"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function VisitorLogger() {
  useEffect(() => {
    const logVisitor = async () => {
      try {
        // Get visitor IP
        const res = await fetch("https://api.ipify.org?format=json");
        const { ip } = await res.json();

        const page = window.location.pathname;

        // Get today's date in YYYY-MM-DD format (UTC)
        const today = new Date().toISOString().split("T")[0];

        // Check if this IP + page combination already exists today
        const { data: existing, error: checkError } = await supabase
          .from("visitors")
          .select("id")
          .eq("ip_address", ip)
          .eq("page", page)
          .gte("created_at", `${today}T00:00:00.000Z`)
          .lt("created_at", `${today}T23:59:59.999Z`)
          .limit(1);

        if (checkError) {
          console.error("❌ Error checking existing visitor:", checkError);
          return;
        }

        // If already exists for this IP + page + day, skip insert
        if (existing && existing.length > 0) {
          console.log(
            "ℹ️ Visitor already logged today for this page:",
            ip,
            page
          );
          return;
        }

        // Insert new visitor record
        const { error } = await supabase.from("visitors").insert([
          {
            ip_address: ip,
            user_agent: navigator.userAgent,
            page: page,
          },
        ]);

        if (error) {
          console.error("❌ Error logging visitor:", error);
        } else {
          console.log("✅ Visitor logged:", ip, page);
        }
      } catch (err) {
        console.error("⚠️ Error logging visitor:", err);
      }
    };

    logVisitor();
  }, []);

  return null; // tidak menampilkan apa pun di UI
}
