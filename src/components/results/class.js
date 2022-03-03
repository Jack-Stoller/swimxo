import React, { Component } from 'react';
import SectionLink from '../sectionLink';
import './results.css';

class ClassResult extends Component {
    render() {
        return (
            <SectionLink onClick={(e) => {if (this.props.onClick) this.props.onClick(e)}}>
                <div className="result">
                    <div className="name">{this.props.data.name ?? '??'}</div>
                    <div className="description">{this.props.data.description ?? '??'}</div>
                </div>
            </SectionLink>
        );
    }
}
export default ClassResult;