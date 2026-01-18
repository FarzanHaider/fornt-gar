/**
 * Gates of Olympus Game API endpoints
 */

import api from "./index";

export const gatesOfOlympusAPI = {
  playGame: (betAmount: number, gameId?: string) => 
    api.post("/gates-of-olympus/play", { betAmount, gameId }),

  getGameHistory: (gameId?: string) => 
    api.get("/gates-of-olympus/history", { params: gameId ? { gameId } : {} }),

  getStats: (gameId?: string) => 
    api.get("/gates-of-olympus/stats", { params: gameId ? { gameId } : {} }),
};

export default gatesOfOlympusAPI;
