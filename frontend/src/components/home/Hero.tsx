import { Button } from "../ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium mb-8 animate-fade-in-up">
          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          New: Academic Year 2025-26 Ready
        </div>

        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 max-w-4xl mx-auto leading-tight animate-fade-in-up animation-delay-200">
          The Operating System for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-500 to-yellow-500">
            Modern Schools
          </span>
        </h1>

        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
          Streamline admissions, attendance, fees, and exams in one beautiful
          platform. Designed for administrators, loved by teachers and parents.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up animation-delay-600">
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800 h-12 px-8 text-base rounded-full transition-all hover:scale-105"
            >
              Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base rounded-full hover:bg-gray-50"
          >
            Book a Demo
          </Button>
        </div>

        <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-20 animate-fade-in-up animation-delay-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-500 w-4 h-4" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-500 w-4 h-4" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-500 w-4 h-4" />
            <span>Cancel anytime</span>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative mx-auto max-w-5xl animate-fade-in-up animation-delay-1000">
          <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="bg-white rounded-xl shadow-2xl ring-1 ring-gray-900/10 overflow-hidden">
              {/* Mockup Header */}
              <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3 flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="h-6 w-64 bg-gray-100 rounded-md"></div>
              </div>

              {/* Mockup Content */}
              <div className="flex h-[400px] lg:h-[600px]">
                {/* Sidebar */}
                <div className="w-64 border-r border-gray-100 bg-gray-50/30 p-4 hidden md:block">
                  <div className="space-y-3">
                    <div className="h-8 w-full bg-pink-50 text-pink-600 rounded-md flex items-center px-3 text-sm font-medium">
                      Dashboard
                    </div>
                    <div className="h-8 w-full hover:bg-gray-50 rounded-md flex items-center px-3 text-sm text-gray-600">
                      Students
                    </div>
                    <div className="h-8 w-full hover:bg-gray-50 rounded-md flex items-center px-3 text-sm text-gray-600">
                      Teachers
                    </div>
                    <div className="h-8 w-full hover:bg-gray-50 rounded-md flex items-center px-3 text-sm text-gray-600">
                      Finance
                    </div>
                    <div className="h-8 w-full hover:bg-gray-50 rounded-md flex items-center px-3 text-sm text-gray-600">
                      Transport
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 lg:p-8 bg-gray-50/10">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-48 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-10 w-32 bg-black rounded-lg"></div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <div className="h-10 w-10 rounded-lg bg-pink-100 mb-4"></div>
                      <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-16 bg-green-100 text-green-600 rounded px-2 text-xs flex items-center">
                        ↑ 12%
                      </div>
                    </div>
                    <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <div className="h-10 w-10 rounded-lg bg-yellow-100 mb-4"></div>
                      <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-16 bg-green-100 text-green-600 rounded px-2 text-xs flex items-center">
                        ↑ 5%
                      </div>
                    </div>
                    <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 mb-4"></div>
                      <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-16 bg-red-100 text-red-600 rounded px-2 text-xs flex items-center">
                        ↓ 2%
                      </div>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm h-64">
                    <div className="flex items-end justify-between h-full gap-4 px-4 pb-4">
                      <div className="w-full bg-pink-50 rounded-t-lg h-[40%]"></div>
                      <div className="w-full bg-pink-100 rounded-t-lg h-[60%]"></div>
                      <div className="w-full bg-pink-200 rounded-t-lg h-[30%]"></div>
                      <div className="w-full bg-pink-300 rounded-t-lg h-[80%]"></div>
                      <div className="w-full bg-pink-400 rounded-t-lg h-[50%]"></div>
                      <div className="w-full bg-pink-500 rounded-t-lg h-[75%]"></div>
                      <div className="w-full bg-pink-600 rounded-t-lg h-[90%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
