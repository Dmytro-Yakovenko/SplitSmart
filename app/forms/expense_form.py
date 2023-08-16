from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, SelectMultipleField
from wtforms.validators import DataRequired, NumberRange


class ExpenseForm(FlaskForm):
    description = StringField('description', validators=[DataRequired(message='Expense description is required.')])
    amount = DecimalField('amount', validators=[NumberRange(min=1, message='Expense amount must be at least $1.')])
    friends = SelectMultipleField('friends', coerce=int)
