import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import * as expenseActions from '../../store/expense';
import './RightSummary.css';

function formatBalance(amount) {
    const balance = amount[0] === '-' ? amount.substring(1) : amount;
    return "$" + String(Number(balance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
};

function RightSummaryBar() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const friendships = useSelector(state => Object.values(state.friend.friendships));
    const balance = useSelector(state => state.expense.summary.balance);

    const friendship = friendships.filter(friendship => friendship.id == id)[0];

    useEffect(() => {
        dispatch(expenseActions.getSummary());
    }, [dispatch]);

    if (location.pathname === '/dashboard') {
        return <></>;
    } else if (location.pathname === '/all') {
        return (
            <div className="right-summ-bar">
                <div className="right-summ-balance">
                    <div>YOUR TOTAL BALANCE</div>
                    {balance < 0 && <div className="teal-amount">you are owed {formatBalance(balance)}</div>}
                    {balance > 0 && <div className="orange-amount">you owe {formatBalance(balance)}</div>}
                    {balance == 0 && <div>You are all settled up</div>}
                </div>
            </div>
        );
    } else {
        return (
            <div className="right-summ-bar">
                <button className="remove-friend-button" onClick={() => history.push(`/friends/${id}/edit`)}>Remove this friend</button>
                <div className="right-summ-balance">
                    <div>YOUR BALANCE</div>
                    {friendship?.bill > 0 && <div className="orange-amount">You owe {friendship?.friend.name.split(" ")[0]} {formatBalance(friendship?.bill)}</div>}
                    {friendship?.bill < 0 && <div className="teal-amount">{friendship?.friend.name.split(" ")[0]} owes you {formatBalance(friendship?.bill)}</div>}
                    {friendship?.bill == 0 && <div>You are all settled up</div>}
                </div>
            </div>
        );
    }


}

export default RightSummaryBar;
