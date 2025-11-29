import { Star } from "lucide-react";

const testimonials = [
  {
    content:
      "This software has completely transformed how we manage our school. The attendance and fee modules are lifesavers.",
    author: "Sarah Johnson",
    role: "Principal, St. Mary's High School",
    avatar: "SJ",
  },
  {
    content:
      "The best part is how easy it is for parents to use. We've seen a 40% increase in parent engagement since switching.",
    author: "David Chen",
    role: "Administrator, Tech Academy",
    avatar: "DC",
  },
  {
    content:
      "Finally, a school ERP that doesn't look like it was built in the 90s. Beautiful, fast, and reliable.",
    author: "Emily Davis",
    role: "Director, Future Kids",
    avatar: "ED",
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Educators
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            See what school administrators and teachers have to say about their
            experience with SchoolApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">
                    {testimonial.author}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
