// import { useState } from 'react';
// import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
// import { Navigation } from './components/Navigation';
// import { HeroSlider } from './components/HeroSlider';
// import { PartnersSection } from './components/PartnersSection';
// import { GamesSection } from './components/GamesSection';
// import { SportsSection } from './components/SportsSection';
// import { CategoryCards } from './components/CategoryCards';
// import { PromoBanners } from './components/PromoBanners';
// import { Footer } from './components/Footer';
// import { FeaturedGamesCarousel } from './components/FeaturedGamesCarousel';
// import { LiveCasinoSection } from './components/LiveCasinoSection';
// import SlotGames from './pages/SlotGames';
// import Sports from './pages/Sports';
// import LiveCasino from './pages/LiveCasino';
// import TVGames from './pages/TVGames';
// import Promotions from './pages/Promotions';
// import { SignIn } from './pages/SignIn';
// import { SignUp } from './pages/SignUp';
// import { DepositPage } from './pages/DepositPage';
// import { WithdrawPage } from './pages/WithdrawPage';
// import { MyProfilePage } from './pages/MyProfilePage';
// import { TransactionHistoryPage } from './pages/TransactionHistoryPage';
// import SweetBonanzaPage from './pages/SweetBonanza';
// import GatesOfOlympusPage from './pages/GatesOfOlympus';
// import { GAMES_CONFIG, getGameConfig } from '../lib/config/games.config';

// function AppContent() {
//   const [currentPage, setCurrentPage] = useState<'home' | 'slots' | 'sports' | 'livecasino' | 'tvgames' | 'promotions'>('home');
//   const [showSignIn, setShowSignIn] = useState(false);
//   const [showSignUp, setShowSignUp] = useState(false);
//   const [showDeposit, setShowDeposit] = useState(false);
//   const [showWithdraw, setShowWithdraw] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [showTransactionHistory, setShowTransactionHistory] = useState(false);
//   const [currentGame, setCurrentGame] = useState<string | null>(null);
//   const { t } = useLanguage();

//   const handleNavigation = (page: string) => {
//     setCurrentPage(page as 'home' | 'slots' | 'sports' | 'livecasino' | 'tvgames' | 'promotions');
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleShowSignIn = () => setShowSignIn(true);
//   const handleShowSignUp = () => setShowSignUp(true);
//   const handleShowDeposit = () => setShowDeposit(true);
//   const handleShowMessages = () => {
//     // For now, just show an alert - can be replaced with actual messages modal later
//     alert('Messages feature coming soon!');
//   };

//   const handleSwitchGame = (gameId?: string) => {
//     if (gameId && gameId !== currentGame) {
//       setCurrentGame(gameId);
//     }
//   };

//   // Dynamic Slot Game Routing - Supports all games from config
//   if (currentGame) {
//     const gameConfig = getGameConfig(currentGame);
//     if (gameConfig) {
//       // Route to specific game page based on ID
//       if (currentGame === 'sweet-bonanza') {
//         return (
//           <SweetBonanzaPage 
//             onClose={() => setCurrentGame(null)} 
//             onSwitchGame={handleSwitchGame}
//           />
//         );
//       }
      
//       if (currentGame === 'gates-of-olympus') {
//         return (
//           <GatesOfOlympusPage 
//             onClose={() => setCurrentGame(null)} 
//             onSwitchGame={handleSwitchGame}
//           />
//         );
//       }

//       // For future games, default to Sweet Bonanza (or show "coming soon" message)
//       // When new games are added, create their page components and add routing here
//       return (
//         <SweetBonanzaPage 
//           onClose={() => setCurrentGame(null)} 
//           onSwitchGame={handleSwitchGame}
//         />
//       );
//     }
//   }

