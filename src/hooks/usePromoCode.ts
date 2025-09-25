import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PromoCode {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  discount_amount: number;
}

interface PromoCodeValidation {
  valid: boolean;
  promoCode?: PromoCode;
  error?: string;
}

export const usePromoCode = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validatePromoCode = async (
    code: string,
    orderAmount: number,
    serviceIds?: string[]
  ): Promise<PromoCodeValidation> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('validate-promo-code', {
        body: {
          code,
          orderAmount,
          serviceIds
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to validate promo code",
          variant: "destructive"
        });
        return { valid: false, error: "Failed to validate promo code" };
      }

      if (!data.valid) {
        toast({
          title: "Invalid Promo Code",
          description: data.error,
          variant: "destructive"
        });
        return { valid: false, error: data.error };
      }

      toast({
        title: "Promo Code Applied!",
        description: `You saved $${data.promoCode.discount_amount.toFixed(2)}`,
      });

      return { valid: true, promoCode: data.promoCode };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate promo code';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return { valid: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    validatePromoCode,
    loading
  };
};