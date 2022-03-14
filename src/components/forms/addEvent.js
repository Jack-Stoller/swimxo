import React, { useEffect, useState } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import SwitchSelector from "react-switch-selector";
import { idConverter } from '../../utils/firestore';
import BrowseCollection from '../browse/collection';
import Popup from '../popup';
import ClassTimeResult from '../results/classtime';
import SectionLink from '../sectionLink';

import './forms.css';

const AddEventForm = (props) => {

    const [defaultClassSnap] = useDocumentDataOnce(props.data?.class.withConverter(idConverter) ?? null);
    const [action, setAction] = useState(props.data?.action ?? 'enrolled');
    const [shouldCharge, setShouldCharge] = useState(props.data?.shouldCharge ?? false);

    const [pickingClass, setPickingClass] = useState(false);
    const [selClass, setSelClass] = useState(null);

    const fromLastAction = {
        waitlist: ['enrolled', 'moved'],
        moved: ['enrolled', 'moved'],
        enrolled: ['complete', 'moved', 'unenrolled'],
        complete: ['waitlist', 'enroll', 'moved'],
        unenrolled: ['waitlist', 'enrolled', 'moved'],
        _: ['waitlist', 'enrolled']
    }


    useEffect(() => {
        if (defaultClassSnap)
            setSelClass(defaultClassSnap);

    }, [defaultClassSnap, props]);

    const capFirstLetter = (word) => {
        return word.substring(0, 1).toUpperCase() + word.substring(1, word.length).toLowerCase();
    }

    console.log(props?.lastAction, (fromLastAction[props?.lastAction || null] ?? []) );


    const pickClass = (data) => {
        setSelClass(data);
        setPickingClass(false);
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    return (
        <>
            <label>Class Time</label>
            <SectionLink onClick={() => {setPickingClass(true)}}>
                {
                    (selClass == null) ?
                        'Pick Class Time'
                    :
                    <>
                        <strong>{selClass.name}</strong>
                        <span>&nbsp;from <strong>{selClass.class.name}</strong> (Tap to change)</span>
                    </>
                }
            </SectionLink>
            <input type="text"
                style={{position: 'absolute', opacity: 0, height: '1px', width: '100%', padding: 0, margin: 0}}
                onFocus={(e) => {e.target.previousElementSibling.focus()}} name="class"
                value={selClass ? '/classes/' + selClass.class.id : ''}
                onClick={() => {setPickingClass(true)}}
                onChange={() => {}}
                data-type="reference"
                data-ref-array={`${selClass?.index}.${action}`}
                required
            />

            <input type="hidden" name="time" data-type="int" value={selClass?.index ?? -1} onChange={() => {}} />
            <input type="hidden" name="name" value={selClass?.class?.name ?? '?'} onChange={() => {}} />


            {
               (pickingClass) ?
               <Popup onClose={() => {setPickingClass(false)}}>
                    <h2>Pick a class time</h2>
                    <BrowseCollection
                        name="classes"
                        component={ClassTimeResult}
                        orderByField="name"
                        searchableField="name"
                        subcollection={{
                            name: "class time",
                            key: "times",
                            parentKey: "class",
                            indexKey: "index",
                        }}
                        getId={(d) => d.class?.id?.toString() + d.index?.toString()}
                        onSelect={(_, data) => { pickClass(data); }}
                    />
                </Popup>
                :
                <></>
            }

            <label>Action</label>
            <div className="input-sized">
                <SwitchSelector
                    options={(fromLastAction[props?.lastAction] ?? props?.lastAction._).map(a => ({label: capFirstLetter(a), value: a}))}
                    initialSelectedIndex={(fromLastAction[props?.lastAction] ?? props?.lastAction._).indexOf(action)}
                    onChange={setAction}
                    backgroundColor="#eceaf0"
                    selectedBackgroundColor="#3F00FF"
                />
                <input type="hidden" name="action" value={action} />
            </div>

            <label>Charge {selClass ? <strong>{formatter.format(selClass.cost)}</strong> : ''} for class?</label>
            <div className="input-sized">
                <SwitchSelector
                    options={[
                        {
                            label: "Yes",
                            value: true
                        },
                        {
                            label: "No",
                            value: false
                        }
                    ]}
                    initialSelectedIndex={[true, false].indexOf(shouldCharge)}
                    onChange={setShouldCharge}
                    backgroundColor="#eceaf0"
                    selectedBackgroundColor="#3F00FF"
                />
                <input type="hidden" data-type="bool" name="shouldCharge" value={shouldCharge} />
            </div>

            <input type="hidden" data-type="number" name="classCost" value={selClass?.cost ?? ''} />
            <input type="hidden" name="className" value={selClass?.class?.name ?? ''} />
            <input type="hidden" name="timeName" value={selClass?.name ?? ''} />

            <label htmlFor="note">Notes</label>
            <textarea name="note" defaultValue={props.data?.note ?? ''} placeholder="Notes"></textarea>
        </>
    );
}
export default AddEventForm;