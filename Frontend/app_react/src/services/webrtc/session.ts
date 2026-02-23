import { RtcSignal } from "./types";

export class WebRtcSession {
	public roomId: string;
	public signalingServerSocket: WebSocket | null;
	public peers: Map<string, RTCPeerConnection>;

	private stunAddress: string;
	private signalingServerAddress: URL;

	constructor(roomId: string, signalingServerAddress: string, stunAddress: string) {
		this.roomId = roomId;
		this.signalingServerSocket = null;
		this.peers = new Map<string, RTCPeerConnection>();
		this.signalingServerAddress = new URL(signalingServerAddress);
		this.signalingServerAddress.searchParams.append("roomId", roomId);
		this.stunAddress = stunAddress;
	}

	public destroy() {
		console.log("Destroying WebRtc session...");

		if (this.signalingServerSocket != null) {
			this.signalingServerSocket.close();
		}
	}

	public async joinCall() {
		this.signalingServerSocket = new WebSocket(this.signalingServerAddress);
		
		new Promise<void>((resolve) => {
			if (this.signalingServerSocket!.readyState === WebSocket.OPEN) {
				resolve();
			} else {
				this.signalingServerSocket!.addEventListener("open", () => resolve(), { once: true });
			}
		}).then(() => {
			this.signalingServerSocket!.addEventListener("message", (message) => this.onMessageCallback(message));
		});
	}

	private onMessageCallback(message: MessageEvent) {
		console.log("GOT MY MESSAGE WOW!!!!!");
		console.log("Message data: ", message.data);

		const pm = JSON.parse(message.data) as RtcSignal;

		switch (pm.type) {
			case "new-connection": {
				this.handleNewConnectionEvent(pm.from);
				break;
			}
			case "offer": {
				this.handleOfferEvent(pm.from, pm.sdp);
				break;
			}
			case "answer": {
				this.handleAnswerEvent(pm.from, pm.sdp);
				break;
			}
			case "ice": {
				this.handleIceEvent(pm.from, pm.candidate);
				break;
			}
		}
	};

	private async handleNewConnectionEvent(from: string) {
		const pc = this.createPeerConnection(from);

		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);
		const message = { type: "offer", to: from, sdp: pc.localDescription! };
		this.signalingServerSocket!.send(JSON.stringify(message));
	}

	private async handleOfferEvent(from: string, sdp: RTCSessionDescriptionInit) {
		const pc = this.createPeerConnection(from);

		pc.setRemoteDescription(sdp);
		const answer = await pc.createAnswer();
		await pc.setLocalDescription(answer);

		const message = { type: "answer", to: from, sdp: pc.localDescription! };
		this.signalingServerSocket!.send(JSON.stringify(message));
	}

	private async handleAnswerEvent(from: string, sdp: RTCSessionDescriptionInit) {
		const search = this.peers.get(from);
		if (search === undefined) {
			throw new Error("TODO2");
		}

		const peer: RTCPeerConnection = search;
		peer.setRemoteDescription(sdp);
	}

	private async handleIceEvent(from: string, candidate: RTCIceCandidateInit) {
		const search = this.peers.get(from);
		if (search === undefined) {
			throw new Error("TODO3");
		}

		const pc: RTCPeerConnection = search;

		await pc.addIceCandidate(candidate);
	}

	private createPeerConnection(peerId: string): RTCPeerConnection {
		const pcConfig: RTCConfiguration = { iceServers: [{ urls: this.stunAddress }] };
		const pc =  new RTCPeerConnection(pcConfig);

		pc.addEventListener("icecandidate", event => this.onIceCandidateCallback(event, peerId));

		this.peers.set(peerId, pc);

		return pc;
	}

	private onIceCandidateCallback(event: RTCPeerConnectionIceEvent, to: string) {
		const message = { type: "ice", to: to, candidate: event.candidate!.toJSON() };
		this.signalingServerSocket!.send(JSON.stringify(message));
	}
}