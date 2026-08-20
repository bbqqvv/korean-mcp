-- ==============================================================================
-- Supabase Keep-Alive Cron Job (Chống Auto-Pause / Sleep)
-- ==============================================================================
-- Lịch chạy: 3 ngày 1 lần vào 00:00 UTC
-- Câu lệnh: SELECT 1; (Cực kỳ nhẹ, không ghi dữ liệu, không ảnh hưởng tới DB)
-- ==============================================================================

-- 1. Kích hoạt extension pg_cron trong Supabase (Chạy trong SQL Editor của Supabase)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Tạo hoặc cập nhật cron job
-- Lưu ý: Nếu job tên 'keep_supabase_alive' đã tồn tại, hãy unschedule trước
SELECT cron.unschedule('keep_supabase_alive') 
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'keep_supabase_alive');

SELECT cron.schedule(
  'keep_supabase_alive',  -- Tên nhận diện job
  '0 0 */3 * *',          -- Cron expression: 3 ngày 1 lần lúc 00:00 UTC
  $$ SELECT 1; $$          -- Câu lệnh SQL siêu nhẹ
);

-- ==============================================================================
-- CÁC CÂU LỆNH QUẢN LÝ (Dùng khi cần kiểm tra hoặc xoá)
-- ==============================================================================

-- Xem tất cả các cron job đang chạy:
-- SELECT * FROM cron.job;

-- Xem lịch sử 10 lần chạy gần nhất:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- Xoá cron job chống sleep:
-- SELECT cron.unschedule('keep_supabase_alive');
