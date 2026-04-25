import { useState, useCallback } from "react";
import {
  fetchActivitiesAPI,
  createActivityAPI,
} from "../services/activity.api";

export default function useActivities() {
  const [activities, setActivities] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchActivities = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetchActivitiesAPI(cursor);

        
      setActivities((prev) => {
        const existingIds = new Set(prev.map((a) => a._id));
        const newData = res.data.filter((a) => !existingIds.has(a._id));
        return [...prev, ...newData];
      });

      setCursor(res.nextCursor || null);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [cursor]);

  const addActivity = async (newActivity) => {
    const tempId = Date.now();

    const optimistic = {
      ...newActivity,
      _id: tempId,
      createdAt: new Date().toISOString(),
    };

    setActivities((prev) => [optimistic, ...prev]);

    try {
      const saved = await createActivityAPI(newActivity);

      if (!saved || saved.error) {
        throw new Error(saved?.error || "API failed");
      }

      setActivities((prev) => prev.map((a) => (a._id === tempId ? saved : a)));
    } catch (err) {
      console.error("Create failed:", err.message);

   
      setActivities((prev) => prev.filter((a) => a._id !== tempId));
    }
  };

  return {
    activities,
    loading,
    fetchActivities,
    addActivity,
  };
}
