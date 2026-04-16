import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Img,
  Tailwind,
  Font,
} from '@react-email/components';

// DEV
// import { readFileSync } from 'fs';
// import { join } from 'path';
// function getLogoSrc(): string {
//   try {
//     const svg = readFileSync(join(__dirname, '../../../apps/web_client/public/email-logo-white.svg'));
//     return `data:image/svg+xml;base64,${svg.toString('base64')}`;
//   } catch {
//     return 'https://oriontrading.pro/email-logo-white.svg';
//   }
// }
// const logoSrc = getLogoSrc();

// PROD
const logoSrc = 'https://oriontrading.pro/email-logo-white.svg';

const USER_NAME = '{{user_name}}';

export default function UserDeleted() {
  return (
    <Tailwind config={{ theme: { extend: { colors: { accent: '#5B6AD4' } } } }}>
      <Html lang="en">
        <Head>
          <Font
            fontFamily="Inter"
            fallbackFontFamily="Arial"
            webFont={{
              url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <Font
            fontFamily="Inter"
            fallbackFontFamily="Arial"
            webFont={{
              url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2',
              format: 'woff2',
            }}
            fontWeight={700}
            fontStyle="normal"
          />
        </Head>
        <Body className="bg-[#f0f2f5] font-[Inter,Arial,sans-serif] py-8 m-0">
          <Container className="max-w-[600px] mx-auto bg-white rounded-[10px] overflow-hidden border border-[#e2e5ea]">

            {/* Accent header with logo right-aligned */}
            <Section className="bg-accent px-6 py-4">
              <Img
                src={logoSrc}
                width={44}
                height={44}
                alt="Orion"
                className="block ml-auto"
              />
            </Section>

            {/* Main message */}
            <Section className="px-10 pt-8 pb-6">
              <Text className="text-[18px] font-bold text-[#111827] mt-0 mb-5 leading-[1.5]">
                Hi {USER_NAME},
              </Text>
              <Text className="text-[15px] text-[#374151] leading-[1.65] mt-0 mb-4">
                Your Orion account has been permanently deleted and your data has
                been removed from our systems.
              </Text>
              <Text className="text-[15px] text-[#374151] leading-[1.65] mt-0 mb-0">
                If you did not request this deletion, please contact our support
                team immediately at{' '}
                <a href="mailto:support@oriontrading.pro" className="text-accent no-underline font-semibold">
                  support@oriontrading.pro
                </a>
                {' '}so we can investigate.
              </Text>
            </Section>

            <Hr className="border-[#e5e7eb] mx-10 my-0" />

            {/* Closing */}
            <Section className="px-10 py-8">
              <Text className="text-[15px] text-[#6b7280] leading-[1.65] mt-0 mb-0">
                It was a pleasure having you on the platform. The markets will be
                here when you're ready.
              </Text>
            </Section>

            {/* Sign-off */}
            <Section className="px-10 pt-0 pb-9">
              <Text className="text-[15px] text-[#374151] leading-[1.65] mt-0 mb-1">
                Best,
              </Text>
              <Text className="text-[15px] font-bold text-[#111827] mt-0 mb-0">
                The Orion Team
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-[#f9fafb] border-t border-[#e5e7eb] px-10 py-4">
              <Text className="text-[12px] text-[#9ca3af] mt-0 mb-1 leading-[1.5]">
                © {new Date().getFullYear()} Orion Trading. All rights reserved.
              </Text>
              <Text className="text-[12px] text-[#9ca3af] mt-0 mb-0 leading-[1.5]">
                You're receiving this email because your account at oriontrading.pro
                was recently deleted.
              </Text>
            </Section>

          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
