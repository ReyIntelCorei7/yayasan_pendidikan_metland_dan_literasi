import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('contact.alert_success'));
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      {/* ═══ Page Hero ══════════════════════════════════════════ */}
            <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center bg-charcoal overflow-hidden">
              <img
                src="/src/assets/sekolahsmkmetlandcibitung.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal/80" />
              <div className="relative z-10 text-center px-6 mt-4">
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-white text-lg font-bold tracking-[3px] uppercase block"
                >
                  {t('contact.hero_tag')}
                </motion.span>
                <WordReveal
                  text={t('contact.hero_title')}
                  tag="h1"
                  className="text-4xl lg:text-5xl font-light text-white"
                />
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="text-gray-300 max-w-2xl mx-auto">
                  {t('contact.hero_subtitle')}
                </motion.p>
              </div>
            </section>

      {/* Contact Grid */}
      <section className="bg-[#FCFCFC] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16">
          {/* Form */}
          <ScrollReveal direction="left">
            <h2 className="text-3xl font-light mb-8">{t('contact.form_title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">{t('contact.form_name')}</label>
                  <input
                    type="text" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors bg-white shadow-sm"
                    placeholder={t('contact.form_name_ph')}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">{t('contact.form_email')}</label>
                  <input
                    type="email" required value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors bg-white shadow-sm"
                    placeholder={t('contact.form_email_ph')}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">{t('contact.form_subject')}</label>
                <input
                  type="text" required value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors bg-white shadow-sm"
                  placeholder={t('contact.form_subject_ph')}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">{t('contact.form_message')}</label>
                <textarea
                  required rows={5} value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors resize-none bg-white shadow-sm"
                  placeholder={t('contact.form_message_ph')}
                />
              </div>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                className="bg-primary text-white px-8 py-4 rounded-lg text-sm font-medium w-full sm:w-auto shadow-md"
              >
                {t('contact.form_submit')}
              </motion.button>
            </form>
          </ScrollReveal>

          {/* Office Info */}
          <ScrollReveal direction="right">
            <h2 className="text-3xl font-light mb-8">{t('contact.office_title')}</h2>
            <div className="space-y-8">
              {[
                { city: 'Bekasi, Indonesia', address: 'M Gold Tower, Lantai 15 JI. Letkol M. Moeffreni Moemin Pekayon Jaya, Bekasi 17148 - Indonesia', phone: '+62 21 8989 8989', email: 'yayasanpendidikanmetland@gmail.com' },
              ].map((office) => (
                <div key={office.city} className="p-6 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors">
                  <h3 className="font-medium text-charcoal mb-3">{office.city}</h3>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />{office.address}</div>
                    <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary shrink-0" />{office.phone}</div>
                    <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary shrink-0" />{office.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Map Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 pb-4">
          <ScrollReveal direction="up">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#3aabf0]" />
                <h3 className="text-lg font-medium text-gray-800">{t('contact.location_title')}</h3>
              </div>
              <iframe
                title="Lokasi Yayasan Pendidikan Metland - M Gold Tower Bekasi"
                src="https://maps.google.com/maps?q=M+Gold+Tower+Pekayon+Jaya+Bekasi&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
