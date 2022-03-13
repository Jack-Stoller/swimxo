import { useState } from 'react';
import './multiselect.css';

const MultiSelect = (props) => {

    const [val, setVal] = useState(props.defaultValue ?? []);

    const toggleVal = (qVal) => {
        let i = val.indexOf(qVal);
        if (i === -1) val.push(qVal);
        else val.splice(i, 1);
        setVal([...val]);
        if (props.onChange) props.onChange(val);
    }

    return (
        <>
            <div className="mutliselect-wrapper">
                {
                    (props.options ?? []).map((o, i) =>
                        <div key={i} className={(val.indexOf(o.value) === -1) ? 'multiselect-option' : 'multiselect-option active'} onClick={() => {toggleVal(o.value)}}>
                            {o.label ?? o.value ?? ''}
                        </div>
                    )
                }
            </div>
        </>
    );
}
export default MultiSelect;