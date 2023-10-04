from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User
from app.forms import ProfileForm
from app.api.auth_routes import validation_errors_to_error_messages
from app.api.aws_helpers import get_unique_filename, upload_file_to_s3

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def get_users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def get_user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/<int:id>', methods=["PUT"])
@login_required
def update_user(id):
    """
    Updates a user
    """
    user = User.query.get(id)
    if not user:
        return {'errors': f"User {id} does not exist."}, 400
    if user.id != current_user.id:
        return {'errors': f"User can only edit their own profile."}, 401
    form = ProfileForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        if form.data['image_url']:
            image_url = form.data['image_url']
            image_url.filename = get_unique_filename(image_url.filename)
            image_url_upload = upload_file_to_s3(image_url)

        user.first_name = form.data['first_name']
        user.last_name = form.data['last_name']
        if form.data['is_changed']:
            user.image_url = image_url_upload['url'] if form.data['image_url'] else "https://splitsmart-aa-ai.s3.us-west-1.amazonaws.com/default.png"
        db.session.commit()
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400
