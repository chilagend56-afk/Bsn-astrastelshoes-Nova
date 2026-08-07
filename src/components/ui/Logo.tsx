import { Link } from 'react-router-dom';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';

export const Logo = () => {
  const { settings } = useSystemSettings();

  return (
    <Link to="/" className="flex items-center gap-3 select-none">
      {settings.logoUrl ? (
        <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
      ) : (
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/30">
          {settings.siteName ? settings.siteName.charAt(0).toUpperCase() : 'Y'}
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-bold text-xl leading-none tracking-tight text-dark uppercase">{settings.siteName || 'Young Dangote'}</span>
        <span className="text-[10px] tracking-[0.15em] text-gray-500 font-medium uppercase mt-0.5">{settings.tagline || 'Tech Hub'}</span>
      </div>
    </Link>
  );
};
