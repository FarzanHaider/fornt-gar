import { X } from 'lucide-react';
import { useState } from 'react';

export function NotificationBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-8 sm:h-10">
          <p className="text-xs sm:text-sm text-gray-700 text-center flex-1">
            Güncel adresimiz <span className="font-bold">www.betsilin835.com</span> 'dur. Bir sonraki domain adresimiz <span className="font-bold">www.betsilin836.com</span> olacaktır.
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 p-1 hover:bg-gray-200 rounded transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

