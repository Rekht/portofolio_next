"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

interface Message {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  // Pause animation on hover by getting current position
  const handleMouseEnter = useCallback(() => {
    if (scrollRef.current) {
      const computedStyle = window.getComputedStyle(scrollRef.current);
      const transform = computedStyle.getPropertyValue("transform");
      scrollRef.current.style.transform = transform;
    }
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.style.transform = "";
    }
    setIsPaused(false);
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from("messages")
      .insert([{ name: name.trim(), message: message.trim() }]);

    if (error) {
      console.error("Error submitting message:", error);
    } else {
      setName("");
      setMessage("");
      setShowModal(false);
      fetchMessages();
    }
    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Duplicate messages for seamless loop
  const duplicatedMessages = [...messages, ...messages];

  return (
    <div className="w-full">
      {/* Title outside container */}
      <h2 className="text-2xl font-bold text-foreground text-center mb-6">
        Guestbook
      </h2>

      <GlassCard accentColor="purple">
        {/* Messages Marquee */}
        <div
          className="relative overflow-hidden mb-6"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No messages yet. Be the first one!
              </p>
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex gap-4 marquee-container"
              style={{
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {duplicatedMessages.map((msg, index) => (
                <div
                  key={`${msg.id}-${index}`}
                  className={`flex-shrink-0 w-[300px] bg-card/60 border rounded-xl p-4 backdrop-blur-sm transition-all duration-300 cursor-pointer ${
                    hoveredId === msg.id
                      ? "border-purple-500/70 scale-105 shadow-lg shadow-purple-500/20"
                      : "border-border hover:border-purple-500/50"
                  }`}
                  onMouseEnter={() => setHoveredId(msg.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <p className="text-foreground text-sm leading-relaxed mb-3">
                    {msg.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-medium text-sm">
                      {msg.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leave Message Button */}
        <div className="text-center">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-full transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
          >
            Leave a Message
          </button>
        </div>
      </GlassCard>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-foreground mb-4">
                Write a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-muted-foreground text-sm mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name..."
                    className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground placeholder:text-placeholder focus:outline-none focus:border-purple-500/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground text-sm mb-2">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message..."
                    rows={4}
                    className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-xl text-foreground placeholder:text-placeholder focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-secondary text-muted-foreground rounded-xl hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for marquee animation */}
      <style jsx>{`
        .marquee-container {
          animation: marquee 30s linear infinite;
          will-change: transform;
        }
        @keyframes marquee {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
