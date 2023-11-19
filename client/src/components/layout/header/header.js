import React from "react";
import {DropDown} from "../../screens/dropdown/dropdown";
import './header.css';
import {Link} from "react-router-dom";
import {getExperimentPaths} from "../../../data/experiments";
import {getRedirectBackUrl} from "../../../utils/helpers";
export const Header = ({only_back_btn, only_dropdown, item_selected, list_open, optionsList, select_item, reference}) => {

    // exp-details-panel-h
    // exp-details-panel-h-btn
    let className;
    if (!only_back_btn && ! only_back_btn)
        className = '';
    else if (!only_back_btn)
        className = '';
    else if (!only_dropdown)
        className = '';

    return (
        <div
            className={'admin_header ' + className}
        >
            <div>
                {
                    !only_dropdown && (
                        <Link
                            {...getRedirectBackUrl()}
                        >
                            <button>Back</button>
                        </Link>
                    )
                }

                {
                    !only_back_btn && (
                        <DropDown
                            label='Experiment'
                            tag='EXP'
                            dropdown_item='experiment_list'
                            item_selected={item_selected}
                            list_open={list_open}
                            optionsList={optionsList.sort()}
                            select_item={select_item}
                            reference={reference}
                        />
                    )
                }
            </div>

            <hr/>
        </div>
    )
};
