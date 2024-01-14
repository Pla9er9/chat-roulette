import { useState } from "react";
import Chat from "./components/chat/chat";
import Landing from "./components/landing/landing";

function App() {
    const [chatActive, setChatActive] = useState(false);
    if (chatActive) {
        return <Chat stop={() => setChatActive((ac) => (ac = false))} />;
    } else {
        return <Landing onclick={() => setChatActive((ac) => (ac = true))} />;
    }
}

export default App;
