/**
 * Utilitários para formatação e validação de números de telefone brasileiros
 */

/**
 * Aplica máscara de telefone brasileiro
 * @param phone - Número de telefone sem formatação
 * @returns Número formatado com máscara
 */
export function applyPhoneMask(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length <= 2) {
    return cleanPhone;
  } else if (cleanPhone.length <= 7) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2)}`;
  } else if (cleanPhone.length <= 11) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7, 11)}`;
  }
  
  return phone;
}

/**
 * Remove formatação do número de telefone
 * @param phone - Número de telefone formatado
 * @returns Número limpo apenas com dígitos
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Valida se o DDD é válido no Brasil
 * @param ddd - Código DDD
 * @returns true se o DDD é válido
 */
export function isValidDDD(ddd: string): boolean {
  const validDDDs = [
    '11', '12', '13', '14', '15', '16', '17', '18', '19', // SP
    '21', '22', '24', // RJ
    '27', '28', // ES
    '31', '32', '33', '34', '35', '37', '38', // MG
    '41', '42', '43', '44', '45', '46', // PR
    '47', '48', '49', // SC
    '51', '53', '54', '55', // RS
    '61', // DF
    '62', '64', // GO
    '63', // TO
    '65', '66', // MT
    '67', // MS
    '68', // AC
    '69', // RO
    '71', '73', '74', '75', '77', // BA
    '79', // SE
    '81', '87', // PE
    '82', // AL
    '83', // PB
    '84', // RN
    '85', '88', // CE
    '86', '89', // PI
    '91', '93', '94', // PA
    '92', '97', // AM
    '95', // RR
    '96', // AP
    '98', '99' // MA
  ];
  
  return validDDDs.includes(ddd);
}

/**
 * Formata número para exibição
 * @param phone - Número de telefone
 * @returns Número formatado para exibição
 */
export function formatPhoneForDisplay(phone: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  
  if (cleanPhone.length === 11) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
  } else if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
  }
  
  return phone;
}

/**
 * Formata número de telefone (alias para formatPhoneForDisplay)
 * @param phone - Número de telefone
 * @returns Número formatado
 */
export function formatPhoneNumber(phone: string): string {
  return formatPhoneForDisplay(phone);
}

/**
 * Remove máscara do número de telefone (alias para cleanPhoneNumber)
 * @param phone - Número de telefone formatado
 * @returns Número limpo apenas com dígitos
 */
export function removePhoneMask(phone: string): string {
  return cleanPhoneNumber(phone);
}

/**
 * Obtém informações sobre o DDD
 * @param ddd - Código DDD
 * @returns Informações sobre o estado/região
 */
export function getDDDInfo(ddd: string): { state: string; region: string } | null {
  const dddMap: Record<string, { state: string; region: string }> = {
    '11': { state: 'SP', region: 'São Paulo (Capital e região metropolitana)' },
    '12': { state: 'SP', region: 'São Paulo (Vale do Paraíba)' },
    '13': { state: 'SP', region: 'São Paulo (Baixada Santista)' },
    '14': { state: 'SP', region: 'São Paulo (Bauru e região)' },
    '15': { state: 'SP', region: 'São Paulo (Sorocaba e região)' },
    '16': { state: 'SP', region: 'São Paulo (Ribeirão Preto e região)' },
    '17': { state: 'SP', region: 'São Paulo (São José do Rio Preto e região)' },
    '18': { state: 'SP', region: 'São Paulo (Presidente Prudente e região)' },
    '19': { state: 'SP', region: 'São Paulo (Campinas e região)' },
    '21': { state: 'RJ', region: 'Rio de Janeiro (Capital e região metropolitana)' },
    '22': { state: 'RJ', region: 'Rio de Janeiro (Norte e noroeste)' },
    '24': { state: 'RJ', region: 'Rio de Janeiro (Sul e região serrana)' },
    '27': { state: 'ES', region: 'Espírito Santo (Norte)' },
    '28': { state: 'ES', region: 'Espírito Santo (Sul)' },
    // Adicione mais conforme necessário
  };
  
  return dddMap[ddd] || null;
}