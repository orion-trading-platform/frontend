import React from 'react';

const LAST_UPDATED = 'April 4, 2026';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="border-t border-white/10 pt-8 mt-8">
    <h2 className="text-base font-semibold text-white mb-3">{title}</h2>
    <div className="text-sm text-white/75 leading-relaxed space-y-3">{children}</div>
  </section>
);

const PrivacyPolicy: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#0d0d14] text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-[#0d0d14]/90 backdrop-blur border-b border-white/10">
        <div className="max-w-[760px] mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-widest uppercase text-white/90">Orion</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[760px] mx-auto px-6 py-14 pb-24">
        <h1 className="text-2xl font-semibold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-white/60 mb-2">Last updated: {LAST_UPDATED}</p>
        <p className="text-sm text-white/75 leading-relaxed mt-6">
          This Privacy Policy describes how Orion Trading, Inc. ("Orion", "we", "us", or "our")
          collects, uses, stores, and shares information when you use the Orion trading platform,
          including all associated websites, APIs, and services (collectively, the "Platform").
          By using the Platform, you agree to the practices described in this Policy.
        </p>

        <Section title="1. Information We Collect">
          <p><strong className="text-white/90">Account information.</strong> When you register, we collect your email address and a
          cryptographically hashed representation of your password (we never store your password
          in plain text). If you register via Google OAuth, we receive your email address from
          Google and do not store a password at all.</p>
          <p><strong className="text-white/90">Trading activity.</strong> We record all orders placed, executed, modified, or cancelled
          through the Platform, including timestamps, instrument, order type, quantity, price,
          and execution status. This data is necessary for trade confirmation, regulatory
          record-keeping, and your account history.</p>
          <p><strong className="text-white/90">Financial information.</strong> We collect account balance, deposit and withdrawal
          history, and transaction records. We do not store full payment card numbers; any card
          processing is handled by our PCI-DSS-compliant payment processors.</p>
          <p><strong className="text-white/90">Device and usage data.</strong> We automatically collect your IP address, browser type,
          operating system, referring URLs, pages visited, session duration, and clickstream data
          when you access the Platform.</p>
          <p><strong className="text-white/90">Cookies and similar technologies.</strong> See Section 6 (Cookies) for details.</p>
          <p><strong className="text-white/90">KYC/AML documentation.</strong> If required by applicable law or our compliance
          programme, we may ask you to submit government-issued identification, proof of address,
          or other documents to verify your identity. These are stored with restricted access and
          retained in accordance with Section 4 (Data Retention).</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use collected information to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Create and manage your account, authenticate your identity, and provide customer support</li>
            <li>Process and settle your trades and manage your portfolio balances</li>
            <li>Comply with AML, KYC, and other applicable financial regulatory obligations</li>
            <li>Detect, investigate, and prevent fraud, unauthorized account access, market manipulation, and other prohibited conduct</li>
            <li>Send transactional communications (trade confirmations, security alerts, password resets)</li>
            <li>Send marketing and product communications, where you have given consent or where permitted by law — you may opt out at any time</li>
            <li>Generate aggregated, anonymized analytics to improve Platform performance and user experience</li>
            <li>Enforce our Terms of Use and comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="3. How We Share Your Information">
          <p><strong className="text-white/90">Liquidity providers and exchanges.</strong> To execute your orders, we transmit
          necessary order details (instrument, quantity, price, account reference) to our
          counterparty liquidity providers and regulated trading venues. Order flow shared
          with third parties does not include your name or email address.</p>
          <p><strong className="text-white/90">Service providers.</strong> We share data with third-party vendors who help us operate
          the Platform, including cloud hosting providers, email delivery services, fraud
          detection tools, and analytics platforms. All such vendors are bound by data
          processing agreements requiring them to use your data only to provide services
          to Orion and to maintain appropriate security standards.</p>
          <p><strong className="text-white/90">Regulators and law enforcement.</strong> We may disclose your information when required
          by applicable law, regulation, court order, or at the direction of a regulatory
          authority (including SEC, FINRA, FinCEN, and equivalent bodies in other jurisdictions).
          We will notify you of such disclosures where legally permitted to do so.</p>
          <p><strong className="text-white/90">Business transfers.</strong> In connection with a merger, acquisition, financing, or
          sale of substantially all assets, your information may be transferred as part of
          that transaction. You will be notified via email and a prominent Platform notice
          before your data becomes subject to a materially different privacy policy.</p>
          <p><strong className="text-white/90">We do not sell your personal data</strong> to third parties for their own marketing
          or advertising purposes.</p>
        </Section>

        <Section title="4. Data Retention">
          <p>
            We retain your account data for as long as your account is active. Following account
            closure, we retain your trading records, transaction history, and identity verification
            documents for a minimum of <strong className="text-white/90">seven (7) years</strong> to comply with SEC Rule 17a-4,
            FINRA Rule 4511, FinCEN record-keeping requirements, and equivalent obligations under
            applicable international financial regulations.
          </p>
          <p>
            Device and usage logs are retained for up to 24 months for security and fraud
            investigation purposes, after which they are deleted or anonymized.
          </p>
          <p>
            Where retention is required by law or regulatory order, we may retain data beyond
            the periods described above.
          </p>
        </Section>

        <Section title="5. Security">
          <p>
            We implement industry-standard technical and organizational measures to protect your
            information, including:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong className="text-white/90">Encryption at rest:</strong> AES-256 for stored data</li>
            <li><strong className="text-white/90">Encryption in transit:</strong> TLS 1.3 for all data transmitted between your browser and our servers</li>
            <li><strong className="text-white/90">Password security:</strong> Argon2id hashing with per-user random salts — we cannot recover your password</li>
            <li><strong className="text-white/90">Access controls:</strong> Role-based access with least-privilege principles; employee access to production data is logged and audited</li>
            <li><strong className="text-white/90">Penetration testing and audits:</strong> Regular third-party security assessments</li>
          </ul>
          <p>
            No security system is impenetrable. In the event of a data breach that affects
            your personal information, we will notify you as required by applicable law.
          </p>
        </Section>

        <Section title="6. Cookies">
          <p>
            We use the following categories of cookies and similar tracking technologies:
          </p>
          <p><strong className="text-white/90">Strictly necessary cookies.</strong> These are required for the Platform to function,
          including session authentication tokens and CSRF protection tokens. You cannot opt
          out of these without also opting out of using the Platform.</p>
          <p><strong className="text-white/90">Analytics cookies.</strong> We use anonymized analytics cookies to understand how
          users interact with the Platform (pages viewed, features used, error rates). These
          do not identify you individually. You may opt out via the cookie preference centre
          accessible in the Platform's settings.</p>
          <p>
            We do not use advertising or cross-site tracking cookies.
          </p>
        </Section>

        <Section title="7. Your Rights">
          <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong className="text-white/90">Access:</strong> request a copy of the personal data we hold about you</li>
            <li><strong className="text-white/90">Rectification:</strong> request correction of inaccurate data</li>
            <li><strong className="text-white/90">Erasure:</strong> request deletion of your data (subject to our legal retention obligations described in Section 4)</li>
            <li><strong className="text-white/90">Portability:</strong> receive your data in a structured, machine-readable format</li>
            <li><strong className="text-white/90">Objection / restriction:</strong> object to or request restriction of certain processing activities</li>
          </ul>
          <p>
            <strong className="text-white/90">California residents (CCPA/CPRA):</strong> You have the right to know what personal
            information we collect and how it is used, the right to delete (subject to exceptions),
            the right to opt out of sale (we do not sell personal information), and the right to
            non-discrimination for exercising your privacy rights.
          </p>
          <p>
            To exercise any of these rights, submit a request to{' '}
            <span className="text-white/90">privacy@oriontrading.pro</span>. We will respond
            within 30 days (or within the timeframe required by applicable law). We may require
            identity verification before fulfilling your request.
          </p>
        </Section>

        <Section title="8. Children">
          <p>
            The Platform is not directed to individuals under 18 years of age. We do not knowingly
            collect personal information from children under 18. If we become aware that we have
            inadvertently collected such information, we will delete it promptly.
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. For material changes — such as
            new categories of data collected, new sharing partners, or changes to your rights —
            we will provide at least 30 days' notice via email to your registered address and/or
            a prominent notice on the Platform. The "Last updated" date at the top of this page
            reflects the most recent revision.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            For privacy-related inquiries, data requests, or complaints:<br />
            <span className="text-white/90">privacy@oriontrading.pro</span><br />
            Orion Trading, Inc., 1601 Rice Boulevard, Houston, TX 77005
          </p>
          <p>
            If you are located in the European Economic Area and believe we have not addressed
            your concern adequately, you have the right to lodge a complaint with your local
            supervisory authority.
          </p>
        </Section>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
