// API Types and Interfaces

export type Difficulty = "Easy" | "Med." | "Hard" | string;

export interface Problem {
  id: number;
  title: string;
  difficulty?: Difficulty;
  successRate?: string;
  topic?: string;
  description?: string;
  constraints?: string[];
  examples?: ProblemExample[];
  hints?: string[];
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface RunRequest {
  problemId: string | number;
  code: string;
  language?: string;
}

export interface RunResult {
  status: 'success' | 'fail' | 'error';
  stdout: string[];
  events: Array<{ type: string; message: string }>;
  runtimeMs: number;
  memoryMb: number;
  testCases?: TestCaseResult[];
  score?: number;
  message?: string;
}

export interface TestCaseResult {
  id: number;
  status: 'passed' | 'failed' | 'error';
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTime?: number;
}

export interface Submission {
  id: number;
  status: string;
  code_content: string;
  judge_result?: string | null;
  submitted_at: string;
}

export interface Course {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  rating?: number;
  totalRatings?: number;
  price?: number;
  originalPrice?: number;
  image?: string;
  modules?: Module[];
  instructor?: Instructor;
}

export interface Module {
  id: number;
  title: string;
  lectures: number;
  duration: string;
  content?: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  videoUrl?: string;
  materials?: Material[];
  transcript?: string;
}

export interface Material {
  name: string;
  size: string;
  type: 'pdf' | 'file' | 'image' | 'video';
  url: string;
}

export interface Instructor {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface Contest {
  id: number;
  name: string;
  description?: string;
  status: 'ONGOING' | 'UPCOMING' | 'FINISHED';
  timeRemaining?: string;
  startTime?: string;
  endTime?: string;
  participants: 'Solo' | 'Team';
  gameMode: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prize: string;
  participantCount: string;
  rules?: string[];
  prizes?: Prize[];
  timeline?: TimelineEvent[];
}

export interface Prize {
  rank: number;
  amount: string;
}

export interface TimelineEvent {
  id: string;
  name: string;
  time: string;
  status: 'completed' | 'ongoing' | 'upcoming';
}

export interface Ranking {
  contestId: number;
  contestName: string;
  users: RankingUser[];
}

export interface RankingUser {
  rank: number;
  name: string;
  avatar?: string;
  score?: number;
  time?: string;
}

export interface SandboxProject {
  id: number;
  title: string;
  description?: string;
  author: string;
  authorAvatar?: string;
  thumbnail?: string;
  demoUrl: string;
  sourceCodeUrl?: string;
  tags?: string[];
  createdAt: string;
  views?: number;
  likes?: number;
  type: 'course-project' | 'personal-project';
}

export interface User {
  id: number | null;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  stats?: UserStats;
}

export interface UserStats {
  problemsSolved: number;
  contestsParticipated: number;
  projectsUploaded: number;
  totalScore?: number;
  rank?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthTokens {
  access_token: string;
  expire_in: number;
  auth_type: string;
}

export interface AuthResponse {
  result: AuthTokens;
  message?: string;
  user?: User;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  message?: string;
}

