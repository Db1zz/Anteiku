import React from "react";
import { StatusColors } from "./ProfileButton";

export type MemberStatus = "online" | "idle" | "dnd" | "offline";
export interface Member {
  id: string;
  name: string;
  avatarUrl?: string;
  status: MemberStatus;
  role?: string;
}

interface MemberListProps {
  members: Member[];
}

export const MemberList: React.FC<MemberListProps> = ({ members }) => {
  const groups = members.reduce<Record<string, Member[]>>((acc, m) => {
    const key = m.status === "offline" ? "Offline" : m.role || "Online";
    (acc[key] ||= []).push(m);
    return acc;
  }, {});

  const orderedKeys = Object.keys(groups).sort((a, b) => {
    if (a === "Offline") return 1;
    if (b === "Offline") return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4">
      {orderedKeys.map((group) => (
        <div key={group}>
          <h3 className="mb-2 px-1 text-xs font-ananias font-bold uppercase tracking-wider text-gray-800/70">
            {group} — {groups[group].length}
          </h3>
          <ul className="space-y-1">
            {groups[group].map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-brand-beige/40 cursor-pointer"
              >
                <div className="relative h-8 w-8 shrink-0 rounded-full border-2 border-gray-800 bg-brand-beige shadow-sharp-xs">
                  {m.avatarUrl ? (
                    <img
                      src={m.avatarUrl}
                      alt={m.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-800">
                      {m.name[0]?.toUpperCase()}
                    </span>
                  )}
                  <span
                    className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-brand-green ${StatusColors[m.status]}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-roboto text-sm font-bold text-gray-900">
                    {m.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
