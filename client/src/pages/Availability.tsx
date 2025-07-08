import { useEffect, useState } from "react";

const Availability = () => {
  const [availability, setAvailability] = useState<any[]>([]);
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchAvailability = async () => {
    try {
      const res = await fetch(
        "https://mentorship-by-iygeal.onrender.com/api/v1/availability",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Failed to load availability.");
        return;
      }
      setAvailability(data.availability || []);
    } catch (err) {
      console.error(err);
      setMessage("Error loading availability.");
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(
        "https://mentorship-by-iygeal.onrender.com/api/v1/availability",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ day, startTime, endTime }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Failed to add slot.");
        return;
      }

      setMessage("Slot added.");
      setDay("");
      setStartTime("");
      setEndTime("");
      fetchAvailability(); // Refresh list
    } catch (err) {
      console.error(err);
      setMessage("Error adding slot.");
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      const res = await fetch(
        `https://mentorship-by-iygeal.onrender.com/api/v1/availability/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Failed to delete slot.");
        return;
      }

      setMessage("Slot deleted.");
      fetchAvailability(); // Refresh list
    } catch (err) {
      console.error(err);
      setMessage("Error deleting slot.");
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Your Availability</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleAddSlot}>
        <label>
          Day:
          <select value={day} onChange={(e) => setDay(e.target.value)} required>
            <option value="">--Select--</option>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>
        </label>
        <br />
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Add Slot</button>
      </form>

      <h3>Current Slots:</h3>
      <ul>
        {availability.map((slot) => (
          <li key={slot._id} style={{ marginBottom: "1rem" }}>
            {slot.day}: {slot.startTime} - {slot.endTime}{" "}
            <button onClick={() => handleDeleteSlot(slot._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Availability;
