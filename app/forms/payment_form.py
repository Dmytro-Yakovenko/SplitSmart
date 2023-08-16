from flask_wtf import FlaskForm
from wtforms import DecimalField, SelectField
from wtforms.validators import NumberRange, ValidationError
from app.models import Friendship


def amount_is_whole(form, field):
    amount = field.data
    friendship = Friendship.query.get(form.data['friendship'])
    if amount != friendship.bill:
        raise ValidationError('Payment amount must settle up the entire bill.')


class PaymentForm(FlaskForm):
    friendship = SelectField('friendship', coerce=int)
    amount = DecimalField('amount', validators=[amount_is_whole])
    # amount = DecimalField('amount', validators=[NumberRange(min=1, message='Payment amount must be at least $1.'), amount_is_whole])
