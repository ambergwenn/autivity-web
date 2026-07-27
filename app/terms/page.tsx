import TermsNavbar from "@/components/terms-navbar";
import Footer from "@/components/footer";

export default function TermsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
            <TermsNavbar />
            <main className="flex-1 py-12 px-6">
                <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800 md:p-12">

                    <h1 className="font-fredoka text-3xl font-bold text-slate-800 dark:text-slate-100 md:text-4xl">
                        Terms and Conditions
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        <strong>Last Updated:</strong> July 20, 2026
                    </p>

                    <div className="mt-8 space-y-8 text-slate-600 dark:text-slate-300">

                        <p>
                            Welcome to <strong>Autivity</strong>. Please read these Terms and Conditions (&quot;Terms&quot;) carefully before accessing or using our application, web platform, or services.
                        </p>
                        <p>
                            By registering for an account or using Autivity, you agree to be bound by these Terms. If you do not agree to all of these Terms, you may not access or use the application.
                        </p>

                        {/* Section 1 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                1. Description of Service
                            </h2>
                            <p>
                                Autivity is an adaptive educational platform designed to support students with Autism Spectrum Disorder (ASD). The platform bridges learning between home and school environments by providing:
                            </p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>Interactive, adaptive learning activities.</li>
                                <li>Real-time engagement and sensory accessibility controls.</li>
                                <li>Developmental milestones and skill domain progress tracking.</li>
                                <li>Evaluation tools and feedback channels for educators and parents.</li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                2. Educational Support Disclaimer (Not Medical/Clinical Therapy)
                            </h2>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">IMPORTANT DISCLAIMER:</p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    <strong>Educational Tool Only:</strong> Autivity is designed solely as an educational support and skill-building application.
                                </li>
                                <li>
                                    <strong>No Medical or Diagnostic Claims:</strong> Autivity is <strong>not</strong> a clinical diagnostic tool, medical device, or replacement for licensed Occupational Therapy (OT), Applied Behavior Analysis (ABA), speech therapy, or clinical psychiatric care.
                                </li>
                                <li>
                                    <strong>Consultation with Professionals:</strong> Parents, guardians, and educators should continue working with qualified healthcare and special education professionals to address specific diagnostic, clinical, or therapeutic needs.
                                </li>
                            </ul>
                        </div>

                        {/* Section 3 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                3. Account Eligibility &amp; Role Responsibilities
                            </h2>
                            <p>
                                Autivity provides distinct account roles tailored to our dual parent-teacher ecosystem.
                            </p>

                            <h3 className="font-fredoka text-base font-semibold text-slate-700 dark:text-slate-200">
                                A. Adult Account Creation
                            </h3>
                            <p>
                                You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to register an account as a Teacher or Parent/Caregiver.
                            </p>

                            <h3 className="font-fredoka text-base font-semibold text-slate-700 dark:text-slate-200">
                                B. Learner / Student Profiles
                            </h3>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    Learner profiles <strong>cannot</strong> be created independently by children.
                                </li>
                                <li>
                                    All student profiles must be created and managed by an authorized parent, legal guardian, or verified educator/school administrator.
                                </li>
                                <li>
                                    Adult account holders are responsible for maintaining the confidentiality of their login credentials.
                                </li>
                            </ul>

                            <h3 className="font-fredoka text-base font-semibold text-slate-700 dark:text-slate-200">
                                C. Role-Specific Obligations
                            </h3>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    <strong>Teachers &amp; Special Educators:</strong> Responsible for assigning appropriate learning activities, inputting accurate rubric evaluations and qualitative feedback, and managing classroom rosters responsibly.
                                </li>
                                <li>
                                    <strong>Parents &amp; Caregivers:</strong> Responsible for reviewing home progress, managing their child&apos;s sensory preferences, and maintaining consistent communication with linked educators.
                                </li>
                                <li>
                                    <strong>Administrators:</strong> Responsible for overseeing verified educator credentials and managing institution-level classes.
                                </li>
                            </ul>
                        </div>

                        {/* Section 4 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                4. Acceptable Use &amp; System Integrity
                            </h2>
                            <p>
                                To ensure a safe, supportive, and effective environment for all users, you agree <strong>not</strong> to:
                            </p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>Provide false or misleading information during registration or account management.</li>
                                <li>Attempt to access accounts, student records, or administrative features belonging to other users without authorization.</li>
                                <li>Reverse engineer, decompile, copy, or duplicate the platform&apos;s codebase, activity engines, adaptive algorithms, or design assets.</li>
                                <li>Introduce viruses, automated scraping tools, or malicious code that could impair the application&apos;s performance or sensory-safe environment.</li>
                                <li>Use the application for any commercial or unauthorized marketing purposes.</li>
                            </ul>
                        </div>

                        {/* Section 5 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                5. Intellectual Property Rights
                            </h2>
                            <p>
                                All rights, title, and interest in and to <strong>Autivity</strong>—including but not limited to the software architecture, user interface designs, graphics, sound assets, custom activity engines, and proprietary characters—are the exclusive property of Autivity and its developers.
                            </p>
                            <p>
                                Subject to these Terms, Autivity grants you a limited, non-exclusive, non-transferable license to access and use the platform strictly for personal, non-commercial, educational purposes.
                            </p>
                        </div>

                        {/* Section 6 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                6. User Content &amp; Progress Data
                            </h2>
                            <p>
                                Users retain ownership over any qualitative notes, rubric evaluations, or progress records created while using the platform. However, by submitting content or completing learning sessions, you grant Autivity a royalty-free license to host, process, and display this data solely for the purpose of providing, operating, and improving our adaptive learning services to you and your linked accounts.
                            </p>
                        </div>

                        {/* Section 7 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                7. Service Availability &amp; Platform Updates
                            </h2>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    <strong>Continuous Improvement:</strong> We continuously refine our platform, difficulty scaling algorithms, and feature sets. We reserve the right to modify, update, or temporarily suspend features for maintenance or technical upgrades.
                                </li>
                                <li>
                                    <strong>No Guarantee of Uninterrupted Access:</strong> While we strive for optimal reliability and offline-friendly activity performance, we do not guarantee that access to the web portal or online sync services will always be uninterrupted or error-free.
                                </li>
                            </ul>
                        </div>

                        {/* Section 8 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                8. Account Termination &amp; Suspension
                            </h2>
                            <p>We reserve the right to suspend or terminate your account access if:</p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>You violate any provision of these Terms.</li>
                                <li>An educator account is determined to be unauthorized or unverified by an educational institution administrator.</li>
                                <li>Required by law or to prevent harm to our users, system infrastructure, or student data safety.</li>
                            </ul>
                            <p>
                                You may terminate your account at any time by navigating to your account settings or contacting support.
                            </p>
                        </div>

                        {/* Section 9 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                9. Limitation of Liability
                            </h2>
                            <p>To the maximum extent permitted by applicable law:</p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    Autivity and its developers shall <strong>not</strong> be liable for any indirect, incidental, special, or consequential damages resulting from your use of, or inability to use, the application.
                                </li>
                                <li>
                                    The platform is provided on an <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> basis without warranties of any kind, either express or implied, including fitness for a particular educational outcome.
                                </li>
                            </ul>
                        </div>

                        {/* Section 10 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                10. Changes to These Terms
                            </h2>
                            <p>
                                We reserve the right to update these Terms and Conditions at any time. When updates occur, we will revise the &quot;Last Updated&quot; date at the top of this document. Continued use of Autivity following any changes signifies your acceptance of the revised Terms.
                            </p>
                        </div>

                        {/* Section 11 */}
                        <div className="space-y-4">
                            <h2 className="font-fredoka text-xl font-semibold text-slate-800 dark:text-slate-100">
                                11. Contact Us
                            </h2>
                            <p>
                                If you have questions or concerns regarding these Terms and Conditions, please reach out to us:
                            </p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    <strong>Email:</strong>{" "}
                                    <a
                                        href="mailto:support@autivity.app"
                                        className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        support@autivity.app
                                    </a>
                                </li>
                                <li>
                                    <strong>Contact Portal:</strong>{" "}
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
