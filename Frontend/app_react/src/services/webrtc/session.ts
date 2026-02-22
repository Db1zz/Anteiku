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
			// Wait server message with the list of peers...
			// if there's none, do nothing and just wait to someone to connect? or setup your own env....
			// Add smth =)
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
		}
	};

	private async handleNewConnectionEvent(from: string) {
		const pc = new RTCPeerConnection;
		this.peers.set(from, pc);

		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);
		const message = { type: "offer", to: from, sdp: pc.localDescription! };
		this.signalingServerSocket!.send(JSON.stringify(message));
	}

	private async handleOfferEvent(from: string, sdp: RTCSessionDescriptionInit) {
		const search = this.peers.get(from);
		if (search === undefined) {
			throw new Error("TODO2");
		}

		const peer: RTCPeerConnection = search;
		peer.setRemoteDescription(sdp);
		const answer = await peer.createAnswer();
		await peer.setLocalDescription(answer);

		const message = { type: "answer", to: from, sdp: peer.localDescription! };
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
}