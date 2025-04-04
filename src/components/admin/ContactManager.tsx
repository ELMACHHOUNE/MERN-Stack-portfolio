import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Trash2,
  CheckCircle,
  MessageSquare,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isActive: boolean;
  createdAt: string;
}

const ContactManager: React.FC = () => {
  const { t } = useLanguage();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    fetchContacts();
  }, [token]);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/contact/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(t("contact.management.messages.error"));
      }

      const data = await response.json();
      setContacts(data);
    } catch (err) {
      toast.error(t("contact.management.messages.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/contact/admin/${id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(t("contact.management.messages.markReadError"));
      }

      setContacts(
        contacts.map((contact) =>
          contact._id === id ? { ...contact, isRead: true } : contact
        )
      );
      toast.success(t("contact.management.messages.markReadSuccess"));
    } catch (err) {
      toast.error(t("contact.management.messages.markReadError"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("contact.management.messages.confirmDelete"))) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/contact/admin/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(t("contact.management.messages.deleteError"));
      }

      setContacts(contacts.filter((contact) => contact._id !== id));
      toast.success(t("contact.management.messages.deleteSuccess"));
    } catch (err) {
      toast.error(t("contact.management.messages.deleteError"));
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    if (filter === "unread") return !contact.isRead;
    if (filter === "read") return contact.isRead;
    return true;
  });

  const unreadCount = contacts.filter((contact) => !contact.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <MessageSquare className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {t("contact.management.title")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("contact.management.messages.messageCount", {
                count: contacts.length,
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {unreadCount} {t("contact.management.status.unreadCount")}
            </span>
          </div>
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "unread" | "read")
            }
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{t("contact.management.filter.all")}</option>
            <option value="unread">
              {t("contact.management.filter.unread")}
            </option>
            <option value="read">{t("contact.management.filter.read")}</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredContacts.map((contact) => (
          <motion.div
            key={contact._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border ${
              !contact.isRead
                ? "border-blue-500 dark:border-blue-400"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        !contact.isRead
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-500"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                      }`}
                    >
                      <Mail className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {contact.name}
                      </h3>
                      {!contact.isRead && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                          {t("contact.management.status.unread")}
                        </span>
                      )}
                    </div>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                      {contact.email}
                    </a>
                    <h4 className="text-base font-medium text-gray-800 dark:text-gray-200 mt-2">
                      {contact.subject}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">
                      {contact.message}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col items-center gap-3 sm:gap-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {new Date(contact.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  {!contact.isRead ? (
                    <button
                      onClick={() => handleMarkAsRead(contact._id)}
                      className="p-1.5 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title={t("contact.management.actions.markAsRead")}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  ) : (
                    <span
                      className="p-1.5 text-gray-400 dark:text-gray-500"
                      title={t("contact.management.status.read")}
                    >
                      <EyeOff className="w-5 h-5" />
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="p-1.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title={t("contact.management.actions.delete")}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === "all"
                ? t("contact.management.messages.noMessages")
                : filter === "unread"
                ? t("contact.management.messages.noUnreadMessages")
                : t("contact.management.messages.noReadMessages")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactManager;
