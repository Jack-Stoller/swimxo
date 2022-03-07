import firebase from 'firebase/compat/app';
import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';
import { idConverter } from '../../utils/firestore';
import Search from '../search';
import Loading from './../loading';

import './collection.css';

const firestore = firebase.firestore();


const BrowseCollection = (props) => {

    const ref = firestore.collection(props.name).withConverter(idConverter);
    const query = ref.where('deleted', '!=', true).orderBy('deleted').limit(500);
    const [data, loading] = useCollectionData(query);

    const [searchStr, setSearchStr] = useState('');

    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {

        let d = (data && props.subcollection) ?
            data.reduce(
                (a, b) => 
                    a.concat(
                        (props.parentKeyName) ?
                        b[props.subcollection].map(s => {
                            return {...s, [props.parentKeyName]: b}
                        })
                        : b[props.subcollection]

                    ),
                    []
                )
        : data;

        setFilteredData((d ?? []).filter(s => s[props.searchableField].toLowerCase().includes(searchStr.toLowerCase())));
    }, [data, searchStr]);



    return (
        (loading) ?
            <Loading />
        :
        <>
            <header className="results-header">
                {
                    (props.search && !props.search) ?
                    <></>
                    :
                    <Search value={searchStr} placeholder={'Search ' + (props.name ?? '') + '...'} onSearch={(e, s) => {e.preventDefault(); setSearchStr(s)}} />
                }

                <div className="results-and-add-btn">
                    <h3>Showing {filteredData && filteredData.length} {props.name ?? ''} {(searchStr !== '') ? `that have "${searchStr}" it their ${props.searchableField}.` : '' }</h3>
                    {
                        (props.addUrl) ?
                        <Link to={props.addUrl}>
                            <button className="icon">+</button>
                        </Link>
                        :
                        <></>
                    }
                </div>
            </header>

            <div className="results">
                {filteredData && filteredData.map(dat => <props.component data={dat} key={dat} onClick={() => {
                    if (props.onSelect) props.onSelect(dat.id, dat);
                }} />)}
            </div>
        </>
    );
}

export default BrowseCollection;