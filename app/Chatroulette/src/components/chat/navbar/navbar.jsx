import "./navbar.scss";
import PropTypes from 'prop-types'

function Navbar({ status, stop, skip, online }) {
    return (
        <nav>
            <p>Chat roulete</p>
            <p style={{ margin: " 0 15px 0 auto" }}>{status}</p>
            <p>
                <span style={{ color: "#33FB06" }}>{online}</span> online
            </p>
            <button onClick={stop}>Stop</button>
            <button onClick={skip} style={{background: "#7cfc95", color: "#111"}}>Skip</button>
        </nav>
    );
}

Navbar.propTypes = {
    status: PropTypes.string,
    stop: PropTypes.func,
    skip: PropTypes.func,
    online: PropTypes.string
}

export default Navbar
