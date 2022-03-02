import React, { Component } from 'react';

import './forms.css';

class FamilyForm extends Component {

    render() {
        return (
            <>
                <label htmlFor="lastname">Last Name</label>
                <input type="text" name="lastname" placeholder="Last Name" required />

                <label htmlFor="priority">Order / Priority (Optional)</label>
                <input type="number" name="priority" placeholder="Order / Priority"/>
            </>
        );
    }
}
export default FamilyForm;