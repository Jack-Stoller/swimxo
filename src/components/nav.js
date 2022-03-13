import firebase from './../firebase';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as DashboardIcon } from './../assets/icons/dashboard.svg';
import { ReactComponent as BrowseIcon } from './../assets/icons/browse.svg';
import { ReactComponent as FamilyIcon } from './../assets/icons/family.svg';
import { ReactComponent as StudentIcon } from './../assets/icons/student.svg';
import { ReactComponent as ClassIcon } from './../assets/icons/class.svg';
import { ReactComponent as UserIcon } from './../assets/icons/user.svg';
import { ReactComponent as ContactIcon } from './../assets/icons/contact.svg';
import { ReactComponent as ScheduleIcon } from './../assets/icons/schedule.svg';

import './nav.css';
import { useAuthState } from 'react-firebase-hooks/auth';

const auth = firebase.auth();

const Nav = () => {

    let [curPage, setCurPage] = useState(0);

    const [user] = useAuthState(auth);

    return (
        <nav>
            <ul>
                <li className={curPage === 5 ? 'active' : ''}>
                    <Link to="/me" onClick={() => {setCurPage(5)}}>
                        <UserIcon />
                        <span>{user.displayName}</span>
                    </Link>
                </li>
                <li className={curPage === 0 ? 'active' : ''}>
                    <Link to="/" onClick={() => {setCurPage(0)}}>
                        <DashboardIcon />
                        <span>Dashboard</span>
                    </Link>
                </li>
                <li className={curPage === 1 ? 'active' : ''}>
                    <Link to="/browse" onClick={() => {setCurPage(1)}}>
                        <BrowseIcon />
                        <span>Browse</span>
                    </Link>
                </li>
                <li className={curPage === 2 ? 'active' : ''}>
                    <Link to="/browse/families" onClick={() => {setCurPage(2)}}>
                        <FamilyIcon />
                        <span>Families</span>
                    </Link>
                </li>
                <li className={curPage === 3 ? 'active' : ''}>
                    <Link to="/browse/students" onClick={() => {setCurPage(3)}}>
                        <StudentIcon />
                        <span>Students</span>
                    </Link>
                </li>
                <li className={curPage === 4 ? 'active' : ''}>
                    <Link to="/browse/classes" onClick={() => {setCurPage(4)}}>
                        <ClassIcon />
                        <span>Classes</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;