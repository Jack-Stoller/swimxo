import React, { useState } from 'react';

import './class.css'
import './forms.css';

const ClassForm = (props) => {

    const [skills, setSkills] = useState((props.data?.skills ?? []).map(s => {
        return {
            key: s.key ?? '',
            name: s.name ?? '',
            description: s.description ?? '',
            goal: s.goal ?? '',
            id: Math.random()
        }
    }));

    return (
        <>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" placeholder="Name" defaultValue={props.data?.name ?? ''} required />

            <label htmlFor="description">Description</label>
            <textarea name="description" placeholder="Description" rows="3" defaultValue={props.data?.description ?? ''} required ></textarea>

            <label>Skills</label>
            <div className="skills">
                {
                    skills.map((s, i) =>
                        <div className="skill" key={s.id}>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Skill Name"
                                value={s.name}
                                onChange={(e) => {
                                    let a = [...skills], v = e.target.value;
                                    a[i].key = v.replaceAll(' ', '_').toLowerCase();
                                    a[i].name = v;
                                    setSkills(a)}
                                }
                                required
                                ref={(c) => {
                                    if (skills.filter(sk => sk.key === s.key).length > 1)
                                        c?.setCustomValidity('Must be unique skill name')
                                }}
                            />
                            <input className="form-input" type="number" placeholder="Goal" value={s.goal} onChange={(e) => {
                                skills[i].goal = e.target.value;
                                setSkills([...skills])}
                            }
                            onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                            required />
                            <textarea className="form-input" placeholder="Skill Description" rows="6" value={s.description} onChange={(e) => {
                                skills[i].description = e.target.value;
                                setSkills([...skills])}
                            }></textarea>
                            <button className="icon" type="button" onClick={() => {
                                let a = [...skills];
                                a.splice(i, 1);
                                setSkills(a)
                            }}>-</button>
                        </div>
                    )
                }
                <button className="icon" type="button" onClick={() => {
                    //
                    //    alert('')
                    setSkills([...skills, {key: '', name: '', goal: '', description: '', focus: false, id: Math.random()}])
                }}>+</button>
            </div>
            <input type="hidden" name="skills" data-type="json" value={JSON.stringify(skills.map(v => {return {key: v.key, goal: parseInt(v.goal), description: v.description, name: v.name}}))} />

            <input type="hidden" name="skill_level" data-type="number" defaultValue={0} />

        </>
    );
}
export default ClassForm;