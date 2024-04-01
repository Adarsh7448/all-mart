class Config():
    DEBUG = False
    SQLITE_DB_DIR = None  
    SQLALCHEMY_DATABASE_URI = None 
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class LocalDevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///allmart_database.sqlite3"
    SECRET_KEY = "mad2-project-allmart-secret-key"
    DEBUG = True
    SECURITY_PASSWORD_HASH = "bcrypt"
    SECURITY_PASSWORD_SALT = "mad2-project-allmart-password-salt"
    SECURITY_REGISTERABLE = True
    SECURITY_SEND_REGISTER_EMAIL = False
    SECURITY_UNAUTHORIZED_VIEW = None
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"