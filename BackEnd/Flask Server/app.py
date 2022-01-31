from flask import Flask,jsonify, request, url_for
import warnings
import requests
from mrcnn import utils
from mrcnn import visualize
from mrcnn.visualize import display_images
from mrcnn.visualize import display_instances
import mrcnn.model as modellib
from mrcnn.model import log
from mrcnn.config import Config
from mrcnn import model as modellib, utils
from PIL import Image
import cv2
import subprocess
from skimage import data, img_as_float
from skimage import exposure
import os
import sys
import json
import datetime
import numpy as np
import skimage.draw
import random
import math
import re
import time
import tensorflow as tf
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import matplotlib.image as mpimg
import numpy as np
import glob
import voting
import components.body.featureDetection
import components.head.featureDetection
import components.tail.featureDetection
import rescuer
import send_sms
import facebook
import constants
import ReverseGeocoding
import rescuer

warnings.filterwarnings('ignore')

app = Flask(__name__)

BACKENDURL = "http://localhost:8081"


# Root directory of the project
# ROOT_DIR = "D:\RP\AllinOne"
#
# DEFAULT_LOGS_DIR = os.path.join(ROOT_DIR, "logs")
#
# MODEL_DIR = os.path.join(ROOT_DIR, "logs")
#
# WEIGHTS_PATH = "D:\RP\AllinOne\logs\mask_rcnn_object_0097.h5"  # change it

ROOT = os.path.dirname(os.path.abspath(__file__))


# Root directory of the project
ROOT_DIR = os.path.join(ROOT, "AllinOne")

DEFAULT_LOGS_DIR = os.path.join(ROOT_DIR, "logs")

MODEL_DIR = os.path.join(ROOT_DIR, "logs")

WEIGHTS_PATH = os.path.join(MODEL_DIR, "mask_rcnn_object_0097.h5")


TEST_MODE = "inference"
DataSetDirecory = os.path.join(ROOT_DIR, "Dataset")

model = None

print("++++++++++++++++++++++++update tracker 004++++++++++++++++++++++++++++++++")

# methods

def make_directories(detecion_id):
    directoryPre = "precluster"
    directoryClusters = "clusters"

    # Parent Directory path
    parent_dir = os.path.join(ROOT, "detections")
    path_second_Parent = os.path.join(parent_dir, detecion_id)

    os.mkdir(path_second_Parent)

    # Path
    path_Pre_Cluster = os.path.join(path_second_Parent, directoryPre)
    path_Cluster = os.path.join(path_second_Parent, directoryClusters)
    path_Head = os.path.join(path_second_Parent, "head")
    path_Body = os.path.join(path_second_Parent, "body")
    path_Tail = os.path.join(path_second_Parent, "tail")

    os.mkdir(path_Pre_Cluster)
    os.mkdir(path_Cluster)
    os.mkdir(path_Head)
    os.mkdir(path_Body)
    os.mkdir(path_Tail)

    return path_second_Parent, path_Pre_Cluster, path_Cluster, path_Head, path_Body, path_Tail


# resize


def image_resize(image, width = None, height = None, inter = cv2.INTER_AREA):
    # initialize the dimensions of the image to be resized and
    # grab the image size
    dim = None
    (h, w) = image.shape[:2]

    # if both the width and height are None, then return the
    # original image
    if width is None and height is None:
        return image

    # check to see if the width is None
    if width is None:
        # calculate the ratio of the height and construct the
        # dimensions
        r = height / float(h)
        dim = (int(w * r), height)

    # otherwise, the height is None
    else:
        # calculate the ratio of the width and construct the
        # dimensions
        r = width / float(w)
        dim = (width, int(h * r))

    # resize the image
    resized = cv2.resize(image, dim, interpolation = inter)

    # return the resized image
    return resized

# decoder methods

