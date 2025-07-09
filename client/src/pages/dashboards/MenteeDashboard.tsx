const MenteeDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="min-h-[80vh] mt-12 px-6 text-center">
      <h2 className="text-3xl font-bold text-emerald-700 mb-4">
        Welcome Mentee
      </h2>

      <p className="text-gray-700 max-w-xl mx-auto text-lg">
        {user?.firstName}, you can now browse mentors, send mentorship requests,
        and book sessions.
      </p>

      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-gray-600">Use the navigation bar above to:</p>
        <ul className="list-disc text-left text-gray-700 space-y-2">
          <li>Explore available mentors</li>
          <li>Track request status</li>
          <li>Book mentorship sessions</li>
          <li>Give feedback on completed sessions</li>
        </ul>
      </div>
    </div>
  );
};

export default MenteeDashboard;
