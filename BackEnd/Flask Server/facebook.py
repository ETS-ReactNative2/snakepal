import facebook as fb
import requests
import logging
import json
from gensim.summarization.summarizer import summarize
from gensim.summarization import keywords
from collections import Counter
import string

video_path = ""
page_post_id = ""

def post_video(token, videoPath):
    auth_token = token
    # # url = "https://graph-video.facebook.com/101972902051639/videos?access_token=" + auth_token
    # url = "https://graph-video.facebook.com/101972902051639/videos" \
    #       "?description=Please provide the identification" \
    #       "&title=Snake identification." \
    #       "&access_token=" + auth_token
    # video_path = videoPath
    # files = {'file': open(video_path, 'rb')}
    # x = requests.post(url, files=files).text
    # y = json.loads(x)
    # print(y)
    # return y
    url = "https://graph.facebook.com/108263931465732/feed?message=Kindly Provide the Identification!&link=" + \
          videoPath + "/&access_token=" + token
    output = requests.post(url).text
    jsonoutput = json.loads(output)
    return (jsonoutput)


def get_comments(token, page_post_id):
    auth_token = token
    url = 'https://graph.facebook.com/' + page_post_id + '?fields=id,from,message,comments.summary(true)&access_token=' + auth_token
    output = requests.get(url).text
    print(output)
    jsonouput = json.loads(output)
    return jsonouput['comments']['data']


def getFinalResultFB(sen):

    sen = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vitae velit sit amet ligula accumsan dictum. Ut " \
      "in facilisis orci, a cursus purus. " + " " + sen

    # print(sen)

    words = sen.split()
    counter = Counter(words)
    top_three = counter.most_common(3)
    print("this is top three", top_three)

    comments = [top_three[0][0], top_three[1][0], top_three[2][0]]
    wholeString = ""

    for x in comments:
        wholeString = wholeString + " " + x.lower()

    print("this is the whole string", wholeString)
    # print("length of the whole string: ", len(wholeString))

    # if len(wholeString) > 20:
    #     print("true")
    # else:
    #     print("false")

    if (wholeString.find("cobra")) != -1:
        # print("Found 'cobra' in the string.")
        # result = "cobra"
        return "cobra"
    if (wholeString.find("russell's")) != -1:
        # print("Found 'russ' in the string.")
        # result = "russell's viper"
        return "russell's viper"
    else:
        return "none"


# print(getFinalResultFB("cobra. this is cobra. cobra is one of the venomous snake species in sri lanka.cobra. this is cobra. cobra is one of the venomous snake species in sri lanka.cobra. this is cobra. cobra is one of the venomous snake species in sri lanka."))
