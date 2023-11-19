import React, {useState} from "react";

export const Counters = ({counters = [], addNewCounter, modifyRunningCounter}) => {

    const [counterSelected, setCounterSelected] = useState(null);
    const [newCounter, setNewCounter] = useState('');
    const [enableAddButton, setEnableAddButton] = useState(false);
    const [alreadyExist, setAlreadyExist] = useState(false);

    if (counterSelected > counters.length || counterSelected === counters.length) {
        setCounterSelected(null);
        return <></>;
    }

    return (
        <div
            className='admin-settings-all-counters'
        >
            <label>Running counters:</label>
            <div
                className='admin-settings-all-counters-add'
            >
                <input
                    value={newCounter}
                    className={(alreadyExist ? ' highlight_error_input ' : '')}
                    onKeyDown={e => {
                        if (e.keyCode === 13 && enableAddButton){
                            setEnableAddButton(false);
                            setCounterSelected(null);
                            setAlreadyExist(false);
                            setNewCounter('');
                            addNewCounter(newCounter);
                        }
                    }}
                    onChange={e => {
                        let value = e.target.value;
                        setNewCounter(value);
                        let already_exist = false;
                        for (let i=0; i< counters.length; i++)
                            if (counters[i].running_name === value) {
                                already_exist = true;
                            }

                        if (value !== '' && !already_exist)
                            setEnableAddButton(true);
                        else
                            setEnableAddButton(false);

                        if (already_exist)
                            setAlreadyExist(true);
                        else
                        if (alreadyExist)
                            setAlreadyExist(false);
                    }}
                />
                <button
                    className={'btn-add ' + (!enableAddButton ? ' disabledElem ' : '')}
                    onClick={() => {
                        setEnableAddButton(false);
                        setCounterSelected(null);
                        setAlreadyExist(false);
                        setNewCounter('');
                        addNewCounter(newCounter);
                    }}
                >
                    Add
                </button>
            </div>

            <div
                className='admin-settings-all-counters-list'
            >
                <div
                    className='admin-settings-all-counters-list-name'
                    style={{
                        gridTemplateRows: 'repeat('+ counters.length +', max-content)'
                    }}
                >
                    {
                        counters.map(
                            (counter, index) => {
                                return (
                                    <label
                                        key={'countersSet_' + counter.running_name}
                                        onClick={() => setCounterSelected(index)}
                                        className={(counterSelected === index ? ' highlight_selected ' : '') + (newCounter === counter.running_name ? ' highlight_error_input ' : '')}
                                    >
                                        {counter.running_name}
                                    </label>
                                )
                            }
                        )
                    }
                </div>
                <div
                    className='admin-settings-all-counters-list-data'
                >
                    {
                        counterSelected !== null && (
                            <>
                                <div>
                                    <label>Counter:</label>
                                    <label>{counters[counterSelected].counter}</label>
                                </div>
                                <div>
                                    <button
                                        onClick={counters[counterSelected].counter === 0 ? () => {} : () => modifyRunningCounter(counters[counterSelected].running_name, 'reset')}
                                        className={counters[counterSelected].counter === 0 ? 'disabledElem' : ''}
                                    >Reset</button>
                                    <button
                                        onClick={counters[counterSelected].running_name === 'test' ? () => {} : () => modifyRunningCounter(counters[counterSelected].running_name, 'remove')}
                                        className={counters[counterSelected].running_name === 'test' ? 'disabledElem' : ''}
                                    >Remove</button>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
