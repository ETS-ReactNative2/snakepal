# from components.body.featureDetection import extractBodyScore
# from components.head.featureDetection import extractHeadScore
# from components.tail.featureDetection import extractTailScore
# from components.body.featureDetection import extractBodyName
# from components.head.featureDetection import extractHeadName
# from components.tail.featureDetection import extractTailName

import numpy as np

# bodyPercentage = extractBodyScore()
# headPercentage = extractHeadScore()
# tailPercentage = extractTailScore()
# bodyName = extractBodyName()
# headName = extractHeadName()
# tailName = extractTailName()


DetectionID = ''


# get the result of the server side identification
def getFinaleScore(bscore, hscore, tscore, bname, hname, tname):
    labelName = ''

    snakeDict = {bname: bscore, hname: hscore, tname: tscore}

    # conditions for detection scores ------------------
    if bname == 'NONE' and tname == 'NONE' and hname == 'NONE':
        labelName = 'NONE'
        finalServerResult = 0

    if bname != hname and bname != tname and hname != tname:
        labelName = max(snakeDict.keys())
        finalServerResult = max(snakeDict.values())

    if bname == hname and bname == tname and hname == tname:
        labelName = bname
        finalServerResult = ((bscore + hscore + tscore) / 3)

    elif bname == hname and (tname != bname or tname != hname):
        labelName = bname
        finalServerResult = ((bscore + hscore) / 2)

    elif bname == tname and (bname != hname or hname != tname):
        labelName = bname
        finalServerResult = ((bscore + tscore) / 2)

    elif hname == tname and (bname != hname or bname != tname):
        labelName = hname
        finalServerResult = ((hscore + tscore) / 2)


    return finalServerResult

def getFinaleName(bscore, hscore, tscore, bname, hname, tname):
    labelName = ''

    snakeDict = {bname: bscore, hname: hscore, tname: tscore}

    # conditions for detection scores ------------------
    if bname == 'NONE' and tname == 'NONE' and hname == 'NONE':
        labelName = 'NONE'
        finalServerResult = 0

    if bname != hname and bname != tname and hname != tname:
        labelName = max(snakeDict.keys())
        finalServerResult = max(snakeDict.values())

    if bname == hname and bname == tname and hname == tname:
        labelName = bname
        finalServerResult = ((bscore + hscore + tscore) / 3)

    elif bname == hname and (tname != bname or tname != hname):
        labelName = bname
        finalServerResult = ((bscore + hscore) / 2)

    elif bname == tname and (bname != hname or hname != tname):
        labelName = bname
        finalServerResult = ((bscore + tscore) / 2)

    elif hname == tname and (bname != hname or bname != tname):
        labelName = hname
        finalServerResult = ((hscore + tscore) / 2)


    return labelName

