import React, { Component } from 'react';

import './forms.css';

class ClassForm extends Component {

    render() {
        return (
            <>
                <label htmlFor="name">Name</label>
                <input type="text" name="name" placeholder="Name" required />

                <label htmlFor="description">Description</label>
                <textarea name="description" placeholder="Description" required ></textarea>

                <label htmlFor="skill_level">Skill Level</label>
                <input type="number" name="skill_level" placeholder="Skill Level" required />
            </>
        );
    }
}
export default ClassForm;