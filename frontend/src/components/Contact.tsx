import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { trackContactSubmission } from "../services/analytics";
import { api } from "../utils/api";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = useCallback(() => {
    if (!formData.name.trim()) return t("contact.validation.nameRequired");
    if (!formData.email.trim()) return t("contact.validation.emailRequired");
    if (!formData.subject.trim())
      return t("contact.validation.subjectRequired");
    if (!formData.message.trim())
      return t("contact.validation.messageRequired");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return t("contact.validation.invalidEmail");
    return null;
  }, [formData, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await api.post("/contact", formData);
      if (response.error) {
        throw new Error(response.error || t("contact.errors.sendFailed"));
      }

      // Track the contact submission
      await trackContactSubmission();

      setStatus({
        type: "success",
        message: t("contact.success.messageSent"),
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : t("contact.errors.sendFailed"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit directly without debounce to avoid stale state and hook warnings

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-heading-1 mb-4">
            {t("contact.title")}
          </h2>
          <p className="text-body-var max-w-2xl mx-auto">
            {t("contact.description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="label">
                {t("contact.name")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder={t("contact.namePlaceholder")}
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                {t("contact.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder={t("contact.emailPlaceholder")}
              />
            </div>

            <div>
              <label htmlFor="subject" className="label">
                {t("contact.subject")}
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="input"
                placeholder={t("contact.subjectPlaceholder")}
              />
            </div>

            <div>
              <label htmlFor="message" className="label">
                {t("contact.message")}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="input"
                placeholder={t("contact.messagePlaceholder")}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium btn-brand ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? t("contact.sending") : t("contact.send")}
            </motion.button>
          </form>

          {status.type && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-md ${
                status.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status.message}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
