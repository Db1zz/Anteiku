import React from 'react';

export interface NotificationPayload {
  user_id: string;
  sender_id: string;
  chat_id: string;
  content: string;
  timestamp: number;
}

interface NotificationToastProps {
  payload: NotificationPayload;
  onClose?: () => void;
  senderName?: string;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ 
  payload, 
  onClose,
  senderName 
}) => {
  const { sender_id, content, timestamp } = payload;

  const timeString = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="group max-w-sm w-full bg-[#313338] text-white shadow-2xl rounded-lg pointer-events-auto ring-1 ring-white/10 overflow-hidden border-l-4 border-indigo-500 hover:bg-[#35373c] transition-colors">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full bg-gray-600"
              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${sender_id}`}
              alt="avatar"
            />
          </div>
          
          <div className="ml-3 w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-100 truncate">
                {senderName || `User ${sender_id.slice(0, 8)}`}
              </p>
              <span className="text-[10px] text-gray-400 ml-2">{timeString}</span>
            </div>
            <p className="mt-1 text-sm text-gray-300 line-clamp-2 break-words">
              {content}
            </p>
          </div>

          {onClose && (
            <div className="ml-4 flex-shrink-0 flex">
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-300 focus:outline-none p-1"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};