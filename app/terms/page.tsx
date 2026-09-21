export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-semibold mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-6">Last updated: September 2026</p>

        <div className="space-y-6 text-sm text-gray-700">
          <section>
            <h2 className="font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using Ghana Agriculture Hub, you agree to
              these Terms of Service. If you do not agree, please do not use the
              platform.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">2. What This Platform Is</h2>
            <p>
              Ghana Agriculture Hub is a directory and discovery platform that
              connects farmers, buyers, suppliers, machinery owners, service
              providers, and job seekers across Ghana&apos;s agricultural sector.
              The platform helps users discover and contact one another. It does
              not process payments, verify the accuracy of listings, or act as a
              party to any transaction, employment relationship, or agreement
              between users.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">3. Your Account</h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activity under your account. You
              must provide accurate information when registering and creating
              listings.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">4. Listings and Content</h2>
            <p className="mb-2">
              When you post a listing, job posting, application, or article, you
              are solely responsible for its accuracy and legality. You agree not
              to post content that is:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>False, misleading, or fraudulent.</li>
              <li>Illegal, or offering illegal goods or services.</li>
              <li>Infringing on someone else&apos;s rights.</li>
              <li>Abusive, harassing, or discriminatory.</li>
            </ul>
            <p className="mt-2">
              We reserve the right to remove listings or content that violate
              these terms.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">5. Transactions Between Users</h2>
            <p>
              Any transaction, negotiation, agreement, or employment arrangement
              you enter into with another user is solely between you and that
              user. We are not responsible for the quality, safety, legality, or
              accuracy of any listing, product, service, or job opportunity, nor
              for the conduct of any user.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">6. Market Information</h2>
            <p>
              Pricing and market information shown on the platform (such as
              average asking prices) is derived from user-submitted listings and
              does not represent verified transaction data. It should not be
              relied upon as financial or market advice.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">7. Account Termination</h2>
            <p>
              We may suspend or terminate accounts that violate these terms. You
              may stop using the platform and request account deletion at any
              time.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">8. Limitation of Liability</h2>
            <p>
              The platform is provided &quot;as is&quot; without warranties of any kind.
              To the fullest extent permitted by law, we are not liable for any
              damages arising from your use of the platform or your dealings with
              other users.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">9. Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the
              platform after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">10. Contact</h2>
            <p>
              Questions about these terms can be directed to the platform
              administrator.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}