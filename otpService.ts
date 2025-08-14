export async function sendOtp(to: string) {
  console.log('Sending OTP to', to);
  // In production, integrate with SMS/email provider or Supabase Auth.
  // For demo, return a fixed code.
  return '123456';
}
