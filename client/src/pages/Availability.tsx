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
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-emerald-700 mb-4 text-center">
        Your Availability
      </h2>

      {message && <p className="text-center text-red-600 mb-4">{message}</p>}

      <form onSubmit={handleAddSlot} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Day:</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">--Select--</option>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Start Time:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">End Time:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
        >
          Add Slot
        </button>
      </form>

      <h3 className="mt-8 text-lg font-semibold text-gray-700">Current Slots:</h3>
      <ul className="mt-2 space-y-2">
        {availability.map((slot) => (
          <li
            key={slot._id}
            className="flex justify-between items-center bg-gray-50 border px-4 py-2 rounded"
          >
            {slot.day}: {slot.startTime} - {slot.endTime}
            <button
              onClick={() => handleDeleteSlot(slot._id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-4"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

};

export default Availability;
