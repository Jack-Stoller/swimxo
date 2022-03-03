import firebase from 'firebase/compat/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';
import Loading from './../loading';

const firestore = firebase.firestore();


const BrowseCollection = (props) => {
    const ref = firestore.collection(props.name).withConverter(idConverter);
    const query = ref.orderBy(props.orderBy).limit(250);
    const [data, loading] = useCollectionData(query);

    return (
        (loading) ?
            <Loading />
        :
        <>
            <header className="results-header">
                <h3>Showing {data && data.length} {props.name ?? ''}</h3>
                {
                    (props.addUrl) ?
                    <Link to={props.addUrl}>
                        <button className="add-btn">+</button>
                    </Link>
                    :
                    <></>
                }
            </header>

            <div className="results">
                {data && data.map(dat => <props.component data={dat} key={dat.id} onClick={() => {
                    if (props.onSelect) props.onSelect(dat.id, dat);
                }} />)}
            </div>
        </>
    );
}


const idConverter = {
    toFirestore: (data) => {
        delete data.id;
        return data;
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            ...data
        };
    },
};

export default BrowseCollection;