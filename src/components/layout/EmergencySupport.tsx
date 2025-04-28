import React from 'react';
import { X, PhoneOutgoing, MessageSquare } from 'lucide-react';
import { emergencyResources } from '../../data/mockData';

interface EmergencySupportProps {
  onClose: () => void;
}

const EmergencySupport: React.FC<EmergencySupportProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-red-600 p-4 flex justify-between items-center">
          <h2 className="text-white font-semibold text-lg">Emergency Support Resources</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-red-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-6">{emergencyResources.message}</p>
          
          <div className="space-y-4">
            {emergencyResources.hotlines.map((hotline, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-1">{hotline.name}</h3>
                <div className="flex items-center text-gray-600 mb-1">
                  <PhoneOutgoing size={16} className="mr-2" />
                  <span>{hotline.number}</span>
                </div>
                <div className="text-sm text-gray-500">Available: {hotline.available}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-medium text-gray-800 mb-2 flex items-center">
              <MessageSquare size={18} className="mr-2 text-yellow-600" />
              If this is an emergency
            </h3>
            <p className="text-gray-700">
              If you or someone else is in immediate danger, please call emergency services (911 in the US) right away.
            </p>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencySupport;