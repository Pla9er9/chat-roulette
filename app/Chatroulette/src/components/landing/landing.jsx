import "./landing.scss";
import PropTypes from "prop-types";

function Landing({ onclick }) {
    return (
        <div className="column" id="landing">
            <h1>
                <span style={{ fontSize: "125px" }}>Chatroulette</span> <br />{" "}
                <span style={{ color: "#33FB06" }}>chat</span> with{" "}
                <span
                    style={{ color: " #081106", WebkitTextStroke: "#fff 1px" }}
                >
                    random
                </span>{" "}
                <br /> people
            </h1>
            <button onClick={onclick}>Try now</button>
        </div>
    );
}

Landing.propTypes = {
    onclick: PropTypes.func,
};

export default Landing;
