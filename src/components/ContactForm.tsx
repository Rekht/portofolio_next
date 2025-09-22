// components/ContactForm.tsx - Komponen form kontak
import React, { useState, FormEvent } from "react";

interface Notification {
  show: boolean;
  message: string;
  type: "success" | "error";
}

const ContactForm: React.FC = () => {
  const [notification, setNotification] = useState<Notification>({
    show: false,
    message: "",
    type: "success",
  });

  const showNotification = (
    message: string,
    type: "success" | "error"
  ): void => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/rekhtanggoro@gmail.com",
        {
          method: "POST",
          body: new FormData(form),
        }
      );

      const data = await response.json();

      if (data.success) {
        showNotification("Pesan terkirim!", "success");
        form.reset();
      } else {
        showNotification("Gagal mengirim pesan", "error");
      }
    } catch (error) {
      showNotification("Error: " + (error as Error).message, "error");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-900 p-8 rounded-xl"
      >
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_template" value="box" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-gray-300 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition"
        >
          Send Message
        </button>
      </form>

      {/* Notifikasi Toast */}
      {notification.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 transition-all duration-300 animate-fade-in-up ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Tambahkan ini ke global CSS atau config Tailwind */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default ContactForm;
