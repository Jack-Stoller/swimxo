import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { ReactComponent as BrowseIcon } from './../assets/icons/browse.svg';
import { ReactComponent as ContactIcon } from './../assets/icons/contact.svg';
import { ReactComponent as ScheduleIcon } from './../assets/icons/schedule.svg';

import './nav.css';

class Nav extends Component {
    render() {
        return (
            <nav>
                <ul>
                    <li>
                        <Link to="/">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/browse">
                            <BrowseIcon />Browse
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact">
                            <ContactIcon />Contact
                        </Link>
                    </li>
                    <li>
                        <Link to="/schedule">
                            <ScheduleIcon />Schedule
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Nav;