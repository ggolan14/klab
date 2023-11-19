import React from 'react';
import './prompt_message.css';

const PromptMessage = (props) => {

    if (!props || !props.show)
        return <></>;

    return (
        <div className='P_MSG_B'>
            <div
                className={`prompt-message prompt-message-${props.messageType}`}
            >
                <div>
                    {props.children}

                    <div
                        className='prompt-message-buttons'
                    >
                        {
                            props.buttons.map(
                                btn => (
                                    <button
                                        key={'prompt-message-'+btn.text}
                                        onClick={() => btn.callbackFunc({
                                            msg_of: props.msg_of,
                                            click_result: btn.result,
                                            action_on: props.action_on,
                                            action: props.action,
                                        })}
                                        className={'prompt-message-' + btn.className}
                                    >
                                        {btn.text}
                                    </button>
                                )
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PromptMessage;
