import React, {useState} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {setGameMode, setWaitForAction} from "../../../actions/app_actions";
import {getFilters, downloadUserData, downloadWpImages} from "../../../actions/exp_actions";
import './reports.css';
import {toggleOpen} from "../dropdown/dropdown";
import PromptMessage from "../promptMessage/PromptMessage";
// import { parse } from 'zipson';
import {Header} from "../../layout/header/header";
import {getCurrentExp, preventPageGoBack, setCurrentExp} from "../../../utils/helpers";
import {setAlert} from "../../../actions/alert";
const FileDownload = require('js-file-download');

let RedirectBack;

// const ttt = (
//     <select
//         value='Add'
//         onChange={e => addFilter(filter_of, e.target.value)}
//     >
//         <option disabled value='Add'>Add {label}</option>
//         {list_filtered.length === list.length && <option value='All'>all</option>}
//         {
//             list_filtered.map(
//                 list_item => {
//                     let exist = selected_list.indexOf(list_item) > -1;
//                     return (
//                         <option
//                             disabled={exist}
//                         >
//                             {exist && '✓ '}
//                             {list_item}
//                         </option>
//                     )}
//             )
//         }
//     </select>
// );

function promptMessages(children_type, action_on){
    if (children_type === 'ERROR')
        return (
            <label
                style={{
                    textAlign: 'center',
                    fontSize: 'x-large'
                }}
            >
                {action_on}
            </label>
        )
};

const FilterItem = ({label, filter_item, selected_list, list, addFilter, removeFilter, filter_of, selected_list_length}) => {
    const [filtersSearch, setFiltersSearch] = useState('');

    let list_filtered;

    if (filter_item.need_search)
        list_filtered = list.filter(list_ => list_.includes(filtersSearch));
    else
        list_filtered = list;

    return (
        <div className='filter_list'>
            <label>{label}</label>
            {filter_item.need_search && (
                <input onChange={e => setFiltersSearch(e.target.value)}/>
            )}
            <ol>
                {
                    list_filtered.map(
                        list_item => {
                            let exist = selected_list.indexOf(list_item) > -1;
                            return (
                                <li
                                    key={list_item}
                                    className={exist ? 'list_item_y' : 'list_item_n'}
                                    onClick={() => exist? removeFilter(filter_of, list_item) : addFilter(filter_of, list_item)}
                                >
                                    {exist && '✓ '}
                                    {list_item}
                                </li>
                            )}
                    )
                }
            </ol>
        </div>
    )
}

const FilterPanel = ({label, list, selected_list, filter_of, addFilter, removeFilter, filter_item}) => {

    return (
        <div className='filter_item'>

            <FilterItem
                addFilter={addFilter}
                removeFilter={removeFilter}
                filter_item={filter_item}
                selected_list={selected_list}
                list={list}
                filter_of={filter_of}
                selected_list_length={selected_list.length}
                label={label}
            />
            <div className='f_list_select'>
                {
                    selected_list.map(
                        list_select => (
                            <label key={list_select+'l'} className='selected_item'>
                                <span key={list_select+'s1'} onClick={() => removeFilter(filter_of, list_select)}>X</span>
                                <span key={list_select+'s2'}>{list_select}</span>
                            </label>
                        )
                    )
                }
            </div>
        </div>
    )
}
const FiltersBox = ({Filters, addFilter, removeFilter}) => {

    return (
        <div
            className='filters'
        >
            {
                Filters.map(
                    filter_item => {
                        // const {label, list, selected_list, filter_of} = filter_item;
                        return (
                            <FilterPanel key={filter_item.label} {...filter_item} addFilter={addFilter} removeFilter={removeFilter} filter_item={filter_item}/>
                        );
                    }
                )
            }
        </div>
    )
}

const getPermissions = () => (['Admin', 'Patient']);

