import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import Toast from '../components/Toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast({ message: 'Thank you for your message! Our project team will respond shortly.', type: 'success' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="glass-panel p-8 text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Contact & Support</h1>
        <p className="text-sm text-slate-300">Have questions about our Deep Neural Network implementation or web architecture?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-lg font-bold text-white">Project Details</h3>
          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <span>Department of Computer Science & Engineering, University College of Engineering</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <span>contact@edutrack-ai.edu</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <span>+91 (080) 2345-6789</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-6 md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white">Send Us a Feedback Message</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-control"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-control"
              required
            />
          </div>

          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="form-control"
            required
          />

          <textarea
            placeholder="Your message or feedback regarding prediction accuracy..."
            rows="4"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="form-control"
            required
          ></textarea>

          <button type="submit" disabled={loading} className="gradient-btn py-3 px-6 text-sm flex items-center gap-2">
            <Send className="w-4 h-4" /> {loading ? 'Sending Message...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
