import React, { Component } from 'react';
import SectionLink from '../sectionLink';
import './results.css';

class FamilyResult extends Component {
    render() {



        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',

            // These options are needed to round to whole numbers if that's what you want.
            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });

        let owes = formatter.format(this.props.data.transactions?.map(p => p.amount).reduce((a, b) => a + b, 0));

        if (owes === '$NaN') owes = '$0';

        return (
            <SectionLink onClick={(e) => {if (this.props.onClick) this.props.onClick(e)}}>
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