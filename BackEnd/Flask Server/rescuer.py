import ssl

import pymongo

import ReverseGeocoding
from constants import PATH

detectionId = ""
final_label = ""
user_phoneNo = ""
user_name = ""
user_fname = ""
user_lname = ""
RId = ""
user_id = ""
user_location=""

# connect to the mongoDB
myClient = pymongo.MongoClient(PATH, ssl_cert_reqs=ssl.CERT_NONE)

# create a DB
myDB = myClient["Rescuer"]

# create a collection
myCol = myDB["Rescuers"]


# Rescuer = {
#     "fname": "Palitha",
#     "lname": "Perera",
#     "phoneNo": "0775869523",
#     "area": "Colombo"
# }
#
##insert data to the collection
# x = myCol.insert_one(Rescuer)

# ---------get the rescuer details according to the user district--------------#

def assignDetections():

    global user_location
    user_location = ReverseGeocoding.findDistrict()

    findRescuer = {
        "area": user_location
    }
    userLocationResult = myCol.find(findRescuer)

    # set new detections to the respective rescuers based on the district

    for x in userLocationResult:
        myCol.update_many(
            {"username": x['username']},
            {
                '$push': {
                    'detections':
                        {
                            "Final_Label": final_label,
                            "User_Location": ReverseGeocoding.findAddress(),
                            "User_phoneNo": user_phoneNo,
                            "User_name": user_fname + " " + user_lname,
                            "ID": detectionId,
                            "Longitude": ReverseGeocoding.longitude,
                            "Latitude": ReverseGeocoding.latitude
                        }
                }
            }
        )
        print(x)

    # add snake detection details w/ locations to CSV file

    file_name = 'Detection.csv'

    with open(file_name, 'a') as output:
        # output.write('Latitude,Longitude,SnakeType\n')
        output.write("{},{},{}\n".format(ReverseGeocoding.latitude, ReverseGeocoding.longitude, final_label))


# ---------send notification to the rescuers--------------#
def sendNotificationToRescuer():

    findRescuer = {
        "area": ReverseGeocoding.findDistrict()
    }
    userLocationResult = myCol.find(findRescuer)

    for x in userLocationResult:
        rescuerNotification = {
            "RescuerID": x['resID'],
            "RfirstName": x['fname'],
            "RlastName": x['lname'],
            "RphoneNo": x['phoneNo'],
            "Rarea": x['area'],
            "Final_Label": final_label,
            "User_Location": ReverseGeocoding.findAddress(),
            "User_PhoneNo": user_phoneNo,
            "User_name": user_fname + " " + user_lname,
        }

        return rescuerNotification


# ---------send notification to the user--------------#
def sendNotificationToUser():

    userNotification = {
        "DetectionID": detectionId,
        "User_name": user_fname + " " + user_lname,
        "User_id": user_id,
        "message": "Messages have been sent to the rescuers successfully!"
    }

    return userNotification


# ---------get rescuer's detection details--------------#

# use username of the rescuer to get the rescue details from the collection

def getRescueDetails(Rusername):
    findRescuer = {
        "username": Rusername
    }
    result = myCol.find(findRescuer)

    for detections in result:
        rescuer_info = {
            "id": detections['resID'],
            "fname": detections['fname'],
            "lname": detections['lname'],
            "phoneNo": detections['phoneNo'],
            "location": detections['area'],
            "requests": detections['detections'],
            "acceptedDetection": detections['acceptedDetections']
        }

        return rescuer_info


# print(getRescueDetails())

# ----------notify user about the accepted rescuer ----------#

def notifyAcceptanceToUser():
    findRescuer = {
        "resID": RId
    }
    result = myCol.find(findRescuer)

    for x in result:
        userMsg = {
            "recuer_id": x['resID'],
            "fname": x['fname'],
            "lname": x['lname'],
            "phoneNo": x['phoneNo'],
            "detectionId": detectionId
        }

        myCol.update(
            {"resID": RId},
            {
                '$push': {
                    'acceptedDetections':
                        {
                            "ID": detectionId,
                            "Final_Label": final_label,
                            "User_Location": ReverseGeocoding.findAddress(),
                            "User_phoneNo": user_phoneNo,
                            "User_name": user_fname + " " + user_lname,
                            "Longitude": ReverseGeocoding.longitude,
                            "Latitude": ReverseGeocoding.latitude
                        }
                }
            }
        )

        return userMsg


# ----------get accepted detection array from rescuer ----------#

def getAcceptedList(resID):
    findRescuer = {
        "resID": resID
    }
    result = myCol.find(findRescuer)

    for x in result:
        acceptedList = {
            "RescuerID": RId,
            "AcceptedList": x['acceptedDetections']
        }

        return acceptedList
