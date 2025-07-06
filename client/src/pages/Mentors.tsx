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
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Discover Mentors</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Filter by skill..."
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {message && <p>{message}</p>}

      <ul>
        {mentors.map(
          (
            mentor: any // eslint-disable-line
          ) => (
            <li key={mentor._id} style={{ marginBottom: "1rem" }}>
              <strong>
                {mentor.firstName} {mentor.lastName}
              </strong>{" "}
              <br />
              <em>{mentor.email}</em> <br />
              Skills: {mentor.skills?.join(", ") || "N/A"} <br />
              <button onClick={() => handleRequest(mentor._id)}>
                Request Mentorship
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Mentors;
