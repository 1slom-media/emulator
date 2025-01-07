export async function maskPhoneNumber(phone: string): Promise<string> {
  const maskedPhone = phone.replace(
    /^(\d{4})(\d{2})(\d{2})(\d{2})$/,
    '$1****$3$4',
  );
  return maskedPhone;
}