def decode_frames(video_URL, path):
    videoFile = video_URL
    imagesFolder = path
    count = 0
    vidcap = cv2.VideoCapture(videoFile)
    success,image = vidcap.read()
    success = True
    while (count<10):
        vidcap.set(cv2.CAP_PROP_POS_MSEC,(count*1000))    # added this line
        success,image = vidcap.read()
        print ('Read a new frame: ', success)
        filename = imagesFolder + "/image_" + str(int(count)) + ".jpg"
        image2 = image_resize(image, height=250)
        cv2.imwrite(filename, image2)
        count = count + 1



# def decode_frames(video_URL, path):
#     videoFile = video_URL
#     imagesFolder = path
#     cap = cv2.VideoCapture(videoFile)
#     frameRate = cap.get(5)  # frame rate
#     while (cap.isOpened()):
#         frameId = cap.get(1)  # current frame number
#         ret, frame = cap.read()
#         if (ret != True):
#             break
#         if (frameId % math.floor(frameRate) == 0):
#             filename = imagesFolder + "/image_" + str(int(frameId)) + ".jpg"
#             image2 = image_resize(frame, height=250)
#             cv2.imwrite(filename, image2)
#     cap.release()


#     ! ffmpeg -i input.mp4 -r 1 %04d.bmp


# iframes extract

def get_frame_types(video_fn):
    command = 'ffprobe -v error -show_entries frame=pict_type -of default=noprint_wrappers=1'.split()
    out = subprocess.check_output(command + [video_fn]).decode()
    frame_types = out.replace('pict_type=', '').split()
    return zip(range(len(frame_types)), frame_types)


def save_i_keyframes(video_fn, path_Pre_Cluster):
    frame_types = get_frame_types(video_fn)
    i_frames = [x[0] for x in frame_types if x[1] == 'I']
    if i_frames:
        #         basename = os.path.splitext(os.path.basename(video_fn))[0]
        cap = cv2.VideoCapture(video_fn)
        for frame_no in i_frames:
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_no)
            ret, frame = cap.read()
            outname = '_i_frame_' + str(frame_no) + '.jpg'
            pathTemp = path_Pre_Cluster
            cv2.imwrite(os.path.join(pathTemp, outname), frame)
            print('Saved: ' + outname)
        cap.release()
    else:
        print('No I-frames in ' + video_fn)


# enhance methods

def variance_of_laplacian(image):
    # compute the Laplacian of the image and then return the focus
    # measure, which is simply the variance of the Laplacian
    return cv2.Laplacian(image, cv2.CV_64F).var()


def enhance_and_save(path_Pre_Cluster, path_Cluster):
    n = 0

    for img in glob.glob(path_Pre_Cluster + "/*.jpg"):
        image = mpimg.imread(img)
        #     cv_img.append(n)`

        # detect bluur
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        fm = variance_of_laplacian(gray)
        text = "Not Blurry"

        print(fm)

        # removeblur images

        if fm < 2.0:
            text = "Blurry"
            os.remove(img)

        else:

            print("Saved")
            n = n + 1

            # contrast
            # Contrast stretching
            imgC = cv2.imread(img)
            p2, p98 = np.percentile(imgC, (2, 98))
            img_rescale = exposure.rescale_intensity(imgC, in_range=(p2, p98))

            # Equalization
            # img_eq = exposure.equalize_hist(imgC)

            # Adaptive Equalization
            img_adapteq = exposure.equalize_adapthist(imgC, clip_limit=0.03)

            #         im = Image.fromarray(img_adapteq)
            #         im.save('test.png')

            # closing all open windows
            cv2.destroyAllWindows()

            #       pathTemp = 'D:\RP\Training Models\clusters'
            cv2.imwrite(f'{path_Cluster}/image_{n}.jpg', img_adapteq * 255)


# model load methods

