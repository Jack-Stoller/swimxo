import { useState } from 'react';
import { ReactComponent as BrowseIcon } from './../assets/icons/browse.svg';
import './dashboard.css';

const Dashboard = (props) => {

    const [val, setVal] = useState(props.value ?? '');

    return (
        <>
            <h1>Dashboard</h1>
        </>
    );
}

export default Dashboard