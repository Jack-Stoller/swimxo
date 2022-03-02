import React, { Component } from 'react';
import SectionLink from '../sectionLink';
import './results.css';

class FamilyResult extends Component {
    render() {

        let owes = (Math.round(this.props.data.payments?.map(p => p.amount).reduce((a, b) => a + b, 0) * 100) / 100).toFixed(2);

        if (owes === 'NaN') owes = '$0';
        else if (owes.startsWith('-')) owes = '-$' + owes.substring(1, owes.length)
        else owes = '$' + owes;

        return (
            <SectionLink>
                <div className="result">
                    <div className="name">{this.props.data.lastname ?? '??'}</div>
                    <div className="stats">
                        <div className="stat">{this.props.data.students?.length ?? 0} Students</div>
                        <div className="stat">Owes {owes}</div>
                    </div>
                </div>
            </SectionLink>
        );
    }
}
export default FamilyResult;