class CustomConfig(Config):
    """Configuration for training on the custom  dataset.
    Derives from the base Config class and overrides some values.
    """
    # Give the configuration a recognizable name
    NAME = "object"

    IMAGES_PER_GPU = 1

    NUM_CLASSES = 1 + 3  # Background + phone,laptop and mobile

    # Number of training steps per epoch
    STEPS_PER_EPOCH = 25

    # Skip detections with < 90% confidence
    DETECTION_MIN_CONFIDENCE = 0.8


config = CustomConfig()
CUSTOM_DIR = os.path.join(ROOT_DIR, "/Dataset/")


class InferenceConfig(config.__class__):
    # Run detection on one image at a time
    GPU_COUNT = 1
    IMAGES_PER_GPU = 1
    DETECTION_MIN_CONFIDENCE = 0.7


config = InferenceConfig()
config.display()


# Code for Customdataset class. Same code is present in custom.py file also
class CustomDataset(utils.Dataset):

    def load_custom(self, dataset_dir, subset):

        self.add_class("object", 1, "body")
        self.add_class("object", 2, "head")
        self.add_class("object", 3, "tail")

        assert subset in ["train", "val"]
        dataset_dir = os.path.join(dataset_dir, subset)

        valDirectory = os.path.join(DataSetDirecory, "val")
        AnotationPath = os.path.join(valDirectory, "AllAnotations.json")
        annotations1 = json.load(open(AnotationPath))

        annotations = list(annotations1.values())  # don't need the dict keys

        annotations = [a for a in annotations if a['regions']]

        # Add images
        for a in annotations:
            polygons = [r['shape_attributes'] for r in a['regions']]
            objects = [s['region_attributes']['type'] for s in a['regions']]
            print("objects:", objects)
            name_dict = {"body": 1, "head": 2, "tail": 3}
            num_ids = [name_dict[a] for a in objects]

            print("numids", num_ids)
            image_path = os.path.join(dataset_dir, a['filename'])
            image = skimage.io.imread(image_path)
            height, width = image.shape[:2]

            self.add_image(
                "object",
                image_id=a['filename'],  # use file name as a unique image id
                path=image_path,
                width=width, height=height,
                polygons=polygons,
                num_ids=num_ids
            )

    def load_mask(self, image_id):

        image_info = self.image_info[image_id]
        if image_info["source"] != "object":
            return super(self.__class__, self).load_mask(image_id)

        info = self.image_info[image_id]
        if info["source"] != "object":
            return super(self.__class__, self).load_mask(image_id)
        num_ids = info['num_ids']
        mask = np.zeros([info["height"], info["width"], len(info["polygons"])],
                        dtype=np.uint8)
        for i, p in enumerate(info["polygons"]):
            rr, cc = skimage.draw.polygon(p['all_points_y'], p['all_points_x'])

            mask[rr, cc, i] = 1

        num_ids = np.array(num_ids, dtype=np.int32)
        return mask, num_ids  # np.ones([mask.shape[-1]], dtype=np.int32)

    def image_reference(self, image_id):
        """Return the path of the image."""
        info = self.image_info[image_id]
        if info["source"] == "object":
            return info["path"]
        else:
            super(self.__class__, self).image_reference(image_id)


# In[4]:


# Inspect the model in training or inference modes values: 'inference' or 'training'


def get_ax(rows=1, cols=1, size=16):
    """Return a Matplotlib Axes array to be used in all visualizations in the notebook.  Provide a central point to control graph sizes. Adjust the size attribute to control how big to render images"""
    _, ax = plt.subplots(rows, cols, figsize=(size * cols, size * rows))
    return ax


def load_model(ROOT_DIR):
    # Must call before using the dataset
    CUSTOM_DIR = ROOT_DIR
    dataset = CustomDataset()
    dataset.load_custom(CUSTOM_DIR, "val")
    dataset.prepare()
    print("Images: {}\nClasses: {}".format(len(dataset.image_ids), dataset.class_names))

    config = CustomConfig()
    # LOAD MODEL. Create model in inference mode
    model = modellib.MaskRCNN(mode="inference", model_dir=MODEL_DIR, config=config)

    # Load COCO weights Or, load the last model you trained
    weights_path = WEIGHTS_PATH
    # Load weights
    print("Loading weights ", weights_path)
    model.load_weights(weights_path, by_name=True)

    return model


