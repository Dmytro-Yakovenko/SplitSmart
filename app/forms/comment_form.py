from flask_wtf import FlaskForm
from wtforms import TextAreaField
from wtforms.validators import DataRequired


class CommentForm(FlaskForm):
    comment = TextAreaField('comment', validators=[DataRequired(message='Comment is required.')])
