import React, { useEffect, useState } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import SwitchSelector from "react-switch-selector";
import BrowseCollection from '../browse/collection';
import Popup from '../popup';
import FamilyResult from '../results/family';
import SectionLink from '../sectionLink';

import './forms.css';

const ParentForm = (props) => {

    const [defaultFamilySnap] = useDocumentDataOnce(props.data?.family ?? null);
    const [primaryContact, setPrimaryContact] = useState(props.data?.primary_contact ?? true);
    const [preferredContactMethod, setPreferredContactMethod] = useState(props.data?.preferred_contact_method ?? 'text');

    const [pickingFamily, setPickingFamily] = useState(false);
    const [family, setFamily] = useState(null);

    useEffect(() => {
        if (defaultFamilySnap)
            setFamily({
                ...defaultFamilySnap,
                id: props.data?.family.id
            });

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
                data-ref-array="parents"
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
            <input type="text" name="name" placeholder="Name" defaultValue={props.data?.name ?? ''} required />

            <label htmlFor="email">Email (Optional)</label>
            <input type="email" name="email" defaultValue={props.data?.email ?? ''} placeholder="Email" />

            <label htmlFor="phone">Phone (Optional)</label>
            <input type="tel" name="phone" defaultValue={props.data?.phone ?? ''} placeholder="Phone" />

            <label htmlFor="primary_contact">Primary Contact</label>
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
                    initialSelectedIndex={[true, false].indexOf(props.data?.primary_contact ?? 0)}
                    onChange={setPrimaryContact}
                    name="primary_contact"
                    backgroundColor="#eceaf0"
                    selectedBackgroundColor="#3F00FF"
                />
                <input type="hidden" data-type="bool" name="primary_contact" value={primaryContact} />
            </div>


            <label htmlFor="preferred_contact_method">Preferred Contact Method</label>
            <div className="input-sized">
                <SwitchSelector
                    options={[
                        {
                            label: "Text",
                            value: "text"
                        },
                        {
                            label: "Email",
                            value: "email"
                        },
                        {
                            label: "Call",
                            value: "call"
                        }
                    ]}

                    initialSelectedIndex={['text', 'email', 'call'].indexOf(props.data?.preferred_contact_method ?? 0)}
                    onChange={setPreferredContactMethod}
                    name="preferred_contact_method"
                    backgroundColor="#eceaf0"
                    selectedBackgroundColor="#3F00FF"
                />
                <input type="hidden" name="preferred_contact_method" value={preferredContactMethod} />
            </div>
        </>
    );
}
export default ParentForm;