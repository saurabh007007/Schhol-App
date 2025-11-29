import {
  Users,
  Calendar,
  BookOpen,
  CreditCard,
  Bus,
  Award,
  ArrowRight,
} from "lucide-react";
import { Button } from "../ui/button";

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Student Management",
    description:
      "Comprehensive student profiles, attendance tracking, and performance monitoring. Keep track of every student's journey from admission to graduation with our detailed digital records.",
    color: "bg-pink-100 text-pink-600",
    image: "bg-pink-50",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Smart Scheduling",
    description:
      "Automated timetable generation that handles conflicts and optimizes resource allocation. Manage classes, exams, and events effortlessly with our drag-and-drop interface.",
    color: "bg-yellow-100 text-yellow-600",
    image: "bg-yellow-50",
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Fee Management",
    description:
      "Streamline your financial operations with automated fee collection, invoicing, and reporting. Parents can pay online securely, and you get real-time financial insights.",
    color: "bg-green-100 text-green-600",
    image: "bg-green-50",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-pink-600 tracking-widest uppercase mb-3">
            Features
          </h2>
          <p className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Everything you need to run a modern school
          </p>
          <p className="text-lg text-gray-500">
            Powerful tools designed to reduce administrative workload and
            improve educational outcomes.
          </p>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row gap-12 lg:gap-24 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1 space-y-6">
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
                <div className="pt-4">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-pink-600 font-semibold hover:text-pink-700"
                  >
                    Learn more <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 w-full">
                <div
                  className={`aspect-[4/3] rounded-2xl ${feature.image} border border-gray-100 p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300`}
                >
                  {/* Abstract UI Representation */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-50">
                    <div className="w-3/4 h-3/4 bg-white rounded-xl shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-500 border border-gray-100 p-4">
                      <div className="h-4 w-1/3 bg-gray-100 rounded mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-gray-50 rounded"></div>
                        <div className="h-2 w-full bg-gray-50 rounded"></div>
                        <div className="h-2 w-2/3 bg-gray-50 rounded"></div>
                      </div>
                    </div>
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