# csegementation methods

def saveBody(classId, image, rArray, path_Body):
    class_id = classId

    image2 = cv2.imread(image)

    class_fltr = rArray['class_ids'] == class_id
    boxes = rArray['rois'][class_fltr, :]

    accinfoArr = rArray['scores']

    if (len(boxes) != 0):

        accinfo = accinfoArr[0]

        if (accinfo > 0.93):
            print('Accuracy of body is ' + str(accinfo))
            moreAcc = boxes[0]
            j1, i1, j2, i2 = moreAcc

            cropped2 = image2[j1: j2, i1: i2]

            #  write image
            cv2.imwrite(path_Body + "/" + str(accinfo) + '.JPG', cropped2)


def saveHead(classId, image, rArray, path_Head):
    class_id = classId

    image2 = cv2.imread(image)

    class_fltr = rArray['class_ids'] == class_id
    boxes = rArray['rois'][class_fltr, :]

    accinfoArr = rArray['scores']

    if (len(boxes) != 0):

        accinfo = accinfoArr[0]

        if (accinfo > 0.93):
            print('Accuracy of head is ' + str(accinfo))
            moreAcc = boxes[0]
            j1, i1, j2, i2 = moreAcc

            cropped2 = image2[j1: j2, i1: i2]

            #  write image
            cv2.imwrite(path_Head + "/" + str(accinfo) + '.JPG', cropped2)


def saveTail(classId, image, rArray, path_Tail):
    class_id = classId

    image2 = cv2.imread(image)

    class_fltr = rArray['class_ids'] == class_id
    boxes = rArray['rois'][class_fltr, :]

    accinfoArr = rArray['scores']

    if (len(boxes) != 0):

        accinfo = accinfoArr[0]

        if (accinfo > 0.93):
            print('Accuracy of tail is ' + str(accinfo))
            moreAcc = boxes[0]
            j1, i1, j2, i2 = moreAcc

            cropped2 = image2[j1: j2, i1: i2]

            #  write image
            cv2.imwrite(path_Tail + "/" + str(accinfo) + '.JPG', cropped2)


def detect_body_parts(path_Cluster, model, path_Head, path_Body, path_Tail):
    cv_img = []

    # body
    for img in glob.glob(path_Cluster + "/*.jpg"):
        image1 = mpimg.imread(img)

        print(len([image1]))
        results1 = model.detect([image1], verbose=1)

        r1 = results1[0]

        saveBody(1, img, r1, path_Body)
        saveHead(2, img, r1, path_Head)
        saveTail(3, img, r1, path_Tail)

# subscribe to mqtt
# def on_message(client, userdata, message):
#     print("received message: " ,str(message.payload.decode("utf-8")))
#
#
#
# mqttBroker ="http://34.125.88.216:8080"
#
# client = mqtt.Client("flask")
# client.connect(mqttBroker)
#
# client.loop_start()
#
# client.subscribe("detection/request")
# client.on_message=on_message
#
# time.sleep(30)
# client.loop_stop()