//   // Promotions Page
//   if (currentPage === 'promotions') {
//     return (
//       <>
//         <Promotions 
//           onNavigate={handleNavigation} 
//           onShowSignIn={handleShowSignIn} 
//           onShowSignUp={handleShowSignUp}
//           onShowDeposit={handleShowDeposit}
//           onShowMessages={handleShowMessages}
//         />
//         {showSignIn && (
//           <SignIn 
//             onClose={() => setShowSignIn(false)} 
//             onSwitchToSignUp={() => {
//               setShowSignIn(false);
//               setShowSignUp(true);
//             }}
//             onNavigate={handleNavigation}
//           />
//         )}
//         {showSignUp && (
//           <SignUp 
//             onClose={() => setShowSignUp(false)}
//             onSwitchToSignIn={() => {
//               setShowSignUp(false);
//               setShowSignIn(true);
//             }}
//             onNavigate={handleNavigation}
//           />
//         )}
//         {showDeposit && (
//           <DepositPage 
//             onClose={() => setShowDeposit(false)}
//             onOpenWithdraw={() => {
//               setShowDeposit(false);
//               setShowWithdraw(true);
//             }}
//             onOpenProfile={() => {
//               setShowDeposit(false);
//               setShowProfile(true);
//             }}
//             onOpenTransactionHistory={() => {
//               setShowDeposit(false);
//               setShowTransactionHistory(true);
//             }}
//           />
//         )}
//         {showWithdraw && (
//           <WithdrawPage 
//             onClose={() => setShowWithdraw(false)}
//             onOpenDeposit={() => {
//               setShowWithdraw(false);
//               setShowDeposit(true);
//             }}
//             onOpenProfile={() => {
//               setShowWithdraw(false);
//               setShowProfile(true);
//             }}
//             onOpenTransactionHistory={() => {
//               setShowWithdraw(false);
//               setShowTransactionHistory(true);
//             }}
//           />
//         )}
//         {showProfile && (
//           <MyProfilePage 
//             onClose={() => setShowProfile(false)}
//             onOpenDeposit={() => {
//               setShowProfile(false);
//               setShowDeposit(true);
//             }}
//             onOpenWithdraw={() => {
//               setShowProfile(false);
//               setShowWithdraw(true);
//             }}
//             onOpenTransactionHistory={() => {
//               setShowProfile(false);
//               setShowTransactionHistory(true);
//             }}
//           />
//         )}
//         {showTransactionHistory && (
//           <TransactionHistoryPage 
//             onClose={() => setShowTransactionHistory(false)}
//             onOpenDeposit={() => {
//               setShowTransactionHistory(false);
//               setShowDeposit(true);
//             }}
//             onOpenWithdraw={() => {
//               setShowTransactionHistory(false);
//               setShowWithdraw(true);
//             }}
//             onOpenProfile={() => {
//               setShowTransactionHistory(false);
//               setShowProfile(true);
//             }}
//           />
//         )}
//       </>
//     );
//   }

//   // TV Games Page
//   if (currentPage === 'tvgames') {
//     return (
//       <>
//         <TVGames 
//           onNavigate={handleNavigation} 
//           onShowSignIn={handleShowSignIn} 
//           onShowSignUp={handleShowSignUp}
//           onShowDeposit={handleShowDeposit}
//           onShowMessages={handleShowMessages}
//         />
//         {showSignIn && (
//           <SignIn 
//             onClose={() => setShowSignIn(false)} 
//             onSwitchToSignUp={() => {
//               setShowSignIn(false);
//               setShowSignUp(true);
//             }}
//             onNavigate={handleNavigation}
//           />
//         )}
//         {showSignUp && (
//           <SignUp 
//             onClose={() => setShowSignUp(false)}
//             onSwitchToSignIn={() => {
//               setShowSignUp(false);
//               setShowSignIn(true);
//             }}
//             onNavigate={handleNavigation}
//           />
//         )}
//         {showDeposit && (
//           <DepositPage 
//             onClose={() => setShowDeposit(false)}
//             onOpenWithdraw={() => {
//               setShowDeposit(false);
//               setShowWithdraw(true);
//             }}
//             onOpenProfile={() => {
//               setShowDeposit(false);
//               setShowProfile(true);
//             }}
//             onOpenTransactionHistory={() => {
//               setShowDeposit(false);
//               setShowTransactionHistory(true);
//             }}
//           />
//         )}
//         {showWithdraw && (
//           <WithdrawPage 
//             onClose={() => setShowWithdraw(false)}
//             onOpenDeposit={() => {
//               setShowWithdraw(false);
//               setShowDeposit(true);
//             }}
//             onOpenProfile={() => {
//               setShowWithdraw(false);
//               setShowProfile(true);
//             }}
//             onOpenTransactionHistory={() => {
//               setShowWithdraw(false);
//               setShowTransactionHistory(true);
//             }}
//           />
//         )}
//         {showProfile && (
//           <MyProfilePage 
//             onClose={() => setShowProfile(false)}
//             onOpenDeposit={() => {
//               setShowProfile(false);
//               setShowDeposit(true);
//             }}
//             onOpenWithdraw={() => {
//               setShowProfile(false);
//               setShowWithdraw(true);
//             }}
//             onOpenTransactionHistory={() => {
//               setShowProfile(false);
//               setShowTransactionHistory(true);
//             }}
//           />
//         )}
//         {showTransactionHistory && (
//           <TransactionHistoryPage 
//             onClose={() => setShowTransactionHistory(false)}
//             onOpenDeposit={() => {
//               setShowTransactionHistory(false);
//               setShowDeposit(true);
//             }}
//             onOpenWithdraw={() => {
//               setShowTransactionHistory(false);
//               setShowWithdraw(true);
//             }}
//             onOpenProfile={() => {
//               setShowTransactionHistory(false);
//               setShowProfile(true);
//             }}
//           />
//         )}
//       </>
//     );
//   }

