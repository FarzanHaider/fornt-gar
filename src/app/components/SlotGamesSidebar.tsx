import { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

interface SlotGamesSidebarProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  selectedProvider?: string;
  onProviderChange?: (provider: string) => void;
}

export function SlotGamesSidebar({ 
  selectedCategory, 
  onCategoryChange, 
  selectedProvider, 
  onProviderChange 
}: SlotGamesSidebarProps) {
  const [providersExpanded, setProvidersExpanded] = useState(true);
  const [featuresExpanded, setFeaturesExpanded] = useState(true);

  const providers = [
    { name: 'Pragmatic Play', count: 248 },
    { name: 'NetEnt', count: 156 },
    { name: 'Play\'n GO', count: 132 },
    { name: 'Evolution', count: 98 },
    { name: 'Microgaming', count: 87 },
    { name: 'Red Tiger', count: 76 },
    { name: 'Yggdrasil', count: 64 },
    { name: 'Push Gaming', count: 52 },
    { name: 'Hacksaw Gaming', count: 48 },
    { name: 'Relax Gaming', count: 41 }
  ];

  const features = [
    { name: 'Bonus Buy', count: 156 },
    { name: 'Free Spins', count: 324 },
    { name: 'Jackpot', count: 89 },
    { name: 'Megaways', count: 112 },
    { name: 'Multiplier', count: 198 },
    { name: 'Wild', count: 276 },
    { name: 'Scatter', count: 245 },
    { name: 'Avalanche', count: 87 }
  ];

  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg shadow-sm p-4 space-y-6 sticky top-20 h-fit">
      {/* Search */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Oyun Ara</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Oyun adı..." 
            className="pl-10"
          />
        </div>
      </div>

      {/* Providers */}
      <div>
        <button 
          onClick={() => setProvidersExpanded(!providersExpanded)}
          className="flex items-center justify-between w-full font-semibold text-gray-900 mb-3 hover:text-purple-700"
        >
          <span>Sağlayıcılar</span>
          {providersExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {providersExpanded && (
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-100">
            {providers.map((provider) => (
              <label 
                key={provider.name} 
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  if (onProviderChange) {
                    // Toggle provider selection or set as single selection
                    if (selectedProvider === provider.name) {
                      onProviderChange('Tümü');
                    } else {
                      onProviderChange(provider.name);
                    }
                  }
                }}
              >
                <Checkbox checked={selectedProvider === provider.name} />
                <span className="text-sm text-gray-700 flex-1">{provider.name}</span>
                <span className="text-xs text-gray-400">({provider.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div>
        <button 
          onClick={() => setFeaturesExpanded(!featuresExpanded)}
          className="flex items-center justify-between w-full font-semibold text-gray-900 mb-3 hover:text-purple-700"
        >
          <span>Özellikler</span>
          {featuresExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {featuresExpanded && (
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-100">
            {features.map((feature) => (
              <label 
                key={feature.name} 
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  if (onCategoryChange) {
                    // Map feature to category
                    const categoryMap: Record<string, string> = {
                      'Jackpot': 'Jackpot',
                      'Free Spins': 'Bonus Buy',
                      'Megaways': 'Megaways'
                    };
                    const category = categoryMap[feature.name] || feature.name;
                    if (selectedCategory === category) {
                      onCategoryChange('Tümü');
                    } else {
                      onCategoryChange(category);
                    }
                  }
                }}
              >
                <Checkbox checked={selectedCategory === feature.name || 
                  (feature.name === 'Jackpot' && selectedCategory === 'Jackpot') ||
                  (feature.name === 'Free Spins' && selectedCategory === 'Bonus Buy') ||
                  (feature.name === 'Megaways' && selectedCategory === 'Megaways')
                } />
                <span className="text-sm text-gray-700 flex-1">{feature.name}</span>
                <span className="text-xs text-gray-400">({feature.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Volatility */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Volatilite</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
            <Checkbox />
            <span className="text-sm text-gray-700">Düşük</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
            <Checkbox />
            <span className="text-sm text-gray-700">Orta</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
            <Checkbox />
            <span className="text-sm text-gray-700">Yüksek</span>
          </label>
        </div>
      </div>

      {/* Clear Filters Button */}
      {(selectedCategory !== 'Tümü' || selectedProvider !== 'Tümü') && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              if (onCategoryChange) onCategoryChange('Tümü');
              if (onProviderChange) onProviderChange('Tümü');
            }}
            className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </aside>
  );
}