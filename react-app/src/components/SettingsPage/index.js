import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from '../../store/session';
import TopNavigationBar from '../TopNavigationBar';
import "./Settings.css";

function SettingsPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [name, setName] = useState(sessionUser.name);
    const [imgUrl, setImgUrl] = useState(sessionUser.image_url);
    const [password, setPassword] = useState("");
    const [isChanged, setIsChanged] = useState(false);
    const [errors, setErrors] = useState([]);

    if (!sessionUser) return <Redirect to="/" />;

    const handleEdit = async (e) => {
        e.preventDefault();
        const form = document.getElementById("settings-form");
        const formData = new FormData(form);
        formData.append('is_changed', isChanged);
        if (name.split(" ")[0]?.length > 0) formData.append('first_name', name.split(" ")[0]);
        if (name.split(" ")[1]?.length > 0) formData.append('last_name', name.split(" ")[1]);
        const data = await dispatch(sessionActions.editProfile(sessionUser.id, formData));
        if (data) {
            setErrors(data);
        } else {
            setErrors([]);
        }
    };

    const displayFile = (e) => {
        e.preventDefault();
        const img = document.getElementById("settings-preview");
        img.src = URL.createObjectURL(e.target.files[0]);
    };

    const removeFile = (e) => {
        e.preventDefault();
        const img = document.getElementById("settings-preview");
        img.src = "https://splitsmart-aa-ai.s3.us-west-1.amazonaws.com/default.png";
        const upload = document.getElementById("settings-upload");
        upload.value = "";
    };

    return (
        <>
            <TopNavigationBar />
            <div id="settings-container">
                <h1>Your Account</h1>
                <form id="settings-form" onSubmit={handleEdit}>
                    <div id="settings-image">
                        <div>
                            <img
                                id="settings-preview"
                                src={sessionUser.image_url}
                                onError={(e) => {
                                    e.target.src = "https://splitsmart-aa-ai.s3.us-west-1.amazonaws.com/default.png";
                                    e.onerror = null;
                                }}
                                alt="settings-preview"
                            />
                            <button
                                id="settings-preview-remove"
                                className="delete"
                                onClick={async (e) => {
                                    await setIsChanged(true);
                                    await setImgUrl(null);
                                    await removeFile(e);
                                }}
                            >&#x2715;</button>
                        </div>
                        <div>
                            <label>Your avatar</label>
                            <input
                                id="settings-upload"
                                type="file"
                                name="image_url"
                                accept=".png, .jpg, .jpeg"
                                onChange={async (e) => {
                                    await setIsChanged(true);
                                    await setImgUrl(e.target.files[0]);
                                    await displayFile(e);
                                }}
                            />
                        </div>
                    </div>
                    <div id="settings-inputs">
                        {errors.length > 0 && <ul className="error-message-container">
                            {errors.map((error, idx) => (
                                <li key={idx} className="error-msg">{error}</li>
                            ))}
                        </ul>}
                        <label>Your name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label>Your email address</label>
                        <input
                            type="text"
                            value={sessionUser.email}
                            disabled
                        />
                        <label>Your phone number</label>
                        <input
                            type="text"
                            value={sessionUser.phone_number || "None"}
                            disabled
                        />
                        <label>Enter Password to Confirm Changes</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button className="accent" type="submit">Save</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default SettingsPage;
