from flask import Blueprint, jsonify, session, request
from flask_login import current_user, login_required
from app.models import db, Expense, ExpenseParticipant, Friendship
from app.forms import ExpenseForm
from app.api.auth_routes import validation_errors_to_error_messages
from decimal import Decimal

expense_routes = Blueprint('expenses', __name__)


@expense_routes.route('/summary')
@login_required
def summary():
    """
    Query for the current user's balance summary
    """
    friendships = Friendship.query.filter(Friendship.user_id == current_user.id).all()
    positive_bills = 0
    negative_bills = 0
    for friendship in friendships:
        if friendship.bill < 0:
            negative_bills += friendship.bill
        elif friendship.bill > 0:
            positive_bills += friendship.bill
    balance = positive_bills + negative_bills
    return {
        'balance': balance,
        'you owe': positive_bills,
        'you are owed': abs(negative_bills)
    }


@expense_routes.route('/')
@login_required
def my_expenses():
    """
    Query for all expenses created by the current user and returns them in a list of expense dictionaries
    """
    expenses = Expense.query.filter(Expense.creator_id == current_user.id).all()
    return {'expenses': [expense.to_dict() for expense in expenses]}


@expense_routes.route('/unsettled')
@login_required
def unsettled_expenses():
    """
    Query for all unsettled expenses charged to the current user and returns them in a list of expense dictionaries
    """
    friendships = Friendship.query.filter(Friendship.friend_id == current_user.id).all()
    friendship_ids = [friendship.id for friendship in friendships]
    unsettled = ExpenseParticipant.query.filter(ExpenseParticipant.friendship_id.in_(friendship_ids), ExpenseParticipant.is_settled == False).all()
    return {'unsettled': [expense.to_dict() for expense in unsettled]}


@expense_routes.route('/settled')
@login_required
def settled_expenses():
    """
    Query for all settled expenses charged to the current user and returns them in a list of expense dictionaries
    """
    friendships = Friendship.query.filter(Friendship.friend_id == current_user.id).all()
    friendship_ids = [friendship.id for friendship in friendships]
    settled = ExpenseParticipant.query.filter(ExpenseParticipant.friendship_id.in_(friendship_ids), ExpenseParticipant.is_settled == True).all()
    return {'settled': [expense.to_dict() for expense in settled]}


@expense_routes.route('/<int:id>')
@login_required
def get_expense(id):
    """
    Query for an expense by id and returns that expense in a dictionary
    """
    expense = Expense.query.get(id)
    # checks if expense exists
    if not expense:
        return {'errors': f"Expense {id} does not exist."}
    participants = ExpenseParticipant.query.filter(ExpenseParticipant.expense_id == expense.id).all()
    participant_ids = [participant.friendship.friend_id for participant in participants]
    # checks if current user is a part of the expense
    if current_user.id not in [*participant_ids, expense.creator_id]:
        return {'errors': f"User is not a participant of expense {expense.id}."}, 401
    return expense.to_dict()


@expense_routes.route('/', methods=['POST'])
@login_required
def create_expense():
    """
    Creates a new expense, creates corresponding expense participant information, and updates friendships' bill amounts
    """
    form = ExpenseForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    # set form's SelectMultipleField choices to active friends of current user
    form.friends.choices = [(friendship.id, friendship.friend.to_dict()['name']) for friendship in Friendship.query.filter(Friendship.user_id == current_user.id, Friendship.is_active == True).all()]
    if form.validate_on_submit():
        expense = Expense(
            description=form.data['description'],
            amount=form.data['amount'],
            creator_id=current_user.id
        )
        db.session.add(expense)
        db.session.commit()
        # split expense amount equally by all participants, including current user
        bill_delta = Decimal("%.2f" % (expense.amount/(len(form.data['friends'])+1)))
        for id in form.data['friends']:
            # create an expense participant row for every friend indicated in expense
            expense_participant = ExpenseParticipant(
                expense_id=expense.id,
                friendship_id=id,
                amount_due=bill_delta
            )
            db.session.add(expense_participant)
            # update both friendships' bill amounts to reflect new expense
            user_to_friend = Friendship.query.get(id)
            friend_to_user = Friendship.query.filter(Friendship.user_id == user_to_friend.friend_id, Friendship.friend_id == user_to_friend.user_id).first()
            user_to_friend.bill -= bill_delta
            friend_to_user.bill += bill_delta
        db.session.commit()
        return expense.to_dict(), 201
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


@expense_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_expense(id):
    """
    Updates an expense, corresponding expense participant information, and friendships' bill amounts
    """
    expense = Expense.query.get(id)
    # checks if expense exists
    if not expense:
        return {'errors': f"Expense {id} does not exist."}, 400
    # checks if current user is a creator of the expense
    if expense.creator_id != current_user.id:
        return {'errors': f"User is not the creator of expense {id}."}, 401
    old_bill = Decimal("%.2f" % (expense.amount/(len(expense.participants)+1)))
    form = ExpenseForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    form.friends.choices = [(friendship.id, friendship.friend.to_dict()['name']) for friendship in Friendship.query.filter(Friendship.user_id == current_user.id, Friendship.is_active == True).all()]
    if form.validate_on_submit():
        form.populate_obj(expense)
        db.session.commit()
        new_bill = Decimal("%.2f" % (expense.amount/(len(expense.participants)+1)))
        bill_delta = new_bill - old_bill
        # update every expense participant row for every friend indicated in expense
        participants = ExpenseParticipant.query.filter(ExpenseParticipant.expense_id == expense.id).all()
        for participant in participants:
            participant.amount_due = new_bill
            user_to_friend = Friendship.query.get(participant.friendship_id)
            friend_to_user = Friendship.query.filter(Friendship.user_id == user_to_friend.friend_id, Friendship.friend_id == user_to_friend.user_id).first()
            # update both friendships' bill amounts to reflect new expense
            user_to_friend.bill -= bill_delta
            friend_to_user.bill += bill_delta
            if bill_delta > 0:
                # set is_settled to False, when their amount due increased
                participant.is_settled = False
        db.session.commit()
        return expense.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


@expense_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_expense(id):
    """
    Deletes an expense, corresponding expense participant information, and corresponding comments; and updates friendships' bill amounts
    """
    expense = Expense.query.get(id)
    # checks if expense exists
    if not expense:
        return {'errors': f"Expense {id} does not exist."}, 400
    participants = ExpenseParticipant.query.filter(ExpenseParticipant.expense_id == expense.id).all()
    participant_ids = [participant.friendship.friend_id for participant in participants]
    # checks if current user is a part of the expense
    if current_user.id not in [*participant_ids, expense.creator_id]:
        return {'errors': f"User is not a participant of expense {expense.id}."}, 401
    # update both friendships' bill amounts to reflect deleted expense
    old_bill = Decimal("%.2f" % (expense.amount/(len(expense.participants)+1)))
    participants = ExpenseParticipant.query.filter(ExpenseParticipant.expense_id == expense.id).all()
    for participant in participants:
        user_to_friend = Friendship.query.get(participant.friendship_id)
        friend_to_user = Friendship.query.filter(Friendship.user_id == user_to_friend.friend_id, Friendship.friend_id == user_to_friend.user_id).first()
        user_to_friend.bill += old_bill
        friend_to_user.bill -= old_bill
    db.session.delete(expense)
    db.session.commit()
    return {'message': 'Delete successful.'}
