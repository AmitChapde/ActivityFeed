import { useEffect, useState, useRef } from "react";
import useActivities from "../hooks/useActivities";
import ActivityForm from "./ActivityForm";
import ActivityItem from "./ActivityItem";

export default function ActivityFeed() {
  const { activities, loading, fetchActivities, addActivity } = useActivities();

  const [filter, setFilter] = useState("all");


  useEffect(() => {
    fetchActivities();
  }, []);

 
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        fetchActivities();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchActivities]);

 
  const fetchRef = useRef(fetchActivities);

  useEffect(() => {
    fetchRef.current = fetchActivities;
  }, [fetchActivities]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchRef.current();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  
  const filteredActivities = activities.filter((a) => {
    if (filter === "all") return true;
    return a.type?.toLowerCase().includes(filter);
  });

  return (
    <div className="container">
      <h2 className="title">Activity Feed</h2>

      <ActivityForm onAdd={addActivity} />

      
      <div className="filter">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="comment">Comment</option>
        </select>
      </div>

      {filteredActivities.length === 0 && !loading && (
        <p className="empty">No activities yet</p>
      )}

      <div className="list">
        {filteredActivities.map((a) => (
          <ActivityItem key={a._id} activity={a} />
        ))}
      </div>

      {loading && <p className="loading">Loading...</p>}
    </div>
  );
}