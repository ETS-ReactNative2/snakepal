from twilio.rest import Client

client = Client('AC8f2914203fe0241c8add2e554ce88359', '2415fef95bd62af0fcd03bbc754f2ac6')


def sendSMS():
    client.messages \
        .create(
        body="Hello Rescuer! Reptile is detected. Plese check SnakePal app for more info. ~ Team SnakePal",
        from_='+19062890741',
        to='+94716341788'
    )
