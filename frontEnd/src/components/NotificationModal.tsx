import React from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  notification: {
    type: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
  } | null;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  notification,
  onClose
}) => {
  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-80 overflow-hidden">
        <div className="bg-green-500 p-3 text-white">
          <h3 className="font-semibold text-lg">New Message</h3>
        </div>
        
        <div className="p-4">
          <p className="mb-2 font-semibold">{notification.senderName}</p>
          <p className="text-gray-700 mb-3">{notification.content}</p>
          <p className="text-xs text-gray-500">
            {new Date(notification.timestamp).toLocaleTimeString()}
          </p>
        </div>
        
        <div className="border-t p-3 flex justify-end space-x-2">
          <button 
            onClick={onClose}
            className="px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal; 