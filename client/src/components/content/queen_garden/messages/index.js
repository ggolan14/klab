import React from "react";
import './msg.css';
import {getMessage} from "./msg";

class QueenGardenMessages extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      message_id: this.props.message_id,
    };

    this.Forward = this.props.Forward;
    this.button_label = this.props.button_label;
    this.message_position = this.props.message_position || 'left';
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.message_id !== prevProps.message_id) {
      this.Forward = this.props.Forward;
      this.button_label = this.props.button_label;
      this.message_position = this.props.message_position || 'left';
      this.setState({
        message_id: this.props.message_id
      });

    }

  }

  button = () => {
    return (
      <button
        style={{margin: 'auto'}}
        onClick={() => this.Forward()}
      >
        {this.button_label}
      </button>
    )
  }

  render() {
    const MessageComp = getMessage(this.state.message_id);

    return (
      <div
        className={'qg_msg ' + `msg_pos_${this.message_position}`}
      >
        <MessageComp/>
        {this.button_label && this.button()}
      </div>
    )
  }
}

export default QueenGardenMessages;
