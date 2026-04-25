import { useState } from "react";

export default function ActivityForm({ onAdd }) {
  const [text, setText] = useState("");

  const users = ["John Doe", "Alice", "Rahul"];

  const handleSubmit = () => {
    if (!text) return;

    const randomUser = users[Math.floor(Math.random() * users.length)];

    onAdd({
      actorId: randomUser.toLowerCase().replace(" ", "_"),
      actorName: randomUser,
      type: text
    });

    setText("");
  };

  return (
    <div className="form">
      <input
        className="input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter activity"
      />
      <button className="button" onClick={handleSubmit}>
        Add
      </button>
    </div>
  );
}