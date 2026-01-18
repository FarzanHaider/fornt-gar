/**
 * Sweet Bonanza Game API endpoints
 */

import api from "./index";

export const sweetBonanzaAPI = {
  playGame: (betAmount: number, gameId?: string) => 
    api.post("/sweet-bonanza/play", { betAmount, gameId }),

  getGameHistory: (gameId?: string) => 
    api.get("/sweet-bonanza/history", { params: gameId ? { gameId } : {} }),

  getStats: (gameId?: string) => 
    api.get("/sweet-bonanza/stats", { params: gameId ? { gameId } : {} }),
};

export default sweetBonanzaAPI;

