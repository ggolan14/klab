import React from "react";

export function closeAllDrops(except){
    let sc = this.state;
    for (let state_item in this.state){
        if (state_item.includes('_dropdown') && !state_item.includes(except))
            sc[state_item] = false;
    }
    this.setState(sc);
}

export function toggleOpen(dropdown_item){
    if (dropdown_item === 'ALL'){
        closeAllDrops.bind(this)();
    }
    else {
        closeAllDrops.bind(this)(dropdown_item);
        this.setState(state => {
            return {
                [dropdown_item + '_dropdown']: !state[dropdown_item + '_dropdown']
            }
        })
    }
}

export const DropDown = ({label, item_selected, list_open, optionsList, select_item, dropdown_item, reference, tag}) => {
// export const DropDown = ({label, toggleOpen, item_selected, list_open, optionsList, select_item, dropdown_item, ref}) => {
    return (
        <div
            className='admin-consent_form-drop-down'
        >
            <label>{label}:</label>
            <div>
                <label
                    group='DROPDOWN_TAG'
                    onClick={() => function () {
                        return toggleOpen.bind(this)(dropdown_item);
                    }.bind(reference)()}
                >
                    {item_selected || 'Select...'}
                </label>
                <div
                    style={{
                        display: list_open ? 'grid' : 'none'
                    }}
                >
                    {
                        optionsList.sort().map(
                            item => (
                                <label
                                    key={'item-' + item}
                                    onClick={() => select_item(item, tag)}
                                    className={(item_selected === item ? 'admin-consent_form-drop-down-selected_exp' : '')}
                                >
                                    {item}
                                </label>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}
