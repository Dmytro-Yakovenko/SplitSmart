import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useParams, useHistory } from "react-router";
import * as friendActions from '../../store/friend';
import TopNavigationBar from '../TopNavigationBar';
import "./EditFriend.css";


function EditFriendPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector((state) => state.session.user);
    const friendship = useSelector((state) => state.friend.selectedFriendship);
    const [isFriendshipLoaded, setIsFriendshipLoaded] = useState(false);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(friendActions.fetchFriendshipById(id))
                .then(() => setIsFriendshipLoaded(true));
        };
        fetchData();
    }, [dispatch, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await dispatch(friendActions.updateFriendship(id));
        if (data) {
            setErrors(data);
        } else {
            history.push('/dashboard');
        }
    };

    if (!sessionUser) return <Redirect to="/" />;

    return (isFriendshipLoaded &&
        <>
            <TopNavigationBar />
            <form className="edit-friend-form" onSubmit={handleSubmit}>
                <h1>Edit friend info</h1>
                {errors.length > 0 && <ul>
                    {errors.map((error, idx) => (
                        <li key={idx} className="error-msg">{error}</li>
                    ))}
                </ul>}
                <div>{friendship.friend.email}</div>
                {friendship.bill != 0 &&
                    <div className="edit-friend-text">
                        Some of your expenses with this person also involve other third parties.
                        <span style={{ fontWeight: "bolder" }}> As a result, deleting this friend will not delete those expenses, and they will still be visible from the "All expenses" screen. </span>
                        However, this friend should be removed from your list of friends successfully.
                    </div>
                }
                <div className="edit-friend-buttons">
                    <button onClick={() => history.push(`/friends/${id}`)}>Cancel</button>
                    <button type="submit">Delete this friend</button>
                </div>
            </form>
        </>
    );
}

export default EditFriendPage;
