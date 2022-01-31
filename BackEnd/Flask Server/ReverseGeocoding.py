import requests

import constants

latitude = 6.8979941
longitude = 79.9222869


district = ""
address = ""


def findDistrict():
    # Defining a params dictionary for the parameters to be sent to the API
    PARAMS = {
        'at': '{},{}'.format(latitude, longitude),
        'apikey': constants.GEOCODING_API_KEY
    }

    # Sending get request and saving the response as response object
    r = requests.get(url=constants.GEOCODING_URL, params=PARAMS)

    # Extracting data in json format
    data = r.json()

    # Taking out title from JSON
    district = data['items'][0]['address']['county']

    return district


def findAddress():
    # Defining a params dictionary for the parameters to be sent to the API
    PARAMS = {
        'at': '{},{}'.format(latitude, longitude),
        'apikey': constants.GEOCODING_API_KEY
    }

    # Sending get request and saving the response as response object
    r = requests.get(url=constants.GEOCODING_URL, params=PARAMS)

    # Extracting data in json format
    data = r.json()

    # Taking out title from JSON
    address = data['items'][0]['address']['label']

    return address
