"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

interface Message {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [payload.new as Message, ...prev]);
        }
      )
      .subscribe();

    // cleanup saat unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching messages:", error);
    else setMessages(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !message.trim()) {
      setErrorMsg("❗ Name and message cannot be empty.");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("messages")
      .insert([{ name, message }]);
    setLoading(false);

    if (error) {
      console.error("Error sending message:", error);
      setErrorMsg("Failed to send message. Please try again later.");
    } else {
      setName("");
      setMessage("");
      fetchMessages();
      setShowForm(false);
    }
  }

  return (
    <section className="py-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-900/95 to-black/80 rounded-xl p-8 w-full border border-gray-800/40 shadow-xl backdrop-blur-lg">
        {messages.length > 0 ? (
          <div className="overflow-hidden p-8 w-full">
            <InfiniteMovingCards
              items={messages.map((m) => ({
                quote: m.message,
                name: m.name,
                title: new Date(m.created_at).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }),
              }))}
              direction="left"
              speed="normal"
            />
          </div>
        ) : (
          <p className="text-center text-gray-400 mb-8">No messages yet 😄</p>
        )}

        {!showForm ? (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-200"
            >
              Leave a Message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 mt-10 max-w-md mx-auto"
          >
            <input
              type="text"
              placeholder="Your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-700/60 bg-gray-900/70 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-700/60 bg-gray-900/70 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />

            {errorMsg && (
              <p className="text-red-400 text-center text-sm">{errorMsg}</p>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 font-semibold rounded-full transition-all duration-200 ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed text-gray-300"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
