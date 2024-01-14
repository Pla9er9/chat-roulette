import { useState } from "react";
import "./messageInput.scss";
import PropTypes from "prop-types";

function MessageInput({ sendMessage }) {
    let [value, setValue] = useState("");
    const handleChange = (e) => {
        setValue((v) => (v = e.target.value));
    };
    return (
        <div id="messageInput">
            <input
                value={value}
                onChange={handleChange}
                onKeyDown={(k) => {
                    if (k.key === "Enter") {
                        sendMessage(value);
                        setValue((v) => (v = ""));
                    }
                }}
                placeholder="Write a Message"
            />
            <button
                onClick={() => {
                    sendMessage(value);
                    setValue((v) => (v = ""));
                }}
            >
                <img
                    src={new URL("/src/assets/send.svg", import.meta.url)}
                    alt="send icon"
                />
            </button>
        </div>
    );
}

MessageInput.propTypes = {
    sendMessage: PropTypes.func,
};

export default MessageInput;
