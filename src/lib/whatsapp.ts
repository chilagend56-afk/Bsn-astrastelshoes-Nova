export const formatWhatsAppNumber = (number: string): string => {
  if (!number) return '';
  // Remove all non-numeric characters except +
  let cleanNumber = number.replace(/[^\d+]/g, '');
  
  // If it starts with a plus, just remove the plus
  if (cleanNumber.startsWith('+')) {
    cleanNumber = cleanNumber.substring(1);
  }
  
  // If it starts with a 0, it's likely a local Nigerian number (e.g., 081...), replace 0 with 234
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '234' + cleanNumber.substring(1);
  }
  
  return cleanNumber;
};
