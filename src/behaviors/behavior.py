#!/usr/bin/env python
from numpy import random
import threading
import time
import requests


LED_TRANSITION_BLINK = "blink"
LED_TRANSITION_BREATHE = "breathe"
LED_TRANSITION_TRANSIT_ONCE = "transitonce"
LED_TRANSITIONS = [LED_TRANSITION_BLINK, LED_TRANSITION_BREATHE, LED_TRANSITION_TRANSIT_ONCE]

IPADDRESS = 108.


class Behavior:
    def __init__(self, conn, path, filename):
        """Initialization of Behavior

        Keyword arguments:
        conn - Instance of MistyConnections
        path - Path to the folder containing all behaviors.
        filename - Filename of the behavior.
        """
        # Oopen and read the instructions
        f = open(path + '/' + filename, 'r')
        self.conn = conn
        self.instructions = f.readlines()
        f.close()

    def run(self):
        """Executes behavior."""
        for instruction in self.instructions:
            args = instruction.replace('\n','').split(' ')
            # Ignore blank lines and lines with no args
            if len(args) < 2:
                continue

            # Move Arms
            elif args[0] == 'MAS':
                deg = int(args[1])
                spd = int(args[2])
                deg2 = int(args[3])
                spd2 = int(args[4])
                myObj = {
                    "LeftArmPosition": deg, 
                    "RightArmPosition": deg2, 
                    "LeftArmVelocity": spd, 
                    "RightArmVelocity": spd2
                }
                requests.post(IPADDRESS + "/api/arms/set", json=myObj)

            # Move Head
            elif args[0] == 'MH':
                roll = int(args[1])
                pitch = int(args[2])
                yaw = int(args[3])
                spd = int(args[4])
                myObj = {"Pitch": pitch, "Roll": roll, "Yaw": yaw, "Velocity": spd}
                # Endpoint: POST <robot-ip-address>/api/head
                requests.post(IPADDRESS + "/api/head", json=myObj)

            # Move the tracks of the robot
            elif args[0] == 'MT':
                linearMovement = int(args[1])
                angularMovement = int(args[2])
                timeInMS = int(args[3])
                myObj = {"LinearVelocity": linearMovement, "AngularVelocity": angularMovement}
                # Endpoint: POST <robot-ip-address>/api/drive
                requests.post(IPADDRESS + "/api/drive", json=myObj)
           
            # Static LED Change
            elif args[0] == 'CL':
                red = int(args[1])
                green = int(args[2])
                blue = int(args[3])
                myObj = {"red": red, "green": green, "blue": blue}
                # Endpoint: POST <robot-ip-address>/api/led
                requests.post(IPADDRESS + "/api/led", json=myObj)

            # Transition the LED between two colors
            elif args[0] == 'TL':
                from_red = int(args[1])
                from_green = int(args[2])
                from_blue = int(args[3])
                to_red = int(args[4])
                to_green = int(args[5])
                to_blue = int(args[6])
                transition = LED_TRANSITIONS.index(args[7].lower())
                timeInMS = int(args[8])
                myObj = {
                    "Red": from_red,
                    "Green": from_green, 
                    "Blue": from_blue,
                    "Red2": to_red, 
                    "Green2": to_green, 
                    "Blue2": to_blue, 
                    "TransitionType": transition, 
                    "Time": timeInMS
                }
                # Endpoint: POST <robot-ip-address>/api/led/transition
                requests.post(IPADDRESS + "/api/led/transition", json=myObj)

            # Sleep
            elif args[0] == 'SL':
                ms = int(args[1])
                self.conn.sleep(ms / 1000)
           
            # Change Facial Image
            elif args[0] == 'FI':
                imgName = args[1]
                # msg = imgName
                # x = threading.Thread(target=display_face, args=(self.conn.imgPub, msg))
                # imgPub.publish(msg)
                #x.start()
                myObj = {"FileName": msg}
                # POST <robot-ip-address>/api/images/display
                requests.post(IPADDRESS + "/api/images/display", json=myObj)

            # Control Blink + Facial Image
            elif args[0] == 'FIB':
                imgName = args[1]
                blinkduration = float(args[2]) / 1000.0
                msg = imgName
                x = threading.Thread(target=control_face_and_blink, args=(self.conn.imgPub, msg, blinkduration))
                x.start()

            # Change Facial Image After Time
            elif args[0] == 'DFI':
                imgName = args[1]
                delay = float(args[2]) / 1000.0
                msg = imgName
                x = threading.Thread(target=delayed_display_face, args=(self.conn.imgPub, msg, delay, 0.0, 0.1))
                x.start()

            # Speak
            elif args[0] == 'SP':
                text = args[1]
                myObj = {"Text": text}
                # Endpoint: POST <robot-ip-addres>/api/tts/speak
                requests.post(IPADDRESS + "/api/tts/speak", json=myObj)                

            # Toggle flashlight
            elif args[0] == 'FL':
                toggleOn = args[1]
                myObj = {"On": toggleOn}
                # Endpoint: POST <robot-ip-address>/api/flashlight
                requests.post(IPADDRESS + "/api/flashlight", json=myObj)                

            # Play audio
            elif args[0] == 'AU':
                fileName = args[1]
                myObj = {"FileName": fileName}
                # POST <robot-ip-address>/api/audio/play
                requests.post(IPADDRESS + "/api/audio/play", json=myObj)      

            # Display text
            elif args[0] == 'DIS':
                text = args[1]
                myObj = {"Text": text}
                # Endpoint: POST <robot-ip-address>/api/text/display
                requests.post(IPADDRESS + "/api/text/display", json=myObj) 
            
            self.conn.sleep(0.5)

# Controls the time the blinking face is displayed before the new face
def control_face_and_blink(pub, msg, blink_duration):
    blink = "blinkMisty.png"
    blinkMsg = blink
    pub(blinkMsg)
    time.sleep(blink_duration)
    pub(msg)

# Blinks for a set amount of time before transitioning to the new face
def display_face(pub, msg):
    blink = "blinkMisty.png"
    blinkMsg = blink
    pub(blinkMsg)
    time.sleep(0.35)
    pub(msg)

# Wait for some time before displaying the new face
def delayed_display_face(pub, msg, mean, low, high):
    num = random.uniform(low, high)
    time.sleep(mean + num)
    blink = "blinkMisty.png"
    blinkMsg =  blink
    pub(blinkMsg)
    time.sleep(0.2)
    pub(msg)