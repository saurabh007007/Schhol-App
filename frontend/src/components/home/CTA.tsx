import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          Ready to transform your school?
        </h2>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Join thousands of forward-thinking schools that are saving time and
          improving education with SchoolApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-pink-600 hover:bg-pink-700 text-white h-14 px-8 text-lg rounded-full w-full sm:w-auto shadow-xl shadow-pink-200"
            >
              Get Started for Free
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 text-lg rounded-full w-full sm:w-auto"
          >
            Contact Sales
          </Button>
        </div>
        <p className="mt-6 text-sm text-gray-400">
          No credit card required · 14-day free trial · Cancel anytime
        </p>
      </div>
    </section>
  );
};
