
export default function ActivityItem({ activity }) {
  return (
    <div className="activity-item">
      <p className="activity-text">
        <strong>{activity.actorName}</strong> {activity.type}
      </p>
      <small className="activity-time">
        {new Date(activity.createdAt).toLocaleString()}
      </small>
    </div>
  );
}