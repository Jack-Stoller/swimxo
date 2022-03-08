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
                        <span>&nbsp;(Tap to change)</span>
                    </>
                }
            </SectionLink>
            <input type="text"
                style={{position: 'absolute', opacity: 0, height: '1px', width: '100%', padding: 0, margin: 0}}
                onFocus={(e) => {e.target.previousElementSibling.focus()}} name="class"
                value={selClass ? '/classes/' + selClass.id : ''}
                onClick={() => {setPickingClass(true)}}
                onChange={() => {}}
                data-type="reference"
                required
            />


            {
               (pickingClass) ?
               <Popup onClose={() => {setPickingClass(false)}}>
                    <h2>Pick a class time</h2>
                    <BrowseCollection
                        name="classes"
                        component={ClassTimeResult}
                        addUrl="/add/class"
                        orderByField="name"
                        searchableField="name"
                        subcollection="times"
                        subcollectionName="class time"
                        subcollectionGetKey={(d) => [d.class.id, d.times.indexOf(d)]}
                        parentKeyName="class"
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
                            label: "Prompted",
                            value: "prompted"
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
                <input type="hidden" data-type="bool" name="action" value={action} />


            </div>

            <label htmlFor="note">Notes</label>
            <textarea name="note" defaultValue={props.data?.note ?? ''} placeholder="Notes" required></textarea>
        </>
    );
}
export default AddEventForm;