//   // Live Casino Page
//   if (currentPage === 'livecasino') {
//     return (
//       <>
//         <LiveCasino 
//           onNavigate={handleNavigation} 
//           onShowSignIn={handleShowSignIn} 
//           onShowSignUp={handleShowSignUp}
//           onShowDeposit={handleShowDeposit}
//           onShowMessages={handleShowMessages}
//         />
//         {showSignIn && (
//           <SignIn 
//             onClose={() => setShowSignIn(false)} 
//             onSwitchToSignUp={() => {
//               setShowSignIn(false);
//               setShowSignUp(true);
//             }}
//             onNavigate={handleNavigation}
//           />
//         )}
//         {showSignUp && (
//           <SignUp 
//             onClose={() => setShowSignUp(false)}
//             onSwitchToSignIn={() => {
//               setShowSignUp(false);
//               setShowSignIn(true);
//             }}
//             onNavigate={handleNavigation}
//           />
//         )}
//         {showDeposit && (
//           <DepositPage 
//             onClose={() => setShowDeposit(false)}
//             onOpenWithdraw={() => {
//               setShowDeposit(false);
//               setShowWithdraw(true);
//             }}
//             onOpenProfile={() => {
//               setShowDeposit(false);
//               setShowProfile(true);
//             }}
//             onOpenTransactionHistory={() => {
//               setShowDeposit(false);
//               setShowTransactionHistory(true);
//             }}
//           />
//         )}
//         {showWithdraw && (
//           <WithdrawPage 
//             onClose={() => setShowWithdraw(false)}
//             onOpenDeposit={() => {
//               setShowWithdraw(false);
//               setShowDeposit(true);
//             }}
//             onOpenProfile={() => {
//               setShowWithdraw(false);
//               setShowProfile(true);
//             }}
//             onOpenTransactionHistory={() => {
//               setShowWithdraw(false);
//               setShowTransactionHistory(true);
//             }}
//           />
//         )}
//         {showProfile && (
//           <MyProfilePage 
//             onClose={() => setShowProfile(false)}
//             onOpenDeposit={() => {
//               setShowProfile(false);
//               setShowDeposit(true);
//             }}
//             onOpenWithdraw={() => {
//               setShowProfile(false);
//               setShowWithdraw(true);
//             }}
//             onOpenTransactionHistory={() => {
//               setShowProfile(false);
//               setShowTransactionHistory(true);
//             }}
//           />
//         )}
//         {showTransactionHistory && (
//           <TransactionHistoryPage 
//             onClose={() => setShowTransactionHistory(false)}
//             onOpenDeposit={() => {
//               setShowTransactionHistory(false);
//               setShowDeposit(true);
//             }}
//             onOpenWithdraw={() => {
//               setShowTransactionHistory(false);
//               setShowWithdraw(true);
//             }}
//             onOpenProfile={() => {
//               setShowTransactionHistory(false);
//               setShowProfile(true);
//             }}
//           />
//         )}
//       </>
//     );
//   }

