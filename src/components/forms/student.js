import React, { useState } from 'react';
import SwitchSelector from "react-switch-selector";
import SectionLink from '../sectionLink';

import './forms.css';

const StudentForm = () => {

    const [exact_birthday, set_exact_birthday] = useState(true);

    return (
        <>
            <label>Family</label>
            <SectionLink>
                Pick Family
            </SectionLink>

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