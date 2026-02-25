import React, { useState, useRef, useEffect } from "react";
import { useCallContext } from "../contexts/CallContext";
import { useWebRtc } from "../hooks/useWebRtc";

export const VoiceView: React.FC = () => {
	const callContext = useCallContext();
	const { localStream, remoteStreams } = useWebRtc(
		callContext.activeCall?.roomId!, 
		callContext.activeCall?.signalingServerAddress!,
		callContext.activeCall?.stunAddress!);
	var localVideoRef = useRef<HTMLVideoElement>(null);
	var remoteVideoRef = useRef<Map<string, HTMLVideoElement>>(new Map());

	useEffect(() => {
		remoteStreams.forEach((stream, peerId) => {
			const pc = remoteVideoRef.current.get(peerId);
			if (pc != null) {
				pc.srcObject = stream;
			}
		});
	}, [remoteStreams])

	return (
		<div className="flex justify-center items-center">
			<div className="flex gap-6 mx-auto">
				{/* <video
					ref={localVideoRef}
					playsInline
					autoPlay
					muted
					className="w-[600px] h-[350px] bg-black rounded-lg shadow"
				/> */}
				{remoteStreams &&
				Array.from(remoteStreams.entries()).map(([peerId]) => (
					<video
					key={peerId}
					ref={el => {
						if (el) {
							remoteVideoRef.current.set(peerId, el);
							console.log("zxc1");
						} else {
							remoteVideoRef.current.delete(peerId);
							console.log("zxc2");
						}
					}}
					playsInline
					autoPlay
					className="w-[600px] h-[350px] bg-black rounded-lg shadow"
					/>
				))}
			</div>
		</div>
	);
};
