'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AffiliateTracker() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const ref = searchParams.get('ref');
    
    if (ref) {
      console.log(`[AffiliateTracker] Cupom detectado: ${ref}`);
      // Salva no localStorage para persistência entre páginas
      localStorage.setItem('vya_affiliate_coupon', ref);
      
      // Feedback visual opcional no console para desenvolvedor
      console.log('Referência de afiliado salva com sucesso.');
    }
  }, [searchParams]);

  // Este componente não renderiza nada visualmente
  return null;
}
