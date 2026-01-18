// import { useState } from "react";
// import { useLanguage } from "../contexts/LanguageContext";
// import { Navigation } from "../components/Navigation";
// import { HeroSlider } from "../components/HeroSlider";
// import { PartnersSection } from "../components/PartnersSection";
// import { GamesSection } from "../components/GamesSection";
// import { SportsSection } from "../components/SportsSection";
// import { CategoryCards } from "../components/CategoryCards";
// import { PromoBanners } from "../components/PromoBanners";
// import { Footer } from "../components/Footer";
// import { FeaturedGamesCarousel } from "../components/FeaturedGamesCarousel";
// import { LiveCasinoSection } from "../components/LiveCasinoSection";
// import SignIn from "./SignIn";
// import SignUp from "./SignUp";
// import DepositPage from "./DepositPage";
// import WithdrawPage from "./WithdrawPage";
// import MyProfilePage from "./MyProfilePage";
// import TransactionHistoryPage from "./TransactionHistoryPage";

// export default function HomePage() {
//   const [showSignIn, setShowSignIn] = useState(false);
//   const [showSignUp, setShowSignUp] = useState(false);
//   const [showDeposit, setShowDeposit] = useState(false);
//   const [showWithdraw, setShowWithdraw] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [showTransactionHistory, setShowTransactionHistory] = useState(false);
//   const [currentGame, setCurrentGame] = useState<string | null>(null);
//   const { t } = useLanguage();

//   const handleNavigation = (page: string) => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-white">
//         <Navigation
//           onNavigate={handleNavigation}
//           onShowSignIn={() => setShowSignIn(true)}
//           onShowSignUp={() => setShowSignUp(true)}
//           onShowDeposit={() => setShowDeposit(true)}
//           onShowMessages={() => alert("Messages feature coming soon!")}
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

//       {/* SignIn Modal */}
//       {showSignIn && (
//         <SignIn
//           onClose={() => setShowSignIn(false)}
//           onSwitchToSignUp={() => {
//             setShowSignIn(false);
//             setShowSignUp(true);
//           }}
//           onLoginSuccess={() => setShowSignIn(false)} // CLOSE only after success
//         />
//       )}

//       {/* SignUp Modal */}
//       {showSignUp && (
//         <SignUp
//           onClose={() => setShowSignUp(false)}
//           onSwitchToSignIn={() => {
//             setShowSignUp(false);
//             setShowSignIn(true);
//           }}
//         />
//       )}

//       {/* Deposit Modal */}
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

//       {/* Withdraw Modal */}
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

//       {/* Profile Modal */}
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

//       {/* Transaction History Modal */}
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
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Navigation } from "../components/Navigation";
import { HeroSlider } from "../components/HeroSlider";
import { PartnersSection } from "../components/PartnersSection";
import { GamesSection } from "../components/GamesSection";
import { SportsSection } from "../components/SportsSection";
import { CategoryCards } from "../components/CategoryCards";
import { PromoBanners } from "../components/PromoBanners";
import { Footer } from "../components/Footer";
import { FeaturedGamesCarousel } from "../components/FeaturedGamesCarousel";
import { LiveCasinoSection } from "../components/LiveCasinoSection";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import DepositPage from "./DepositPage";
import WithdrawPage from "./WithdrawPage";
import MyProfilePage from "./MyProfilePage";
import TransactionHistoryPage from "./TransactionHistoryPage";

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [modal, setModal] = useState<"signin" | "signup" | "deposit" | "withdraw" | "profile" | "history" | null>(null);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleNavigation = (page: string) => {
    onNavigate?.(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navigation
          onNavigate={handleNavigation}
          onShowSignIn={() => setModal("signin")}
          onShowSignUp={() => setModal("signup")}
          onShowDeposit={() => setModal("deposit")}
          onShowMessages={() => alert("Messages feature coming soon!")}
        />
        <HeroSlider />
        <PartnersSection />
        <FeaturedGamesCarousel
          onGameClick={(gameId) => setCurrentGame(gameId)}
          onNavigate={handleNavigation}
        />
        <GamesSection
          onGameClick={(gameId) => setCurrentGame(gameId)}
          onNavigate={handleNavigation}
        />
        <CategoryCards />
        <LiveCasinoSection />
        <SportsSection />
        <PromoBanners />
        <Footer />
      </div>

      {/* Modals */}
      {modal === "signin" && (
        <SignIn
          onClose={() => setModal(null)}
          onSwitchToSignUp={() => setModal("signup")}
          onLoginSuccess={() => setModal(null)}
        />
      )}

      {modal === "signup" && (
        <SignUp
          onClose={() => setModal(null)}
          onSwitchToSignIn={() => setModal("signin")}
        />
      )}

      {modal === "deposit" && (
        <DepositPage
          onClose={() => setModal(null)}
          onOpenWithdraw={() => setModal("withdraw")}
          onOpenProfile={() => setModal("profile")}
          onOpenTransactionHistory={() => setModal("history")}
        />
      )}

      {modal === "withdraw" && (
        <WithdrawPage
          onClose={() => setModal(null)}
          onOpenDeposit={() => setModal("deposit")}
          onOpenProfile={() => setModal("profile")}
          onOpenTransactionHistory={() => setModal("history")}
        />
      )}

      {modal === "profile" && (
        <MyProfilePage
          onClose={() => setModal(null)}
          onOpenDeposit={() => setModal("deposit")}
          onOpenWithdraw={() => setModal("withdraw")}
          onOpenTransactionHistory={() => setModal("history")}
        />
      )}

      {modal === "history" && (
        <TransactionHistoryPage
          onClose={() => setModal(null)}
          onOpenDeposit={() => setModal("deposit")}
          onOpenWithdraw={() => setModal("withdraw")}
          onOpenProfile={() => setModal("profile")}
        />
      )}
    </>
  );
}
