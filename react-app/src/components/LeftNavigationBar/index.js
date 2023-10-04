import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as friendActions from '../../store/friend';
import OpenModalButton from '../OpenModalButton';
import AddFriendModal from '../AddFriendModal';
import './LeftNavigation.css';
import logo from './splitsmart-logo.png';

function LeftNavigationBar() {
    const dispatch = useDispatch();
    const activeFriends = useSelector((state) => Object.values(state.friend.friendships));
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(friendActions.fetchFriendships())
            .then(() => setIsLoaded(true));
    }, [dispatch]);

    return (
        <div className="left-nav-bar">
            <NavLink to="/dashboard" activeClassName="active-nav-link"><img className="dashboard-logo" src={logo} alt="dashboard-logo" />Dashboard</NavLink>
            <NavLink to="/all" activeClassName="active-nav-link"><i className="fas fa-solid fa-list" />All Expenses</NavLink>
            <div className="friends-list-header">FRIENDS
                <OpenModalButton
                    modalComponent={<AddFriendModal />}
                    buttonText="+ add"
                />
            </div>
            {isLoaded && activeFriends?.map((friendObj) => (
                <NavLink key={friendObj.id} to={`/friends/${friendObj.id}`} activeClassName="active-nav-link"><i className="fas fa-solid fa-user" />{friendObj.friend.name}</NavLink>
            ))}
        </div>
    );
}

export default LeftNavigationBar;
