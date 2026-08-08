import { Link } from 'react-router-dom';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';

export const Logo = () => {
  const { settings } = useSystemSettings();

  return (
    <Link to="/" className="flex items-center gap-3 select-none">
      {settings.logoUrl ? (
        <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
      ) : (
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-pink-500/30">
          {settings.siteName ? settings.siteName.charAt(0).toUpperCase() : 'C'}
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-bold text-xl leading-none tracking-tight text-dark uppercase">{settings.siteName || 'Bsn-astrastelshoes'}</span>
        <span className="text-[10px] tracking-[0.15em] text-pink-600 font-semibold uppercase mt-0.5">
          {settings.tagline === 'Fancy Shoes & Glamour' ? 'Feel Good. Spend Smart.' : (settings.tagline || 'Feel Good. Spend Smart.')}
        </span>
      </div>
    </Link>
  );
};
