import * as friendActions from './friend';

// constants
const LOAD_SUMMARY = 'expense/loadSummary';
const LOAD_CREATED_EXPENSES = 'expense/loadCreatedExpenses';
const LOAD_UNSETTLED_EXPENSES = 'expense/loadUnsettledExpenses';
const LOAD_SETTLED_EXPENSES = 'expense/loadSettledExpenses';
const LOAD_CURRENT_EXPENSE = 'expense/loadCurrentExpense';
const ADD_EXPENSE = 'expense/addExpense';
const EDIT_EXPENSE = 'expense/editExpense';
const REMOVE_EXPENSE = 'expense/removeExpense';

const loadSummary = (summary) => {
    return {
        type: LOAD_SUMMARY,
        summary
    };
};
const loadCreatedExpenses = (expenses) => {
    return {
        type: LOAD_CREATED_EXPENSES,
        expenses
    };
};
const loadUnsettledExpenses = (expenses) => {
    return {
        type: LOAD_UNSETTLED_EXPENSES,
        expenses
    };
};
const loadSettledExpenses = (expenses) => {
    return {
        type: LOAD_SETTLED_EXPENSES,
        expenses
    };
};
const loadCurrentExpense = (expense) => {
    return {
        type: LOAD_CURRENT_EXPENSE,
        expense
    };
};
const addExpense = (expense) => {
    return {
        type: ADD_EXPENSE,
        expense
    };
};
const editExpense = (expense) => {
    return {
        type: EDIT_EXPENSE,
        expense
    };
};
const removeExpense = (id) => {
    return {
        type: REMOVE_EXPENSE,
        id
    };
};

// store.dispatch();
export const getSummary = () => async dispatch => {
    const response = await fetch('/api/expenses/summary');
    const data = await response.json();
	dispatch(loadSummary(data));
	return response;
};
export const getCreatedExpenses = () => async dispatch => {
    const response = await fetch('/api/expenses/');
    const data = await response.json();
    dispatch(loadCreatedExpenses(data.expenses));
    return response;
};
export const getUnsettledExpenses = () => async dispatch => {
    const response = await fetch('/api/expenses/unsettled');
    const data = await response.json();
	dispatch(loadUnsettledExpenses(data.unsettled));
	return response;
};
export const getSettledExpenses = () => async dispatch => {
    const response = await fetch('/api/expenses/settled');
    const data = await response.json();
	dispatch(loadSettledExpenses(data.settled));
	return response;
};
export const getCurrentExpense = (id) => async dispatch => {
    const response = await fetch(`/api/expenses/${id}`);
	const data = await response.json();
	dispatch(loadCurrentExpense(data));
    return response;
};
export const createExpense = (description, amount, friends) => async dispatch => {
    const response = await fetch('/api/expenses/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description,
            amount,
            friends
        })
    });
    const data = await response.json();
    dispatch(addExpense(data));
    dispatch(getCreatedExpenses());
    dispatch(getSettledExpenses());
    dispatch(getUnsettledExpenses());
    dispatch(getSummary());
    dispatch(friendActions.fetchFriendships());
    return response;
};
export const updateExpense = (id, description, amount, friends) => async dispatch => {
    const response = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description,
            amount,
            friends
        })
    });
    const data = await response.json();
    dispatch(editExpense(data));
    dispatch(getCreatedExpenses());
    dispatch(getSettledExpenses());
    dispatch(getUnsettledExpenses());
    dispatch(getSummary());
    dispatch(friendActions.fetchFriendships());
    return response;
};
export const deleteExpense = (id) => async dispatch => {
    const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE'
    });
    dispatch(removeExpense(id));
    dispatch(getCreatedExpenses());
    dispatch(getSettledExpenses());
    dispatch(getUnsettledExpenses());
    dispatch(getSummary());
    dispatch(friendActions.fetchFriendships());
    return response;
};

const initialState = {
    summary: {},
    createdExpenses: {},
    unsettledExpenses: {},
    settledExpenses: {},
    currentExpense: {}
};

const expense = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_SUMMARY:
            newState = { ...state, summary: {} };
            newState.summary = action.summary;
            return newState;
        case LOAD_CREATED_EXPENSES:
            newState = { ...state, createdExpenses: {} };
            action.expenses.forEach(expenseObj => {
                newState.createdExpenses[expenseObj.id] = expenseObj
            });
            return newState;
        case LOAD_UNSETTLED_EXPENSES:
            newState = { ...state, unsettledExpenses: {} };
            action.expenses.forEach(expenseObj => {
                newState.unsettledExpenses[expenseObj.id] = expenseObj
            });
            return newState;
        case LOAD_SETTLED_EXPENSES:
            newState = { ...state, settledExpenses: {} };
            action.expenses.forEach(expenseObj => {
                newState.settledExpenses[expenseObj.id] = expenseObj
            });
            return newState;
        case LOAD_CURRENT_EXPENSE:
            newState = { ...state, currentExpense: {} };
            newState.currentExpense = action.expense;
            return newState;
        case ADD_EXPENSE:
            newState = { ...state, createdExpenses: { ...state.createdExpenses, [action.expense.id]: action.expense } };
            return newState;
        case EDIT_EXPENSE:
            newState = { ...state, createdExpenses: { ...state.createdExpenses, [action.expense.id]: { ...state.createdExpenses[action.expense.id], ...action.expense } } };
            return newState;
        case REMOVE_EXPENSE:
            newState = { ...state, createdExpenses: { ...state.createdExpenses } };
            delete newState.createdExpenses[action.id];
            return newState;
        default:
            return state;
    }
};

export default expense;
