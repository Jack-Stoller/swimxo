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

    const displayName = (props.subcollection?.name) ? props.subcollection.name ?? '' : props.name ?? '';

    useEffect(() => {

        const procSub = (p) => {
            let d = p[props.subcollection.key] ?? [];

            if (props.subcollection?.parentKey)
                d = d.map(s => {
                    return {...s, [props.subcollection.parentKey]: p}
                });

            if (props.subcollection?.indexKey)
                d = d.map((s, i) => {
                    return {...s, [props.subcollection.indexKey]: i}
                });

            return d;
        }

        let d = (data && props.subcollection?.key) ?
            data.reduce(
                (a, b) => {
                    return a.concat(procSub(b))},
                    []
                )
        : data;

        setFilteredData((d ?? []).filter(s => (s[props.searchableField] ?? '').toLowerCase().includes(searchStr.toLowerCase())));
    }, [data, searchStr, props]);


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
                    <Search value={searchStr} placeholder={'Search ' + displayName + '...'} onSearch={(e, s) => {e.preventDefault(); e.stopPropagation(); setSearchStr(s)}} />
                }

                <div className="results-and-add-btn">
                    <h3>Showing {filteredData && filteredData.length} {displayName} {(searchStr !== '') ? `that have "${searchStr}" it their ${props.searchableField}.` : '' }</h3>
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
                {filteredData && filteredData.map(dat => <props.component
                    data={dat}
                    key={(props.getId) ? props.getId(dat) : dat.id}
                    onClick={() => {
                        if (props.onSelect) props.onSelect(dat.id, dat);
                    }}
                    />)}
            </div>
        </>
    );
}

export default BrowseCollection;