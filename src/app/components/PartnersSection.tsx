import { DollarSign, QrCode, Wallet } from 'lucide-react';

export function PartnersSection() {
  const paymentMethods = [
    { 
      name: 'Banka Havale', 
      icon: <DollarSign className="w-8 h-8 text-gray-600" />,
      description: 'Bank Transfer'
    },
    { 
      name: 'Tiktak Havale', 
      icon: <DollarSign className="w-8 h-8 text-gray-600" />,
      description: 'Tiktak Transfer'
    },
    { 
      name: 'Galaxypay Havale', 
      icon: <span className="text-2xl font-bold text-gray-600">G</span>,
      description: 'Galaxypay Transfer'
    },
    { 
      name: 'Anında QR', 
      icon: <QrCode className="w-8 h-8 text-gray-600" />,
      description: 'Instant QR'
    },
    { 
      name: 'Betsilin Havale', 
      icon: <DollarSign className="w-8 h-8 text-gray-600" />,
      description: 'Betsilin Transfer'
    },
    { 
      name: 'Anında Papara', 
      icon: <span className="text-2xl font-bold text-purple-600">p</span>,
      description: 'Instant Papara'
    },
    { 
      name: 'Fulgurpay F', 
      icon: <span className="text-3xl font-bold text-gray-600">F</span>,
      description: 'Fulgurpay'
    }
  ];

  return (
    <section className="bg-white py-6 sm:py-8">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {paymentMethods.map((method, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-lg transition-all duration-300 hover:border-cyan-500 group"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-lg group-hover:bg-cyan-50 transition-colors">
                  {method.icon}
                </div>
                
                {/* Name */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">{method.name}</h3>
                  <p className="text-[10px] text-gray-500">{method.description}</p>
                </div>

                {/* Button */}
                <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold py-2 px-3 rounded-md transition-colors">
                  YATIRIM YAP
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}