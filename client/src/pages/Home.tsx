const Home = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-4">
        Welcome to Mentorship Matching Platform Developed by Iygeal
      </h1>

      <p className="text-gray-700 max-w-2xl text-lg leading-relaxed">
        This platform connects aspiring individuals with experienced mentors
        across various fields. You can sign up as a <strong>mentor</strong> or{" "}
        <strong>mentee</strong>, send and respond to mentorship requests,
        schedule personalized sessions, and leave feedback — all in one place.
      </p>

      <p className="mt-4 text-gray-600">
        Get started by registering an account or logging in to your dashboard.
      </p>
    </div>
  );
};

export default Home;
