export interface TrackingSession {
  id: string;
  date: string; // ISO string format
  timeInMinutes: number; // Time taken for 10 kicks
  kickCount: number; // Should be 10 when saved
  createdAt: number; // timestamp
}
