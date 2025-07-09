import { useEffect, useState } from "react";

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [skill, setSkill] = useState("");
  const [message, setMessage] = useState("");

  const fetchMentors = async () => {
    try {
      const query = skill ? `?skill=${encodeURIComponent(skill)}` : "";
      const res = await fetch(
        `https://mentorship-by-iygeal.onrender.com/api/v1/users/mentors${query}`
      );
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to fetch mentors");
        return;
      }

      setMentors(data.mentors || []);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("An error occurred while fetching mentors.");
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMentors();
  };

  const handleRequest = async (mentorId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    try {
      const res = await fetch(
        `https://mentorship-by-iygeal.onrender.com/api/v1/requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mentorId }),
        }
      );

      const data = await res.json();
      alert(data.message || "Request sent");
    } catch (err) {
      console.error(err);
      alert("Failed to send mentorship request.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold text-emerald-700 mb-6 text-center">
        Discover Mentors
      </h2>

      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-2 mb-6 justify-center"
      >
        <input
          type="text"
          placeholder="Filter by skill..."
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Search
        </button>
      </form>

      {message && <p className="text-red-600 text-center">{message}</p>}

      <ul className="space-y-6">
        {mentors.map((mentor: any) => (
          <li
            key={mentor._id}
            className="bg-white rounded-lg shadow-md p-4 border"
          >
            <h3 className="text-xl font-semibold text-emerald-700">
              {mentor.firstName} {mentor.lastName}
            </h3>
            <p className="text-gray-600">
              <em>{mentor.email}</em>
            </p>
            <p className="mt-1 text-gray-700">
              <strong>Skills:</strong> {mentor.skills?.join(", ") || "N/A"}
            </p>
            <button
              onClick={() => handleRequest(mentor._id)}
              className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
            >
              Request Mentorship
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Mentors;
