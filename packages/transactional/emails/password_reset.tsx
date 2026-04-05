import { Html, Heading, Text } from '@react-email/components';

// Placeholder constants — exported literally into the HTML so the backend can
// substitute real values at send time via simple string replacement.
const RESET_TOKEN = '{{reset_token}}';
const EXPIRE_MINUTES = '{{expire_minutes}}';

export default function PasswordReset() {
  return (
    <Html>
      <Heading>Password Reset Request</Heading>
      <Text>Enter the code below to reset your password. It expires in {EXPIRE_MINUTES} minutes.</Text>
      <Text style={{ fontFamily: 'monospace', fontSize: '1.4em', letterSpacing: '0.1em' }}>
        <strong>{RESET_TOKEN}</strong>
      </Text>
      <Text>If you didn't request this, please ignore this email.</Text>
    </Html>
  );
}
