export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'warning';
  model: string;
  systemMessage: string;
  color: string;
  rune: React.ReactNode;
}
