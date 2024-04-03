import os
from os import listdir
from os.path import isfile, join
import tkinter as tk
from behavior import *
import json
from mutagen.mp3 import MP3
import requests
import time
import base64

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
COMMENT_FOLDER = CURRENT_DIR  + "/Misty_Comments10071"
BEHAVIOR_FOLDER = CURRENT_DIR + "/behaviors"
BEHAVIOR_FILES = [f for f in listdir(BEHAVIOR_FOLDER) if isfile(join(BEHAVIOR_FOLDER, f))]
JSON_FILE = CURRENT_DIR + "/comments.json"


LED_TRANSITION_BLINK = "blink"
LED_TRANSITION_BREATHE = "breathe"
LED_TRANSITION_TRANSIT_ONCE = "transitonce"
LED_TRANSITIONS = [LED_TRANSITION_BLINK, LED_TRANSITION_BREATHE, LED_TRANSITION_TRANSIT_ONCE]

class Misty:
    def __init__(self, ip):
        self.bvs = {}
        self.build_behaviors()
        self.ip = ip

    def build_behaviors(self):
        for f in BEHAVIOR_FILES:
            self.bvs[f.replace('.bv', '')] = Behavior(self, BEHAVIOR_FOLDER, f)

    def run_bv(self, bv):
        self.bvs[bv].run()

    def speakCommentAndWait(self, comment_file):
        self.sleep(1.5)
        audioFileName = join(COMMENT_FOLDER, comment_file)
        audio = MP3(audioFileName)
        length = audio.info.length
        self.sendAndPlayAudio(audioFileName)
        self.sleep(length - 0.5)

    def speakCommentAndElicit(self, comment_file, elicitation):
        self.speakCommentAndWait(comment_file)
        thread_voice = threading.Thread(target=self.speakCommentAndWait, args=(elicitation,))
        thread_behavior = threading.Thread(target=self.run_bv, args=('elicit',))
        thread_voice.start()
        thread_behavior.start()

    def sendAndPlayAudio(self, filename):
        try:
            file = open(filename, 'rb')
        except IOError:
            print('Failed to open file', filename)
            return
        # Since the filename is an absolute path to the file,
        # split it based on '/' and only use the last index of
        # split for the filename to be stored on Misty.
        splits = filename.split('/')

        # Data -> This must be a base64 encoding of the audio file.
        # Immediately Apply -> Do you want to instantly play the file?
        # Overwrite Existing -> Do you want to replace the current stored file if it exists?
        json = {'Data': base64.b64encode(file.read()).decode('utf-8'),
                'FileName': splits[len(splits)-1],
                'ImmediatelyApply': True,
                'OverwriteExisting': True}
        requests.post('http://'+self.ip+'/api/audio', json=json)
        file.close()

    def updateBlinkMap(self):
        requests.post('http://'+self.ip+'/api/blink/settings',
            json={
                "BlinkImages": "eyes_acceptance.jpg=blinkMisty.png,eyes_admiration.jpg=blinkMisty.png,eyes_amazement.jpg=blinkMisty.png,eyes_anger.jpg=blinkMisty.png,eyes_annoyed.jpg=blinkMisty.png,eyes_anticipation.jpg=blinkMisty.png,eyes_apprehension.jpg=blinkMisty.png,eyes_boredom.jpg=blinkMisty.png,eyes_default.jpg=blinkMisty.png,eyes_disgust.jpg=blinkMisty.png,eyes_ecstasy_frame_1.jpg=blinkMisty.png,eyes_ecstasy_frame_2.jpg=blinkMisty.png,eyes_fear.jpg=blinkMisty.png,eyes_grief.jpg=blinkMisty.png,eyes_interest.jpg=blinkMisty.png,eyes_loathing.jpg=blinkMisty.png,eyes_pensiveness.jpg=blinkMisty.png,eyes_rage.jpg=blinkMisty.png,eyes_sad.jpg=blinkMisty.png,eyes_surprise.jpg=blinkMisty.png,eyes_terror.jpg=blinkMisty.png,eyes_trust.jpg=blinkMisty.png,eyes_vigilance.jpg=blinkMisty.png",
                "OpenEyeMinMs" : 5000,
                "OpenEyeMaxMs" : 7000,
                "ClosedEyeMinMs" : 100,
                "ClosedEyeMaxMs" : 200
            })

    def blinkPub(self):
        resp = requests.post('http://'+self.ip+'/api/blink',
            json={"Blink": "true"})

    def armsPub(self, msg):
        # msg = [deg, spd, deg2, spd2]
        leftArmPos = msg[0]
        leftArmVel = msg[1]
        rightArmPos = msg[2]
        rightArmVel = msg[3]
        requests.post('http://'+self.ip+'/api/arms/set',
            json={"LeftArmPosition": leftArmPos, 
                "RightArmPosition": rightArmPos,
                "LeftArmVelocity": leftArmVel,
                "RightArmVelocity": rightArmVel})

    def hdPub(self, msg):
        roll = msg[0]
        pitch = msg[1]
        yaw = msg[2]
        velocity = msg[3]
        requests.post('http://'+self.ip+'/api/head',json={"Pitch": pitch, "Roll": roll, "Yaw": yaw, "Velocity": velocity, "Units": "degrees"})

    def drvTimePub(self, msg):
        linear_velocity = msg[0]
        angular_velocity = msg[1]
        time_in_milli_second = msg[2]
        requests.post('http://'+self.ip+'/api/drive/time',json={"LinearVelocity": linear_velocity,"AngularVelocity": angular_velocity, "TimeMS": time_in_milli_second})

    def ledPub(self, msg):
        red = msg[0]
        green = msg[1]
        blue = msg[2]
        requests.post('http://'+self.ip+'/api/led',json={"red": red,"green": green,"blue": blue})

    def transLEDPub(self, msg):
        # msg = [from_red, from_green, from_blue, to_red, to_green, to_blue, transition, timeInMS]
        from_red = msg[0]
        from_green = msg[1]
        from_blue = msg[2]
        to_red = msg[3]
        to_green = msg[4]
        to_blue = msg[5]
        transition_type = LED_TRANSITIONS[msg[6]]
        time = msg[7]
        requests.post('http://'+self.ip+'/api/led/transition',
            json={"Red": from_red,
                "Green": from_green,
                "Blue": from_blue,
                "Red2": to_red,
                "Green2": to_green,
                "Blue2": to_blue,
                "TransitionType": transition_type,
                "TimeMS": time})

    def sleep(self, time_to_sleep):
        time.sleep(time_to_sleep)

    def imgPub(self, msg):
        image_name = msg
        resp = requests.post('http://'+self.ip+'/api/images/display',json={'FileName': image_name})
        if ".gif" not in image_name:
            self.blinkPub()




