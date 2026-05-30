import { useState, useEffect, useRef } from 'react';
import { getVehicleImage } from '../data/imageService';

/**
 * VehicleImage — fetches the real Wikipedia image for a car.
 * Shows a shimmer skeleton while loading.
 * If Wikipedia has no image, shows a clean branded "No Photo" placeholder
 * instead of a generic fallback.
 */
export default function VehicleImage({ make, model, bodyType, alt, className, style }) {
  const [src, setSrc] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setSrc(null);
    setLoaded(false);
    setFailed(false);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          getVehicleImage(make, model).then(url => {
            if (cancelled) return;
            if (url) setSrc(url);
            else setFailed(true);
          }).catch(() => {
            if (!cancelled) setFailed(true);
          });
        }
      },
      { rootMargin: '300px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [make, model]);

  const handleError = () => {
    // Image URL returned but failed to load — show placeholder
    setSrc(null);
    setFailed(true);
  };

  return (
    <div
      ref={ref}
      className={`vehicle-img-wrapper${loaded ? ' loaded' : ''}`}
      style={style}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          className={className}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          loading="lazy"
        />
      ) : failed ? (
        /* Clean branded placeholder — no random stock photos */
        <div className="vehicle-img-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/>
            <rect x="9" y="11" width="14" height="10" rx="2"/>
            <circle cx="12" cy="17" r="1"/>
            <circle cx="20" cy="17" r="1"/>
          </svg>
          <span>{make} {model}</span>
        </div>
      ) : (
        /* Shimmer while fetching */
        <div className="vehicle-img-skeleton" />
      )}
    </div>
  );
}