@app.route('/detect' , methods=['GET', 'POST'])
def hello_world():  # put application's code here
    # executions
    ROOT = os.path.dirname(os.path.abspath(__file__))


    # Root directory of the project
    ROOT_DIR = os.path.join(ROOT, "AllinOne")

    DEFAULT_LOGS_DIR = os.path.join(ROOT_DIR, "logs")

    MODEL_DIR = os.path.join(ROOT_DIR, "logs")

    WEIGHTS_PATH = os.path.join(MODEL_DIR, "mask_rcnn_object_0097.h5")


    TEST_MODE = "inference"
    DataSetDirecory = os.path.join(ROOT_DIR, "Dataset")

    # components.tail.featureDetection.defaultInitializer()
    # components.body.featureDetection.defaultInitializer()
    # components.head.featureDetection.defaultInitializer()



    if request.method == 'POST':
        DetectionID = request.json['detection_id']
        urlString = request.json['videoURL']

        # test


        second_Root_Path,path_Pre_Cluster, path_Cluster, path_Head, path_Body, path_Tail = make_directories(DetectionID)

        # decode
        decode_frames(urlString, path_Pre_Cluster)

        # save i fames
        # save_i_keyframes(urlString, path_Pre_Cluster)

        # # ehance

        enhance_and_save(path_Pre_Cluster, path_Cluster)

        global model

        if model==None:

             model = load_model(DataSetDirecory)

        detect_body_parts(path_Cluster, model, path_Head, path_Body, path_Tail)

        components.tail.featureDetection.defaultInitializer()
        components.body.featureDetection.defaultInitializer()
        components.head.featureDetection.defaultInitializer()

        bodyLabel = components.body.featureDetection.extractBodyName(path_Body)
        bodyScore = components.body.featureDetection.extractBodyScore()

        headLabel = components.head.featureDetection.extractHeadName(path_Head)
        headScore = components.head.featureDetection.extractHeadScore()

        tailLabel = components.tail.featureDetection.extractTailName(path_Tail)
        tailScore = components.tail.featureDetection.extractTailScore()

        voting.DetectionID = DetectionID
        print("server all")
        print(voting.getFinaleName(bodyScore, headScore, tailScore, bodyLabel, tailLabel, headLabel))
        print(voting.getFinaleScore(bodyScore, headScore, tailScore, bodyLabel, tailLabel, headLabel))
        print("Finale")

        print("Detection id")
        print(voting.DetectionID)

        #

        # voting.default()




        # os.remove(second_Root_Path)

        # publish to mqtt




        BACKEndDetectionsUpdate = BACKENDURL+"/detection/update-server-values/"+DetectionID
        requestData ={"HeadLabel": headLabel,
                      "HeadScore": headScore,
                      "TailLabel": tailLabel,
                      "TailScore": tailScore,
                      "BodyLabel": bodyLabel,
                      "BodyScore": bodyScore,
                      "Final_Label": voting.getFinaleName(bodyScore, headScore, tailScore, bodyLabel,headLabel, tailLabel),
                      "Final_Score": voting.getFinaleScore(bodyScore, headScore, tailScore, bodyLabel, headLabel, tailLabel)
                      }

        requests.post(url=BACKEndDetectionsUpdate, data=requestData)



        return jsonify(
            {
                "HeadScore": headScore,
                "BodyScore": bodyScore,
                "TailScore": tailScore,
                "HeadLabel": headLabel,
                "BodyLabel": bodyLabel,
                "TailLabel": tailLabel,
                "Final_Label": voting.getFinaleName(bodyScore, headScore, tailScore, bodyLabel,headLabel, tailLabel),
                "Final_Score": voting.getFinaleScore(bodyScore, headScore, tailScore, bodyLabel, headLabel, tailLabel)

            }
        )


# -------------------------Server side identification----------------------------#

# GET - real time detection val (POST - added ofonly for the testing purpose)
# @app.route('/Detection/realtimedata', methods=['POST'])
# def getRTIdentificationID():
#     data = request.json['RTScore']
#     # voting.getSeversideResult(data)
#     voting.RTScore = data
#     return jsonify(data)



# def serverFinalIdentification(Head_URL,Body_URL,Tail_URL, DetectionID):
#     # if POST
#     if request.method == 'GET':
#         return jsonify(
#             {
#                 "Final_Detection": voting.getSeversideResult(),
#                 "Server_Detection": voting.returnSnakeDetails(),
#                 "DetectionId": voting.DetectionID
#             }
#         )
#     # if GET
#     components.head.featureDetection.headimagepath = Head_URL
#     components.body.featureDetection.bodyimagepath = Body_URL
#     components.tail.featureDetection.tailimagepath = Tail_URL
#     voting.DetectionID = DetectionID
#     return jsonify('URLs and detection ID are receieved')


