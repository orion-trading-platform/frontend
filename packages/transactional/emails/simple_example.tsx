// This file demonstrates local image handling for the preview server.
// For the dynamic placeholder pattern used in production templates, see password_reset.tsx.
import { Html, Heading, Text, Link, Img } from '@react-email/components';
import { readFileSync } from 'fs';
import { join } from 'path';

// For local preview (npm run dev): use getLogoSrc() instead of the
// hardcoded URL below. It reads the SVG from the monorepo and encodes it as
// a base64 data URI so the preview server can display it without hosting the
// file. Falls back to the hosted URL if the file can't be read.
// For export: use the hardcoded absolute URL — email clients block data URIs.
function getLogoSrc(): string {
  try {
    const svg = readFileSync(join(__dirname, '../../../apps/web_client/src/assets/logo-black.svg'));
    return `data:image/svg+xml;base64,${svg.toString('base64')}`;
  } catch {
    return 'https://oriontrading.pro/logo-black.svg';
  }
}

// const logoSrc = getLogoSrc();                               // for local preview (localhost:3000)
const logoSrc = 'https://oriontrading.pro/logo-black.svg';  // use this for 'npm run export'

interface WelcomeProps {
  // Dynamic URLs (e.g. password reset links) are passed as props.
  // So a static URL like in this example wouldn't need this.
  // A default is provided so the react-email preview renders without arguments.
  url?: string;
}

export default function Welcome({ url = 'https://oriontrading.pro' }: WelcomeProps) {
  return (
    <Html>
      <Heading>Welcome to Orion Trading</Heading>
      <Text>Click the link below and explore.</Text>
      <Link href={url}>Orion</Link>
      <Img src={logoSrc} width={120} height={120} alt="Orion Trading" />
    </Html>
  );
}