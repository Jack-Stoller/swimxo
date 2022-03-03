import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import AddDoc from "../components/addDoc";
import Browse from '../components/browse';
import ClassForm from "../components/forms/class";
import FamilyForm from "../components/forms/family";
import ParentForm from "../components/forms/parent";
import StudentForm from "../components/forms/student";
import Nav from './../components/nav';

import './Portal.css'

function Portal() {
    return (
        <Router>
            <section className="app">
                <Nav />
                <section className="content-scroll-wrapper">
                    <section className="content">
                        <Routes>
                            <Route path="/browse/*" element={<Browse />}></Route>
                            <Route path="/contact/*" element={<h1>Contact</h1>}></Route>
                            <Route path="/schedule/*" element={<h1>Schedule</h1>}></Route>
                            <Route path="/settings/*" element={<h1>Settings</h1>}></Route>

                            <Route path="/add/class" element={
                                <AddDoc
                                    singleName="class"
                                    sys_name="classes"
                                    form={ClassForm}
                                />
                            } />
                            <Route path="/add/family" element={
                                <AddDoc
                                    singleName="family"
                                    sys_name="families"
                                    form={FamilyForm}
                                />
                            } />
                            <Route path="/add/parent" element={
                                <AddDoc
                                    singleName="parent"
                                    sys_name="parents"
                                    form={ParentForm}
                                />
                            } />
                            <Route path="/add/student" element={
                                <AddDoc
                                    singleName="student"
                                    sys_name="students"
                                    form={StudentForm}
                                />
                            } />

                            <Route path="/" element={<h1>Overview</h1>}></Route>
                        </Routes>
                    </section>
                </section>
            </section>
        </Router>
    );
}

export default Portal;
