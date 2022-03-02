import React, { Component } from 'react';
import SectionLink from '../sectionLink';
import './results.css';

class ParentResult extends Component {

    render() {
        return (
            <SectionLink>
                <div className="result">
                    <div className="name">{this.props.data.name ?? '??'}</div>
                    <div className="stats">
                        {
                            (this.props.data.primary_contact) ?
                            <div className="stat">Primary Contact</div>
                            :
                            <></>
                        }
                        {
                            (this.props.data.email) ?
                            <div className="stat">{this.props.data.email}</div>
                            :
                            <></>
                        }
                        {
                            (this.props.data.phone) ?
                            <div className="stat">{this.props.data.phone}</div>
                            :
                            <></>
                        }
                    </div>
                </div>
            </SectionLink>
        );
    }
}
export default ParentResult;