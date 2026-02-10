'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      disabled={product.stock === 0}
      className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${
        product.stock > 0 
          ? (isAdded ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200')
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      {product.stock > 0 ? (isAdded ? '✓ Adicionado!' : 'Adicionar ao Carrinho') : 'Produto Indisponível'}
    </button>
  );
}