class Reports extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        let exp;

        try {
            exp = this.props.location.state.exp;
        }
        catch (e){
            exp = undefined;
        }
        if (!exp) {
            const local_s = getCurrentExp();
            if (local_s)
                exp = local_s;
        }

        setCurrentExp(exp);

        RedirectBack = exp ? (exp + '/main') : '/';

        this.state = {
            auth: props.auth,
            isAuthenticated: props.isAuthenticated,
            isLoading: true,
            exp_selected: exp,
            experiment_list_dropdown: false,

            prompt_message: {
                show: false,
                messageType: null,
                children_type: null,
                buttons: [],
                action_on: null,
                action: null,
            },

            filters_values: {
                runnings: [],
                versions: [],
                users: [],
                permissions: getPermissions(),
            },
            filters_selected: {
                runnings: [],
                versions: [],
                users: [],
                permissions: [],
            },
        };

        this.select_drop_item = this.select_drop_item.bind(this);
        this.onClickOnForm = this.onClickOnForm.bind(this);
        this.getAllFilters = this.getAllFilters.bind(this);
        this.filtersOptions = this.filtersOptions.bind(this);

        this.downloadZip = this.downloadZip.bind(this);
        this.downloadImages = this.downloadImages.bind(this);
        this.DownloadData = this.DownloadData.bind(this);
        this.promptCallback = this.promptCallback.bind(this);
    }

    select_drop_item(item, tag) {
        if (tag === 'EXP'){
            let sc = this.state;
            sc.exp_selected = item;
            sc.filters_selected = {
                runnings: [],
                versions: [],
                users: [],
                permissions: [],
            };
            sc.filters_values = {
                runnings: [],
                versions: [],
                users: [],
                permissions: getPermissions(),
            };
            setCurrentExp(item);
            this.setState(sc, this.getAllFilters );
        }
    }

    getAllFilters(){
        this.props.setWaitForAction(true);
        getFilters(this.state.exp_selected, this.state.filters_selected).then(
            res => {
                let sc = this.state;
                try {
                    sc.filters_values = {
                        runnings: res.data.filters.runnings,
                        versions: res.data.filters.versions,
                        users: res.data.filters.users,
                        permissions: getPermissions(),
                    };
                    console.log('---> getAllFilters() Runnings:', sc.filters_values.runnings, 'Versions:', sc.filters_values.versions, 'Users:', sc.filters_values.users, 'Permissions:', sc.filters_values.permissions);

                    // console.log('sc.filters_selected', sc.filters_selected);

                    // sc.filters_selected = {
                    //     runnings: sc.filters_selected.runnings.filter(v_ => sc.filters_values.runnings.indexOf(v_) > -1),
                    //     versions: sc.filters_selected.versions.filter(v_ => sc.filters_values.versions.indexOf(v_) > -1),
                    //     users: sc.filters_selected.users.filter(v_ => sc.filters_values.users.indexOf(v_) > -1),
                    //     permissions: sc.filters_selected.permissions,
                    // }

                }
                catch (e){
                    sc.filters_values = {
                        runnings: [],
                        versions: [],
                        users: [],
                        permissions: getPermissions(),
                    };
                    sc.filters_selected = {
                        runnings: [],
                        versions: [],
                        users: [],
                        permissions: [],
                    }
                }
                this.setState(sc, () => this.props.setWaitForAction(false));
            }
        )
    }

    componentDidMount() {
        this.props.setGameMode(false);
        this.props.setWaitForAction(true);

        preventPageGoBack();
        if (this.state.exp_selected) {
            this.getAllFilters();
        }


    }

    filtersOptions(){
        const addFilter = (filter_of, filter) => {
            let sc = this.state;
            sc.filters_selected[filter_of] = Array.from(new Set([...sc.filters_selected[filter_of], filter]));
            this.setState(sc, this.getAllFilters);
        }

        const removeFilter = (filter_of, filter) => {
            let sc = this.state;
            sc.filters_selected[filter_of] = sc.filters_selected[filter_of].filter(
                flt => flt !== filter
            );
            this.setState(sc, this.getAllFilters);
        }

        const {filters_values, filters_selected} = this.state;
        const Filters = [
            {
                label: 'Permissions',
                list: filters_values.permissions,
                filter_of: 'permissions',
                selected_list: filters_selected.permissions,
                need_search: false
            },
            {
                label: 'Running',
                list: filters_values.runnings,
                filter_of: 'runnings',
                selected_list: filters_selected.runnings,
                need_search: true
            },
            {
                label: 'Versions',
                list: filters_values.versions,
                filter_of: 'versions',
                selected_list: filters_selected.versions,
                need_search: true
            },
            {
                label: 'Users',
                list: filters_values.users,
                filter_of: 'users',
                selected_list: filters_selected.users,
                need_search: true
            },
        ];

        return (
            <FiltersBox
                Filters={Filters}
                addFilter={addFilter}
                removeFilter={removeFilter}
            />
        );
    }

    onClickOnForm(e) {
        try {
            let tag = e.target.attributes.group.value;
            if (tag !== 'DROPDOWN_TAG')
                toggleOpen.bind(this)('ALL');
        }
        catch (e) {
            toggleOpen.bind(this)('ALL');
        }
    }

    downloadZip() {
        this.props.setWaitForAction(true);

        downloadUserData(
            this.state.exp_selected,
            this.state.filters_selected,
        ).then(
            res => {
                this.props.setWaitForAction(false);
                try {
                    if (res.data.error){
                        this.props.setAlert('Error', 'danger');
                    }
                    else{
                        let file_name = 'reports.zip';
                        FileDownload(res.data, file_name);
                    }
                }
                catch (e) {
                    this.props.setAlert('Error', 'danger');                }
            }
        ).catch(
          err => {
              this.props.setWaitForAction(false);
              this.props.setAlert('Error', 'danger');
          }
        )
    }

    promptCallback({msg_of, click_result, action_on, action}) {
        this.setState({
            prompt_message: {
                show: false,
                messageType: null,
                children_type: null,
                action_on: null,
                action: null,
                buttons: []
            }
        }, () => {
            // if (msg_of === 'COUNTERS_DELETE'){
            //     if (click_result === 'YES')
            //         console.log('click_result', click_result)
            // }
        })
    }

    downloadImages(aaa) {
        if (!aaa) return;
        this.props.setWaitForAction(true);

        downloadWpImages(
            this.state.exp_selected,
            {
                runs_selected: this.state.filters.runs_selected,
                vers_selected: this.state.filters.vers_selected,
                users_selected: this.state.filters.users_selected
            }
        ).then(
            res => {
                FileDownload(res.data, 'images.zip');
                this.props.setWaitForAction(false);
            }
        )
    }

    DownloadData(){
        const need_image = false;
        // const need_image = this.state.exp_selected === 'WordPuzzle';

        return (
            <div
                className='download_data'
            >
                {need_image && (<button onClick={this.downloadImages}>Download Data</button>)}
                <button onClick={this.downloadZip}>Download Data</button>
            </div>
        )
    }

    render() {
        const gridTemplateRows = this.state.exp_selected ? 'repeat(3,max-content)' : 'repeat(2,max-content)';

        const {filters_selected} = this.state;
        let disableDownloadButton = true;
        try {
            let f_num = Object.keys(filters_selected).reduce((accumulator, currentValue) => accumulator + filters_selected[currentValue].length, 0);
            disableDownloadButton = f_num === 0;
            // console.log('f_num', f_num );
        }
        catch (e) {}
        // console.log('disableDownloadButton', disableDownloadButton );

        return (
            <>
                <PromptMessage
                    {...this.state.prompt_message}
                >
                    {
                        this.state.prompt_message.children_type && promptMessages(this.state.prompt_message.children_type, this.state.prompt_message.action_on)
                    }
                </PromptMessage>


                <div
                    className={'admin-reports-page ' + (this.state.prompt_message.show ? 'dimming-page' : '')}
                    onClick={this.onClickOnForm}
                    style={{
                        gridTemplateRows
                    }}
                >
                    <Header
                        item_selected={this.state.exp_selected}
                        list_open={this.state.experiment_list_dropdown}
                        optionsList={this.state.auth.user.Experiments.sort()}
                        select_item={this.select_drop_item}
                        reference={this}
                    />

                    {
                        !this.state.exp_selected ? (
                            <label>Select experiment</label>
                        ) : (
                            <>
                                <div className='c_box'>

                                    {this.filtersOptions()}
                                </div>
                                <div className='b_box'>
                                    <button
                                        className={disableDownloadButton? 'disabledElem' : ''}
                                        onClick={() => this.downloadZip()}
                                    >
                                        Download Data
                                    </button>
                                </div>
                            </>
                        )
                    }
                </div>
            </>
        );
    };
}

Reports.propTypes = {
    isAuthenticated: PropTypes.bool,
    setGameMode: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    setWaitForAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {setGameMode, setWaitForAction, setAlert})(Reports);
