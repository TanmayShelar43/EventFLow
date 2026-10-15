import React from 'react';

const CATEGORIES = [
  {
    id: 'Music & Concerts',
    name: 'Music & Concerts',
    count: '140+ Events',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    color: 'from-amber-500/20'
  },
  {
    id: 'Comedy',
    name: 'Stand-Up Comedy',
    count: '65+ Shows',
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=600&q=80',
    color: 'from-violet-500/20'
  },
  {
    id: 'Workshops',
    name: 'Workshops & Masterclasses',
    count: '80+ Sessions',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    color: 'from-emerald-500/20'
  },
  {
    id: 'Arts & Culture',
    name: 'Arts & Culture',
    count: '50+ Exhibitions',
    image: 'https://images.unsplash.com/photo-1508997449629-303059a039c0?auto=format&fit=crop&w=600&q=80',
    color: 'from-rose-500/20'
  }
];

export default function CategorySection({ activeCategory, onSelectCategory }) {
  return (
    <section id="categories" className="py-12 border-t border-[#EBE7E0] bg-[#F4EFEA]/40">
      <div className="container-desktop">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#121316]">
              Explore by <span className="font-serif-italic text-[#4F46E5]">Category</span>
            </h2>
            <p className="text-sm text-[#575861] mt-1">Select a category to filter live events near you</p>
          </div>
          {activeCategory && (
            <button 
              onClick={() => onSelectCategory('')}
              className="text-xs font-semibold text-[#4F46E5] hover:underline self-start md:self-auto"
            >
              Clear filter ({activeCategory})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <div 
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? '' : cat.id)}
                className={`group relative h-64 rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 shadow-sm hover:shadow-xl ${
                  isSelected ? 'ring-2 ring-[#4F46E5] border-transparent scale-[1.02]' : 'border-[#E2DDD5] hover:border-[#CBD5E1]'
                }`}
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                    {cat.count}
                  </span>
                  <h3 className="text-lg font-bold mt-2 group-hover:text-[#EEF2FF] transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}