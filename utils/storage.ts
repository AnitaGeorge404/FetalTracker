import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrackingSession } from '@/types/tracking';

const STORAGE_KEY = '@fetal_tracker_sessions';

export const StorageService = {
  /**
   * Save a new tracking session
   */
  async saveSession(session: TrackingSession): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      sessions.push(session);
      // Sort by date, most recent first
      sessions.sort((a, b) => b.createdAt - a.createdAt);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  },

  /**
   * Get all tracking sessions
   */
  async getAllSessions(): Promise<TrackingSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  },

  /**
   * Delete a specific session
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      const filtered = sessions.filter(s => s.id !== sessionId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  },

  /**
   * Clear all sessions (for testing)
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing sessions:', error);
      throw error;
    }
  }
};
