import React from 'react';

const LAST_UPDATED = 'April 10, 2026';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="border-t border-white/10 pt-8 mt-8">
    <h2 className="text-base font-semibold text-white mb-3">{title}</h2>
    <div className="text-sm text-white/75 leading-relaxed space-y-3">{children}</div>
  </section>
);

const TermsOfService: React.FC = () => {
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
        <h1 className="text-2xl font-semibold text-white mb-2">Terms of Use</h1>
        <p className="text-sm text-white/60 mb-2">Last updated: {LAST_UPDATED}</p>
        <p className="text-sm text-white/75 leading-relaxed mt-6">
          This website is merely a class software development project and stock trading simulator.
          No real money is managed and Orion Trading, Inc. does not exist. Any financial, legal,
          contact, etc. information listed is a fabrication for the purposes of this exercise.
          These Terms of Use ("Terms") govern your access to and use of the Orion trading platform,
          including all associated websites, APIs, mobile applications, and services
          (collectively, the "Platform"), operated by Orion Trading, Inc. ("Orion", "we", "us", or "our").
          By creating an account or using the Platform you agree to be bound by these Terms.
          If you do not agree, do not use the Platform.
        </p>

        <Section title="1. Eligibility">
          <p>
            You must be at least 18 years of age to use the Platform. By registering, you represent and
            warrant that you are 18 or older and have the legal capacity to enter into a binding agreement.
          </p>
          <p>
            You may not use the Platform if you are located in, or a national or resident of, any country
            subject to comprehensive sanctions administered by the U.S. Office of Foreign Assets Control
            (OFAC), the European Union, or the United Nations.
            You represent that your use of the Platform does not violate any applicable laws or regulations
            in your jurisdiction.
          </p>
        </Section>

        <Section title="2. Account Registration and Security">
          <p>
            You must provide accurate, current, and complete information when creating your account and
            keep it updated. You are solely responsible for safeguarding your login credentials and for
            all activity that occurs under your account.
          </p>
          <p>
            You must notify Orion immediately at <span className="text-white/90">support@oriontrading.pro</span> if
            you suspect unauthorized access to your account. Orion will not be liable for any losses
            arising from unauthorized use of your account where you failed to notify us promptly or
            where the unauthorized access resulted from your failure to maintain credential security.
          </p>
          <p>
            Orion reserves the right to require multi-factor authentication or additional verification
            steps at its discretion, particularly for large withdrawals or unusual account activity.
          </p>
        </Section>

        <Section title="3. Trading Activity">
          <p>
            All orders placed through the Platform — whether market, limit, or stop orders — are
            binding upon submission. Orion routes orders to one or more liquidity providers and
            regulated exchanges on your behalf. Execution prices are determined by prevailing market
            conditions at the time of order matching and are not guaranteed.
          </p>
          <p>
            All executed trades are final. Orion does not offer trade cancellations or reversals after
            execution except in cases of clear technical error at Orion's sole discretion.
          </p>
          <p>
            Trading in securities and financial instruments involves substantial risk of loss.
            You acknowledge that you may lose some or all of your invested capital and that past
            performance of any instrument is not indicative of future results.
          </p>
        </Section>

        <Section title="4. Fees and Commissions">
          <p>
            Orion charges fees for certain services including but not limited to trade execution,
            fund withdrawals, and data subscriptions. The current fee schedule is published on the
            Platform's Fees page and is incorporated into these Terms by reference.
          </p>
          <p>
            Orion reserves the right to modify its fee schedule at any time with at least 30 days'
            prior notice communicated via email to your registered address and/or a prominent notice
            on the Platform. Continued use of the Platform after the effective date of any fee change
            constitutes your acceptance of the updated fees.
          </p>
        </Section>

        <Section title="5. No Financial Advice">
          <p>
            Nothing on the Platform constitutes investment advice, financial advice, trading advice,
            or any other type of advice. Orion is a technology platform that facilitates trading; it
            is not a registered investment adviser, broker-dealer, or financial planner.
          </p>
          <p>
            Market data, analytics, news feeds, and any other informational content provided through
            the Platform are for informational purposes only. You should consult a qualified financial
            professional before making any investment decisions.
          </p>
        </Section>

        <Section title="6. Prohibited Conduct">
          <p>You agree not to engage in any of the following:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Wash trading, spoofing, layering, or any other form of market manipulation</li>
            <li>Using automated bots, scrapers, or scripts to access the Platform without a valid API agreement with Orion</li>
            <li>Attempting to reverse-engineer, decompile, or disassemble the Platform or its underlying technology</li>
            <li>Submitting false identity information or impersonating another person or entity</li>
            <li>Transmitting malware, viruses, or any other malicious code</li>
            <li>Engaging in any activity that disrupts, degrades, or impairs the Platform's performance</li>
            <li>Violating any applicable securities laws, AML regulations, or KYC requirements</li>
          </ul>
          <p>
            Violation of this section may result in immediate account suspension, termination, and
            referral to relevant regulatory or law enforcement authorities.
          </p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            The Platform and all of its content — including software, trade names, trademarks, logos,
            user interfaces, market data compilations, and documentation — are the exclusive property
            of Orion Trading, Inc. or its licensors and are protected by applicable intellectual
            property laws.
          </p>
          <p>
            You are granted a limited, non-exclusive, non-transferable, revocable license to access
            and use the Platform solely for your personal trading activities in accordance with these
            Terms. No other rights are granted.
          </p>
        </Section>

        <Section title="8. Account Termination">
          <p>
            You may close your account at any time by contacting <span className="text-white/90">support@oriontrading.pro</span>.
            Upon account closure, any open positions may be closed at prevailing market prices and
            remaining balances will be remitted to your verified withdrawal method, subject to
            applicable holds and regulatory requirements.
          </p>
          <p>
            Orion may suspend or terminate your account immediately and without prior notice if:
            (a) you breach these Terms; (b) Orion is required to do so by applicable law or a
            regulatory authority; (c) Orion reasonably suspects fraudulent or illegal activity;
            or (d) Orion discontinues the Platform.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ORION AND ITS OFFICERS, DIRECTORS,
            EMPLOYEES, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING TRADING LOSSES, LOSS OF PROFITS, LOSS
            OF DATA, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF
            THE PLATFORM, EVEN IF ORION HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p>
            ORION'S AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE
            TERMS OR THE PLATFORM SHALL NOT EXCEED THE TOTAL FEES PAID BY YOU TO ORION IN THE
            TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
          </p>
          <p>
            Orion does not warrant that the Platform will be uninterrupted, error-free, or free of
            harmful components, or that market data provided will be accurate or timely.
          </p>
        </Section>

        <Section title="10. Governing Law and Dispute Resolution">
          <p>
            These Terms are governed by the laws of the State of Delaware, without regard to its
            conflict of law provisions. Any dispute, claim, or controversy arising out of or relating
            to these Terms or your use of the Platform shall be resolved by binding arbitration
            administered by the American Arbitration Association (AAA) under its Commercial
            Arbitration Rules, with proceedings conducted in English.
          </p>
          <p>
            YOU AND ORION EACH WAIVE THE RIGHT TO A JURY TRIAL AND TO PARTICIPATE IN A CLASS
            ACTION OR CLASS ARBITRATION. YOU MAY ONLY BRING CLAIMS AGAINST ORION IN YOUR
            INDIVIDUAL CAPACITY.
          </p>
          <p>
            Nothing in this section prevents either party from seeking injunctive or other equitable
            relief in a court of competent jurisdiction to prevent irreparable harm.
          </p>
        </Section>

        <Section title="11. Changes to These Terms">
          <p>
            Orion may update these Terms from time to time. For material changes, we will provide
            at least 30 days' notice via email to your registered address and/or a prominent notice
            on the Platform. Your continued use of the Platform after the effective date of updated
            Terms constitutes your acceptance of the changes. If you do not agree to the updated
            Terms, you must stop using the Platform and close your account.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>
            Questions about these Terms may be directed to:<br />
            <span className="text-white/90">legal@oriontrading.pro</span><br />
            Orion Trading, Inc., 1601 Rice Boulevard, Houston, TX 77005
          </p>
        </Section>
      </div>
    </main>
  );
};

export default TermsOfService;
