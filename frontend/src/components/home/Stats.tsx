export const Stats = () => {
  const stats = [
    { label: "Schools Trusted", value: "1,000+" },
    { label: "Students Managed", value: "500k+" },
    { label: "Uptime Guarantee", value: "99.9%" },
    { label: "Countries Supported", value: "25+" },
  ];

  return (
    <section className="bg-black text-white py-12 border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-gray-400 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
