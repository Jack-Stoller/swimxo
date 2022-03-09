import React, { useEffect, useState } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import SwitchSelector from "react-switch-selector";
import { idConverter } from '../../utils/firestore';
import BrowseCollection from '../browse/collection';
import Popup from '../popup';
import ClassTimeResult from '../results/classtime';
import SectionLink from '../sectionLink';
import ClassResult from './../results/class';

import './forms.css';

const AddEventForm = (props) => {

    const [defaultClassSnap] = useDocumentDataOnce(props.data?.class.withConverter(idConverter) ?? null);
    const [action, setAction] = useState(props.data?.action ?? 'enrolled');

    const [pickingClass, setPickingClass] = useState(false);
    const [selClass, setSelClass] = useState(null);


    useEffect(() => {
        if (defaultClassSnap)
            setSelClass(defaultClassSnap);

    }, [defaultClassSnap, props])


    const pickClass = (data) => {
        setSelClass(data);
        setPickingClass(false);
    }

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
            <input type="hidden" name="name" value={selClass?.class.name ?? '?'} onChange={() => {}} />


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
                    options={[
                        {
                            label: "Enrolled",
                            value: "enrolled"
                        },
                        {
                            label: "Waitlist",
                            value: "waitlist"
                        },
                        {
                            label: "Completed",
                            value: "completed"
                        },
                        {
                            label: "Promoted",
                            value: "promoted"
                        },
                        {
                            label: "Placed",
                            value: "placed"
                        }
                    ]}
                    initialSelectedIndex={[true, false].indexOf(props.data?.action ?? 0)}
                    onChange={setAction}
                    backgroundColor="#eceaf0"
                    selectedBackgroundColor="#3F00FF"
                />
                <input type="hidden" name="action" value={action} />


            </div>

            <label htmlFor="note">Notes</label>
            <textarea name="note" defaultValue={props.data?.note ?? ''} placeholder="Notes"></textarea>
        </>
    );
}
export default AddEventForm;