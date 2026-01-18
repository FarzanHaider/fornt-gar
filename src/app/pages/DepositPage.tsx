import { useState, useEffect } from 'react';
import { X, Eye, Gift, User, Settings, History, ChevronDown } from 'lucide-react';
import { paymentAPI } from '../../lib/api/payment.api';
import { authAPI } from '../../lib/api/auth.api';
import { updateUserData } from '../../lib/utils/auth';

interface DepositPageProps {
  onClose: () => void;
  onOpenWithdraw?: () => void;
  onOpenProfile?: () => void;
  onOpenTransactionHistory?: () => void;
}

export function DepositPage({ onClose, onOpenWithdraw, onOpenProfile, onOpenTransactionHistory }: DepositPageProps) {
  const [amount, setAmount] = useState('');
  const [balanceManagementOpen, setBalanceManagementOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState(0);

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
    
    // Listen for balance updates
    const handleUserDataUpdate = (event: CustomEvent) => {
      if (event.detail?.balance !== undefined) {
        setBalance(event.detail.balance);
        setUser(event.detail);
      }
    };
    
    window.addEventListener('userDataUpdated', handleUserDataUpdate as EventListener);
    
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate as EventListener);
    };
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await authAPI.me();
      const userData = response?.data || response || null;
      
      if (userData) {
        setUser(userData);
        const userBalance = userData.balance !== undefined ? userData.balance : 
                          (userData.user?.balance !== undefined ? userData.user.balance : 0);
        setBalance(userBalance);
        updateUserData(userData);
      }
    } catch (err: any) {
      console.error('Error fetching user data:', err);
    }
  };

  const handlePaymentMade = async () => {
    if (!amount) {
      setError('Please enter an amount');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amountNum < 100) {
      setError('Minimum deposit amount is ₺100');
      return;
    }

    if (amountNum > 100000) {
      setError('Maximum deposit amount is ₺100,000');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await paymentAPI.createIbanDeposit({
        amount: amountNum,
        description: 'IBAN Havale/EFT',
      });

      const responseData = response.data;
      
      if (responseData.newBalance !== undefined) {
        // Balance was updated (auto-approved in dev mode)
        setBalance(responseData.newBalance);
        if (user) {
          const updatedUser = { ...user, balance: responseData.newBalance };
          updateUserData(updatedUser);
          setUser(updatedUser);
        }
        setSuccess(responseData.message || 'Deposit successful! Your balance has been updated.');
      } else {
        // Pending approval
        setSuccess(responseData.message || 'Deposit request submitted. It will be credited after approval.');
      }

      setAmount('');
      
      // Refresh user data after a short delay
      setTimeout(() => {
        fetchUserData();
      }, 1000);
    } catch (err: any) {
      console.error('Deposit error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit deposit request';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-8" style={{ opacity: 1 }}>
      <div className="w-[80%] h-[90vh] bg-white rounded-lg shadow-2xl flex overflow-hidden z-[10000]" style={{ opacity: 1, backgroundColor: '#ffffff' }}>
        {/* Left Sidebar */}
        <div className="w-60 bg-[#e8e8e8] border-r border-gray-300 flex flex-col">
        {/* User Profile */}
        <div className="p-4 bg-white border-b border-gray-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">
              {user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="font-semibold text-sm text-gray-800">{user?.username || user?.email || 'User'}</div>
              <div className="text-xs text-gray-500">{user?.email || ''}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-700 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Account not verified</span>
          </div>
          <button className="w-full py-2 bg-white border-2 border-red-400 text-red-500 rounded text-sm font-semibold hover:bg-red-50">
            VERIFY NOW
          </button>
        </div>

        {/* Main Balance */}
        <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium">Main Balance</span>
            <Eye className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mb-3">{balance.toFixed(2)} ₺</div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded text-xs font-bold flex items-center justify-center gap-1">
              <span className="text-lg">💰</span> DEPOSIT
            </button>
            <button className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded text-xs font-bold flex items-center justify-center gap-1">
              <span className="text-lg">💸</span> WITHDRAW
            </button>
          </div>
        </div>

        {/* Bonus Balance */}
        <div className="p-4 bg-gradient-to-br from-yellow-600 to-yellow-700 text-white border-b-2 border-yellow-800">
          <div className="text-xs font-medium mb-1">Total Bonus Balance</div>
          <div className="text-2xl font-bold">0.00 ₺</div>
        </div>

        {/* Bonus Balance Detail */}
        <div className="px-4 py-2 bg-gradient-to-br from-yellow-600 to-yellow-700 text-white flex justify-between text-xs border-b border-gray-300">
          <span>Bonus Balance</span>
          <span>0.00 ₺</span>
        </div>

        {/* Loyalty Points */}
        <button className="mx-4 my-3 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded flex items-center justify-center gap-2 text-sm font-semibold">
          <div className="w-6 h-6 bg-yellow-800 rounded-full flex items-center justify-center text-xs font-bold">
            P
          </div>
          Loyalty Points
        </button>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          {/* My Profile */}
          <button className="w-full px-4 py-3 bg-white hover:bg-gray-50 flex items-center justify-between text-sm font-medium text-gray-800 border-b border-gray-300">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>MY PROFILE</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Balance Management */}
          <div className="border-b border-gray-300">
            <button 
              onClick={() => setBalanceManagementOpen(!balanceManagementOpen)}
              className="w-full px-4 py-3 bg-white hover:bg-gray-50 flex items-center justify-between text-sm font-medium text-gray-800"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>BALANCE MANAGEMENT</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${balanceManagementOpen ? 'rotate-180' : ''}`} />
            </button>
            {balanceManagementOpen && (
              <div className="bg-[#d8d8d8]">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300 bg-[#c8c8c8]">
                  Deposit
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300" onClick={onOpenWithdraw}>
                  Withdraw
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300" onClick={onOpenTransactionHistory}>
                  Transaction History
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300">
                  Withdraw Status
                </button>
              </div>
            )}
          </div>

          {/* Bet History */}
          <button className="w-full px-4 py-3 bg-white hover:bg-gray-50 flex items-center justify-between text-sm font-medium text-gray-800 border-b border-gray-300">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>BET HISTORY</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Bonuses */}
          <button className="w-full px-4 py-3 bg-white hover:bg-gray-50 flex items-center justify-between text-sm font-medium text-gray-800 border-b border-gray-300">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span>BONUSES</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Deposit Content */}
      <div className="flex-1 bg-[#e0e0e0] overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-300 px-6 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Deposit</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-w-2xl mx-auto">
          {/* Amount Input Section */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-4">Enter Deposit Amount</h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₺) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <div className="mt-2 text-xs text-gray-500">
              Min: 100 ₺ | Max: 100,000 ₺
            </div>
          </div>

          {/* Bank Transfer Details Section */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🏦</div>
              <h3 className="text-base font-bold text-gray-800">Bank Transfer (Havale / IBAN)</h3>
            </div>
            
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-900 font-medium mb-1">
                ℹ️ Please send the amount via bank transfer using the details below.
              </p>
              <p className="text-xs text-purple-700">
                After making the transfer, click "Payment Made" and wait for admin approval.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Bank Name
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 font-medium">
                  Ziraat Bankası
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  IBAN
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 font-mono">
                  TR33 0001 0012 3456 7890 1234 56
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Account Holder Name
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-800 font-medium">
                  Garbet Ödeme Hizmetleri A.Ş.
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">{success}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handlePaymentMade}
            disabled={!amount || loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 text-base shadow-md"
          >
            {loading ? 'SUBMITTING...' : 'PAYMENT MADE'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your deposit will be processed after admin verification (usually within 15-30 minutes)
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
export default DepositPage;
