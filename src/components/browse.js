import React, { Component, useEffect } from 'react';
import './browse.css';
import FamilyResult from './results/family';
import ParentResult from './results/parent';
import StudentResult from './results/student';
import ClassResult from './results/class';
import Search from './search';
import SectionLink from './sectionLink';
import BrowseCollection from './browse/collection';
import { Route, Routes, useNavigate } from 'react-router-dom';


const Browse = () => {

    const nav = useNavigate();

    return (
        <section>
            <h1>Search</h1>
            <Routes>
                <Route path={`/`} element={<BrowseOptions />} />

                <Route path={`/families`} element={
                    <BrowseCollection
                        name="families"
                        component={FamilyResult}
                        addUrl="/add/family"
                        orderByField="lastname"
                        searchableField="lastname"
                        onSelect={(id) => { nav('/family/' + id) }}
                    />
                } />
                <Route path={`/students`} element={
                    <BrowseCollection
                        name="students"
                        component={StudentResult}
                        addUrl="/add/student"
                        orderByField="name"
                        searchableField="name"
                        onSelect={(id) => { nav('/student/' + id) }}
                    />
                } />
                <Route path={`/parents`} element={
                    <BrowseCollection
                        name="parents"
                        component={ParentResult}
                        addUrl="/add/parent"
                        orderByField="name"
                        searchableField="name"
                        onSelect={(id) => { nav('/parent/' + id) }}
                    />
                } />
                <Route path={`/classes`} element={
                    <BrowseCollection
                        name="classes"
                        component={ClassResult}
                        addUrl="/add/class"
                        orderByField="name"
                        searchableField="name"
                        onSelect={(id) => { nav('/class/' + id) }}
                    />
                } />

                <Route path={`:query`} element={<BrowseSearch />} />
                <Route path={`/search/:query`} element={<BrowseSearch />} />
            </Routes>

        </section>
    );
}

class BrowseSearch extends Component {
    render() {
        return (
            <h3>Searching</h3>
        );
    }
}



class BrowseOptions extends Component {
    render() {
        return (
            <>
                <Search placeholder="Search Everywhere... (NOT WORKING YET)" />
                <h3>Or view all...</h3>
                <div className="browse-locations">
                    <SectionLink to="/browse/families">Families</SectionLink>
                    <SectionLink to="/browse/students">Students</SectionLink>
                    <SectionLink to="/browse/parents">Parents</SectionLink>
                    <SectionLink to="/browse/classes">Classes</SectionLink>
                </div>
            </>
        );
    }
}

export default Browse;