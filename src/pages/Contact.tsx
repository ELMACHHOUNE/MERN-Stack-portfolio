import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAdminProfile } from "../context/AdminProfileContext";
import { useLanguage } from "../context/LanguageContext";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ValidationError {
  field: string;
  message: string;
}

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const { adminProfile } = useAdminProfile();
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateForm = () => {
    const newErrors: ValidationError[] = [];

    if (!formData.name.trim()) {
      newErrors.push({
        field: "name",
        message: t("contact.validation.nameRequired"),
      });
    }

    if (!formData.email.trim()) {
      newErrors.push({
        field: "email",
        message: t("contact.validation.emailRequired"),
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push({
        field: "email",
        message: t("contact.validation.emailInvalid"),
      });
    }

    if (!formData.subject.trim()) {
      newErrors.push({
        field: "subject",
        message: t("contact.validation.subjectRequired"),
      });
    }

    if (!formData.message.trim()) {
      newErrors.push({
        field: "message",
        message: t("contact.validation.messageRequired"),
      });
    } else if (formData.message.trim().length < 10) {
      newErrors.push({
        field: "message",
        message: t("contact.validation.messageTooShort"),
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.errors) {
          const validationErrors = data.errors.map((err: any) => ({
            field: err.param,
            message: err.msg,
          }));
          setErrors(validationErrors);
          toast.error(t("contact.error.formErrors"));
          return;
        }
        throw new Error(data.message || t("contact.error.sendFailed"));
      }

      toast.success(t("contact.success"));
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("contact.error.sendFailed")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    setErrors((prev) => prev.filter((error) => error.field !== name));
  };

  const getFieldError = (fieldName: string) => {
    return errors.find((error) => error.field === fieldName)?.message;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("contact.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t("contact.info.title")}
            </h2>
            <div className="space-y-6">
              {/* Gmail */}
              {adminProfile?.socialLinks?.gmail && (
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t("contact.info.email")}
                    </h3>
                    <a
                      href={adminProfile.socialLinks.gmail}
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                      {adminProfile.socialLinks.gmail.replace("mailto:", "")}
                    </a>
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              {adminProfile?.socialLinks?.whatsapp && (
                <div className="flex items-start space-x-4">
                  <MessageCircle className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t("contact.info.whatsapp")}
                    </h3>
                    <a
                      href={adminProfile.socialLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                      {adminProfile.socialLinks.whatsapp
                        .replace("https://wa.me/", "+")
                        .replace("/", "")}
                    </a>
                  </div>
                </div>
              )}

              {/* Location */}
              {adminProfile?.location && (
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t("contact.info.location")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {adminProfile.location}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            {adminProfile?.socialLinks && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t("contact.info.connect")}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(adminProfile.socialLinks)
                    .filter(
                      ([key, value]) =>
                        value && key !== "gmail" && key !== "whatsapp"
                    )
                    .map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      >
                        <span className="capitalize">
                          {t(`about.socialLinks.${platform}`)}
                        </span>
                      </a>
                    ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t("contact.form.title")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t("contact.name")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("contact.namePlaceholder")}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                    getFieldError("name")
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {getFieldError("name") && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {getFieldError("name")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t("contact.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("contact.emailPlaceholder")}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                    getFieldError("email")
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {getFieldError("email") && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {getFieldError("email")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t("contact.subject")}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t("contact.subjectPlaceholder")}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                    getFieldError("subject")
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {getFieldError("subject") && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {getFieldError("subject")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {t("contact.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("contact.messagePlaceholder")}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent ${
                    getFieldError("message")
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {getFieldError("message") && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {getFieldError("message")}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Send className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    {t("contact.sending")}
                  </>
                ) : (
                  <>
                    <Send className="-ml-1 mr-3 h-5 w-5" />
                    {t("contact.send")}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
