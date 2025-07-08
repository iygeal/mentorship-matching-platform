import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "mentee",
    bio: "",
    goals: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        "https://mentorship-by-iygeal.onrender.com/api/v1/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            skills: formData.skills.split(",").map((s) => s.trim()),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess("Registration successful! You can now log in.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "mentee",
        bio: "",
        goals: "",
        skills: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          name="bio"
          placeholder="Short Bio"
          value={formData.bio}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          name="goals"
          placeholder="Your Goals"
          value={formData.goals}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (comma-separated)"
          value={formData.skills}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="mentee">Mentee</option>
          <option value="mentor">Mentor</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
