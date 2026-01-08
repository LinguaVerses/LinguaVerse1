import React from 'react';
import { Construction } from 'lucide-react';

interface Props {
  title: string;
}

const GenericPlaceholder: React.FC<Props> = ({ title }) => {
  return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      <div className="bg-white p-12 rounded-2xl shadow-xl border border-purple-100 max-w-lg w-full">
        <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Construction size={40} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{title}</h1>
        <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
        <p className="text-slate-500 mb-8">
          We are currently working hard to bring you this page. Please check back later for updates!
        </p>
        <button className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors w-full">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default GenericPlaceholder;