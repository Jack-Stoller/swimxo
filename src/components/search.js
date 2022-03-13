import { useState } from 'react';
import { ReactComponent as BrowseIcon } from './../assets/icons/browse.svg';
import './search.css';

const Search = (props) => {

    const [val, setVal] = useState(props.value ?? '');

    return (
        <form onSubmit={(e) => {if (props.onSearch) props.onSearch(e, val);}}>
            <div className="search-input">
                <input type="search" placeholder={props.placeholder ?? 'Search...'} value={val} onChange={(e) => {setVal(e.target.value)}} />
                <button className="icon">
                    <BrowseIcon />
                </button>
            </div>
        </form>
    );
}

export default Search;