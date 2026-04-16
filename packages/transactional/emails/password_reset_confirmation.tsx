import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
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
// const logoSrc     = getLogoSrc();
// const SUPPORT_URL = 'http://localhost:5173/#/support';

// PROD
const logoSrc     = 'https://oriontrading.pro/email-logo-white.svg';
const SUPPORT_URL = 'https://www.oriontrading.pro/#/support';

const USER_NAME = '{{user_name}}';

export default function PasswordResetConfirmation() {
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
              url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2',
              format: 'woff2',
            }}
            fontWeight={600}
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
                Your Orion account password was recently changed.
              </Text>
              <Text className="text-[15px] text-[#374151] leading-[1.65] mt-0 mb-0">
                If you made this change, no further action is needed. If you did
                not request a password reset, your account may be compromised.
                Please contact our support team immediately so we can secure your
                account.
              </Text>
            </Section>

            <Hr className="border-[#e5e7eb] mx-10 my-0" />

            {/* Contact support CTA */}
            <Section className="px-10 py-7 text-center">
              <Button
                href={SUPPORT_URL}
                className="bg-accent text-white text-[13px] font-bold tracking-[0.08em] no-underline py-[14px] px-9 rounded-lg"
              >
                CONTACT SUPPORT
              </Button>
            </Section>

            <Hr className="border-[#e5e7eb] mx-10 my-0" />

            {/* Security note */}
            <Section className="px-10 pt-7 pb-2">
              <Text className="text-[15px] font-bold text-[#111827] mt-0 mb-[14px] uppercase tracking-[0.05em]">
                Keep your account secure
              </Text>
              <Text className="text-[14px] text-[#374151] leading-[1.65] mt-0 mb-3 pl-3 border-l-2 border-accent">
                <strong>Use a strong password:</strong> Choose a unique password
                that you don't use on any other site.
              </Text>
              <Text className="text-[14px] text-[#374151] leading-[1.65] mt-0 mb-3 pl-3 border-l-2 border-accent">
                <strong>Stay alert:</strong> Orion will never ask for your password
                via email or phone. Be cautious of phishing attempts.
              </Text>
              <Text className="text-[14px] text-[#6b7280] leading-[1.65] mt-6 mb-0">
                Our team is always here to help if you have any concerns about
                your account security.
              </Text>
            </Section>

            {/* Sign-off */}
            <Section className="px-10 pt-4 pb-9">
              <Text className="text-[15px] text-[#374151] leading-[1.65] mt-0 mb-1">
                Best,
              </Text>
              <Text className="text-[15px] font-semibold text-[#111827] mt-0 mb-0">
                The Orion Team
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-[#f9fafb] border-t border-[#e5e7eb] px-10 py-4">
              <Text className="text-[12px] text-[#9ca3af] mt-0 mb-1 leading-[1.5]">
                © {new Date().getFullYear()} Orion Trading. All rights reserved.
              </Text>
              <Text className="text-[12px] text-[#9ca3af] mt-0 mb-0 leading-[1.5]">
                You're receiving this email because a password change was made on
                your account at oriontrading.pro.
              </Text>
            </Section>

          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
