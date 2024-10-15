import React from "react";
import './msg.css';
import {getMessage, QueenGardenGameMessageImg} from "./msg";
import {Flower} from "../game_board/flowers/flower";

class QueenGardenMessages extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      message_id: this.props.message_id,
      message_more_info: this.props.message_more_info,
      button_label: this.props.button_label,
      button_class_name: this.props.button_class_name,
      message_position: this.props.message_position,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props !== prevProps) {
      this.setState({
        message_id: this.props.message_id,
        message_more_info: this.props.message_more_info,
        button_label: this.props.button_label,
        button_class_name: this.props.button_class_name,
        message_position: this.props.message_position,
      });

    }

  }

  render() {
    const MessageComp = getMessage(this.state.message_id);
    // const MessageImg = getMessageImg(this.state.message_id);

    return (
      <>
        <QueenGardenGameMessageImg
          message_id={this.state.message_id}
          message_position={this.state.message_position}
          from_road={this.state.message_more_info?.from_road}
        />

        {this.state.message_more_info && this.state.message_more_info.flower_color && (
          <div
            className={'qg_msg_sad_flower qg_msg_sad_flower_' + this.state.message_more_info.from_road}
          >
            <Flower
              flower_color={this.state.message_more_info.flower_color}
              flower_type='sad'
            />
          </div>
        )}
        <div
          className={`qg_msg msg_pos_${this.state.message_position}`}
        >

          <MessageComp message_more_info={this.state.message_more_info}/>
          {this.state.button_label && (
            <button
              className={this.state.button_class_name || ''}
              style={{margin: 'auto'}}
              onClick={() => this.props.Forward()}
            >
              {this.state.button_label}
            </button>
          )}
        </div>
      </>
    )
  }
}

export default QueenGardenMessages;
