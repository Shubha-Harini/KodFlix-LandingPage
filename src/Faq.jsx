import React, { useState } from 'react';
import { Plus, X, ChevronRight } from 'lucide-react';

const faqs = [
  {
    question: "What is KODFLIX?",
    answer: "KODFLIX is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices."
  },
  {
    question: "How much does KODFLIX cost?",
    answer: "Watch KODFLIX on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from ₹149 to ₹649 a month. No extra costs, no contracts."
  },
  {
    question: "Where can I watch?",
    answer: "Watch anywhere, anytime. Sign in with your KODFLIX account to watch instantly on the web at kodflix.com from your personal computer or on any internet-connected device that offers the KODFLIX app."
  },
  {
    question: "How do I cancel?",
    answer: "KODFLIX is flexible. There are no annoying contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime."
  },
  {
    question: "What can I watch on KODFLIX?",
    answer: "KODFLIX has an extensive library of feature films, documentaries, TV shows, anime, award-winning KODFLIX originals, and more. Watch as much as you want, anytime you want."
  },
  {
    question: "Is KODFLIX good for kids?",
    answer: "The KODFLIX Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and films in their own space."
  }
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div className="faq-item" key={index}>
            <div className="faq-question" onClick={() => toggleFaq(index)}>
              <span>{faq.question}</span>
              {openIndex === index ? <X size={30} /> : <Plus size={30} />}
            </div>
            <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
              <div className="faq-answer-inner">
                <div className="faq-answer-content">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="email-cta">
        <p>Ready to watch? Enter your email to create or restart your membership.</p>
        <div className="email-form">
          <input type="email" placeholder="Email address" />
          <button className="btn-get-started">
            Get Started <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Faq;
