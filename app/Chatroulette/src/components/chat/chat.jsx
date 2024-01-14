import { useEffect, useState } from "react";
import MessageInput from "./messageInput/messageInput";
import Messages from "./messages/messages";
import Navbar from "./navbar/navbar";
import PropTypes from "prop-types";

function Chat({ stop }) {
    let [sendMessage, setSendMessage] = useState(undefined);
    let [online, setOnline] = useState("0");
    let [status, setStatus] = useState("Szukanie obcego");
    let [messages, setMessages] = useState([]);
    let [socket, setSocket] = useState(null);

    function onMessage(msg) {
        console.log(msg.data);
        if (msg.data.startsWith("-server-online-")) {
            console.log(msg.data);
            console.log(msg.data.replace("-server-online-", ""));
            setOnline(msg.data.replace("-server-online-", ""));
            return false;
        }
        let messagesDiv = document.getElementById("messages");
        switch (msg.data) {
            case "-server-found-":
                setMessages([...messages, ["Znaleziono obcego", false]]);
                setStatus("Połączono");
                break;
            case "-server-disconected-":
                setMessages([
                    ...messages,
                    ["Połaczenie z obcym zerwane", false],
                ]);
                setStatus("Szukanie obcego");
                break;
            default:
                setMessages((m) => (m = [...m, [msg.data, false]]));
                messagesDiv.scrollTop = messagesDiv.scrollHeigh;
        }
        return false;
    }

    useEffect(() => {
        setSocket((socket) => {
            socket = new WebSocket("ws://localhost:4500/ws");
            socket.onerror = (e) => {
                console.log(e);
                setStatus("Error occured please restart or try later");
                socket.close();
            };
            socket.onclose = (e) => {
                console.log(e);
            };
            socket.onmessage = onMessage;
            socket;
            setSendMessage(
                (ssm) =>
                    (ssm = (msg) => {
                        setMessages((messages) => [...messages, [msg, true]]);
                        let messagesDiv = document.getElementById("messages");
                        messagesDiv.scrollTop = messagesDiv.scrollHeight;
                        socket.send("-m-" + msg);
                    })
            );
            return socket;
        });
    }, []);

    return (
        <>
            <div className="column">
                <Navbar
                    status={status}
                    online={online}
                    stop={() => {
                        setMessages((m) => (m = []));
                        socket.send("-stop-");
                        socket.close();
                        setSocket((s) => (s = null));
                        stop();
                    }}
                    skip={() => {
                        setMessages((m) => (m = []));
                        socket.send("-skip-");
                    }}
                />
                <Messages messages={messages} />
                <MessageInput sendMessage={sendMessage} />
            </div>
        </>
    );
}

Chat.propTypes = {
    stop: PropTypes.func,
};

export default Chat;
