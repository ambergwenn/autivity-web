"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqItems = [
  {
    question: "What is Autivity?",
    answer: "Autivity is an interactive mobile and web platform specifically designed for children with Autism Spectrum Disorder (ASD). It combines engaging developmental activities—like pre-writing tracing and matching—with real-time adaptive learning and professional progress tracking."
  },
  {
    question: "Who is Autivity built for?",
    answer: "Autivity is built for three main groups: Learners (children with ASD who play the guided activities), Educators (who manage classes, assign materials, and review clinical progress), and Parents and Guardians (who want transparent home-school sync and custom sensory controls)."
  },
  {
    question: "How does the app adapt to each child's needs?",
    answer: "Every child is unique. Autivity features personalized sensory profiles that automatically apply custom sound and music preferences upon login. Plus, our smart adaptive engine monitors progress in real time to ensure tasks match the learner's comfort and skill level."
  },
  {
    question: "Can parents track progress at home?",
    answer: "Yes! Once educators review and validate completed session data, detailed skill analytics and milestone achievements immediately update and sync to the parent dashboard for transparent, real-time visibility."
  },
  {
    question: "How does Autivity ensure safety and privacy?",
    answer: "We take privacy very seriously. All student records, activity reports, and notes are strictly protected so that only authorized teachers and linked family members can view them. There are no public user profiles, social features, or third-party ads."
  }
];

export default function FAQ() {
  return (
    <section className="w-full mx-auto max-w-4xl px-6 py-20 border-t border-[#E5E7EB]/50">
      <div className="mb-16 flex flex-col items-center justify-center text-center px-4 md:px-8 mx-auto">
        <h2 className="max-w-2xl text-3xl font-fredoka font-bold leading-tight text-[#535B74] md:text-4xl lg:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 max-w-xl text-lg font-medium text-[#6B7280]">
          Find answers to common questions about Autivity's adaptive engine, safety guidelines, and clinical pedagogy.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full flex flex-col gap-4">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger>
              {item.question}
            </AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
