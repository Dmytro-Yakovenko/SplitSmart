import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./ExpenseDetailsSection.css";
import  * as expenseActions from "../../store/expense";
import {
  addComment,
  deleteComment,
  // getCommentsByExpenseId,
  updateComment,
} from "../../store/comment";
import OpenModalButton from '../OpenModalButton';
import AddEditExpenseModal from '../AddEditExpenseModal';

const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function ExpenseDetailsSection({ expenseId }) {
  //dispatch
  const dispatch = useDispatch();

  //states
  const [comment, setComment] = useState("");
  const [commentEdit, setCommentEdit] = useState("");
  const [errorEdit, setErrorEdit] = useState({});
  const [error, setError] = useState({});
  const [isEdit, setEdit] = useState(false);
  const [commentId, setCommentId] = useState(null);
  // const expense = useSelector((state) => state.expense?.currentExpense);
  const sessionUser = useSelector((state) => state.session.user);
  const createdExpenses = useSelector((state) => Object.values(state.expense.createdExpenses));
  const unsettledExpenses = useSelector((state) => {
    return Object.values(state.expense.unsettledExpenses).map(participant => participant.expense);
  });
  const settledExpenses = useSelector((state) => {
    return Object.values(state.expense.settledExpenses).map(participant => participant.expense);
  });
  // const comments = useSelector((state) => Object.values(state.comment?.comments));


  const allExpenses = [...createdExpenses, ...unsettledExpenses, ...settledExpenses];
  const expense = allExpenses.filter(expense => expense.id === expenseId)[0];
  const comments = expense.comments;



  //useEffects
  useEffect(() => {
    const fetchData = async () => {
      dispatch(expenseActions.getCreatedExpenses());
      dispatch(expenseActions.getSettledExpenses());
      dispatch(expenseActions.getUnsettledExpenses());
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const error = {};

    if (comment.length > 255) {
      error.message = "comment has to be less than 255 characters";
    }

    setError(error);
  }, [comment]);

  useEffect(() => {
    const error = {};

    if (commentEdit.length > 255) {
      error.message = "comment has to be less than 255 characters";
    }

    setErrorEdit(error);
  }, [commentEdit]);

  //handlers
  const handleCommentCreate = (e) => {
    e.preventDefault();
    dispatch(addComment(comment, expenseId));
    setComment("");
  };

  const handleDelete = (commentId) => {
    let answer = window.confirm(
      "Are you sure you want to delete this comment? This will completely remove this comment for ALL people involved, not just you."
    );
    if (answer) {
      dispatch(deleteComment(commentId));
    }
  };

  const handleCommentEdit = (commentId, commentText) => {
    setEdit(true);
    setCommentId(commentId);
    setCommentEdit(commentText);
  };

  const handleEditCancel = () => {
    setEdit(false);
    setCommentId(null);
    setCommentEdit("")
  };

  const handleEditComment = (e)=>{
    e.preventDefault();
    dispatch(updateComment(commentEdit, commentId));
    setCommentEdit("");
    setCommentId(null)
    setEdit(false)
  }

  //utils
  const date = new Date(expense?.created_at);
  const createdDate = `${
    month[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()} `;
  const formatMoney = (amount) => {
    return (
      "$" +
      String(
        Number(amount)
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, "$&,")
      )
    );
  };

  return (
    <div id={`expense-details-${expenseId}`} className="expense-details expense-comments-wrapper hidden">
      <section className="expense-subheader">
        <div className="expense-image-wrapper">
          <img
            src="https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png"
            alt="reciept sign"
          />
        </div>
        <div className="expense-subheader-text-wrapper">
          <p className="expense-subheader-description">
            {expense?.description}
          </p>
          <p className="expense-subheader-amount">
            {formatMoney(expense?.amount)}
          </p>
          <p className="expense-subheader-date">
            Added by {expense?.user?.short_name} on {createdDate}
          </p>

          {/* <button
            className="expense-btn expense-edit-btn"
            onClick={() => alert("feature coming soon")}
          >
            Edit expense
          </button> */}
          {expense.creator_id == sessionUser.id && <OpenModalButton modalComponent={<AddEditExpenseModal expenseId={expense.id} />} buttonText={'Edit expense'} />}
        </div>
      </section>
      <hr style={{width:"95%"}} />

      <main className="expense-main">
        <section className="expense-main-content">
          <div className="expense-main-content-wrapper expense-content-wrapper">
            <img
              src={expense?.user?.image_url}
              alt={expense?.user?.short_name}
            />
            <p>
              {expense?.user?.short_name} paid{" "}
              {formatMoney(expense?.amount)} and owes{" "}
              {formatMoney(
                expense?.amount / (expense?.participants?.length + 1)
              )}
            </p>
          </div>
          <div className="expense-main-content-wrapper">
            <ul className="expense-main-list">
              {expense?.participants?.map((participant) => (
                <li key={participant?.id}>
                  <img
                    src={participant?.friendship?.friend?.image_url}
                    alt={participant?.friendship?.friend?.short_name}
                  />
                  <p>
                    {participant?.friendship?.friend?.short_name} owes{" "}
                    {formatMoney(participant?.amount_due)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="expense-main-content expense-comment">
          <p className="expense-comment-text">
            <img
              className="expense-icon"
              src="https://res.cloudinary.com/dr1ekjmf4/image/upload/v1688652280/icons8-comment-50_eh2i18.png"
              alt="comment icon"
            />
            Notes and Comments
          </p>
          <ul className="expense-comment">
            {comments.map((comment) => (
              <li key={comment.id} className="expense-comment-item">
                {isEdit && commentId === comment.id ? (
                  <>
                    {" "}
                    <form
                      className="expense-comment-form"
                      onSubmit={handleEditComment}
                    >
                      <label>
                        <textarea
                          required
                          onChange={(e) => setCommentEdit(e.target.value)}
                          placeholder="Add comment"
                          value={commentEdit}
                        ></textarea>
                        {errorEdit.message && (
                          <span className="expense-error">{errorEdit.message}</span>
                        )}
                      </label>
                      <div className="expense-button-wrapper">
                        <button
                          disabled={!!errorEdit.message}
                          className="expense-btn expense-post-btn"
                          type="submit"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            handleEditCancel();
                          }}
                          className="expense-btn expense-edit-btn"
                          type="reset"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <p className="expense-comment-title">
                      {comment?.user?.short_name}
                      {new Date().getMonth() ===
                        new Date(comment?.created_at).getMonth() &&
                      new Date().getDate() ===
                        new Date(comment?.created_at).getDate() ? (
                        <span className="expense-comment-span">Today</span>
                      ) : (
                        <span className="expense-comment-span">
                          {" "}
                          {month[new Date(comment?.created_at).getMonth()]}{" "}
                          {new Date(comment?.created_at).getDate()}
                        </span>
                      )}
                    </p>
                        { (sessionUser.id === comment.user.id) && <div className="expense-icon-wrapper">
                      <span
                        onClick={() =>
                          handleCommentEdit(comment.id, comment.comment)
                        }
                      >
                        <img
                          src="https://res.cloudinary.com/dr1ekjmf4/image/upload/v1688651618/icons8-pencil-50_1_cg3jui.png"
                          alt="edit icon"
                        />
                      </span>
                      <span
                        className="expense-close"
                        onClick={() => handleDelete(comment.id)}
                      >
                        X
                      </span>
                    </div>}
                    <p className="expense-comment-text">{comment?.comment}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
          <form className="expense-comment-form" onSubmit={handleCommentCreate}>
            <label>
              <textarea
              required
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add comment"
                value={comment}
              ></textarea>
              {error.message && (
                <span className="expense-error">{error.message}</span>
              )}
            </label>

            <button
              disabled={!!error.message}
              className="expense-btn expense-post-btn"
              type="submit"
            >
              Post
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default ExpenseDetailsSection;
