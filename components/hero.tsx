import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        // 1. We moved the background directly to the main section wrapper
        // bg-cover: Forces it to fill 100% of the width (no white gaps)
        // bg-bottom: Anchors the crop to the bottom, protecting your wave
        // bg-no-repeat: Stops it from tiling like a checkerboard
        <section
            className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden bg-cover bg-bottom bg-no-repeat"
            style={{ backgroundImage: "url('/images/hero/background.svg')" }}
        >

            {/* The Content Layer: Upgraded to a max-width container with a 2-column grid */}
            <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2">

                {/* LEFT COLUMN: Text and Buttons */}
                <div className="flex flex-col items-start text-left">
                    <h1 className="font-fredoka text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl" style={{ color: "#4B5161" }}>
                        Empowering Neurodivergent Learners
                    </h1>

                    <p className="font-medium mt-6 max-w-lg text-lg text-slate-700 md:text-xl" style={{ color: "#4B5161" }}>
                        Autivity provides evidence-based, highly adaptive activities designed
                        to build confidence and mastery.
                    </p>

                    {/* Store Badges CTA */}
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-transform hover:scale-105"
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                alt="Download on the App Store"
                                className="h-[42px] w-auto"
                            />
                        </Link>

                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-transform hover:scale-105"
                        >
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                alt="Get it on Google Play"
                                /* The Google badge visually looks a tiny bit smaller due to its internal SVG padding, 
                                   so we bump it to 44px to make them look perfectly balanced side-by-side! */
                                className="h-[44px] w-auto"
                            />
                        </Link>
                    </div>
                </div>

                {/* RIGHT COLUMN: The Mascot */}
                <div className="flex justify-center md:justify-end">
                    <div className="relative w-full max-w-[400px] md:max-w-[500px]">
                        <Image
                            src="/images/hero/mascot.svg"
                            alt="Autivity Mascot"
                            width={500}
                            height={500}
                            priority // Load instantly
                            className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
                        />

                        {/* Top-left: Pink Circle */}
                        <Image
                            src="/images/hero/elements/ellipse-2.svg"
                            alt=""
                            width={22}
                            height={22}
                            className="absolute left-[43%] top-[-3%] z-20 animate-pulse-soft"
                        />

                        {/* Top-right: Yellow Flower */}
                        <Image
                            src="/images/hero/elements/flower-2.svg"
                            alt=""
                            width={41}
                            height={41}
                            className="absolute right-[25%] top-[-5%] z-20 animate-float"
                        />

                        {/* Mid-right: Pink Flower */}
                        <Image
                            src="/images/hero/elements/flower-3.svg"
                            alt=""
                            width={29}
                            height={29}
                            className="absolute right-[8%] top-[30%] z-20 animate-float-delayed"
                        />

                        {/* Mid-low-right: Yellow Circle */}
                        <Image
                            src="/images/hero/elements/ellipse-4.svg"
                            alt=""
                            width={22}
                            height={22}
                            className="absolute right-[20%] top-[50%] z-20 animate-pulse-soft"
                        />

                        {/* Low-right: Purple Star */}
                        <Image
                            src="/images/hero/elements/star-2.svg"
                            alt=""
                            width={44}
                            height={44}
                            className="absolute right-[5%] bottom-[27%] z-20 animate-float"
                        />

                        {/* Lowest-right: Pink Circle */}
                        <Image
                            src="/images/hero/elements/ellipse-3.svg"
                            alt=""
                            width={37}
                            height={37}
                            className="absolute right-[18%] bottom-[-10%] z-20 animate-pulse-soft"
                        />

                        {/* Low-left: Yellow Flower */}
                        <Image
                            src="/images/hero/elements/flower-1.svg"
                            alt=""
                            width={29}
                            height={29}
                            className="absolute left-[13%] bottom-[18%] z-20 animate-float"
                        />

                        {/* Lower-left: Purple Star */}
                        <Image
                            src="/images/hero/elements/star-1.svg"
                            alt=""
                            width={33}
                            height={33}
                            className="absolute left-[2s%] bottom-[7%] z-20 animate-float-delayed"
                        />

                        {/* Bottom-leftmost: Pink Circle */}
                        <Image
                            src="/images/hero/elements/ellipse-1.svg"
                            alt=""
                            width={22}
                            height={22}
                            className="absolute left-[12%] bottom-[-2%] z-20 animate-pulse-soft"
                        />
                    </div>
                </div>

            </div>

        </section>
    );
}