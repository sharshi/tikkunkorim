import { Amud } from '../types';

/**
 * Data loader utility for Torah text
 * This handles loading the full Tikkun data from various sources
 */

// For production, you would load this from an API or external service
export class TikkunDataLoader {
  private static instance: TikkunDataLoader;
  private cachedData: Amud[] | null = null;
  private loading: boolean = false;

  static getInstance(): TikkunDataLoader {
    if (!TikkunDataLoader.instance) {
      TikkunDataLoader.instance = new TikkunDataLoader();
    }
    return TikkunDataLoader.instance;
  }

  /**
   * Load Tikkun data from the original JavaScript file
   * In production, this would be replaced with an API call or database query
   */
  async loadFullData(): Promise<Amud[]> {
    if (this.cachedData) {
      return this.cachedData;
    }

    if (this.loading) {
      // Wait for existing load to complete
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!this.loading && this.cachedData) {
            resolve(this.cachedData);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    this.loading = true;
    
    try {
      // In a real application, you might:
      // 1. Fetch from an API: await fetch('/api/tikkun-data')
      // 2. Load from a database
      // 3. Stream large data in chunks
      
      // For now, we'll try to load from the backup file if it exists
      const response = await fetch('/backup/tikun.js');
      if (response.ok) {
        const jsText = await response.text();
        // Parse the JavaScript variable declaration
        const dataMatch = jsText.match(/var tikkun = (\[.*\]);/);
        if (dataMatch) {
          this.cachedData = JSON.parse(dataMatch[1]);
          return this.cachedData!;
        }
      }
      
      // Fallback to sample data
      const { tikkunData } = await import('../data/tikkunData');
      this.cachedData = tikkunData;
      return this.cachedData;
      
    } catch (error) {
      console.error('Failed to load full Tikkun data:', error);
      // Return sample data as fallback
      const { tikkunData } = await import('../data/tikkunData');
      this.cachedData = tikkunData;
      return this.cachedData;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Get a specific amud by number
   */
  async getAmud(amudNumber: number): Promise<Amud | null> {
    const data = await this.loadFullData();
    return data.find(amud => amud.amud === amudNumber) || null;
  }

  /**
   * Get amudim in a range
   */
  async getAmudRange(start: number, end: number): Promise<Amud[]> {
    const data = await this.loadFullData();
    return data.filter(amud => amud.amud >= start && amud.amud <= end);
  }

  /**
   * Get total number of amudim
   */
  async getTotalAmudim(): Promise<number> {
    const data = await this.loadFullData();
    return data.length;
  }

  /**
   * Clear cached data (useful for memory management)
   */
  clearCache(): void {
    this.cachedData = null;
  }
}

// Export singleton instance
export const tikkunDataLoader = TikkunDataLoader.getInstance();
