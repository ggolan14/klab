import React from "react";
import PropTypes from 'prop-types';
import './consent_form.css';
import ClassicEditorElement from "../editor/classic_editor";

class ConsentForm extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.callback = this.props.callback;
        this.mode = this.props.mode;

        this.state = {
            option_selected: null,
            // option_selected: this.mode === 'DEMO' ? 'user_consent' : null,
            consent_form: this.props.consent_form,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.consent_form !== this.props.consent_form){
            let sc = this.state;
            sc.consent_form = this.props.consent_form;
            this.setState(sc);
        }
    }

    consent_form_view_part1() {
        return (
            <div
                className='consent_form_view_part1'
            >
                <ClassicEditorElement
                    toolbar={null}
                    removeToolBar={true}
                    data={this.state.consent_form.body}
                    onChange={() => {}}
                    part='body'
                    isReadOnly={true}
                    disabled={true}
                />
            </div>
        )
    }

    consent_form_view_part2() {
        return (
            <div
                className='consent_form_view_part2'
            >
                <div>
                    <input
                        type="radio"
                        name='consent_form_radio'
                        checked={this.state.option_selected === 'user_consent'}
                        onChange={() => this.setState({
                            option_selected: 'user_consent'
                        })}
                    />
                    <ClassicEditorElement
                        toolbar={null}
                        removeToolBar={true}
                        data={this.state.consent_form.radio_consent_text}
                        onChange={() => {}}
                        part='radio_consent_text'
                        isReadOnly={true}
                        disabled={true}
                    />
                </div>
                {
                    this.state.consent_form.radio_not_consent_text !== '' && (
                        <div>
                            <input
                                type="radio"
                                name='consent_form_radio'
                                checked={this.state.option_selected === 'user_not_consent'}
                                onChange={() => this.setState({
                                    option_selected: 'user_not_consent'
                                })}
                            />
                            <ClassicEditorElement
                                toolbar={null}
                                removeToolBar={true}
                                data={this.state.consent_form.radio_not_consent_text}
                                onChange={() => {}}
                                part='radio_not_consent_text'
                                isReadOnly={true}
                                disabled={true}
                            />
                        </div>
                    )
                }
            </div>
        )
    }

    render() {
        if (!this.state.consent_form)
            return <></>;

        return (
            <div
                className='consent_form-panel'
            >
                {this.consent_form_view_part1()}
                {this.consent_form_view_part2()}
                <button
                    className={this.state.option_selected === null ? 'disabledElem' : ''}
                    onClick={() => {
                    this.callback('ConsentForm', this.state.option_selected);
                }}>Continue</button>
            </div>
        );
    };
}

ConsentForm.propTypes = {
    consent_form: PropTypes.object,
    callback: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired
};

export default ConsentForm;


