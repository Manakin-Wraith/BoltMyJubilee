import React, { useState, useEffect } from 'react';
import { ExternalLink, Gift, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { Wishlist, WishlistItem } from '../types';

interface SharedListViewProps {
  wishlistId: string;
}

const SharedListView: React.FC<SharedListViewProps> = ({ wishlistId }) => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const storedWishlists = localStorage.getItem('wishlists');
        if (storedWishlists) {
          const wishlists: Wishlist[] = JSON.parse(storedWishlists);
          const foundWishlist = wishlists.find(w => w.id === wishlistId);
          if (foundWishlist) {
            setWishlist(foundWishlist);
            setExpandedCategories(Object.keys(groupItems(foundWishlist.items)));
          } else {
            setError('Wishlist not found');
          }
        } else {
          setError('No wishlists available');
        }
      } catch (err) {
        setError('Error fetching wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [wishlistId]);

  const groupItems = (items: WishlistItem[]) => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, WishlistItem[]>);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !wishlist) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Gift className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
        <p className="text-gray-600">{error || 'Wishlist not found'}</p>
      </div>
    );
  }

  const groupedItems = groupItems(wishlist.items);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-indigo-600 p-6 text-center">
            <Gift className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white">JUBILEE</h1>
            <p className="text-indigo-100 mt-2">Shared Wishlist</p>
          </div>
          <div className="p-6">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">{wishlist.name}</h2>
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="mb-6 border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex justify-between items-center w-full text-left text-xl font-medium text-gray-900 mb-2 focus:outline-none"
                >
                  <span>{category}</span>
                  {expandedCategories.includes(category) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedCategories.includes(category) && (
                  <ul className="space-y-4 mt-4">
                    {items.map((item) => (
                      <li key={item.id} className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <p className="text-gray-800 mb-2">{item.description}</p>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            View Product
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedListView;