import React from "react";
import bgLSideBar from "../../img/bg_l_sidebar.png";
import { Contact, MessageSquare } from "lucide-react";
import { useChatRooms } from "../../hooks/useChatRooms";
import { NotificationBadge } from "../NotificationBadge";
import { useNotifications } from "../../contexts/NotificationContext";

interface LeftBarProps {
  onFriendsClick?: () => void;
  onChatRoomClick?: (userId: string, userName: string) => void;
}

export const LeftBar: React.FC<LeftBarProps> = ({
  onFriendsClick,
  onChatRoomClick,
}) => {
  const { chatRooms, loading, error } = useChatRooms();
  const { getUnreadCount, setActiveTarget } = useNotifications();

  const handleFriendsClick = () => {
    if (onFriendsClick) {
      onFriendsClick();
    }
    setActiveTarget(null);
  }

  return (
    <div className="h-full rounded-l-lg p-4 border border-brand-green relative overflow-hidden flex flex-col">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgLSideBar})` }}
      />
      <div className="absolute inset-0 bg-brand-peach opacity-90" />
      <div className="relative z-10 flex flex-col gap-4 h-full">
        <button
          type="button"
          onClick={handleFriendsClick}
          className="w-full flex items-center gap-3 rounded-lg border border-brand-green/70 bg-brand-beige/90 px-3 py-2 text-brand-green font-semibold shadow-sm transition-colors hover:bg-brand-peach hover:border-brand-green"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-peach/60">
            <Contact size={18} className="text-brand-green" />
          </span>
          <span className="text-left">friends list</span>
        </button>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-3 px-1">
            <MessageSquare size={16} className="text-brand-green" />
            <h3 className="text-brand-green font-semibold text-sm">chats</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin ...">
            {chatRooms.map((room) => (
              <button
                key={room.roomId}
                type="button"
                onClick={() => {
                  onChatRoomClick?.(room.otherUserId, room.otherUserName)
                  setActiveTarget(room.roomId);
                }}
                className="w-full flex items-center gap-3 rounded-lg border border-brand-green/50 bg-brand-beige/80 px-3 py-2 text-left transition-colors hover:bg-brand-beige hover:border-brand-green"
              >
                {}
                <NotificationBadge count={getUnreadCount(room.roomId) || 0}> 
                  <img
                    src={room.otherUserPicture}
                    alt={room.otherUserName}
                    className="h-8 w-8 rounded-full object-cover border border-brand-green/30"
                  />
                </NotificationBadge>

                <div className="flex-1 min-w-0">
                  <p className="text-brand-green font-medium text-sm truncate">
                    {room.otherUserName}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
