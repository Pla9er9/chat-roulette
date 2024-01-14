import "./navbar.scss";
import PropTypes from "prop-types";

function Navbar({ status, stop, skip, online }) {
    let animation = null;
    if (status == "Połączono") {
        animation = (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 512 512"
            >
                <path
                    d="M340.1 177.3L215.3 303l-47.2-47.2-17.8 17.8 56 56c2.5 2.5 5.9 4.5 8.9 4.5s6.3-2 8.8-4.4l133.7-134.4-17.6-18z"
                    fill="#888888"
                />
                <path
                    d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm0 398.7c-105.1 0-190.7-85.5-190.7-190.7 0-105.1 85.5-190.7 190.7-190.7 105.1 0 190.7 85.5 190.7 190.7 0 105.1-85.6 190.7-190.7 190.7z"
                    fill="#888888"
                />
            </svg>
        );
    } else if (status == "Szukanie obcego") {
        animation = (
            <svg
                className="animation"
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
            >
                <path
                    fill="#888888"
                    d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8"
                />
            </svg>
        );
    } else {
        animation = null;
    }

    return (
        <nav>
            <p>Chat roulete</p>
            <p style={{ margin: " 0 15px 0 auto" }}>{status}</p>
            {animation}
            <p>
                <span style={{ color: "#33FB06" }}>{online}</span> online
            </p>
            <button onClick={stop}>Stop</button>
            <button
                onClick={skip}
                style={{ background: "#7cfc95", color: "#111" }}
            >
                Skip
            </button>
        </nav>
    );
}

Navbar.propTypes = {
    status: PropTypes.string,
    stop: PropTypes.func,
    skip: PropTypes.func,
    online: PropTypes.string,
};

export default Navbar;
