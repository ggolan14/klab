import React, {useMemo} from "react";

const Button = ({class_name, label, callback, disabled = false}) => {
    return (
        <button
            className={class_name + (disabled ? ' disabledElem' : '')}
            onClick={disabled ? () => {} : callback}
            disabled={disabled}
        >
            {label}
        </button>
    )
};

const Select = ({value, label, options, callback, label_after, disabled}) => {
    return (
        <div>
            <Label label={label}/>
            <select
                onChange={disabled ? () => {} : e => callback(e.target.value)}
                value={value}
                className={(disabled ? ' disabledElem' : '')}
                style={{marginLeft: 10}}
            >
                {
                    options.map(
                        option => (
                            <option
                                value={typeof option === 'object' ? option.value : option}
                                key={'Select-'+label+ (typeof option === 'object' ? option.value : option)}
                            >
                                {typeof option === 'object' ? option.label : option}
                            </option>
                        )
                    )
                }
            </select>
            {label_after && <Label class_name_a='marginL5' label={label_after}/>}
        </div>
    )
};

const Label = ({class_name_a = '', class_name_b = '', label, second_label}) => {
    if (second_label)
        return (
            <div
                style={{
                    display: "grid",
                    gridAutoFlow: 'column',
                    columnGap: '0.5rem',
                    width: 'max-content'
                }}
            >
                <label
                    className={class_name_a}
                >{label}</label>
                <label
                    className={class_name_b}
                >{second_label}</label>
            </div>
        )
    return (
        <label className={class_name_a ? class_name_a : ''}>{label}</label>
    )
};

const Input = ({class_name, value, label, label_after, pattern, input_type, callback, step, min, disabled = false}) => {
    const display = useMemo(() => {
        if (pattern){
            if (pattern === 'MM:SS'){
                return (
                    <>
                        <input
                            style={{width: '5rem', marginLeft: 10}}
                            className={class_name ? class_name : ''}
                            step={1}
                            min={0}
                            type='number'
                            value={Math.floor(value / 60)}
                            onKeyDown={input_type === 'number' ? e => {
                                if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8 && e.keyCode !== 190 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 38 && e.keyCode !== 40)
                                    e.preventDefault();
                            } : () => {}}
                            onChange={e => {
                                let new_val = e.target.value;
                                if (new_val === '.') return;
                                new_val = Number(new_val);
                                let value_ = Number(value);
                                let split_minutes = Math.floor(value_ / 60);
                                let split_seconds = value_ - split_minutes*60;
                                split_minutes = new_val || 0;
                                new_val = split_minutes*60 + split_seconds;
                                callback(input_type === 'number' ? Number(new_val) : new_val);
                            }}
                        />
                        <label style={{fontWeight: 'bold', margin: '0 0 0 5px'}}>:</label>
                        <input
                            style={{width: '5rem', marginLeft: 10}}
                            className={class_name ? class_name : ''}
                            step={1}
                            min={0}
                            type='number'
                            value={(value - (Math.floor(value / 60)*60))}
                            onKeyDown={input_type === 'number' ? e => {
                                if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8 && e.keyCode !== 190)
                                    e.preventDefault();
                            } : () => {}}
                            onChange={e => {
                                let new_val = e.target.value;
                                if (new_val === '.') return;
                                new_val = Number(new_val);
                                let value_ = Number(value);
                                let split_minutes = Math.floor(value_ / 60);
                                // let split_seconds = value_ - split_minutes*60;
                                let split_seconds = new_val || 0;
                                new_val = split_minutes*60 + split_seconds;
                                callback(input_type === 'number' ? Number(new_val) : new_val);
                            }}
                        />
                    </>
                )
            }
        }
        else {
         return (
             <input
                 style={{marginLeft: 10}}
                 className={class_name ? class_name : '' + (disabled ? ' disabledElem' : '')}
                 step={step}
                 min={min}
                 type={input_type}
                 // type={input_type}
                 value={value}
                 onKeyDown={disabled? e => e.preventDefault() : (
                     input_type === 'number' ? e => {
                         if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8 && e.keyCode !== 190)
                             e.preventDefault();
                     } : () => {}
                 )}
                 onChange={disabled ? () => {} : (
                     e => {
                         let new_val = e.target.value;
                         if ((new_val[new_val.length-1] === '.' && new_val.indexOf('.') !== (new_val.length-1))){
                             return;
                         }
                         if (new_val === '.') new_val = '0.';
                         if (min !== undefined){
                             if (new_val === '')
                                 new_val = min;
                         }
                         callback(input_type === 'number' ? Number(new_val) : new_val);
                     }
                 )}
             />
         )
        }
    }, [input_type, pattern, value, callback, step, min, class_name, disabled]);

    return (
        <div
        >
            <Label
                label={label}
                style={{marginRight: 10}}
            />
            {display}
            {label_after && <Label class_name_a='marginL5' label={label_after}/>}
        </div>
    )
};

const ReturnElement = ({element}) => {
    if (!element.show) return <></>;
    switch (element.type){
        case 'Select':
            return (
                <Select
                    label={element.label}
                    disabled={element.disabled || false}
                    label_after={element.label_after}
                    options={element.options}
                    callback={element.callback}
                    value={element.value}
                />
            );
        case 'Button':
            return (
                <Button
                    class_name={element.class_name}
                    disabled={element.disabled}
                    label={element.label}
                    callback={element.callback}
                />
            )
        case 'Input':
            return (
                <Input
                    class_name={element.class_name}
                    disabled={element.disabled}
                    label={element.label}
                    label_after={element.label_after}
                    pattern={element.pattern}
                    callback={element.callback}
                    input_type={element.input_type}
                    value={element.value}
                    step={element.step}
                    min={element.min}
                />
            )
        case 'Label':
            return (
                <Label
                    label={element.label}
                    second_label={element.second_label}
                    class_name_a={element.class_name_a || ''}
                    class_name_b={element.class_name_b || ''}
                />
            )
        default: return <></>
    }
};

export const DivContainer = (props) => {

    return (
        <div
            className={props.className}
        >
            {
                props.elements && props.elements.map(
                    (element, element_index) => <ReturnElement key={'DivContainer_' + props.className + element.type + element.label + element_index} element={element}/>
                )
            }
            {props.children && props.children}
        </div>
    )
}
