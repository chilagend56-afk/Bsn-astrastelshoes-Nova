import { useEffect } from 'react';
import { useSystemSettings } from '../../contexts/SystemSettingsContext';

export const TitleUpdater = () => {
  const { settings } = useSystemSettings();

  useEffect(() => {
    if (settings?.siteName) {
      document.title = `${settings.siteName} | ${settings.tagline || 'Smart Devices, Smarter Choices'}`;
    }

    if (settings?.siteName || settings?.logoUrl) {
      const name = settings?.siteName || 'Bsn-astrastelshoes';
      const logo = settings?.logoUrl || '/pwa-192x192.png';
      const manifest = {
        name: name,
        short_name: name,
        description: settings?.tagline || 'Tech Hub',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: logo,
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: logo,
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: logo,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      };
      
      const stringManifest = JSON.stringify(manifest);
      const blob = new Blob([stringManifest], {type: 'application/json'});
      const manifestURL = URL.createObjectURL(blob);
      
      let manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        manifestLink.setAttribute('href', manifestURL);
      } else {
        manifestLink = document.createElement('link');
        manifestLink.setAttribute('rel', 'manifest');
        manifestLink.setAttribute('href', manifestURL);
        document.head.appendChild(manifestLink);
      }
      
      if (settings?.logoUrl) {
        let appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
        if (appleIcon) {
          appleIcon.setAttribute('href', settings.logoUrl);
        } else {
          appleIcon = document.createElement('link');
          appleIcon.setAttribute('rel', 'apple-touch-icon');
          appleIcon.setAttribute('href', settings.logoUrl);
          document.head.appendChild(appleIcon);
        }
      }
    }
  }, [settings?.siteName, settings?.tagline, settings?.logoUrl]);

  return null;
};
