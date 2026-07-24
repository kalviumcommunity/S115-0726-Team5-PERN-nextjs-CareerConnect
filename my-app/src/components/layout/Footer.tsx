import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 px-6 border-t border-gray-200 bg-white text-center text-xs text-gray-500">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 max-w-7xl mx-auto">
        <p>&copy; {new Date().getFullYear()} Career Connect. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};
