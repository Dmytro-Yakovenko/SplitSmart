// friend.js

// Action Types
const SET_FRIENDSHIPS = 'friend/SET_FRIENDSHIPS';
const SET_SELECTED_FRIENDSHIP = 'friend/SET_SELECTED_FRIENDSHIP';
const ADD_FRIENDSHIP = 'friend/ADD_FRIENDSHIP';
const EDIT_FRIENDSHIP = 'friend/EDIT_FRIENDSHIP';

// Action Creators
const setFriendships = (friendships) => ({
  type: SET_FRIENDSHIPS,
  payload: friendships,
});

const setSelectedFriendship = (friendship) => ({
  type: SET_SELECTED_FRIENDSHIP,
  payload: friendship,
});

const addFriendship = (friendship) => ({
  type: ADD_FRIENDSHIP,
  payload: friendship,
});

const editFriendship = (friendship) => ({
  type: EDIT_FRIENDSHIP,
  payload: friendship
});

// Thunks


// Fetch all friendships
export const fetchFriendships = () => async (dispatch) => {
  try {
    const response = await fetch('/api/friendships/');
    if (response.ok) {
      const data = await response.json();
      dispatch(setFriendships(data.friendships));
    } else {
      throw new Error('Failed to fetch friendships');
    }
  } catch (error) {
    console.error(error);

  }
};

export const fetchFriendshipById = (friendshipId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/friendships/${friendshipId}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setSelectedFriendship(data));
    } else {
      throw new Error(`Failed to fetch friendship with id ${friendshipId}`);
    }
  } catch (error) {
    console.error(error);

  }
};

export const createFriendship = (email) => async (dispatch) => {
  const response = await fetch('/api/friendships/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (response.ok) {
    const data = await response.json();
    if (data && data.message) {
      return { message: data.message };
    }
    dispatch(addFriendship(data));
    return null;
  }
  else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const updateFriendship = (id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/friendships/${id}`, {
      method: 'PUT'
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(editFriendship(data));
    } else {
      throw new Error('Failed to update friendship');
    }
  } catch (error) {
    console.error(error);
  }
};

// Initial State
const initialState = {
  friendships: {},
  selectedFriendship: {},
};

// Reducer
const friendReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FRIENDSHIPS:
      const friendships = {};
      action.payload.forEach((friendship) => {
        friendships[friendship.id] = friendship;
      });
      return { ...state, friendships };
    case SET_SELECTED_FRIENDSHIP:
      return { ...state, selectedFriendship: action.payload };
    case ADD_FRIENDSHIP:
      return { ...state, friendships: { ...state.friendships, [action.payload.id]: action.payload } };
    case EDIT_FRIENDSHIP:
      return { ...state, friendships: { ...state.friendships, [action.payload.id]: { ...state.friendships[action.payload.id], ...action.payload } } };
    default:
      return state;
  }
};

export default friendReducer;