//   // Sports Page
//   if (currentPage === 'sports') {
//     return (
//       <>
//         <Sports 
//           onNavigate={handleNavigation} 
//           onShowSignIn={handleShowSignIn} 
//           onShowSignUp={handleShowSignUp}
//           onShowDeposit={handleShowDeposit}
//           onShowMessages={handleShowMessages}
//         />
//         {showSignIn && (
//           <SignIn 
//             onClose={() => setShowSignIn(false)} 
//             onSwitchToSignUp={() => {
//               setShowSignIn(false);
//               setShowSignUp(true);
//             }}
//             onNavigate={handleNavigation}
//           />
//         )}
//         {showSignUp && (
//           <SignUp 
//             onClose={() => setShowSignUp(false)}
//             onSwitchToSignIn={() => {
//               setShowSignUp(false);
//               setShowSignIn(true);
//             }}
//             onNavigate={handleNavigation}
//           />
//         )}
//         {showDeposit && (
//           <DepositPage 
//             onClose={() => setShowDeposit(false)}
//             onOpenWithdraw={() => {
//               setShowDeposit(false);
//               setShowWithdraw(true);
//             }}
//             onOpenProfile={() => {
//               setShowDeposit(false);
//               setShowProfile(true);
//             }}
//             onOpenTransactionHistory={() => {
//               setShowDeposit(false);
//               setShowTransactionHistory(true);
//             }}
//           />
//         )}
//         {showWithdraw && (
//           <WithdrawPage 
//             onClose={() => setShowWithdraw(false)}
//             onOpenDeposit={() => {
//               setShowWithdraw(false);
//               setShowDeposit(true);
//             }}
//             onOpenProfile={() => {
//               setShowWithdraw(false);
//               setShowProfile(true);
//             }}
//             onOpenTransactionHistory={() => {
//               setShowWithdraw(false);
//               setShowTransactionHistory(true);
//             }}
//           />
//         )}
//         {showProfile && (
//           <MyProfilePage 
//             onClose={() => setShowProfile(false)}
//             onOpenDeposit={() => {
//               setShowProfile(false);
//               setShowDeposit(true);
//             }}
//             onOpenWithdraw={() => {
//               setShowProfile(false);
//               setShowWithdraw(true);
//             }}
//             onOpenTransactionHistory={() => {
//               setShowProfile(false);
//               setShowTransactionHistory(true);
//             }}
//           />
//         )}
//         {showTransactionHistory && (
//           <TransactionHistoryPage 
//             onClose={() => setShowTransactionHistory(false)}
//             onOpenDeposit={() => {
//               setShowTransactionHistory(false);
//               setShowDeposit(true);
//             }}
//             onOpenWithdraw={() => {
//               setShowTransactionHistory(false);
//               setShowWithdraw(true);
//             }}
//             onOpenProfile={() => {
//               setShowTransactionHistory(false);
//               setShowProfile(true);
//             }}
//           />
//         )}
//       </>
//     );
//   }

//   // Slot Games Page
//   if (currentPage === 'slots') {
//     return (
//       <>
//         <SlotGames 
//           onNavigate={handleNavigation} 
//           onShowSignIn={handleShowSignIn} 
//           onShowSignUp={handleShowSignUp}
//           onShowDeposit={handleShowDeposit}
//           onShowMessages={handleShowMessages}
//           onShowSweetBonanza={() => setCurrentGame('sweet-bonanza')}
//           onShowGatesOfOlympus={() => setCurrentGame('gates-of-olympus')}
//           onShowGame={(gameId: string) => setCurrentGame(gameId)}
//         />
//         {showSignIn && (
//           <SignIn 
//             onClose={() => setShowSignIn(false)} 
//             onSwitchToSignUp={() => {
//               setShowSignIn(false);
//               setShowSignUp(true);
//             }}
//             onNavigate={handleNavigation}
//           />
//         )}
//         {showSignUp && (
//           <SignUp 
//             onClose={() => setShowSignUp(false)}
//             onSwitchToSignIn={() => {
//               setShowSignUp(false);
//               setShowSignIn(true);
//             }}
//             onNavigate={handleNavigation}
//           />
//         )}
//         {showDeposit && (
//           <DepositPage 
//             onClose={() => setShowDeposit(false)}
//             onOpenWithdraw={() => {
//               setShowDeposit(false);
//               setShowWithdraw(true);
//             }}
//             onOpenProfile={() => {
//               setShowDeposit(false);
//               setShowProfile(true);
//             }}
//             onOpenTransactionHistory={() => {
//               setShowDeposit(false);
//               setShowTransactionHistory(true);
//             }}
//           />
//         )}
//         {showWithdraw && (
//           <WithdrawPage 
//             onClose={() => setShowWithdraw(false)}
//             onOpenDeposit={() => {
//               setShowWithdraw(false);
//               setShowDeposit(true);
//             }}
//             onOpenProfile={() => {
//               setShowWithdraw(false);
//               setShowProfile(true);
//             }}
//             onOpenTransactionHistory={() => {
//               setShowWithdraw(false);
//               setShowTransactionHistory(true);
//             }}
//           />
//         )}
//         {showProfile && (
//           <MyProfilePage 
//             onClose={() => setShowProfile(false)}
//             onOpenDeposit={() => {
//               setShowProfile(false);
//               setShowDeposit(true);
//             }}
//             onOpenWithdraw={() => {
//               setShowProfile(false);
//               setShowWithdraw(true);
//             }}
//             onOpenTransactionHistory={() => {
//               setShowProfile(false);
//               setShowTransactionHistory(true);
//             }}
//           />
//         )}
//         {showTransactionHistory && (
//           <TransactionHistoryPage 
//             onClose={() => setShowTransactionHistory(false)}
//             onOpenDeposit={() => {
//               setShowTransactionHistory(false);
//               setShowDeposit(true);
//             }}
//             onOpenWithdraw={() => {
//               setShowTransactionHistory(false);
//               setShowWithdraw(true);
//             }}
//             onOpenProfile={() => {
//               setShowTransactionHistory(false);
//               setShowProfile(true);
//             }}
//           />
//         )}
//       </>
//     );
//   }

