import os

from flask import Flask, render_template_string
from flask_security import Security, current_user, auth_required, hash_password, \
     SQLAlchemySessionUserDatastore, permissions_accepted
from database import db_session, init_db
from models import User, Role
from flask_wtf import CSRFProtect

# Create app
app = Flask(__name__)
app.config['DEBUG'] = True

# Generate a nice key using secrets.token_urlsafe()
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY", 'pf9Wkove4IKEAXvy-cQkeDPhv9Cb3Ag-wyJILbq_dFw')
# Bcrypt is set as default SECURITY_PASSWORD_HASH, which requires a salt
# Generate a good salt using: secrets.SystemRandom().getrandbits(128)
app.config['SECURITY_PASSWORD_SALT'] = os.environ.get("SECURITY_PASSWORD_SALT", '146585145368132386173505678016728509634')
# Don't worry if email has findable domain
app.config["SECURITY_EMAIL_VALIDATOR_ARGS"] = {"check_deliverability": False}
# enable google auth
app.config["SECURITY_OAUTH_ENABLE"] = True
app.config["SECURITY_OAUTH_BUILTIN_PROVIDERS"] = ["google"]
app.config["GOOGLE_CLIENT_ID"] = os.environ.get("GOOGLE_CLIENT_ID")
app.config["GOOGLE_CLIENT_SECRET"] = os.environ.get("GOOGLE_CLIENT_SECRET")

# enable spa
# no forms so no concept of flashing
app.config["SECURITY_FLASH_MESSAGES"] = False

# Need to be able to route backend flask API calls. Use 'admin'
# to be the Flask-Security endpoints.
app.config["SECURITY_URL_PREFIX"] = '/admin'


# These need to be defined to handle redirects
# As defined in the API documentation - they will receive the relevant context
app.config["SECURITY_POST_CONFIRM_VIEW"] = "/confirmed"
app.config["SECURITY_CONFIRM_ERROR_VIEW"] = "/confirm-error"
app.config["SECURITY_RESET_VIEW"] = "/reset-password"
app.config["SECURITY_RESET_ERROR_VIEW"] = "/reset-password-error"
app.config["SECURITY_REDIRECT_BEHAVIOR"] = "spa"
app.config["SECURITY_POST_LOGOUT_VIEW"] = "/login"
app.config["SECURITY_POST_LOGIN_VIEW"] = "/"
app.config["SECURITY_RECOVERABLE"] = True

# CSRF protection is critical for all session-based browser UIs

# enforce CSRF protection for session / browser - but allow token-based
# API calls to go through
app.config["SECURITY_CSRF_PROTECT_MECHANISMS"] = ["session", "basic"]
app.config["SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS"] = True

# Send Cookie with csrf-token. This is the default for Axios and Angular.
app.config["SECURITY_CSRF_COOKIE_NAME"] = "XSRF-TOKEN"
app.config["WTF_CSRF_CHECK_DEFAULT"] = False
app.config["WTF_CSRF_TIME_LIMIT"] = None
app.config["SECURITY_REDIRECT_HOST"] = "localhost:4000"

# In your app
# Enable CSRF on all api endpoints.
CSRFProtect(app)

# manage sessions per request - make sure connections are closed and returned
app.teardown_appcontext(lambda exc: db_session.close())

# Setup Flask-Security
user_datastore = SQLAlchemySessionUserDatastore(db_session, User, Role)
app.security = Security(app, user_datastore)

# Views
@app.route("/")
@auth_required()
def home():
    return render_template_string('Hello {{current_user.email}}!')

@app.route("/user")
@auth_required()
@permissions_accepted("user-read")
def user_home():
    return render_template_string("Hello {{ current_user.email }} you are a user!")

# one time setup
with app.app_context():
    init_db()
    # Create a user and role to test with
    app.security.datastore.find_or_create_role(
        name="user", permissions={"user-read", "user-write"}
    )
    db_session.commit()
    if not app.security.datastore.find_user(email="test@me.com"):
        app.security.datastore.create_user(email="test@me.com",
        password=hash_password("password"), roles=["user"])
    db_session.commit()

if __name__ == '__main__':
    # run application (can also use flask run)
    app.run()
