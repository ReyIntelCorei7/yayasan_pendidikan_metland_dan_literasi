import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ChevronDown } from 'lucide-react';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';

const faqs = [
  { q: 'How can I get involved with Higher Life Foundation?', a: 'There are many ways to get involved — from volunteering and donating to partnering with us on programs. Contact our team to learn more about opportunities.' },
  { q: 'Where does my donation go?', a: 'Over 85% of donations go directly to programs. We maintain full financial transparency with annual audited reports available on our Impact page.' },
  { q: 'Do you accept corporate partnerships?', a: 'Yes! We actively partner with corporations for CSR initiatives, employee engagement programs, and co-branded campaigns. Reach out to our partnerships team.' },
  { q: 'Can I visit your programs on the ground?', a: 'We welcome visitors and organize periodic field visits. Contact us to schedule a visit to any of our program sites across six African countries.' },
  { q: 'How do you measure impact?', a: 'We use rigorous monitoring and evaluation frameworks, tracking both quantitative metrics and qualitative outcomes. Our annual reports detail our impact methodology.' },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center bg-charcoal overflow-hidden">
        <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="relative z-10 text-center px-6">
          <WordReveal text="Get In Touch" tag="h1" className="text-4xl lg:text-6xl font-light text-white justify-center" delay={0.2} />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-gray-400 mt-4">
            We'd love to hear from you. Let's build Africa's future together.
          </motion.p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16">
          {/* Form */}
          <ScrollReveal direction="left">
            <h2 className="text-3xl font-light mb-8">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Your Name</label>
                  <input
                    type="text" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-lime transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Email Address</label>
                  <input
                    type="email" required value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-lime transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Subject</label>
                <input
                  type="text" required value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-lime transition-colors"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Message</label>
                <textarea
                  required rows={5} value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-lime transition-colors resize-none"
                  placeholder="Tell us about your inquiry..."
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, backgroundColor: '#007A82' }}
                whileTap={{ scale: 0.98 }}
                className="bg-lime text-charcoal px-8 py-4 rounded-lg text-sm font-medium w-full sm:w-auto"
              >
                Send Message →
              </motion.button>
            </form>
          </ScrollReveal>

          {/* Office Info */}
          <ScrollReveal direction="right">
            <h2 className="text-3xl font-light mb-8">Our Offices</h2>
            <div className="space-y-8">
              {[
                { city: 'Harare, Zimbabwe', address: '123 Samora Machel Avenue, Harare', phone: '+263 242 700 000', email: 'harare@higherlife.org' },
                { city: 'Lagos, Nigeria', address: '45 Broad Street, Lagos Island', phone: '+234 1 234 5678', email: 'lagos@higherlife.org' },
                { city: 'Accra, Ghana', address: '78 Independence Avenue, Accra', phone: '+233 30 277 0000', email: 'accra@higherlife.org' },
              ].map((office) => (
                <div key={office.city} className="p-6 rounded-2xl border border-gray-100 hover:border-lime/30 transition-colors">
                  <h3 className="font-medium text-charcoal mb-3">{office.city}</h3>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-lime mt-0.5 shrink-0" />{office.address}</div>
                    <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-lime shrink-0" />{office.phone}</div>
                    <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-lime shrink-0" />{office.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-offwhite py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <WordReveal text="Frequently Asked Questions" tag="h2" className="text-4xl font-light text-charcoal mb-12 justify-center text-center" />
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-sm font-medium text-charcoal pr-4">{faq.q}</span>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </motion.div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
