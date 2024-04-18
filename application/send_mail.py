import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from jinja2 import Template

SMTP_SERVER_HOST = "localhost"
SMTP_SERVER_PORT = 1025
SENDER_ADDRESS = "adarsh@study.iitm.ac.in"
SENDER_PASSWORD = ""

def send_email(to_address, subject, message, content = "html", attachment_file = None):   #default content -> html
    msg = MIMEMultipart()
    msg['From'] = SENDER_ADDRESS
    msg['To'] = to_address
    msg['Subject'] = subject

    if content == "html":
        msg.attach(MIMEText(message, "html"))
    else:
        msg.attach(MIMEText(message, "plain"))

    if attachment_file:
        with open(attachment_file, 'rb') as attachment:
            # Add file as application/octet-stream
            part = MIMEBase("application", "octet-stream")
            part.set_payload(attachment.read())
        # email attachments are sent as base64 encoded.
        encoders.encode_base64(part)
        # refer https://www.ietf.org/rtc/rtc2183.txt
        part.add_header("Content-Disposition", f"attachment; filename = {attachment_file}")
        #add attachement to message
        msg.attach(part)

    s = smtplib.SMTP(host = SMTP_SERVER_HOST, port = SMTP_SERVER_PORT)
    s.login(SENDER_ADDRESS, SENDER_PASSWORD)
    s.send_message(msg)
    s.quit()

    return True

def format_message(template, data):
    with open(template) as file:
        content = Template(file.read())
        return content.render(data = data)