import React, { useState } from 'react';
import { ExternalLink, Share2, ArrowLeft, Edit2, Trash2, Plus } from 'lucide-react';
import { Wishlist, WishlistItem } from '../types';

interface ListDisplayProps {
  wishlist: Wishlist;
  onUpdateList: (updatedWishlist: Wishlist) => void;
  onDeleteList: (listId: string) => void;
  onBack: () => void;
}

const ListDisplay: React.FC<ListDisplayProps> = ({ wishlist, onUpdateList, onDeleteList, onBack }) => {
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Omit<WishlistItem, 'id'>>({ category: '', description: '', url: '' });
  const [isAddingItem, setIsAddingItem] = useState(false);

  const groupedItems = wishlist.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof wishlist.items>);

  const handleEditItem = (item: WishlistItem) => {
    setEditingItem(item);
  };

  const handleUpdateItem = (updatedItem: WishlistItem) => {
    const updatedItems = wishlist.items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    onUpdateList({ ...wishlist, items: updatedItems });
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = wishlist.items.filter(item => item.id !== itemId);
    onUpdateList({ ...wishlist, items: updatedItems });
  };

  const handleShare = () => {
    const shareableUrl = `${window.location.origin}/?sharedList=${wishlist.id}`;
    setShareUrl(shareableUrl);
    navigator.clipboard.writeText(shareableUrl);
  };

  const handleDeleteWishlist = () => {
    if (window.confirm('Are you sure you want to delete this wishlist?')) {
      onDeleteList(wishlist.id);
    }
  };

  const handleAddItem = () => {
    if (newItem.category && newItem.description) {
      const updatedItems = [...wishlist.items, { ...newItem, id: Date.now().toString() }];
      onUpdateList({ ...wishlist, items: updatedItems });
      setNewItem({ category: '', description: '', url: '' });
      setIsAddingItem(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="text-indigo-600 hover:text-indigo-800 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <div>
          <button onClick={handleShare} className="text-indigo-600 hover:text-indigo-800 flex items-center mr-2">
            <Share2 className="w-4 h-4 mr-1" /> Share
          </button>
          <button onClick={handleDeleteWishlist} className="text-red-600 hover:text-red-800 flex items-center">
            <Trash2 className="w-4 h-4 mr-1" /> Delete List
          </button>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">{wishlist.name}</h2>
      {shareUrl && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          Shareable link copied to clipboard: {shareUrl}
        </div>
      )}
      {/* Rest of the component remains the same */}
    </div>
  );
};

export default ListDisplay;