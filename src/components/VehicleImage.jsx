import { useState, useEffect, useRef } from 'react';
import { getVehicleImage } from '../data/imageService';

const BODY_FALLBACKS = {
  Saloon: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
  SUV: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80',
  Coupe: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  Hatchback: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80',
  Convertible: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3b?auto=format&fit=crop&w=800&q=80',
  DEFAULT: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
};

/**
 * VehicleImage - lazy-loads a Wikipedia image for the given make/model.
 * Falls back to a premium Unsplash image on error or miss.
 * Uses IntersectionObserver to only start fetching when visible.
 */
export default function VehicleImage({ make, model, bodyType, alt, className, style }) {
  const [src, setSrc] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);
  
  const fallback = BODY_FALLBACKS[bodyType] || BODY_FALLBACKS.DEFAULT;

  useEffect(() => {
    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          getVehicleImage(make, model).then(url => {
            if (!cancelled) setSrc(url || fallback);
          }).catch(() => {
            if (!cancelled) setSrc(fallback);
          });
        }
      },
      { rootMargin: '200px' } // Start loading 200px before the image enters viewport
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [make, model, fallback]);

  const handleError = () => {
    setSrc(fallback);
  };

  return (
    <div
      ref={ref}
      className={`vehicle-img-wrapper${loaded ? ' loaded' : ''}`}
      style={style}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={className}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          loading="lazy"
        />
      ) : (
        // Skeleton shimmer while loading
        <div className="vehicle-img-skeleton" />
      )}
    </div>
  );
}
