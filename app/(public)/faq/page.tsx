import React from 'react'
import { FAQ } from '@/components/ui/faq-tabs'

export const metadata = {
  title: 'FAQ — Drivers Australia',
  description: 'Frequently Asked Questions about Drivers Australia and our transport recruitment network.',
}

const categories = {
  general: 'General',
  operators: 'For Fleet Operators',
  drivers: 'For Licensed Drivers',
  tokens: 'Token System',
}

const faqData = {
  general: [
    {
      question: 'What is Drivers Australia?',
      answer: 'Drivers Australia is a premium job board and listing network built specifically for the Australian transport industry, connecting licensed drivers with fleet operators.',
    },
    {
      question: 'Is it free to use?',
      answer: 'Yes, it is completely free for drivers to search listings and apply. For transport operators, posting driver listings utilizes token credits.',
    },
    {
      question: 'How do I contact support?',
      answer: 'You can reach out to our dedicated support team through our contact page or by emailing support@driversaustralia.com.au.',
    },
  ],
  operators: [
    {
      question: 'How do custom pre-screening forms work?',
      answer: 'Operators can build specific question sets (e.g. asking for licence class, ABN status, years of experience) that candidates must complete when submitting their application.',
    },
    {
      question: 'Can I edit a listing after publishing?',
      answer: 'Currently, to maintain the integrity of active applications, listings cannot be edited once they are approved. You can close a listing and publish a new one if details change.',
    },
    {
      question: 'How do I review candidate applications?',
      answer: 'All applications are delivered directly to your Operator Dashboard. You will see candidate details, contact info, and their answers to your pre-screening questions in real time.',
    },
  ],
  drivers: [
    {
      question: 'Do I need a specific licence class to join?',
      answer: 'Drivers Australia supports all heavy and light vehicle classifications including Multi Combination (MC), Heavy Combination (HC), Heavy Rigid (HR), Medium Rigid (MR), and Light Rigid (LR).',
    },
    {
      question: 'How do I respond to a listing?',
      answer: 'Simply click on any active listing, complete the operator\'s custom pre-screening questionnaire, and click submit. The operator will contact you directly.',
    },
    {
      question: 'Are my contact details safe?',
      answer: 'Yes, your profile and application details are only shared directly with the specific operator of the listing you apply to. We never sell your personal information.',
    },
  ],
  tokens: [
    {
      question: 'What are tokens used for?',
      answer: 'Tokens are credits used by transport operators to post job listings. Each new listing consumes exactly 1 token credit.',
    },
    {
      question: 'How many free tokens do I get?',
      answer: 'Every new transport operator account is automatically provisioned with 3 free token credits upon signup to help you get started.',
    },
    {
      question: 'How do I purchase more tokens?',
      answer: 'If you require additional token credits to post more openings, please contact our administrator team through the dashboard portal.',
    },
  ],
}

export default function FAQPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-background">
      <FAQ 
        title="FAQ" 
        subtitle="Frequently Asked Questions" 
        categories={categories} 
        faqData={faqData} 
      />
    </div>
  )
}
