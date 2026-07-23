"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const VISITOR_ID_KEY = "garaj_jeans_visitor_id";
const HEARTBEAT_INTERVAL_MS = 20000;

function getVisitorId() {
  const existingVisitorId = window.localStorage.getItem(
    VISITOR_ID_KEY
  );

  if (existingVisitorId) {
    return existingVisitorId;
  }

  const newVisitorId = crypto.randomUUID();

  window.localStorage.setItem(
    VISITOR_ID_KEY,
    newVisitorId
  );

  return newVisitorId;
}

export default function VisitorTracker() {
  useEffect(() => {
    const visitorId = getVisitorId();

    async function sendHeartbeat() {
      const { error } = await supabase.rpc(
        "heartbeat_visitor",
        {
          p_visitor_id: visitorId,
        }
      );

      if (error) {
        console.error(
          "Ziyaretçi hareketi kaydedilemedi:",
          error
        );
      }
    }

    sendHeartbeat();

    const intervalId = window.setInterval(
      sendHeartbeat,
      HEARTBEAT_INTERVAL_MS
    );

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        sendHeartbeat();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.clearInterval(intervalId);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  return null;
}
