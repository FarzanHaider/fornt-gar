import { useState } from 'react';
import { X, Eye, Gift, User, Settings, History, ChevronDown } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  category: string[];
}

interface WithdrawPageProps {
  onClose: () => void;
  onOpenDeposit?: () => void;
  onOpenProfile?: () => void;
  onOpenTransactionHistory?: () => void;
}

export function WithdrawPage({ onClose, onOpenDeposit, onOpenProfile, onOpenTransactionHistory }: WithdrawPageProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [iban, setIban] = useState('');
  const [amount, setAmount] = useState('');
  const [balanceManagementOpen, setBalanceManagementOpen] = useState(true);

  const paymentMethods: PaymentMethod[] = [
    { id: '1', name: 'Betsilin Havale', icon: '🏦', category: ['all', 'virtual'] },
    { id: '2', name: 'Türkalı Wallet', icon: '💼', category: ['all', 'virtual'] },
    { id: '3', name: 'Red Havale', icon: '🔴', category: ['all', 'virtual'] },
    { id: '4', name: 'Mehsi Bitcoin', icon: '₿', category: ['all', 'virtual'] },
    { id: '5', name: 'Mehsi Kripto', icon: '₿', category: ['all', 'virtual'] },
    { id: '6', name: 'Pulpapara', icon: '💳', category: ['all', 'payfixpapara'] },
    { id: '7', name: 'Yalpapay Kripto', icon: '₿', category: ['all', 'virtual'] },
    { id: '8', name: 'Havale Havale', icon: '🏛️', category: ['all', 'virtual'] },
    { id: '9', name: 'Bitcoin', icon: '₿', category: ['all', 'virtual'] },
  ];

  const tabs = [
    { id: 'all', label: 'ALL', icon: '⊞' },
    { id: 'virtual', label: 'VIRTUAL WALLET', icon: '💼' },
    { id: 'payfixpapara', label: 'PAYFIX | PAPARA', icon: '💳' },
    { id: 'qr', label: 'QR', icon: '📱' },
  ];

  const filteredMethods = paymentMethods.filter(method => 
    activeTab === 'all' ? true : method.category.includes(activeTab)
  );

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleWithdraw = () => {
    if (!selectedMethod || !iban || !amount) {
      alert('Please select a payment method, enter IBAN and amount');
      return;
    }
    alert(`Withdraw ${amount}₺ using ${selectedMethod.name} to IBAN: ${iban}`);
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
              ŞO
            </div>
            <div>
              <div className="font-semibold text-sm text-gray-800">Şahin Oguz</div>
              <div className="text-xs text-gray-500">SA07050830</div>
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
          <div className="text-2xl font-bold mb-3">61.32 ₺</div>
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
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300" onClick={onOpenDeposit}>
                  Deposit
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300 bg-[#c8c8c8]">
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

      {/* Main Withdraw Content */}
      <div className="flex-1 bg-[#e0e0e0] overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-300 px-6 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Withdraw</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded font-bold text-xs transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Payment Methods Grid */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {filteredMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handleMethodSelect(method)}
                className={`bg-[#3d3d7a] hover:bg-[#4d4d8a] text-white rounded-lg px-3 py-4 flex items-center gap-2 transition-all duration-200 ${
                  selectedMethod?.id === method.id ? 'ring-2 ring-purple-400' : ''
                }`}
              >
                <div className="text-xl">{method.icon}</div>
                <div className="text-left text-xs font-bold leading-tight">{method.name}</div>
              </button>
            ))}
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="grid grid-cols-5 gap-4 text-xs mb-3">
              <div>
                <div className="text-gray-500 mb-1">Payment Name</div>
                <div className="font-semibold text-gray-800">
                  {selectedMethod ? selectedMethod.name : 'Betsilin Havale'}
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Fee</div>
                <div className="font-semibold text-gray-800">Free</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Process Time</div>
                <div className="font-semibold text-gray-800">0</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Min</div>
                <div className="font-semibold text-gray-800">1000 ₺</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Max</div>
                <div className="font-semibold text-gray-800">250000 ₺</div>
              </div>
            </div>
          </div>

          {/* Withdrawable Amount Section */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Withdrawable Amount</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Balance</span>
                <span className="font-semibold text-cyan-500">61.32 ₺</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Unplayed amount</span>
                <span className="font-semibold text-cyan-500">0.00 ₺</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-600">
              Lütfen çekim yapmak için gerekli tüm alanları doldurunuz.
            </p>
          </div>

          {/* IBAN Input */}
          <div className="bg-[#c8c8c8] rounded-lg p-4 mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Iban *
            </label>
            <input
              type="text"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              placeholder=""
              className="w-full px-3 py-2 bg-white border border-gray-400 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* Amount Input */}
          <div className="bg-[#c8c8c8] rounded-lg p-4 mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder=""
              className="w-full px-3 py-2 bg-white border border-gray-400 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            disabled={!selectedMethod || !iban || !amount}
            className="w-full py-3 bg-[#b8b8b8] hover:bg-[#a8a8a8] disabled:bg-[#c8c8c8] disabled:cursor-not-allowed text-gray-700 font-bold rounded-lg transition-all duration-200 text-sm"
          >
            DO WITHDRAW
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default WithdrawPage;