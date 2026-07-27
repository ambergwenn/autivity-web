import TermsNavbar from "@/components/terms-navbar";
import Footer from "@/components/footer";

export default function PrivacyPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
            <TermsNavbar />
            <main className="flex-1 py-12 px-6">
                <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800 md:p-12">

                    <h1 className="font-fredoka text-3xl font-bold text-slate-800 dark:text-slate-100 md:text-4xl">
                        Privacy Policy
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        <strong>Last Updated:</strong> July 20, 2026
                    </p>

                    <div className="mt-8 space-y-8 text-slate-600 dark:text-slate-300">

                        <p>
                            At <strong>Autivity</strong>, we are committed to protecting the privacy, safety, and dignity of our users—especially the learners, parents, and educators who rely on our platform. Grounded in occupational therapy principles and adaptive learning, Autivity provides a safe space for skill development that is focused and personalized for learners with Autism Spectrum Disorder (ASD).
                        </p>
                        <p>
                            This Privacy Policy outlines how we collect, use, store, and safeguard your information across our mobile application and web admin portal.
                        </p>

                        {/* Section 1 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                1. Information We Collect
                            </h2>
                            <p>
                                To deliver an adaptive and personalized learning experience, Autivity collects the following categories of information:
                            </p>

                            <h3 className="font-fredoka text-base font-semibold text-slate-700 dark:text-slate-200">
                                A. Account &amp; Profile Information
                            </h3>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    <strong>Educators &amp; Parents:</strong> Name, email address, account role (such as Teacher or Parent), and encrypted login credentials used to secure and manage your account.
                                </li>
                                <li>
                                    <strong>Learner Profiles:</strong> Student display names or identifiers, spectrum level, and grade level.
                                </li>
                            </ul>

                            <h3 className="font-fredoka text-base font-semibold text-slate-700 dark:text-slate-200">
                                B. Developmental &amp; Learning Progress Data
                            </h3>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    <strong>Domain Tracking:</strong> Metrics across foundational developmental domains, including Fine Motor, Cognitive, Sensory, Communication, and Social skills.
                                </li>
                                <li>
                                    <strong>Session Logs &amp; Adaptive Metrics:</strong> Activity attempt rates, completion times, and real-time difficulty adjustment parameters used by our adaptive engine.
                                </li>
                                <li>
                                    <strong>Qualitative Notes &amp; Rubrics:</strong> Evaluation scores (e.g., 0–4 focus or engagement rubrics) and custom observations feedback by educators.
                                </li>
                            </ul>

                            <h3 className="font-fredoka text-base font-semibold text-slate-700 dark:text-slate-200">
                                C. Sensory &amp; Accessibility Settings
                            </h3>
                            <ul className="list-disc pl-6">
                                <li>
                                    <strong>Sensory Preferences:</strong> Individualized student settings such as background music toggles, sound effect (SFX) preferences, and visual customization options designed to support sensory regulation.
                                </li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                2. Children&apos;s Privacy &amp; Consent
                            </h2>
                            <p>
                                Autivity is designed for use by children, specifically students with Autism Spectrum Disorder (ASD). We prioritize child data privacy:
                            </p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    <strong>No Direct Registration by Children:</strong> Learner profiles cannot be created independently by children. All learner profiles must be created and managed by an authorized parent, legal guardian, or educational institution.
                                </li>
                                <li>
                                    <strong>Parental &amp; School Authority:</strong> We rely on parental consent or authorized school consent to process learner activity data strictly for educational and developmental purposes.
                                </li>
                                <li>
                                    <strong>No Behavioral Advertising:</strong> We do <strong>not</strong> serve targeted advertisements to children or build advertising profiles based on learner activity.
                                </li>
                            </ul>
                        </div>

                        {/* Section 3 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                3. How We Use Your Information
                            </h2>
                            <p>
                                We use the collected information strictly to support developmental learning and platform administration:
                            </p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    <strong>Personalized Adaptive Learning:</strong> Dynamically adjusting task difficulty and complexity based on individual attempt patterns.
                                </li>
                                <li>
                                    <strong>Progress Reporting:</strong> Generating clear progress charts and milestones shared between linked parent and teacher dashboards for synchronized home-school support.
                                </li>
                                <li>
                                    <strong>Sensory Regulation:</strong> Retaining individualized audio and visual settings so sensory preferences persist seamlessly across sessions.
                                </li>
                                <li>
                                    <strong>Platform Maintenance:</strong> Ensuring secure performance, bug fixing, and continuous improvement of our activity engines.
                                </li>
                            </ul>
                        </div>

                        {/* Section 4 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                4. How Information Is Shared
                            </h2>
                            <p>
                                We uphold a strict policy regarding user data: <strong>We do not sell, rent, or trade personal or developmental data to third parties.</strong>
                            </p>
                            <p>Data is shared only in the following limited contexts:</p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    <strong>Authorized Dual Ecosystem Sync:</strong> Learner progress, achievements, and teacher evaluation notes are shared exclusively between the verified parent(s) and assigned educator(s) linked to that student.
                                </li>
                                <li>
                                    <strong>Essential Service Providers:</strong> Trusted third-party infrastructure vendors (such as cloud hosting, security, and authentication providers) that assist us in operating our platform, processing data strictly on our behalf under confidentiality agreements.
                                </li>
                                <li>
                                    <strong>Legal Requirements:</strong> If required by applicable law, regulation, or court order to protect the safety and rights of our users.
                                </li>
                            </ul>
                        </div>

                        {/* Section 5 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                5. Data Security &amp; Retention
                            </h2>
                            <p>
                                We implement administrative, technical, and physical safeguards designed to protect your data against unauthorized access, loss, or misuse:
                            </p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    <strong>Strict Access Controls:</strong> We enforce strict role-based authorization rules to ensure that student records, progress reports, and evaluation notes are accessible only by linked parents and assigned educators.
                                </li>
                                <li>
                                    <strong>Data Retention:</strong> We retain account and profile information for as long as your account remains active. Parents and educational institutions may request deletion of accounts at any time.
                                </li>
                            </ul>
                        </div>

                        {/* Section 6 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                6. Your Rights &amp; Choices
                            </h2>
                            <p>
                                Parents, guardians, and educators have full control over their data:
                            </p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    <strong>Access &amp; Update:</strong> You can review or update account details and student sensory preferences directly within the application settings.
                                </li>
                                <li>
                                    <strong>Data Deletion:</strong> You may request the permanent removal of your account, student profiles, or historical session records by contacting us.
                                </li>
                                <li>
                                    <strong>Consent Revocation:</strong> Parents may revoke consent for child data processing at any time, which will result in the deletion of the associated student profile.
                                </li>
                            </ul>
                        </div>

                        {/* Section 7 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                7. Changes to This Privacy Policy
                            </h2>
                            <p>
                                We may update this Privacy Policy from time to time to reflect platform enhancements or legal compliance updates. We will notify users of material changes via email or an in-app notice prior to the changes taking effect.
                            </p>
                        </div>

                        {/* Section 8 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                8. Contact Us
                            </h2>
                            <p>
                                If you have questions, concerns, or requests regarding this Privacy Policy or our child data privacy practices, please contact us at:
                            </p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    <strong>Email:</strong>{" "}
                                    <a
                                        href="mailto:privacy@autivity.app"
                                        className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        privacy@autivity.app
                                    </a>
                                </li>
                                <li>
                                    <strong>Support Portal:</strong>{" "}
                                    <a
                                        href="https://autivity.app/contact"
                                        className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        https://autivity.app/contact
                                    </a>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
