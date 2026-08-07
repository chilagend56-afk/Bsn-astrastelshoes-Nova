import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SystemSettingsContext = createContext<any>(null);

export const SystemSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<any>({
    siteName: 'Young Dangote',
    deliveryCost: 1500,
    contactEmail: 'admin001@gmail.com',
    whatsappNumber: '08146516003',
    deliveryLocation: 'Port Harcourt',
    maintenanceMode: false,
    logoUrl: '',
    tagline: 'Tech Hub'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'system_config')
        .single();
        
      if (data && !error) {
        setSettings((prev: any) => ({ ...prev, 
          siteName: data.site_name || prev.siteName,
          deliveryCost: data.delivery_cost || prev.deliveryCost,
          contactEmail: data.contact_email || prev.contactEmail,
          whatsappNumber: data.whatsapp_number || prev.whatsappNumber,
          deliveryLocation: data.delivery_location || prev.deliveryLocation,
          maintenanceMode: data.maintenance_mode || prev.maintenanceMode,
          logoUrl: data.logo_url || prev.logoUrl,
          tagline: data.tagline || prev.tagline
        }));
      }
      setLoading(false);
    };

    fetchSettings();

    const channel = supabase.channel('public:settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings', filter: 'id=eq.system_config' }, payload => {
        const pNew: any = payload.new;
        setSettings((prev: any) => ({ ...prev, 
          siteName: pNew.site_name || prev.siteName,
          deliveryCost: pNew.delivery_cost || prev.deliveryCost,
          contactEmail: pNew.contact_email || prev.contactEmail,
          whatsappNumber: pNew.whatsapp_number || prev.whatsappNumber,
          deliveryLocation: pNew.delivery_location || prev.deliveryLocation,
          maintenanceMode: pNew.maintenance_mode || prev.maintenanceMode,
          logoUrl: pNew.logo_url || prev.logoUrl,
          tagline: pNew.tagline || prev.tagline
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SystemSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SystemSettingsContext.Provider>
  );
};

export const useSystemSettings = () => useContext(SystemSettingsContext);
