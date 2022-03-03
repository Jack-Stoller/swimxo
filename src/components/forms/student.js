import React, { useState } from 'react';
import SwitchSelector from "react-switch-selector";
import BrowseCollection from '../browse/collection';
import Popup from '../popup';
import SectionLink from '../sectionLink';
import FamilyResult from './../results/family';

import './forms.css';

const StudentForm = () => {

    const [exact_birthday, set_exact_birthday] = useState(true);

    const [pickingFamily, setPickingFamily] = useState(false);
    const [family, setFamily] = useState(null);

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
                /*
                */
               
               (pickingFamily) ?
               <Popup onClose={() => {setPickingFamily(false)}}>
                    <h2>Pick a family</h2>
                    <BrowseCollection
                        name="families"
                        component={FamilyResult}
                        addUrl="/add/family"
                        orderBy="lastname"
                        onSelect={(_, data) => { pickFamily(data); }}
                    />
                </Popup>
                :
                <></>
            }

            <label htmlFor="name">Name</label>
            <input type="text" name="name" placeholder="Name" required />

            <label htmlFor="birthday">Birthday</label>
            <input type="date" name="birthday" required />
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
                    onChange={set_exact_birthday}
                    backgroundColor="#eceaf0"
                    selectedBackgroundColor="#3F00FF"
                />
                <input type="hidden" data-type="bool" name="exact_birthday" value={exact_birthday} />
            </div>
        </>
    );
}
export default StudentForm;