import React, { useState, useRef, useEffect } from "react";
import { useCall } from "../hooks/useCall";
import { useCallContext } from "../contexts/CallContext";

export const VoiceView: React.FC = () => {
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);

	const callContext = useCallContext();
	
	useEffect(() => {
		if (!callContext.activeCall || !callContext.activeCall.webRtcSession) {
			throw new Error("TODO");
		}

		// const session: RtcSession = callContext.activeCall.session;
		// if (!session.roomId) {
		// 	throw new Error("TODO");
		// }		
	});

	return (
		<div className="flex justify-center items-center">
			<div className="flex gap-6 mx-auto">
			<video
				ref={localVideoRef}
				playsInline
				autoPlay

				className="w-[600px] h-[350px] bg-black rounded-lg shadow"
			/>
			<video
				ref={remoteVideoRef}
				playsInline
				autoPlay
				className="w-[600px] h-[350px] bg-black rounded-lg shadow"
			/>
			</div>
		</div>
	);
};