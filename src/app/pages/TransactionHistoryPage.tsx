import { useState } from 'react';
import { X, Eye, Gift, User, Settings, History, ChevronDown, Search, Download, Filter } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  type: 'Deposit' | 'Withdraw' | 'Bonus' | 'Bet' | 'Win';
  method: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
  reference: string;
}

interface TransactionHistoryPageProps {
  onClose: () => void;
  onOpenDeposit?: () => void;
  onOpenWithdraw?: () => void;
  onOpenProfile?: () => void;
}

export function TransactionHistoryPage({ onClose, onOpenDeposit, onOpenWithdraw, onOpenProfile }: TransactionHistoryPageProps) {
  const [balanceManagementOpen, setBalanceManagementOpen] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2026-01-10 14:32',
      type: 'Deposit',
      method: 'Betsilin Havale',
      amount: '+1,500.00 ₺',
      status: 'Completed',
      reference: 'DEP-20260110-001'
    },
    {
      id: '2',
      date: '2026-01-09 18:45',
      type: 'Withdraw',
      method: 'Bank Transfer',
      amount: '-500.00 ₺',
      status: 'Pending',
      reference: 'WTH-20260109-002'
    },
    {
      id: '3',
      date: '2026-01-09 12:15',
      type: 'Bonus',
      method: 'Welcome Bonus',
      amount: '+200.00 ₺',
      status: 'Completed',
      reference: 'BON-20260109-003'
    },
    {
      id: '4',
      date: '2026-01-08 20:30',
      type: 'Bet',
      method: 'Sweet Bonanza',
      amount: '-50.00 ₺',
      status: 'Completed',
      reference: 'BET-20260108-004'
    },
    {
      id: '5',
      date: '2026-01-08 20:35',
      type: 'Win',
      method: 'Sweet Bonanza',
      amount: '+125.00 ₺',
      status: 'Completed',
      reference: 'WIN-20260108-005'
    },
    {
      id: '6',
      date: '2026-01-07 16:20',
      type: 'Deposit',
      method: 'Papara',
      amount: '+1,000.00 ₺',
      status: 'Completed',
      reference: 'DEP-20260107-006'
    },
    {
      id: '7',
      date: '2026-01-06 11:55',
      type: 'Withdraw',
      method: 'Papara',
      amount: '-750.00 ₺',
      status: 'Failed',
      reference: 'WTH-20260106-007'
    },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type.toLowerCase() === filterType;
    const matchesSearch = transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.method.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Failed':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Deposit':
      case 'Win':
      case 'Bonus':
        return 'text-green-600';
      case 'Withdraw':
      case 'Bet':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
          <button
            onClick={onOpenProfile}
            className="w-full px-4 py-3 bg-white hover:bg-gray-50 flex items-center justify-between text-sm font-medium text-gray-800 border-b border-gray-300"
          >
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
                <button
                  onClick={onOpenDeposit}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300"
                >
                  Deposit
                </button>
                <button
                  onClick={onOpenWithdraw}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300"
                >
                  Withdraw
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300 bg-[#c8c8c8]">
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

      {/* Main Content */}
      <div className="flex-1 bg-[#e0e0e0] overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-300 px-6 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Transaction History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Filter and Search Bar */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by reference or method..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdraw">Withdraw</option>
                  <option value="bonus">Bonus</option>
                  <option value="bet">Bet</option>
                  <option value="win">Win</option>
                </select>

                <button className="px-4 py-2 bg-[#3d3d7a] hover:bg-[#4d4d8a] text-white rounded-lg text-sm font-semibold flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date & Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Method</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Amount</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">{transaction.date}</td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-semibold ${getTypeColor(transaction.type)}`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{transaction.method}</td>
                        <td className={`px-4 py-3 text-sm font-bold text-right ${getTypeColor(transaction.type)}`}>
                          {transaction.amount}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 font-mono">{transaction.reference}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Total Deposits</div>
              <div className="text-2xl font-bold text-green-600">+2,500.00 ₺</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Total Withdrawals</div>
              <div className="text-2xl font-bold text-red-600">-1,250.00 ₺</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Net Balance</div>
              <div className="text-2xl font-bold text-gray-800">+1,250.00 ₺</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default TransactionHistoryPage;