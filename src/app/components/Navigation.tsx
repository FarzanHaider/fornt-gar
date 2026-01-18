import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Menu, Globe, ChevronDown, Tv, Trophy, Grid3x3, Flame, Zap, Ticket, MonitorPlay, Gift, MoreHorizontal, Bell, MessageSquare, Coins, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';

interface NavigationProps {
  onNavigate?: (page: string) => void;
  onShowSignIn?: () => void;
  onShowSignUp?: () => void;
  onShowDeposit?: () => void;
  onShowMessages?: () => void;
}

// Map page names to routes
const pageRoutes: Record<string, string> = {
  home: '/',
  slots: '/slots',
  sports: '/sports',
  livecasino: '/livecasino',
  tvgames: '/tvgames',
  promotions: '/promotions',
};

export function Navigation({ onNavigate, onShowSignIn, onShowSignUp, onShowDeposit, onShowMessages }: NavigationProps = {}) {
  const navigate = useNavigate();
  // ✅ All hooks MUST be inside this function
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { language, setLanguage, t } = useLanguage();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && token !== 'cookie-auth' && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsAuthenticated(true);
          setUser(parsedUser);
        } catch (e) {
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };

    // Listen for custom userDataUpdated event (when user logs in/out in same tab)
    const handleUserDataUpdate = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userDataUpdated', handleUserDataUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    setIsAuthenticated(false);
    setUser(null);
    // Trigger event for other components
    window.dispatchEvent(new Event('userDataUpdated'));
    if (onNavigate) {
      onNavigate('home');
    } else {
      navigate('/');
    }
  };

  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      // Use react-router-dom navigation
      const route = pageRoutes[page] || '/';
      navigate(route);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tr' : 'en');
  };

  const currentTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 relative">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200" style={{ marginTop: 0 }}>
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14">
            {/* Left Side - Logo & Special Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Logo */}
              <button 
                onClick={() => handleNavClick('home')} 
                className="text-xl sm:text-2xl font-bold text-purple-700 hover:text-purple-900 transition-colors mr-2"
              >
                Garbet
              </button>

              {/* Special Buttons */}
              <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md text-xs font-bold transition-colors">
                <Tv className="w-3.5 h-3.5" />
                <span>GARBET TV</span>
              </button>
              <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md text-xs font-bold transition-colors">
                <Trophy className="w-3.5 h-3.5" />
                <span>YONCA YILDIZ</span>
              </button>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Deposit Button */}
              <button 
                onClick={onShowDeposit}
                className="hidden sm:flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs font-bold transition-colors"
              >
                <Coins className="w-3.5 h-3.5" />
              </button>

              {/* Bonuses Button */}
              <button 
                onClick={() => handleNavClick('promotions')}
                className="hidden sm:flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md text-xs font-bold transition-colors"
              >
                <Gift className="w-3.5 h-3.5" />
              </button>

              {/* Messages Button */}
              <button 
                onClick={onShowMessages}
                className="hidden md:flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md text-xs font-bold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>

              {/* User Info or Auth Buttons */}
              {isAuthenticated && user ? (
                <>
                  {/* User Balance/Info */}
                  <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-700 text-white rounded-md text-xs font-bold">
                    <User className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[100px]">{user.username || user.email || 'User'}</span>
                  </div>
                  {/* Logout Button */}
                  <Button 
                    onClick={handleLogout}
                    className="hidden sm:flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold h-auto"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>LOGOUT</span>
                  </Button>
                </>
              ) : (
                <>
                  {/* Sign In Button */}
                  <Button 
                    onClick={() => onShowSignIn ? onShowSignIn() : navigate('/signin')}
                    className="hidden sm:flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md text-xs font-bold h-auto"
                  >
                    <span>SIGN IN</span>
                  </Button>

                  {/* Register Button */}
                  <Button 
                    onClick={() => onShowSignUp ? onShowSignUp() : navigate('/signup')}
                    className="hidden sm:flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md text-xs font-bold h-auto"
                  >
                    <span>REGISTER</span>
                  </Button>
                </>
              )}

              {/* Language, Time & Menu */}
              <div className="hidden lg:flex items-center gap-2 ml-2">
 {/* Language Dropdown */}
<div className="relative">
  <button
    onClick={() => setLangOpen(!langOpen)}
    className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded text-xs font-medium text-gray-700"
  >
    <span>{language === 'tr' ? '🇹🇷' : '🇬🇧'}</span>
    <span>{language === 'tr' ? 'TR' : 'EN'}</span>
    <ChevronDown className="w-3 h-3" />
  </button>

  {langOpen && (
    <div className="absolute top-7 left-0 w-32 bg-white border rounded-md shadow-lg z-50">
      <button
        onClick={() => {
          setLanguage('tr');
          setLangOpen(false);
        }}
        className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-100"
      >
        🇹🇷 Türkçe
      </button>
      <button
        onClick={() => {
          setLanguage('en');
          setLangOpen(false);
        }}
        className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-100"
      >
        🇬🇧 English
      </button>
    </div>
  )}
