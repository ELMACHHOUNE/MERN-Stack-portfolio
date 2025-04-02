import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

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
        throw new Error("Failed to fetch contacts");
      }

      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contacts");
      toast.error("Failed to fetch contact messages");
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
        throw new Error("Failed to mark as read");
      }

      setContacts(
        contacts.map((contact) =>
          contact._id === id ? { ...contact, isRead: true } : contact
        )
      );
      toast.success("Message marked as read");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark as read");
      toast.error("Failed to mark message as read");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

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
        throw new Error("Failed to delete message");
      }

      setContacts(contacts.filter((contact) => contact._id !== id));
      toast.success("Message deleted successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete message");
      toast.error("Failed to delete message");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Contact Messages
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {contacts.length} message{contacts.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="grid gap-4">
        {contacts.map((contact) => (
          <motion.div
            key={contact._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow ${
              !contact.isRead ? "border-l-4 border-blue-500" : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {contact.name}
                  </h3>
                  {!contact.isRead && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                      New
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-blue-500"
                  >
                    {contact.email}
                  </a>
                </div>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {contact.subject}
                </p>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {contact.message}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(contact.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                {!contact.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(contact._id)}
                    className="p-2 text-green-500 hover:text-green-400 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="p-2 text-red-500 hover:text-red-400 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {contacts.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No contact messages found
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactManager;
