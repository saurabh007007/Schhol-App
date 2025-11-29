import { CheckCircle2 } from "lucide-react";

export const About = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div className="relative mb-12 lg:mb-0">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-yellow-500/20 mix-blend-overlay z-10"></div>
              {/* Placeholder for an actual image, using a colored div for now */}
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center"></div>
            </div>

            {/* Floating stats card */}
            <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs hidden md:block">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl">
                  98%
                </div>
                <div>
                  <div className="font-bold text-gray-900">
                    Satisfaction Rate
                  </div>
                  <div className="text-sm text-gray-500">
                    From parents & teachers
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-[98%]"></div>
              </div>
            </div>

            {/* Decorative dots */}
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-pattern-dots opacity-20"></div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-pink-600 tracking-wide uppercase mb-2">
              About Us
            </h2>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-6">
              Empowering Education Through Technology
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We believe that technology should simplify the educational
              process, not complicate it. Our mission is to provide schools with
              intuitive, powerful, and beautiful tools that help them focus on
              what matters most: education.
            </p>

            <div className="space-y-4">
              {[
                "Streamlined administrative workflows",
                "Enhanced communication between parents and teachers",
                "Real-time academic performance tracking",
                "Secure and reliable data management",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 text-green-500 flex-shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