</div>
               
                {/* Time Box */}
                <div className="bg-gray-100 rounded-md px-3 py-1.5 border border-gray-200 shadow-sm">
                  <span className="text-xs text-gray-700 font-medium">{currentTime}</span>
                </div>
                
                {/* Three Dots Menu with Notification */}
                <button className="relative bg-gray-100 hover:bg-gray-200 rounded-md p-2 transition-colors shadow-sm">
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-[10px] font-bold text-white">4</span>
                  </span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-purple-950">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              <button 
                onClick={() => handleNavClick('sports')}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-md text-sm font-semibold transition-colors"
              >
                <Flame className="w-4 h-4" />
                <span>LIVE BET</span>
              </button>
              <button 
                onClick={() => handleNavClick('sports')}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-md text-sm font-semibold transition-colors"
              >
                <Trophy className="w-4 h-4" />
                <span>SPORTS</span>
              </button>
              <button 
                onClick={() => handleNavClick('slots')}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-md text-sm font-semibold transition-colors"
              >
                <Grid3x3 className="w-4 h-4" />
                <span>SLOT GAMES</span>
              </button>
              <button 
                onClick={() => handleNavClick('livecasino')}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-md text-sm font-semibold transition-colors"
              >
                <Flame className="w-4 h-4" />
                <span>LIVE CASINO</span>
              </button>
              <button 
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-md text-sm font-semibold transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>AVI / ZEPPELIN</span>
              </button>
              <button 
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-md text-sm font-semibold transition-colors"
              >
                <Ticket className="w-4 h-4" />
                <span>BILET ÇEKILIŞI</span>
              </button>
              <button 
                onClick={() => handleNavClick('tvgames')}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-md text-sm font-semibold transition-colors"
              >
                <MonitorPlay className="w-4 h-4" />
                <span>TV GAMES</span>
              </button>
              <button 
                onClick={() => handleNavClick('promotions')}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-md text-sm font-semibold transition-colors shadow-lg text-white"
              >
                <Gift className="w-4 h-4" />
                <span>PROMOTIONS</span>
              </button>
            </div>

            {/* More Button */}
            <button className="hidden lg:flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-md text-sm font-semibold transition-colors ml-auto">
              <Grid3x3 className="w-4 h-4" />
              <span>More</span>
            </button>

            {/* Mobile View - Horizontal Scroll */}
            <div className="lg:hidden flex items-center gap-1 overflow-x-auto scrollbar-hide w-full py-1">
              <button 
                onClick={() => handleNavClick('sports')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-white hover:bg-white/10 rounded-md text-xs font-semibold whitespace-nowrap transition-colors"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>LIVE</span>
              </button>
              <button 
                onClick={() => handleNavClick('sports')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-white hover:bg-white/10 rounded-md text-xs font-semibold whitespace-nowrap transition-colors"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>SPORTS</span>
              </button>
              <button 
                onClick={() => handleNavClick('slots')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-white hover:bg-white/10 rounded-md text-xs font-semibold whitespace-nowrap transition-colors"
              >
                <Grid3x3 className="w-3.5 h-3.5" />
                <span>SLOTS</span>
              </button>
              <button 
                onClick={() => handleNavClick('livecasino')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-white hover:bg-white/10 rounded-md text-xs font-semibold whitespace-nowrap transition-colors"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>CASINO</span>
              </button>
              <button 
                onClick={() => handleNavClick('tvgames')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-white hover:bg-white/10 rounded-md text-xs font-semibold whitespace-nowrap transition-colors"
              >
                <MonitorPlay className="w-3.5 h-3.5" />
                <span>TV</span>
              </button>
              <button 
                onClick={() => handleNavClick('promotions')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 rounded-md text-xs font-semibold whitespace-nowrap transition-colors"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>PROMOS</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="max-w-[1920px] mx-auto px-4 py-4 space-y-2">
            <button 
              onClick={() => { handleNavClick('sports'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg font-medium transition-colors"
            >
              <Flame className="w-5 h-5" />
              <span>LIVE BET</span>
            </button>
            <button 
              onClick={() => { handleNavClick('sports'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg font-medium transition-colors"
            >
              <Trophy className="w-5 h-5" />
              <span>{t('nav.sports')}</span>
            </button>
            <button 
              onClick={() => { handleNavClick('slots'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg font-medium transition-colors"
            >
              <Grid3x3 className="w-5 h-5" />
              <span>SLOT GAMES</span>
            </button>
            <button 
              onClick={() => { handleNavClick('livecasino'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg font-medium transition-colors"
            >
              <Flame className="w-5 h-5" />
              <span>LIVE CASINO</span>
            </button>
            <button 
              onClick={() => { handleNavClick('tvgames'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg font-medium transition-colors"
            >
              <MonitorPlay className="w-5 h-5" />
              <span>TV GAMES</span>
            </button>
            <button 
              onClick={() => { handleNavClick('promotions'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg font-medium transition-colors"
            >
              <Gift className="w-5 h-5" />
              <span>PROMOTIONS</span>
            </button>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 space-y-2 border-t border-gray-200 sm:hidden">
              {isAuthenticated && user ? (
                <>
                  <div className="w-full px-4 py-3 bg-purple-700 text-white rounded-lg font-bold text-center">
                    <User className="w-4 h-4 inline mr-2" />
                    {user.username || user.email || 'User'}
                  </div>
                  <Button 
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    LOGOUT
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => { onShowSignIn ? onShowSignIn() : navigate('/signin'); setMobileMenuOpen(false); }}
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold"
                  >
                    <User className="w-4 h-4 mr-2" />
                    SIGN IN
                  </Button>
                  <Button 
                    onClick={() => { onShowSignUp ? onShowSignUp() : navigate('/signup'); setMobileMenuOpen(false); }}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold"
                  >
                    REGISTER
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}