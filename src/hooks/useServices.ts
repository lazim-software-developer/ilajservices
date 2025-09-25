import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  duration_minutes: number;
  image_url?: string;
  features: string[];
  is_active: boolean;
  is_addon: boolean;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const getServicesByCategory = (category: string) => {
    return services.filter(service => service.category === category && !service.is_addon);
  };

  const getAddonServices = () => {
    return services.filter(service => service.is_addon);
  };

  const getServiceById = (id: string) => {
    return services.find(service => service.id === id);
  };

  return {
    services,
    loading,
    error,
    getServicesByCategory,
    getAddonServices,
    getServiceById,
    refreshServices: fetchServices
  };
};