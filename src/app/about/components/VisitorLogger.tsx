"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function VisitorLogger() {
  useEffect(() => {
    const logVisitor = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const { ip } = await res.json();

        const { error } = await supabase.from("visitors").insert([
          {
            ip_address: ip,
            user_agent: navigator.userAgent,
            page: window.location.pathname,
          },
        ]);

        if (error) {
          console.error("❌ Error logging visitor:", error);
        } else {
          console.log("✅ Visitor logged:", ip);
        }
      } catch (err) {
        console.error("⚠️ Error logging visitor:", err);
      }
    };

    logVisitor();
  }, []);

  return null; // tidak menampilkan apa pun di UI
}
