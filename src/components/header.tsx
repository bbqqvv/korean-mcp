'use client';

export interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onOpenMobileSidebar?: () => void;
  onOpenCreateModal?: () => void;
  onOpenAITutor?: () => void;
}

export default function Header(_props: HeaderProps) {
  return null;
}
