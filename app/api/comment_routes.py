from flask import Blueprint, jsonify, session, request
from flask_login import current_user, login_required
from app.models import db, Comment, Expense, ExpenseParticipant
from app.forms import CommentForm
from app.api.auth_routes import validation_errors_to_error_messages

comment_routes = Blueprint('comments', __name__)


@comment_routes.route('/<int:expense_id>')
@login_required
def get_comments(expense_id):
    """
    Query for all comments of a specific expense and returns them in a list of comment dictionaries
    """
    expense = Expense.query.get(expense_id)
    # checks if expense exists
    if not expense:
        return {'errors': f"Expense {expense_id} does not exist"}, 400
    participants = ExpenseParticipant.query.filter(ExpenseParticipant.expense_id == expense.id).all()
    participant_ids = [participant.friendship.friend_id for participant in participants]
    # checks if current user is a part of the expense
    if current_user.id not in [*participant_ids, expense.creator_id]:
        return {'errors': f"User is not a participant of expense {expense.id}."}, 401
    comments = Comment.query.filter(Comment.expense_id == expense_id).all()
    return {'comments': [comment.to_dict() for comment in comments]}


@comment_routes.route('/<int:expense_id>', methods=["POST"])
@login_required
def create_comment(expense_id):
    """
    Creates a new comment
    """
    expense = Expense.query.get(expense_id)
    # checks if expense exists
    if not expense:
        return {'errors': f"Expense {expense_id} does not exist"}, 400
    participants = ExpenseParticipant.query.filter(ExpenseParticipant.expense_id == expense.id).all()
    participant_ids = [participant.friendship.friend_id for participant in participants]
    # checks if current user is a part of the expense
    if current_user.id not in [*participant_ids, expense.creator_id]:
        return {'errors': f"User is not a participant of expense {expense.id}."}, 401
    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        comment = Comment(
            comment=form.data['comment'],
            user_id=current_user.id,
            expense_id=expense_id
        )
        db.session.add(comment)
        db.session.commit()
        return comment.to_dict(), 201
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


@comment_routes.route('/<int:id>', methods=["PUT"])
@login_required
def update_comment(id):
    """
    Updates a comment
    """
    comment = Comment.query.get(id)
    # checks if comment exists
    if not comment:
        return {'errors': f"Comment {id} does not exist."}, 400
    # checks if current user is a creator of the comment
    if comment.user_id != current_user.id:
        return {'errors': f"User is not the creator of comment {id}."}, 401
    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        form.populate_obj(comment)
        db.session.commit()
        return comment.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


@comment_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_comment(id):
    """
    Deletes a comment
    """
    comment = Comment.query.get(id)
    # checks if comment exists
    if not comment:
        return {'errors': f"Comment {id} does not exist."}, 400
    # checks if current user is a creator of the comment
    if comment.user_id != current_user.id:
        return {'errors': f"User is not the creator of comment {id}."}, 401
    db.session.delete(comment)
    db.session.commit()
    return {'message': 'Delete successful.'}
