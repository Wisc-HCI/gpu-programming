import os
import sys
from os import listdir
from os.path import isfile, join
import tkinter as tk
from misty import Misty
import json
import threading
import time

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
COMMENT_FOLDER = join(CURRENT_DIR, "Misty_Comments10071")
BEHAVIOR_FOLDER = join(CURRENT_DIR, "behaviors")
BEHAVIOR_FILES = [f for f in listdir(BEHAVIOR_FOLDER) if isfile(join(BEHAVIOR_FOLDER, f))]
JSON_FILE = CURRENT_DIR + "/comments.json"
INTRO_FILES = [f for f in listdir(COMMENT_FOLDER) if isfile(join(COMMENT_FOLDER, f)) and "_intro" in f]

class WoZ(tk.Frame):
    def __init__(self, parent, ip):
        # Initialize the frame
        tk.Frame.__init__(self, parent)

        # ROS topics for communicating with Misty
        self.conn = Misty(ip)

        # Frame for the comments for 'Microlife in Soil'
        self.comment_frame = tk.Frame(self)
        self.comment_frame.grid(row=0)


        # Frame for showing the commands you'll be sending to Misty
        self.config_frame = tk.Frame(self)
        self.config_frame.grid(row=1)

        # Selection variables
        self.selected_comment_file = None
        self.selected_behavior = None
        self.command = None
        self.selected_elicit = None

        self.config_comment_text = tk.StringVar()
        self.config_comment_text.set("Selected Comment: None")

        # Frame setup methods
        self.setup_comment_frame()
        self.setup_config_frame()

    def setup_comment_frame(self):

        col = 0
        for f in INTRO_FILES:
            name = f.replace('_intro.mp3', '')
            btn = tk.Button(self.comment_frame, text=name, command=lambda c_file=f,text=name,bv='default': self.select_comment(c_file, text, bv, None))
            btn.grid(row=0, column=col)
            col += 1

        btn_row = 1

        with open(JSON_FILE) as f:
            data = json.load(f)['comments']
            for group in data:
                for i in group:
                    col_count = 0
                    for comment in group[i]:
                        try:
                            elicit = comment['elicit']
                        except KeyError:
                            elicit = None
                        btn = tk.Button(self.comment_frame, text=comment['title'], command=lambda c_file=comment['file'],el=elicit,text=comment['title'],bv=comment['emotion']: self.select_comment(c_file, text, bv, el))
                        btn.grid(row=btn_row, column=col_count)
                        col_count += 1
                btn_row += 1
        
        # Add a 'None' button to the top of the comment list
        btn = tk.Button(self.comment_frame, text="None", command=lambda c_file=None,text="None",bv='default': self.select_comment(c_file, text, bv, None))
        btn.grid(row=btn_row, column=0)
        # Add a 'None' button to the top of the comment list
        btn = tk.Button(self.comment_frame, text="None & Forward", command=lambda text="None & Forward",forward=True: self.none_and_move(forward, text))
        btn.grid(row=btn_row, column=1)
        # Add a 'None' button to the top of the comment list
        btn = tk.Button(self.comment_frame, text="None & Back", command=lambda text="None & Back",forward=False: self.none_and_move(forward, text))
        btn.grid(row=btn_row, column=2)

    def setup_config_frame(self):
        # Display the selected comment
        config_comment = tk.Label(self.config_frame, textvariable=self.config_comment_text)
        config_comment.pack(fill="x")

        # Add button for sending the configuration to the Misty robot
        send_btn = tk.Button(self.config_frame, text="Send Commands", command=self.send_commands)
        send_btn.pack(fill="x")

        maps = tk.Button(self.config_frame, text="Setup Maps", command=self.conn.updateBlinkMap)
        maps.pack(fill="x")

    def updateMaps(self, x):
        self.conn.updateBlinkMap()

    def select_comment(self, c_file, text, bv, elicit):
        # Update the selected comment
        self.selected_comment_file = c_file
        self.selected_behavior = bv
        self.selected_elicit = elicit
        self.config_comment_text.set("Selected Comment: " + text)

    def none_and_move(self, forward, text):
        self.selected_comment_file = None
        self.selected_behavior = 'default'
        self.config_comment_text.set('Selected Comment: ' + text)
        if forward:
            self.command = [25, 0, 500]
        else:
            self.selected_behavior = None
            self.command = [-25, 0, 750]


    def send_commands(self):
        # Just shorting the variables...
        bv = self.selected_behavior
        elicit = self.selected_elicit
        cm_file = self.selected_comment_file
        drv = self.command

        # Build threads for speaking the comment and displaying the behavior
        thread_voice = threading.Thread(target=self.conn.speakCommentAndWait, args=(cm_file,))
        thread_voice_and_elicit = threading.Thread(target=self.conn.speakCommentAndElicit, args=(cm_file,elicit))
        thread_behavior = threading.Thread(target=self.conn.run_bv, args=(bv,))
        thread_drive = threading.Thread(target=self.conn.drvTimePub, args=(drv,))

        # Run the threads
        if cm_file is not None and elicit is None:
            thread_voice.start()
        if cm_file is not None and elicit is not None:
            thread_voice_and_elicit.start()
        if bv is not None:
            thread_behavior.start()
        if drv is not None:
            thread_drive.start()
            self.command = None
            


if __name__ == "__main__":
    # Build UI and run
    if len(sys.argv) < 2:
        print("Please run command as: python <file> <robot_ip>")
        exit(1)
    root = tk.Tk()
    root.title("Misty WoZ Reading Tool")
    WoZ(root, sys.argv[1]).pack(fill="both", expand=True)
    root.mainloop()