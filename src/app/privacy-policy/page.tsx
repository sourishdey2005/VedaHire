import { Header } from '@/components/header';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="prose prose-lg mx-auto dark:prose-invert">
          <h1>Privacy Policy</h1>
          <p>
            This is a placeholder for your privacy policy. You should replace
            this with your own policy.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us. For example, we
            collect information when you create an account, upload your resume,
            or communicate with us. The types of information we may collect
            include your name, email address, resume content, and any other
d            information you choose to provide.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to operate and improve our
            services, including to:
          </p>
          <ul>
            <li>
              Provide, maintain, and improve our AI-powered resume analysis
              tools.
            </li>
            <li>
              Personalize your experience and provide content and features that
              match your interests.
            </li>
            <li>
              Respond to your comments, questions, and requests and provide
              customer service.
            </li>
            <li>
              Communicate with you about products, services, offers, and events
              offered by VedaHire and others.
            </li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We do not share your personal information with third parties except
            as described in this Privacy Policy.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We take reasonable measures to help protect information about you
            from loss, theft, misuse and unauthorized access, disclosure,
            alteration, and destruction.
          </p>

          <h2>5. Your Choices</h2>
          <p>
            You may update, correct or delete information about you at any time
            by logging into your online account or emailing us.
          </p>

          <h2>6. Changes to this Policy</h2>
          <p>
            We may change this Privacy Policy from time to time. If we make
            changes, we will notify you by revising the date at the top of the
            policy and, in some cases, we may provide you with additional
            notice.
          </p>
        </div>
      </main>
    </div>
  );
}
