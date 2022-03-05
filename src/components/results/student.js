import React, { Component } from 'react';
import SectionLink from '../sectionLink';
import './results.css';

class StudentResult extends Component {
    render() {
        let ageDifMs = Date.now() - new Date(this.props.data.birthday?.seconds * 1000);
        let ageDate = new Date(ageDifMs); // miliseconds from epoch
        let age = Math.abs(ageDate.getUTCFullYear() - 1970);

        let latestClass = (this.props.data.history) ? this.props.data.history.reduce((a, b) =>
            a.date.seconds < b.date.seconds ? a : b
        ).name
        :
        'no class yet';

        return (
            <SectionLink onClick={(e) => {if (this.props.onClick) this.props.onClick(e)}}>
                <div className="result">
                    <div className="name">{this.props.data.name}</div>
                    <div className="stats">
                        <div className="stat">in {latestClass}</div>
                        <div className="stat">{age} years old</div>
                    </div>
                </div>
            </SectionLink>
        );
    }
}
export default StudentResult;