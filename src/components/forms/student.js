import React, { useEffect, useState } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import SwitchSelector from "react-switch-selector";
import { idConverter } from '../../utils/firestore';
import BrowseCollection from '../browse/collection';
import Popup from '../popup';
import SectionLink from '../sectionLink';
import FamilyResult from './../results/family';

import './forms.css';

const StudentForm = (props) => {

    const [defaultFamilySnap] = useDocumentDataOnce(props.data?.family.withConverter(idConverter) ?? null);
    const [exactBirthday, setExactBirthday] = useState(props.data?.exact_birthday ?? true);

    const [pickingFamily, setPickingFamily] = useState(false);
    const [family, setFamily] = useState(null);


    useEffect(() => {
        setFamily(defaultFamilySnap);
    }, [defaultFamilySnap, props])


    const pickFamily = (data) => {
        setFamily(data);
        setPickingFamily(false);
    }

    return (
        <>
            <label>Family</label>
            <SectionLink onClick={() => {setPickingFamily(true)}}>
                {
                    (family == null) ?
                        'Pick Family'
                    :
                    <>
                        <strong>{family.lastname}</strong>
                        <span>&nbsp;(Tap to change)</span>
                    </>
                }
            </SectionLink>
            <input type="text"
                style={{position: 'absolute', opacity: 0, height: '1px', width: '100%', padding: 0, margin: 0}}
                onFocus={(e) => {e.target.previousElementSibling.focus()}} name="family"
                value={family ? '/families/' + family.id : ''}
                onClick={() => {setPickingFamily(true)}}
                onChange={() => {}}
                data-type="reference"
                data-ref-array="students"
                required
            />


            {
               (pickingFamily) ?
               <Popup onClose={() => {setPickingFamily(false)}}>
                    <h2>Pick a family</h2>
                    <BrowseCollection
                        name="families"
                        component={FamilyResult}
                        addUrl="/add/family"
                        orderByField="lastname"
                        searchableField="lastname"
                        onSelect={(_, data) => { pickFamily(data); }}
                    />
                </Popup>
                :
                <></>
            }

            <label htmlFor="name">Name</label>
            <input type="text" name="name" defaultValue={props.data?.name ?? ''} placeholder="Name" required />

            <label htmlFor="birthday">Birthday</label>
            <input type="date" name="birthday" defaultValue={(props.data?.birthday?.toDate()) ? `${props.data?.birthday?.toDate().getFullYear()}-${props.data?.birthday?.toDate().getMonth() + 1}-${props.data?.birthday?.toDate().getDate()}` : ''} required />
            <div className="input-sized">
                <SwitchSelector
                    options={[
                        {
                            label: "Exact",
                            value: true
                        },
                        {
                            label: "Guess",
                            value: false
                        }
                    ]}
                    initialSelectedIndex={[true, false].indexOf(props.data?.exact_birthday ?? 0)}
                    onChange={setExactBirthday}
                    backgroundColor="#eceaf0"
                    selectedBackgroundColor="#3F00FF"
                />
                <input type="hidden" data-type="bool" name="exact_birthday" value={exactBirthday} />
            </div>
        </>
    );
}
export default StudentForm;