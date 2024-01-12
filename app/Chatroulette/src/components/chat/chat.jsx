import { useEffect, useState } from "react";
import MessageInput from "./messageInput/messageInput";
import Messages from "./messages/messages";
import Navbar from "./navbar/navbar";
import PropTypes from "prop-types";

class Info {
    constructor() {
        this.status = ""
        this.online = "0"
    }
}

function Chat({ stop }) {
    let [sendMessage, setSendMessage] = useState(undefined);
    let [info, setInfo] = useState(new Info());
    let [messages, setMessages] = useState([]);
    let [socket, setSocket] = useState(null);

    useEffect(() => {
        console.log("effect");
        let messagesDiv = document.getElementById("messages");
        setSocket((socket) => {
            socket = new WebSocket("ws://localhost:4500/ws");
            socket.onerror = (e) => {
                alert("Error");
                socket.close();
            };
            socket.onmessage = (msg) => {
                console.log(msg)
                if (msg.data.startsWith("-server-online-")) {
                    console.log(msg.data);
                    setInfo((info) => {
                        info.online = msg.data.replace("-server-online-", "")
                        return info
                    });
                    return;
                }
                switch (msg.data) {
                    case "-server-found-":
                        alert("FOUND")
                        setInfo((i) => {
                            info.status = "Połączono"
                            return info
                        })
                        break;
                    case "-server-disconected-":
                        setInfo((i) => {
                            i.status = "Szukanie obcego"
                            return info
                        })
                        break
                    default:
                        setMessages((m) => (m = [...m, [msg.data, false]]));
                        messagesDiv.scrollTop = messagesDiv.scrollHeigh;
                }
            };
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
                    status={info["status"]}
                    online={info["online"]}
                    stop={() => {
                        setMessages((m) => (m = []));
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
