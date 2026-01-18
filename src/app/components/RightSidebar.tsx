import { MessageCircle, Camera, FileText, Settings } from 'lucide-react';

export function RightSidebar() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden xl:block">
      <div className="bg-gray-800 rounded-l-lg p-2 space-y-3 shadow-lg">
        <button 
          className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-cyan-500 rounded-lg transition-colors group"
          title="Chat"
        >
          <MessageCircle className="w-5 h-5 text-gray-300 group-hover:text-white" />
        </button>
        <button 
          className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-cyan-500 rounded-lg transition-colors group"
          title="Camera"
        >
          <Camera className="w-5 h-5 text-gray-300 group-hover:text-white" />
        </button>
        <button 
          className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-cyan-500 rounded-lg transition-colors group"
          title="Documents"
        >
          <FileText className="w-5 h-5 text-gray-300 group-hover:text-white" />
        </button>
        <button 
          className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-cyan-500 rounded-lg transition-colors group"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-gray-300 group-hover:text-white" />
        </button>
      </div>
    </div>
  );
}