//   // Home Page
//   return (
//     <>
//       <div className="min-h-screen bg-white">
//         <Navigation 
//           onNavigate={handleNavigation} 
//           onShowSignIn={handleShowSignIn} 
//           onShowSignUp={handleShowSignUp}
//           onShowDeposit={handleShowDeposit}
//           onShowMessages={handleShowMessages}
//         />
//         <HeroSlider />
//         <PartnersSection />
//         <FeaturedGamesCarousel 
//           onGameClick={(gameId) => setCurrentGame(gameId)} 
//           onNavigate={handleNavigation}
//         />
//         <GamesSection 
//           onGameClick={(gameId) => setCurrentGame(gameId)} 
//           onNavigate={handleNavigation}
//         />
//         <CategoryCards />
//         <LiveCasinoSection />
//         <SportsSection />
//         <PromoBanners />
//         <Footer />
//       </div>
//       {showSignIn && (
//         <SignIn 
//           onClose={() => setShowSignIn(false)} 
//           onSwitchToSignUp={() => {
//             setShowSignIn(false);
//             setShowSignUp(true);
//           }}
//           onNavigate={handleNavigation}
//         />
//       )}
//       {showSignUp && (
//         <SignUp 
//           onClose={() => setShowSignUp(false)}
//           onSwitchToSignIn={() => {
//             setShowSignUp(false);
//             setShowSignIn(true);
//           }}
//           onNavigate={handleNavigation}
//         />
//       )}
//       {showDeposit && (
//         <DepositPage 
//           onClose={() => setShowDeposit(false)}
//           onOpenWithdraw={() => {
//             setShowDeposit(false);
//             setShowWithdraw(true);
//           }}
//           onOpenProfile={() => {
//             setShowDeposit(false);
//             setShowProfile(true);
//           }}
//           onOpenTransactionHistory={() => {
//             setShowDeposit(false);
//             setShowTransactionHistory(true);
//           }}
//         />
//       )}
//       {showWithdraw && (
//         <WithdrawPage 
//           onClose={() => setShowWithdraw(false)}
//           onOpenDeposit={() => {
//             setShowWithdraw(false);
//             setShowDeposit(true);
//           }}
//           onOpenProfile={() => {
//             setShowWithdraw(false);
//             setShowProfile(true);
//           }}
//           onOpenTransactionHistory={() => {
//             setShowWithdraw(false);
//             setShowTransactionHistory(true);
//           }}
//         />
//       )}
//       {showProfile && (
//         <MyProfilePage 
//           onClose={() => setShowProfile(false)}
//           onOpenDeposit={() => {
//             setShowProfile(false);
//             setShowDeposit(true);
//           }}
//           onOpenWithdraw={() => {
//             setShowProfile(false);
//             setShowWithdraw(true);
//           }}
//           onOpenTransactionHistory={() => {
//             setShowProfile(false);
//             setShowTransactionHistory(true);
//           }}
//         />
//       )}
//       {showTransactionHistory && (
//         <TransactionHistoryPage 
//           onClose={() => setShowTransactionHistory(false)}
//           onOpenDeposit={() => {
//             setShowTransactionHistory(false);
//             setShowDeposit(true);
//           }}
//           onOpenWithdraw={() => {
//             setShowTransactionHistory(false);
//             setShowWithdraw(true);
//           }}
//           onOpenProfile={() => {
//             setShowTransactionHistory(false);
//             setShowProfile(true);
//           }}
//         />
//       )}
//     </>
//   );
// }

// export default function App() {
//   return (
//     <LanguageProvider>
//       <AppContent />
//     </LanguageProvider>
//   );
// }


import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/auth.context";
import { LanguageProvider } from "./contexts/LanguageContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
