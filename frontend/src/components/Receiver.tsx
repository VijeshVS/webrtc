import { useEffect } from "react"


export const Receiver = () => {
    
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'receiver'
            }));
        }
        startReceiving(socket);
    }, []);

    function startReceiving(socket: WebSocket) {
        const video = document.createElement('video');
        const playButton = document.createElement('button');
        playButton.innerText = 'Play Video';
        playButton.onclick = () => video.play();
        document.body.appendChild(video);
        document.body.appendChild(playButton);

        const pc = new RTCPeerConnection();
        pc.ontrack = (event) => {
            video.srcObject = new MediaStream([event.track]);
        }

        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);

            switch (message.type) {
                case 'createOffer':
                    await pc.setRemoteDescription(message.sdp);
                    const answer = await pc.createAnswer()
                    socket.send(JSON.stringify({
                        type: 'createAnswer',
                        sdp: answer
                    }));
                    break;
                case 'iceCandidate':
                    pc.addIceCandidate(message.candidate);
                    break;
            }
        }
    }

    return <div>
        
    </div>
}