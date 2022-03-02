import React, { Component } from 'react';
import { ReactComponent as BrowseIcon } from './../assets/icons/browse.svg';
import './search.css';

class Search extends Component {
    render() {
        return (
            <form>
                <div className="search-input">
                    <input placeholder='Search everywhere...'/>
                    <button>
                        <BrowseIcon />
                    </button>
                </div>
            </form>
        );
    }
}

export default Search;