import { NextResponse } from 'next/server';
import { createNewDeckAsync, getDecksAsync, addCardsToDeckAsync, addEmailLog } from '@/lib/store';
import { generateKoreanVocabWithGroq } from '@/lib/groq';
import { Flashcard } from '@/lib/types';

interface JSONRPCRequest {
  jsonrpc: string;
  id?: string | number;
  method: string;
  params?: any;
}

export async function POST(req: Request) {
  try {
    const body: JSONRPCRequest = await req.json();
    const { jsonrpc = '2.0', id, method, params } = body;

    // 1. Initialize Handshake
    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'korean-flashcard-mcp-server',
            version: '1.0.0'
          }
        }
      });
    }

    // 2. Initialized notification from client
    if (method === 'notifications/initialized') {
      return NextResponse.json({ jsonrpc: '2.0', id, result: {} });
    }

    // 3. List Available MCP Tools for Gemini Spark
    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          tools: [
            {
              name: 'create_vocab_deck',
              description:
                'Tạo bộ thẻ từ vựng tiếng Hàn mới trên ứng dụng (Nhận tiêu đề, danh mục, link YouTube hoặc danh sách từ vựng do Gemini Spark trích xuất).',
              inputSchema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: 'Tiêu đề bộ từ vựng (VD: "Từ vựng tiếng Hàn Công sở qua YouTube")'
                  },
                  category: {
                    type: 'string',
                    description: 'Danh mục: Công sở & Địa điểm | Nhà cửa & Vật dụng | YouTube Video | Giao tiếp hàng ngày | Nâng cao'
                  },
                  description: {
                    type: 'string',
                    description: 'Mô tả bộ từ vựng'
                  },
                  youtube_url: {
                    type: 'string',
                    description: 'Link YouTube nguồn nếu có'
                  },
                  vocabulary: {
                    type: 'array',
                    description: 'Danh sách từ vựng tiếng Hàn (nếu không truyền, AI sẽ tự động sinh bài từ tiêu đề/link YouTube)',
                    items: {
                      type: 'object',
                      properties: {
                        korean: { type: 'string', description: 'Từ tiếng Hàn (VD: "회사")' },
                        pronunciation: { type: 'string', description: 'Phiên âm (VD: "hoe-sa")' },
                        vietnamese: { type: 'string', description: 'Nghĩa tiếng Việt' },
                        hanja: { type: 'string', description: 'Gốc Hán Hàn (VD: "會社")' },
                        example_kr: { type: 'string', description: 'Ví dụ câu tiếng Hàn' },
                        example_vi: { type: 'string', description: 'Nghĩa ví dụ tiếng Việt' }
                      },
                      required: ['korean', 'vietnamese']
                    }
                  }
                },
                required: ['title']
              }
            },
            {
              name: 'add_flashcards',
              description: 'Bổ sung các thẻ từ vựng tiếng Hàn mới vào bộ thẻ đã có.',
              inputSchema: {
                type: 'object',
                properties: {
                  deck_id: { type: 'string', description: 'ID của bộ từ vựng cần bổ sung' },
                  vocabulary: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        korean: { type: 'string' },
                        pronunciation: { type: 'string' },
                        vietnamese: { type: 'string' },
                        hanja: { type: 'string' },
                        example_kr: { type: 'string' },
                        example_vi: { type: 'string' }
                      },
                      required: ['korean', 'vietnamese']
                    }
                  }
                },
                required: ['deck_id', 'vocabulary']
              }
            },
            {
              name: 'get_decks',
              description: 'Lấy danh sách các bộ từ vựng hiện có trên ứng dụng.',
              inputSchema: {
                type: 'object',
                properties: {}
              }
            },
            {
              name: 'send_daily_study_email',
              description: 'Gửi email nhắc nhở học từ vựng tiếng Hàn kèm đường dẫn bài học trực tiếp.',
              inputSchema: {
                type: 'object',
                properties: {
                  recipient_email: { type: 'string', description: 'Địa chỉ email người nhận' },
                  deck_id: { type: 'string', description: 'ID bộ từ vựng cần học (tùy chọn)' },
                  note_for_today: { type: 'string', description: 'Lời nhắn hoặc ghi chú học từ Gemini Spark' }
                },
                required: ['recipient_email']
              }
            }
          ]
        }
      });
    }

    // 4. Call Tool Handling
    if (method === 'tools/call') {
      const { name, arguments: args } = params || {};

      if (name === 'create_vocab_deck') {
        const { title, category, description, youtube_url, vocabulary = [] } = args || {};

        let finalCards: Flashcard[] = [];

        if (vocabulary && vocabulary.length > 0) {
          finalCards = vocabulary.map((item: any, idx: number) => ({
            id: `card-mcp-${Date.now()}-${idx}`,
            korean: item.korean,
            pronunciation: item.pronunciation || '',
            vietnamese: item.vietnamese,
            hanja: item.hanja || '',
            exampleKr: item.example_kr || '',
            exampleVi: item.example_vi || '',
            youtubeUrl: youtube_url,
            difficulty: 'new',
            timesReviewed: 0
          }));
        } else {
          // If Gemini Spark only sends title or YouTube URL, use Groq AI to generate dynamic cards!
          try {
            const aiGen = await generateKoreanVocabWithGroq(youtube_url || title, 6);
            finalCards = aiGen.vocabulary.map((item, idx) => ({
              id: `card-mcp-ai-${Date.now()}-${idx}`,
              korean: item.korean,
              pronunciation: item.pronunciation,
              vietnamese: item.vietnamese,
              hanja: item.hanja || '',
              exampleKr: item.exampleKr || '',
              exampleVi: item.exampleVi || '',
              youtubeUrl: youtube_url,
              difficulty: 'new',
              timesReviewed: 0
            }));
          } catch (e) {
            console.error('Groq AI fallback error in MCP:', e);
          }
        }

        const newDeck = await createNewDeckAsync(
          title,
          (category as any) || (youtube_url ? 'YouTube Video' : 'Giao tiếp hàng ngày'),
          description || 'Bài học tạo từ Gemini Spark qua MCP Server',
          youtube_url,
          finalCards
        );

        const studyLink = `${getDomain(req)}/deck/${newDeck.id}`;

        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    status: 'success',
                    message: `Đã tạo bộ từ vựng thành công: "${newDeck.title}" với ${newDeck.cards.length} thẻ.`,
                    deck_id: newDeck.id,
                    study_link: studyLink,
                    deck: newDeck
                  },
                  null,
                  2
                )
              }
            ]
          }
        });
      }

      if (name === 'add_flashcards') {
        const { deck_id, vocabulary = [] } = args || {};
        const cards: Flashcard[] = vocabulary.map((item: any, idx: number) => ({
          id: `card-mcp-${Date.now()}-${idx}`,
          korean: item.korean,
          pronunciation: item.pronunciation || '',
          vietnamese: item.vietnamese,
          hanja: item.hanja || '',
          exampleKr: item.example_kr || '',
          exampleVi: item.example_vi || '',
          difficulty: 'new',
          timesReviewed: 0
        }));

        const updated = await addCardsToDeckAsync(deck_id, cards);

        if (!updated) {
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: `Không tìm thấy bộ từ vựng với ID: ${deck_id}` }],
              isError: true
            }
          });
        }

        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    status: 'success',
                    message: `Đã bổ sung ${cards.length} thẻ từ vựng vào bộ "${updated.title}".`,
                    deck_id: updated.id,
                    study_link: `${getDomain(req)}/deck/${updated.id}`
                  },
                  null,
                  2
                )
              }
            ]
          }
        });
      }

      if (name === 'get_decks') {
        const decks = await getDecksAsync();
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ status: 'success', total_decks: decks.length, decks }, null, 2)
              }
            ]
          }
        });
      }

      if (name === 'send_daily_study_email') {
        const { recipient_email, deck_id, note_for_today } = args || {};
        const decks = await getDecksAsync();
        const targetDeck = deck_id ? decks.find((d) => d.id === deck_id) : decks[0];

        if (!targetDeck) {
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: 'Không tìm thấy bộ từ vựng để gửi email.' }],
              isError: true
            }
          });
        }

        const domain = getDomain(req);
        const studyLink = `${domain}/deck/${targetDeck.id}`;
        const log = addEmailLog({
          recipient: recipient_email || 'vanbuiquoc@gmail.com',
          deckId: targetDeck.id,
          deckTitle: targetDeck.title,
          cardCount: targetDeck.cards.length,
          status: 'sent',
          note: note_for_today || 'Nhắc nhở học từ vựng tiếng Hàn hôm nay từ Gemini Spark!',
          previewUrl: studyLink
        });

        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    status: 'success',
                    message: `Đã gửi email nhắc học thành công tới: ${log.recipient}`,
                    deck_title: targetDeck.title,
                    card_count: targetDeck.cards.length,
                    study_link: studyLink,
                    note: log.note
                  },
                  null,
                  2
                )
              }
            ]
          }
        });
      }

      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: `Tool '${name}' không tồn tại trên MCP Server.` }],
          isError: true
        }
      });
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: 'Method not found' }
    });
  } catch (error: any) {
    console.error('MCP Error:', error);
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32603, message: error.message || 'Internal error' }
    });
  }
}

export async function GET(req: Request) {
  const domain = getDomain(req);
  return NextResponse.json({
    status: 'online',
    server_name: 'Korean Flashcard MCP Server',
    protocol: 'Model Context Protocol (MCP 2024-11-05)',
    endpoint: `${domain}/api/mcp`,
    available_tools: ['create_vocab_deck', 'add_flashcards', 'get_decks', 'send_daily_study_email'],
    guide: `${domain}/mcp-guide`
  });
}

function getDomain(req: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  const host = req.headers.get('host') || '';
  if (host.includes('vercel.app') || process.env.VERCEL) {
    return `https://${host || 'koflashcard.vercel.app'}`;
  }
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host || 'localhost:3001'}`;
}
