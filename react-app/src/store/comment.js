import * as expenseActions from './expense';

const SET_COMMENT = "comments/SET_COMMENT"
const REMOVE_COMMENT= "comments/REMOVE_COMMENT"
const GET_COMMENTS="comments/GET_COMMENTS"


//actions

const setComment=(comment)=>({
    type:SET_COMMENT,
    payload:comment
})


const removeComment=(id)=>({
    type:REMOVE_COMMENT,
    payload:id
})


const getComments=(comments)=>({
    type: GET_COMMENTS,
    payload: comments
})


// initial state
const initialState={
    comments:{}
}


//fetch
export const addComment=(comment, expenseId)=>async ( dispatch)=>{

    const response=await fetch(`/api/comments/${expenseId}`, {
        method:"POST",
        headers: {
			"Content-Type": "application/json",
		},
        body: JSON.stringify({
            comment
        })
    })

    if (response.ok){
        const data = await response.json()
        dispatch(setComment(data))
        dispatch(expenseActions.getCreatedExpenses());
        dispatch(expenseActions.getSettledExpenses());
        dispatch(expenseActions.getUnsettledExpenses());
        return null
    }

    if(response.status<500){
        const data = await response.json();
        if (data.errors) {
			return data.errors;
		}
        return null
    }
    return ["An error occurred. Please try again."];
}

export const updateComment = (comment, commentId)=>async(dispatch)=>{
    const response= await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    body: JSON.stringify({comment}),
    })

    if(response.ok){
        const data = await response.json()
        dispatch(setComment(data))
        dispatch(expenseActions.getCreatedExpenses());
        dispatch(expenseActions.getSettledExpenses());
        dispatch(expenseActions.getUnsettledExpenses());
        return null
    }

    if(response.status<500){
        const data =await response.json()
        if(data.errors){
            return data.errors
        }
        return null
    }
    return ["An error occurred. Please try again."];
}



export const deleteComment=(commentId)=>async(dispatch)=>{
    const response = await fetch(`/api/comments/${commentId}`,{
        method:"DELETE",

    })

    if(response.ok){
        dispatch(removeComment(commentId))
        dispatch(expenseActions.getCreatedExpenses());
        dispatch(expenseActions.getSettledExpenses());
        dispatch(expenseActions.getUnsettledExpenses());
    }

    if(response.status<500){
        const data =await response.json()
        if(data.errors){
            return data.errors
        }
        return null
    }
    return ["An error occurred. Please try again."];
}




export const getCommentsByExpenseId=(expenseId)=>async(dispatch)=>{
    const response = await fetch(`/api/comments/${expenseId}`)

    if(response.ok){

        const data =await response.json()
        dispatch(getComments(data))
    }
}


//Reducer

export default function reducer(state=initialState, action){
    switch(action.type){
        case GET_COMMENTS:

            const data= action.payload.comments.reduce((acc,curr)=>{
                acc[curr.id]=curr
                return acc
            },{})

            return {...state, comments: {...data}}
        case SET_COMMENT:
            const updatedState={...state, comments: {...state.comments}}
            updatedState.comments[action.payload.id]=action.payload
            return updatedState

        case REMOVE_COMMENT:
            const newState={...state, comments: {...state.comments}}
            delete newState.comments[action.payload]

            return newState
        default:
            return state
    }

}
