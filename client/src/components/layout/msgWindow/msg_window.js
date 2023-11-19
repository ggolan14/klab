import React from "react";
import './msg_window.css';

export class MessageWindow extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            message: this.props.Message,
            props: this.props.Props || {},
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.setState({
                message: this.props.Message,
                props: this.props.Props || {},
            });

        }

    }

    render() {
        const Component = this.state.message;

        return (
            <div
                className='msg_win'
            >
                <div className='STE_GW'>
                    <Component {...this.state.props}/>
                </div>
            </div>
        )
    }
}
