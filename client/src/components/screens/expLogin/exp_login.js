import React from "react";
import PropTypes from 'prop-types';
import './exp_login.css';
import {GetExperimentLabel} from "../../../data/experiments";

class ExpLogin extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.exp = this.props.exp;
        this.callback = this.props.callback;
        this.mode = this.props.mode;
        this.user = this.props.user;
        this.have_consent = this.props.have_consent;

        this.state = {
            user_id: this.user.id || '',
            age: this.user.age || '',
            gender: this.user.gender || null,
            errors_inputs: false,
            errors_inputs_info: [],
            isAdmin: this.props.isAdmin,
            use_my_details: true
        };

        // this.state = {
        //     user_id: this.user.id === 'elirand574@gmail.com',
        //     age: 20,
        //     gender: 'Male',
        //     errors_inputs: false,
        //     errors_inputs_info: [],
        //     isAdmin: true,
        //     use_my_details: true
        // };
        // this.goNext('LogInToGame');

        this.closeErrorInputs = this.closeErrorInputs.bind(this);
        this.changeUseMyDetails = this.changeUseMyDetails.bind(this);
    }

    goNext(option) {
        if (option === 'LogInToGame'){
            let errors_inputs_info = [];
            if (!this.state.user_id)
                errors_inputs_info.push('User ID');
            if (!this.state.age)
                errors_inputs_info.push('Age');
            if (this.state.age && this.state.age < 18)
                errors_inputs_info.push('You must be 18 or older');
            if (this.state.age && this.state.age > 80)
                errors_inputs_info.push('You must be younger than 80');
            if (!this.state.gender)
                errors_inputs_info.push('Gender');

            if (errors_inputs_info.length > 0){
                this.setState({
                    errors_inputs: true,
                    errors_inputs_info
                })
            }
            else {
                this.callback('ExpLogin', {
                    UserId: this.state.user_id,
                    Age: this.state.age,
                    Gender: this.state.gender,
                });
            }
        }
        else if (option === 'ReturnToConsent'){
            this.callback('ReturnToConsent', {});
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isAdmin !== this.props.isAdmin){
            this.setState({
                isAdmin: this.props.isAdmin
            })
        }

        if (prevProps !== this.props) {
            this.exp = this.props.exp;
            this.callback = this.props.callback;
            this.mode = this.props.mode;
            this.user = this.props.user;
            this.have_consent = this.props.have_consent;

            this.setState({
                user_id: this.user.id || '',
                age: this.user.age || '',
                gender: this.user.gender || null,
                errors_inputs: false,
                errors_inputs_info: [],
                isAdmin: this.props.isAdmin,
                use_my_details: true
            });
        }


    }

    componentDidMount() {

    }

    closeErrorInputs() {
        this.setState({
            errors_inputs: false
        });
    }

    changeUseMyDetails(e){
        let sc = this.state;
        if (e.target.checked){
            sc.user_id = this.user.id || '';
            sc.age = this.user.age || '';
            sc.gender = this.user.gender || null;
            sc.use_my_details = true;
        }
        else {
            sc.user_id = '';
            sc.age = '';
            sc.gender = null;
            sc.use_my_details = false;
        }
        this.setState(sc);
    }


    render() {

        const exp_label = GetExperimentLabel(this.exp);

        return (
            <>
                {
                    this.state.errors_inputs && (
                        <div
                            className='exp-login-errors-p'
                        >
                            <div
                                className='exp-login-errors'
                            >
                                <label>There was an <b>errors</b> with following inputs:</label>
                                <div>
                                    {
                                        this.state.errors_inputs_info.map(
                                            error => <label key={'errors_inputs_info_' + error}>{error}</label>
                                        )
                                    }
                                </div>
                                <button
                                    onClick={() => this.closeErrorInputs()}
                                >Close</button>
                            </div>
                        </div>
                    )
                }
                <div
                    className={'exp-login-panel ' + (this.state.errors_inputs ? 'dimming-page' : '')}
                >
                    <div>
                        <label>{exp_label}</label>
                        <div>
                            <table>
                                <tbody>
                                <tr
                                    className='exp-login-panel-id'
                                >
                                    <td>
                                        <label>{this.exp === 'RepeatedChoice' ? 'Participant ID' : 'User ID'}:</label>
                                    </td>
                                    <td>
                                        <input
                                            className={this.state.errors_inputs_info.indexOf('User ID') > -1 ? 'exp-login-item-error' : ''}
                                            type='text'
                                            disabled={this.mode === 'DEMO'}
                                            onKeyDown={e => [32, 191, 220].indexOf(e.keyCode) > -1 ? e.preventDefault() : {}}
                                            onChange={e => this.setState({
                                                user_id: e.target.value.trim().replace(/\//g, '')
                                            })}
                                            value={this.state.user_id}
                                        />
                                    </td>
                                </tr>

                                <tr
                                    className='exp-login-panel-gender'
                                >
                                    <td>
                                        <label>Gender</label>
                                    </td>
                                    <td>
                                        <select
                                            className={this.state.errors_inputs_info.indexOf('Gender') > -1 ? 'exp-login-item-error' : ''}
                                            disabled={this.mode === 'DEMO'}
                                            onChange={e => this.setState({
                                                gender: e.target.value
                                            })}
                                            value={this.state.gender || 'SELECT'}
                                        >
                                            <option value={'SELECT'} disabled>Select...</option>
                                            <option value={'Male'}>Male</option>
                                            {/*<option value={'Male'}>🇳🇱&emsp;  Male</option>*/}
                                            <option value={'Female'}>Female</option>
                                            <option value={'Other'}>Other</option>
                                        </select>
                                    </td>
                                </tr>

                                <tr
                                    className='exp-login-panel-age'
                                >
                                    <td>
                                        <label>Age:</label>
                                    </td>
                                    <td>
                                        <input
                                            className={this.state.errors_inputs_info.indexOf('Age') > -1 ? 'exp-login-item-error' : ''}
                                            type='number'
                                            disabled={this.mode === 'DEMO'}
                                            value={this.state.age}
                                            onChange={e => this.setState({
                                                age: e.target.value
                                            })}
                                            onKeyDown={e => {
                                                if (e.keyCode !== 8 && (e.keyCode < 48 || e.keyCode > 57) ) e.preventDefault()}
                                            }
                                        />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div
                            className='exp-login-panel-btn'
                        >
                            <button
                                onClick={() => this.goNext('LogInToGame')}
                            >
                                Continue
                            </button>

                            {
                                this.have_consent && (
                                    <button
                                        onClick={() => this.goNext('ReturnToConsent')}
                                    >
                                        Return to consent form
                                    </button>
                                )
                            }
                        </div>

                        {
                            this.state.isAdmin && (
                                <div>
                                    <label
                                        className='exp-login-admin-details-chk unselectable'
                                    >
                                        <input
                                            type='checkbox'
                                            onChange={this.changeUseMyDetails}
                                            // onClick={e =>this.setSetting('pl_task', $(e.target).is(':checked'))}
                                            checked={this.state.use_my_details}
                                        /> Use my details
                                    </label>
                                </div>
                            )
                        }
                    </div>
                </div>
            </>
        );

        // return (
        //     <div
        //         className='exp-login-panel'
        //     >
        //         <div>
        //             <div>
        //                 <div
        //                     className='exp-login-panel-id'
        //                 >
        //                     <label>Prolific ID:</label>
        //                     <input
        //                         type='text'
        //                         disabled={this.mode === 'DEMO'}
        //                         onChange={e => this.setState({
        //                             user_id: e.target.value
        //                         })}
        //                         value={this.state.user_id}
        //                     />
        //                 </div>
        //
        //                 <div
        //                     className='exp-login-panel-gender'
        //                 >
        //                     <label>Gender</label>
        //                     <select
        //                         disabled={this.mode === 'DEMO'}
        //                         onChange={e => this.setState({
        //                             gender: e.target.value
        //                         })}
        //                         value={this.state.gender || 'SELECT'}
        //                     >
        //                         <option value={'SELECT'} disabled>Select...</option>
        //                         <option value={'Male'}>Male</option>
        //                         <option value={'Female'}>Female</option>
        //                         <option value={'Other'}>Other</option>
        //                     </select>
        //                 </div>
        //
        //                 <div
        //                     className='exp-login-panel-age'
        //                 >
        //                     <label>Age:</label>
        //                     <input
        //                         type='number'
        //                         disabled={this.mode === 'DEMO'}
        //                         value={this.state.age}
        //                         onChange={e => this.setState({
        //                             age: e.target.value
        //                         })}
        //                         min={1}
        //                         onKeyDown={e => {
        //                             if (e.keyCode !== 8 && (e.keyCode < 48 || e.keyCode > 57) ) e.preventDefault()}
        //                         }
        //                     />
        //                 </div>
        //             </div>
        //
        //             <button
        //                 onClick={() => this.goNext()}
        //             >Continue</button>
        //         </div>
        //     </div>
        // );
    };
}

ExpLogin.propTypes = {
    callback: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
    exp: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
};

export default ExpLogin;


