import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

export function LiveSupportChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:inline-block font-bold text-sm">CANLI DESTEK</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-bold text-sm">CANLI DESTEK</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-64 p-4 bg-gray-50 overflow-y-auto">
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm text-gray-700">Merhaba! Size nasıl yardımcı olabilirim?</p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Mesajınızı yazın..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

