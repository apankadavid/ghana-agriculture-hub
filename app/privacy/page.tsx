export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-semibold mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-6">Last updated: September 2026</p>

        <div className="space-y-6 text-sm text-gray-700">
          <section>
            <h2 className="font-semibold mb-2">1. Introduction</h2>
            <p>
              Ghana Agriculture Hub (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates a platform
              connecting farmers, buyers, suppliers, and other participants in
              Ghana&apos;s agricultural sector. This policy explains what
              information we collect, how we use it, and the choices you have.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">2. Information We Collect</h2>
            <p className="mb-2">When you use our platform, we collect:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account information: your name, email address, and phone number.</li>
              <li>
                Profile information: your role (e.g. farmer, buyer, supplier), region,
                and city.
              </li>
              <li>
                Listing content: any products, inputs, machinery, services, or job
                postings you create, including photos you upload.
              </li>
              <li>
                Job application content: messages and resume/CV files you submit when
                applying to a job listing.
              </li>
              <li>
                If you sign in with Google, we receive your name, email address, and
                profile photo from Google.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To create and manage your account.</li>
              <li>To let other users discover your listings and contact you.</li>
              <li>To let employers review job applications you submit.</li>
              <li>To operate core features like search, weather, and market insights.</li>
              <li>To maintain the security and integrity of the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">4. Sharing of Information</h2>
            <p className="mb-2">We do not sell your personal information. We share data only with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Other users, where you&apos;ve chosen to make information public
                (e.g. your listing, your phone number for WhatsApp contact).
              </li>
              <li>
                Service providers who help us operate the platform: our database
                host, our image/file storage provider (Cloudinary), and Google
                (for sign-in).
              </li>
              <li>Authorities, only if required by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">5. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active. You
              may request deletion of your account and associated data at any time
              by contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">6. Your Choices</h2>
            <p>
              You can review and update your profile information at any time while
              logged in. You may request a copy of your data or ask us to delete it
              by reaching out through the contact details below.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">7. Security</h2>
            <p>
              We use industry-standard measures, including password hashing and
              secure sessions, to protect your information. No system is
              completely secure, and we encourage you to use a strong, unique
              password.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">8. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be
              reflected by updating the &quot;Last updated&quot; date above.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">9. Contact</h2>
            <p>
              Questions about this policy or your data can be directed to the
              platform administrator.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}