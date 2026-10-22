import React from 'react';
import { Product } from '../types';
import { calculateDiscount, formatPrice } from '../utils/formatters';
import { Plus, Check, Edit3, ImageOff } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  currencySymbol: string;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  cartQuantity: number;
  onQuickEditPrice?: (product: Product, newPrice: number) => void;
  isQuickEditMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currencySymbol,
  onAddToCart,
  onSelectProduct,
  cartQuantity,
  onQuickEditPrice,
  isQuickEditMode,
}) => {
  const discountPct = calculateDiscount(product.price, product.originalPrice);

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;
    onAddToCart(product);
  };

  const handlePriceClick = (e: React.MouseEvent) => {
    if (!isQuickEditMode || !onQuickEditPrice) return;
    e.stopPropagation();
    const promptVal = window.prompt(
      `Nuevo precio para "${product.name}" (${currencySymbol}):`,
      product.price.toString()
    );
    if (promptVal !== null) {
      const num = parseFloat(promptVal);
      if (!isNaN(num) && num >= 0) {
        onQuickEditPrice(product, num);
      }
    }
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className={`group relative bg-white rounded-2xl p-3 border transition-all cursor-pointer select-none flex gap-3 sm:gap-4 items-center ${
        !product.isAvailable
          ? 'opacity-60 bg-stone-50 border-stone-200'
          : 'border-stone-200 hover:border-red-300 hover:shadow-md'
      }`}
    >
      {/* Product Image on the left (matching the reference screenshot) */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-stone-100 shrink-0">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback image placeholder */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center text-stone-300">
          <ImageOff size={24} />
        </div>

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-2xs flex items-center justify-center p-1 text-center">
            <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-rose-600 px-1.5 py-0.5 rounded">
              Agotado
            </span>
          </div>
        )}

        {product.badge && product.isAvailable && (
          <div className="absolute top-1 left-1 bg-stone-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
            {product.badge}
          </div>
        )}
      </div>

      {/* Middle info column: title, description, prices */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
        <div>
          {/* Header row with name and discount badge */}
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-red-600 transition">
              {product.name}
            </h3>

            {/* Discount Badge on the right (matching screenshot: -33 %, -20 %, etc.) */}
            {discountPct && (
              <span className="bg-amber-500 text-white font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded-sm shrink-0 tracking-tight shadow-2xs">
                -{discountPct} %
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Bottom row: Price and Red Plus Button */}
        <div className="flex items-end justify-between gap-2 mt-2 pt-1 border-t border-stone-100">
          {/* Price display with optional original price */}
          <div
            className={`flex items-baseline gap-2 flex-wrap ${
              isQuickEditMode ? 'hover:bg-amber-100 px-1 rounded cursor-pointer ring-1 ring-amber-400' : ''
            }`}
            onClick={handlePriceClick}
            title={isQuickEditMode ? 'Clic para editar precio' : undefined}
          >
            <span className="text-red-600 font-extrabold text-sm sm:text-base tracking-tight">
              {formatPrice(product.price, currencySymbol)}
            </span>

            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-stone-400 text-xs sm:text-sm line-through decoration-stone-400 font-medium">
                {formatPrice(product.originalPrice, currencySymbol)}
              </span>
            )}

            {isQuickEditMode && (
              <Edit3 size={12} className="text-amber-600 ml-1 inline" />
            )}
          </div>

          {/* Add to cart button (matching screenshot: red square button with white plus) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {cartQuantity > 0 && (
              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-lg">
                x{cartQuantity}
              </span>
            )}

            <button
              onClick={handlePlusClick}
              disabled={!product.isAvailable}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs transition-transform active:scale-90 ${
                !product.isAvailable
                  ? 'bg-stone-300 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 hover:shadow-md'
              }`}
              title="Añadir al carrito"
              aria-label={`Añadir ${product.name} al carrito`}
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
