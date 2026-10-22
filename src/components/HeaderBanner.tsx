import React, { useState } from 'react';
import { StoreInfo } from '../types';
import { Clock, MapPin, Phone, Info, X, ShieldCheck, Tag, Sparkles } from 'lucide-react';

interface HeaderBannerProps {
  store: StoreInfo;
  onOpenAdmin: () => void;
  isAdminOpen: boolean;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  store,
  onOpenAdmin,
  isAdminOpen,
}) => {
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [promoBannerVisible, setPromoBannerVisible] = useState(store.showAnnouncement);

  return (
    <header className="relative w-full bg-white border-b border-stone-200">
      {/* Top Promotional Bar (matching screenshot: 50% discount! Ver) */}
      {promoBannerVisible && store.announcementText && (
        <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between text-xs sm:text-sm font-semibold shadow-inner">
          <div className="flex items-center gap-2 truncate">
            <span className="text-base animate-bounce">🎉</span>
            <span className="truncate">{store.announcementText}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowPromoModal(true)}
              className="bg-white text-red-600 hover:bg-red-50 text-xs px-2.5 py-0.5 rounded-full font-bold shadow-xs transition"
            >
              Ver
            </button>
            <button
              onClick={() => setPromoBannerVisible(false)}
              className="text-white/80 hover:text-white p-0.5"
              aria-label="Cerrar aviso"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Cover Image Container */}
      <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-stone-900">
        <img
          src={store.coverUrl}
          alt={store.name}
          className="w-full h-full object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

        {/* Top Floating Controls on Cover */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                store.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span>{store.isOpen ? 'Abierto' : 'Cerrado temporalmente'}</span>
          </div>

          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition shadow-sm ${
              isAdminOpen
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white/90 text-stone-800 hover:bg-white'
            }`}
            title="Administrar menú y precios"
          >
            <ShieldCheck size={14} className={isAdminOpen ? 'text-white' : 'text-red-600'} />
            <span>{isAdminOpen ? 'Cerrar Admin' : 'Panel Admin'}</span>
          </button>
        </div>

        {/* Floating Quick Info Badge inside cover image matching screenshot */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <div className="bg-white/95 backdrop-blur-md rounded-lg px-2.5 py-1 shadow-md text-stone-800 flex items-center gap-1.5 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-emerald-700">Open</span>
            </div>
            <button
              onClick={() => setShowInfoModal(true)}
              className="text-stone-400 hover:text-stone-700"
              title="Información del local"
            >
              <Info size={13} />
            </button>
            <span className="border-l border-stone-200 pl-1.5 text-stone-500 text-[10px] hidden xs:inline">
              Gratis desde {store.currencySymbol} {store.freeShippingThreshold.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Restaurant Header Information Row with Overlapping Logo */}
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="flex items-start gap-3 sm:gap-4 -mt-10 sm:-mt-12 relative z-10">
          {/* Logo Badge */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1 shadow-lg ring-1 ring-black/5 shrink-0 overflow-hidden">
            <img
              src={store.logoUrl}
              alt="Logo"
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                // Fallback icon if image broken
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {/* Name & Quick Status */}
          <div className="pt-2 sm:pt-3 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight truncate">
                {store.name}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-stone-500 truncate mt-0.5">
              {store.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-2 text-xs text-stone-600">
              <span className="flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                <Clock size={12} />
                {store.deliveryTimeEstimate}
              </span>

              <span className="flex items-center gap-1 text-stone-600">
                <MapPin size={12} className="text-stone-400" />
                <span className="truncate max-w-[200px]">{store.address}</span>
              </span>

              <button
                onClick={() => setShowInfoModal(true)}
                className="text-red-600 hover:text-red-700 font-semibold underline text-xs"
              >
                Horarios y detalles
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <Info size={18} />
              </div>
              <h3 className="text-lg font-bold text-stone-900">{store.name}</h3>
            </div>

            <div className="space-y-3 text-sm text-stone-600">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-800">Dirección</span>
                  <span>{store.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock size={16} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-800">Horario de Atención</span>
                  <span>{store.hours}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone size={16} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-800">WhatsApp de Pedidos</span>
                  <span>+{store.phone}</span>
                </div>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                <p className="flex justify-between">
                  <span className="text-stone-500">Costo regular de envío:</span>
                  <span className="font-semibold text-stone-800">{store.currencySymbol} {store.shippingFee.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-stone-500">Envío gratis a partir de:</span>
                  <span className="font-semibold text-emerald-600">{store.currencySymbol} {store.freeShippingThreshold.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-stone-500">Tiempo estimado:</span>
                  <span className="font-semibold text-stone-800">{store.deliveryTimeEstimate}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-5 w-full py-2.5 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition text-sm"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Promo Coupon Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative border-2 border-red-500">
            <button
              onClick={() => setShowPromoModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X size={18} />
            </button>
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Sparkles size={28} />
            </div>
            <span className="inline-block px-3 py-1 bg-red-50 text-red-600 font-extrabold text-xs uppercase tracking-wider rounded-full mb-2">
              Promoción Exclusiva
            </span>
            <h3 className="text-xl font-extrabold text-stone-900 mb-2">
              {store.announcementDiscount}
            </h3>
            <p className="text-sm text-stone-600 mb-5">
              {store.announcementText}. Añade los artículos a tu carrito y pide por WhatsApp para hacer válido este descuento.
            </p>
            <button
              onClick={() => setShowPromoModal(false)}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition text-sm"
            >
              ¡Ver Menú con Descuentos!
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
