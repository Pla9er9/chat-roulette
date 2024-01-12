import './messages.scss'
import PropTypes from 'prop-types'

function Messages({ messages }) {
    let n = 0
    const messagesList = messages.map(m => {
        n += 1
        return <div className={`message ${m[1] ? 'my-message' : 'not-my-message'}`} key={m + n}>{m[0]}</div>    
    }
    )
    return (
        <div id='messages'>
            {messagesList}
        </div>
    )
}

Messages.propTypes = {
    messages: PropTypes.array
}

export default Messages