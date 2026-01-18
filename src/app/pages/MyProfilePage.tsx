import { useState } from 'react';
import { X, Eye, Gift, User, Settings, History, ChevronDown } from 'lucide-react';

interface MyProfilePageProps {
  onClose: () => void;
  onOpenDeposit?: () => void;
  onOpenWithdraw?: () => void;
  onOpenTransactionHistory?: () => void;
}

export function MyProfilePage({ onClose, onOpenDeposit, onOpenWithdraw, onOpenTransactionHistory }: MyProfilePageProps) {
  const [myProfileOpen, setMyProfileOpen] = useState(true);
  const [balanceManagementOpen, setBalanceManagementOpen] = useState(true);
  const [betHistoryOpen, setBetHistoryOpen] = useState(false);
  const [bonusesOpen, setBonusesOpen] = useState(false);
  const [selectedSubmenu, setSelectedSubmenu] = useState('personal-details');
  
  // Form states
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('Şahin');
  const [lastName, setLastName] = useState('Oguz');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');

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
            <button className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded text-xs font-bold flex items-center justify-center gap-1" onClick={onOpenDeposit}>
              <span className="text-lg">💰</span> DEPOSIT
            </button>
            <button className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded text-xs font-bold flex items-center justify-center gap-1" onClick={onOpenWithdraw}>
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
          <div className="border-b border-gray-300">
            <button 
              onClick={() => setMyProfileOpen(!myProfileOpen)}
              className="w-full px-4 py-3 bg-white hover:bg-gray-50 flex items-center justify-between text-sm font-medium text-gray-800"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>MY PROFILE</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${myProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            {myProfileOpen && (
              <div className="bg-[#d8d8d8]">
                <button 
                  onClick={() => setSelectedSubmenu('personal-details')}
                  className={`w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300 ${selectedSubmenu === 'personal-details' ? 'bg-[#c8c8c8]' : ''}`}
                >
                  Personal Details
                </button>
                <button 
                  onClick={() => setSelectedSubmenu('change-password')}
                  className={`w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300 ${selectedSubmenu === 'change-password' ? 'bg-[#c8c8c8]' : ''}`}
                >
                  Change Password
                </button>
                <button 
                  onClick={() => setSelectedSubmenu('time-out')}
                  className={`w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300 ${selectedSubmenu === 'time-out' ? 'bg-[#c8c8c8]' : ''}`}
                >
                  Time-Out
                </button>
                <button 
                  onClick={() => setSelectedSubmenu('two-step')}
                  className={`w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300 ${selectedSubmenu === 'two-step' ? 'bg-[#c8c8c8]' : ''}`}
                >
                  Two-Step Authentication
                </button>
                <button 
                  onClick={() => setSelectedSubmenu('verify-account')}
                  className={`w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300 ${selectedSubmenu === 'verify-account' ? 'bg-[#c8c8c8]' : ''}`}
                >
                  Verify Account
                </button>
                <button 
                  onClick={() => setSelectedSubmenu('confirmation-settings')}
                  className={`w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300 ${selectedSubmenu === 'confirmation-settings' ? 'bg-[#c8c8c8]' : ''}`}
                >
                  Confirmation Settings
                </button>
              </div>
            )}
          </div>

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
          <button 
            onClick={() => setBetHistoryOpen(!betHistoryOpen)}
            className="w-full px-4 py-3 bg-white hover:bg-gray-50 flex items-center justify-between text-sm font-medium text-gray-800 border-b border-gray-300"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>BET HISTORY</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${betHistoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Bonuses */}
          <button 
            onClick={() => {
              setBonusesOpen(!bonusesOpen);
              setSelectedSubmenu('bonuses');
            }}
            className="w-full px-4 py-3 bg-white hover:bg-gray-50 flex items-center justify-between text-sm font-medium text-gray-800 border-b border-gray-300"
          >
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span>BONUSES</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${bonusesOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="flex-1 bg-[#e0e0e0] overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-300 px-6 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            {selectedSubmenu === 'personal-details' && 'Personal Details'}
            {selectedSubmenu === 'change-password' && 'Change Password'}
            {selectedSubmenu === 'time-out' && 'Time-Out'}
            {selectedSubmenu === 'two-step' && 'Two-Step Authentication'}
            {selectedSubmenu === 'verify-account' && 'Verify Account'}
            {selectedSubmenu === 'confirmation-settings' && 'Confirmation Settings'}
            {selectedSubmenu === 'bonuses' && 'Bonuses'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Personal Details Content */}
          {selectedSubmenu === 'personal-details' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Account Information</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value="SA07050830"
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <button className="w-full py-3 bg-[#3d3d7a] hover:bg-[#4d4d8a] text-white font-bold rounded text-sm transition-all">
                  UPDATE PROFILE
                </button>
              </div>
            </div>
          )}

          {/* Change Password Content */}
          {selectedSubmenu === 'change-password' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Change Your Password</h3>
                
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <button className="w-full py-3 bg-[#3d3d7a] hover:bg-[#4d4d8a] text-white font-bold rounded text-sm transition-all">
                  CHANGE PASSWORD
                </button>
              </div>
            </div>
          )}

          {/* Time-Out Content */}
          {selectedSubmenu === 'time-out' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Responsible Gaming - Time-Out</h3>
                <p className="text-xs text-gray-600 mb-4">
                  Take a break from gaming. Select a time-out period during which your account will be temporarily suspended.
                </p>
                
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Select Time-Out Period</label>
                  <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400">
                    <option value="">Choose a period</option>
                    <option value="24h">24 Hours</option>
                    <option value="48h">48 Hours</option>
                    <option value="1week">1 Week</option>
                    <option value="1month">1 Month</option>
                    <option value="3months">3 Months</option>
                    <option value="6months">6 Months</option>
                  </select>
                </div>

                <button className="w-full py-3 bg-[#3d3d7a] hover:bg-[#4d4d8a] text-white font-bold rounded text-sm transition-all">
                  ACTIVATE TIME-OUT
                </button>
              </div>
            </div>
          )}

          {/* Two-Step Authentication Content */}
          {selectedSubmenu === 'two-step' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Two-Step Authentication</h3>
                <p className="text-xs text-gray-600 mb-4">
                  Add an extra layer of security to your account by enabling two-step authentication.
                </p>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded mb-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">Two-Step Authentication</div>
                    <div className="text-xs text-gray-500">Status: Disabled</div>
                  </div>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded text-xs transition-all">
                    ENABLE
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Verify Account Content */}
          {selectedSubmenu === 'verify-account' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Verify Your Account</h3>
                <p className="text-xs text-gray-600 mb-4">
                  Please upload the required documents to verify your account. This helps us ensure the security of your account.
                </p>
                
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Identity Document (ID/Passport)</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Proof of Address</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>

                <button className="w-full py-3 bg-[#3d3d7a] hover:bg-[#4d4d8a] text-white font-bold rounded text-sm transition-all">
                  SUBMIT DOCUMENTS
                </button>
              </div>
            </div>
          )}

          {/* Confirmation Settings Content */}
          {selectedSubmenu === 'confirmation-settings' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Communication Preferences</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <div>
                      <div className="text-sm font-medium text-gray-800">Email Notifications</div>
                      <div className="text-xs text-gray-500">Receive updates and promotions via email</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <div>
                      <div className="text-sm font-medium text-gray-800">SMS Notifications</div>
                      <div className="text-xs text-gray-500">Receive important updates via SMS</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-4 h-4" />
                    <div>
                      <div className="text-sm font-medium text-gray-800">Promotional Offers</div>
                      <div className="text-xs text-gray-500">Receive special offers and bonuses</div>
                    </div>
                  </label>
                </div>

                <button className="w-full py-3 bg-[#3d3d7a] hover:bg-[#4d4d8a] text-white font-bold rounded text-sm transition-all mt-4">
                  SAVE PREFERENCES
                </button>
              </div>
            </div>
          )}

          {/* Bonuses Content */}
          {selectedSubmenu === 'bonuses' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Bonuses</h3>
                <p className="text-xs text-gray-600 mb-4">
                  Here you can manage your bonuses and see your bonus history.
                </p>
                
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Bonus History</label>
                  <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400">
                    <option value="">Choose a period</option>
                    <option value="24h">24 Hours</option>
                    <option value="48h">48 Hours</option>
                    <option value="1week">1 Week</option>
                    <option value="1month">1 Month</option>
                    <option value="3months">3 Months</option>
                    <option value="6months">6 Months</option>
                  </select>
                </div>

                <button className="w-full py-3 bg-[#3d3d7a] hover:bg-[#4d4d8a] text-white font-bold rounded text-sm transition-all">
                  VIEW BONUS HISTORY
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
export default MyProfilePage;