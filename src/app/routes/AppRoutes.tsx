import { Routes, Route } from "react-router-dom";
import AuthGuard from "./../auth/AuthGuard";

import HomePage from "./../pages/HomePage";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import SweetBonanzaPage from "../pages/SweetBonanza";
import GatesOfOlympusPage from "../pages/GatesOfOlympus";
import SlotGames from "../pages/SlotGames";
import Sports from "../pages/Sports";
import LiveCasino from "../pages/LiveCasino";
import TVGames from "../pages/TVGames";
import Promotions from "../pages/Promotions";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes - accessible to everyone */}
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/slots" element={<SlotGames />} />
      <Route path="/sports" element={<Sports />} />
      <Route path="/livecasino" element={<LiveCasino />} />
      <Route path="/tvgames" element={<TVGames />} />
      <Route path="/promotions" element={<Promotions />} />

      {/* Protected routes - require authentication */}
      <Route
        path="/game/sweet-bonanza"
        element={
          <AuthGuard>
            <SweetBonanzaPage />
          </AuthGuard>
        }
      />

      <Route
        path="/game/gates-of-olympus"
        element={
          <AuthGuard>
            <GatesOfOlympusPage />
          </AuthGuard>
        }
      />
    </Routes>
  );
}
