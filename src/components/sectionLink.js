import React, { Component } from 'react';
import { ReactComponent as ArrowIcon } from './../assets/icons/arrow.svg';
import { Link } from 'react-router-dom';
import './sectionLink.css';

class SectionLink extends Component {
    render() {
        return (
            (this.props.to) ?
            <Link to={this.props.to}>
                <section className="section-link">
                    <div>{this.props.children}</div>
                    <ArrowIcon />
                </section>
            </Link>
            :
            <section className="section-link" onClick={() => {
                if (this.props.onClick) this.props.onClick();
            }}>
                <div>{this.props.children}</div>
                <ArrowIcon />
            </section>
        );
    }
}

export default SectionLink;