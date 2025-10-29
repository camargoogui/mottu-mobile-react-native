import i18n from './index';

/**
 * Traduz o status de uma moto
 */
export const translateMotoStatus = (status: 'disponível' | 'ocupada' | 'manutenção'): string => {
  const statusMap: Record<string, string> = {
    'disponível': i18n.t('moto.available'),
    'ocupada': i18n.t('moto.occupied'),
    'manutenção': i18n.t('moto.maintenance'),
  };
  return statusMap[status] || status;
};

/**
 * Traduz o status de uma vaga
 */
export const translateVagaStatus = (status: 'livre' | 'ocupada'): string => {
  const statusMap: Record<string, string> = {
    'livre': i18n.t('common.free'),
    'ocupada': i18n.t('common.occupied'),
  };
  return statusMap[status] || status;
};

