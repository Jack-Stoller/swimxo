import React, { useState } from 'react';
import SwitchSelector from "react-switch-selector";

import './forms.css';

const ParentForm = () => {

    const [primary_contact, set_primary_contact] = useState(true);
    const [preferred_contact_method, set_preferred_contact_method] = useState('text');

    return (
        <>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" placeholder="Name" required />

            <label htmlFor="email">Email (Optional)</label>
            <input type="email" name="email" placeholder="Email" />

            <label htmlFor="phone">Phone (Optional)</label>
            <input type="tel" name="phone" placeholder="Phone" />

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
                    onChange={set_primary_contact}
                    name="primary_contact"
                    backgroundColor="#eceaf0"
                    selectedBackgroundColor="#3F00FF"
                />
                <input type="hidden" data-type="bool" name="primary_contact" value={primary_contact} />
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
                    name="preferred_contact_method"
                    backgroundColor="#eceaf0"
                    selectedBackgroundColor="#3F00FF"
                />
                <input type="hidden" name="preferred_contact_method" value={preferred_contact_method} />
            </div>
        </>
    );
}
export default ParentForm;