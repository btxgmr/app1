export interface Player {
  id: string;
  name: string;
  score: number;
  avatarEmoji: string;
  avatarColorHex: string;
  category: string;
  wins: number;
  losses: number;
  streak: number;
  lastDelta?: number;
  lastDeltaTime?: number;
}

export interface ActivityLog {
  id: string;
  timestamp: number;
  type: 'modify' | 'duel' | 'reset' | 'add' | 'edit';
  title: string;
  description: string;
  playerIds: string[];
  previousScores?: Record<string, number>;
  newScores?: Record<string, number>;
}

export type SortMode = 'score_desc' | 'score_asc' | 'name_asc' | 'streak_desc';

export interface LeaderboardSettings {
  unit: string;
  quickDeltas: number[];
  soundEnabled: boolean;
  activeCategory: string;
  sortMode: SortMode;
  tabStyle: 'ios26' | 'floating';
}
