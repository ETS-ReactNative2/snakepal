# SnakePal

SnakePal is a mobile application which Detect Snakes and thier venomousness using video processing.
## Methodology
Snakepal is a react native based app which users need to upload a 3seconds video of a snake where then our central server detect the snake type and its venomousness. The user is notified when a successful detection is recorded.
If the image recognition using video frames process fails then the user uploaded video will be posted on a facebook group where facebook users will be able to make manual recognitions as comments.
These comments are analysed to predict the manual recognitions. All together the final recognition is  notified to the user who uploaded the video. If it is a venomous snake then the rescuers near to the detection location will be informed.

## Technology 
The front end of the application is developed using react native.
The machine learning models and natural language processing methods are intergrated into a python flask API
The Rest of the back end operations including users , rescuers and detection management are in a Node API which is build on express framework.