# -------------------------Rescuer----------------------------#


# POST - get all detection detail from main node.js -> flask
@app.route('/Detection/Final_result', methods=['POST'])
def getDetectionDetails():
    # get details from json body
    rescuer.detectionId = request.json['detection_Id']
    rescuer.final_label = request.json['Final_Label']
    rescuer.user_fname = request.json['User_FirstName']
    rescuer.user_lname = request.json['User_LastName']
    rescuer.user_id = request.json['User_name']
    rescuer.user_phoneNo = request.json['User_PhoneNo']
    ReverseGeocoding.longitude = request.json['User_longitude']
    ReverseGeocoding.latitude = request.json['User_latitude']

    return jsonify({
        "responseCode": 200,
        "msg": "successfully posted!"
    })


# GET - get respective rescuer detection details
@app.route('/Rescuer/login', methods=['POST'])
def rescuerInformation():
    if request.json['username'] == 'sujeewa' and request.json['password'] == '123456' or request.json['username'] == 'amal' and request.json['password'] == '741852' or request.json['username'] == 'nirmala' and request.json['password'] == '456789' or request.json['username'] == 'palitha' and request.json['password'] == '123789':
        rescuerInfo = rescuer.getRescueDetails(request.json['username'])
        return jsonify({
            "responseCode": 200,
            "rescuerInfo": rescuerInfo,
        })
    else:
        return jsonify({"username": request.json['username'], "password": request.json['password']}, 'Try again!')



# GET - send notifications to rescuer and user from flask -> FE
@app.route('/Rescuer/SendNotifications', methods=['GET'])
def sendNotifications():
    rescuer.assignDetections()
    dataRescuer = rescuer.sendNotificationToRescuer()
    dataUser = rescuer.sendNotificationToUser()
    send_sms.sendSMS()

    return jsonify({
        "responseCode": 200,
        "Rescuer": dataRescuer,
        "User": dataUser
    })


# GET - get accepting detection id and rescuer id from FE and send details to node server
# POST - send accepted detection list of rescuer to FE rescuer profile
@app.route('/Rescuer/acceptedDetections/<resID>', methods=['POST', 'GET'])
def acceptedDetectionsInfo(resID):
    if request.method == 'POST':
        rescuer.RId = request.json['id']
        rescuer.detectionId = request.json['detection_Id']
        # URL = BACKENDURL+'/push-rescuer-alerts/' + rescuer.detectionId
        detailsUser = rescuer.notifyAcceptanceToUser()
        # requests.post(url=URL, data=detailsUser)

        return jsonify({
            "rescuer id": rescuer.RId,
            "detection id": rescuer.detectionId,
            "rescuerDetails": detailsUser,
            "responseCode": 200,
            "msg": "successfully posted!"
        })

    rescuer.getAcceptedList(resID)
    return jsonify(rescuer.getAcceptedList(resID))


@app.route('/sendFacebookPost', methods=['POST'])
def sendFacebookPost():
    # facebook.video_path = request.json['videoPath']
    # constants.AUTH_TOKEN = request.json['AUTH_TOKEN']
    a = facebook.post_video(request.json['AUTH_TOKEN'], request.json['videoPath'])
    return jsonify(a)


@app.route('/getFacebookComments', methods=['POST'])
def getFacebookComments():
    # facebook.page_post_id = request.json['pagePostID']
    a = facebook.get_comments(request.json['AUTH_TOKEN'], request.json['pagePostID'])
    return jsonify({"comments": a})

@app.route('/getManualFacebookDetection', methods=['POST'])
def getManualFacebookDetection():
    result = facebook.getFinalResultFB(request.json['sentence'])
    return jsonify({"result": result})




if __name__ == '__main__':

    app.run(port='8080')

