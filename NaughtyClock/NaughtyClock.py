import tkinter as tk
from datetime import datetime, timedelta
import motivation
import subprocess
import os
import random
import pygame
import RPi.GPIO as GPIO
import firebase_admin
from firebase_admin import credentials, firestore
import threading
import time

# Firebase Initialization
cred = credentials.Certificate("/home/mitang/NaughtyClock/naughtyclock-59e94-firebase-adminsdk-1zuj2-1961f41ba6.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# User ID Setup
user_id = 'xkgIx5GxK5OhjyijT00SJc15do42'

# List of all postures for external functionality to call
postures_list = ["Strong"]

class VideoWindow(tk.Tk):
    @staticmethod
    def load_ringtones(folder):
        return [os.path.join(folder, file) for file in os.listdir(folder) if file.endswith('.mp3')]
    

    def alarm_monitor(self, window_instance):
        while True:
            current_time = datetime.now()
            
            if window_instance.nearest_alarm_time and current_time >= window_instance.nearest_alarm_time - timedelta(seconds=3):
                print(f"current_time data {current_time}")
                print(f"Alarm monitor: Time to play alarm at {current_time}. Nearest alarm was {window_instance.nearest_alarm_time}")
                window_instance.after(0, window_instance.play_alarm)
                window_instance.nearest_alarm_time = None
            time.sleep(1)


    def play_alarm(self):
        # Method implementation
        self.hints_label.config(text="Time to GET UP!!")
        ringtone = random.choice(self.ringtones)
        pygame.mixer.music.load(ringtone)
        pygame.mixer.music.play(-1)
        self.ringtone_label.config(text=f'Ringtone: {os.path.basename(ringtone)}')
        self.check_motion()


    
    def __init__(self):
        super().__init__()
        self.title('NaughtyClock')
        self.geometry('800x480')
        self.camera_active = False
        self.posture_process = None
        self.next_alarm_time = None
        self.current_alarm_id = None
        self.ringtones = self.load_ringtones("Ringtone")
        self.is_ringtone_playing = False  # 追踪闹铃播放状态
        self.nearest_alarm_time = None  # 初始化 nearest_alarm_time


        # Start the alarm_monitor thread with a reference to this instance
        alarm_thread = threading.Thread(target=self.alarm_monitor, args=(self,))
        alarm_thread.daemon = True
        alarm_thread.start()


        pygame.mixer.init()
        self.alarm_update_interval = 60000  # Check for updates every 60 seconds
        self.motionPin = 18  # GPIO setup for motion sensor
        self.motion_duration_start = None
        

        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(self.motionPin, GPIO.IN)

        self.main_section = tk.Frame(self, width=360, height=360)
        self.main_section.pack(side='right', fill='both', expand=True)

        self.time_label = tk.Label(self.main_section, text='Time Here', font=('Arial', 50, 'bold'), bg='purple', fg='white')
        self.date_label = tk.Label(self.main_section, text='Date Here', font=('Arial', 20))
        self.motivation_label = tk.Label(self.main_section, text=motivation.get_random_motivation(), font=('Arial', 20), fg='blue', wraplength=350, borderwidth=3, relief="solid")
        self.alarm_label = tk.Label(self.main_section, font=('Arial', 14))

        # Create and configure the ringtone_label and todays_posture_label
        self.ringtone_label = tk.Label(self.main_section, text='Ringtone: Default', font=('Arial', 14))
        self.todays_posture_label = tk.Label(self.main_section, text="Today's Posture: Unknown", font=('Arial', 16), fg='red')
        self.play_ringtone_button = tk.Button(self.main_section, text="Play Ringtone", command=self.play_random_ringtone)

        self.camera_button = tk.Button(self.main_section, text="Camera", command=self.toggle_camera)
        self.deactivate_alarm_button = tk.Button(self.main_section, text="Deactivate Alarm", command=self.deactivate_alarm, state='disable')

        self.hints_label = tk.Label(self.main_section, text="", font=('Arial', 16))
        

        for widget in [self.time_label, self.date_label, self.motivation_label, self.alarm_label, self.ringtone_label, self.todays_posture_label, self.camera_button, self.play_ringtone_button, self.deactivate_alarm_button, self.hints_label]:
            widget.pack()
        
        # Set initial values for labels
        if self.ringtones:
            self.ringtone_label.config(text=f'Ringtone: {os.path.basename(self.ringtones[0])} ')
            self.todays_posture = random.choice(postures_list)
            self.todays_posture_label.config(text=f"Today's Posture: {self.todays_posture}")

            self.update_time()
            self.check_for_alarm_updates()


    def play_random_ringtone(self):
        if self.is_ringtone_playing:
            # 停止播放闹铃
            pygame.mixer.music.stop()
            self.is_ringtone_playing = False
            self.ringtone_label.config(text='Ringtone: Stopped')
            self.deactivate_alarm_button.config(text="Play Ringtone")
        else:
            # 开始播放闹铃
            if self.ringtones:
                ringtone = random.choice(self.ringtones)
                pygame.mixer.music.load(ringtone)
                pygame.mixer.music.play()
                self.ringtone_label.config(text=f'Ringtone: {os.path.basename(ringtone)}')
                self.deactivate_alarm_button.config(text="Stop Ringtone")
                self.is_ringtone_playing = True
            else:
                print("No ringtones available.")

    def toggle_camera(self):
        if self.camera_active:
            self.camera_button.config(text="Camera")
            self.terminate_posture_recognition()
        else:
            self.camera_button.config(text="Stop Camera")
            self.start_posture_recognition()
        self.camera_active = not self.camera_active

    def start_posture_recognition(self):
        self.todays_posture = random.choice(postures_list)
        self.todays_posture_label.config(text=f"Today's Posture: {self.todays_posture}")
        self.posture_process = subprocess.Popen(['python', 'posture_recognition2.py', self.todays_posture], stdout=subprocess.PIPE, text=True)
        self.after(1000, self.check_posture_recognition)

    def check_posture_recognition(self):
        if self.posture_process.poll() is not None:
            output = self.posture_process.communicate()[0]
            if output.strip() == "True":
                print("Posture matched! Stopping alarm.")
                self.hints_label.config(text="Posture matched! Stopping alarm.")
                self.update_alarm_status(False)  # 停止闹钟并更新状态
                self.hints_label.config(text="Alarm Stopped, good job!! Have a nice day!!!")
            else:
                print("Posture did not match. Manual alarm stop available.")
                self.hints_label.config(text="Posture did not match. Click 'Deactive Alarm' to stop Alarm.")
                self.deactivate_alarm_button.config(state='normal')  # 显示 "Deactivate Alarm" 按钮
            self.posture_process = None

    def terminate_posture_recognition(self):
        if self.posture_process:
            self.posture_process.terminate()
            self.posture_process = None
            print("Posture recognition stopped.")

    def update_time(self):
        current_datetime = datetime.now()  # Use datetime object for current time
        current_time_str = current_datetime.strftime('%H:%M:%S')  # Format time as string for display
        current_date_str = current_datetime.strftime('%A, %B %d, %Y')  # Format date as string for display
        self.time_label.config(text=current_time_str)
        self.date_label.config(text=current_date_str)
        if current_datetime.strftime('%H:%M:%S') == "00:00:00":
            self.motivation_label.config(text=motivation.get_random_motivation())
        self.after(1000, self.update_time)


    def check_for_alarm_updates(self):
        try:
            alarms_ref = db.collection('users').document(user_id).collection('alarmList')
            alarms = alarms_ref.get()
            self.process_alarms(alarms)
        except Exception as e:
            print(f"Error retrieving alarms: {e}")
        self.after(self.alarm_update_interval, self.check_for_alarm_updates)

    def process_alarms(self, alarms):
        current_datetime = datetime.now()  # Use datetime object for current time
        self.nearest_alarm_time = None
        self.nearest_alarm_id = None
        min_time_diff = timedelta.max
             
        print("Checking for alarms....")
        for alarm in alarms:
            alarm_data = alarm.to_dict()
            if alarm_data.get('isActive', False):
                alarm_time_str = alarm_data.get('time', '')
                #print(f"Alarm data: {alarm_data}")

                # Convert to datetime for proper comparison
                alarm_time = datetime.strptime(alarm_time_str, '%I:%M %p').time()
                alarm_datetime = datetime.combine(current_datetime.date(), alarm_time)

                # Adjust for crossing midnight
                if current_datetime.time() > alarm_time:
                    alarm_datetime += timedelta(days=1)

                time_diff = alarm_datetime - current_datetime
                if time_diff < min_time_diff:
                    min_time_diff = time_diff
                    self.nearest_alarm_time = alarm_datetime
                    self.nearest_alarm_id = alarm.id

        # Update the alarm label for UI
        if self.nearest_alarm_time:
            self.alarm_label.config(text=f'Next Alarm: {self.nearest_alarm_time.strftime("%Y-%m-%d %I:%M %p")}')
        else:
            self.alarm_label.config(text='No active alarms')

    def check_motion(self):
        """
        检测是否有运动，并根据运动情况做出反应。
        """
        motion_detected = GPIO.input(self.motionPin)
        if motion_detected:
            print("Motion detected! Starting motion duration check.")
            self.hints_label.config(text="Motion detected! Starting motion duration check.")
            if not self.check_motion_duration():
                self.after(1000, self.check_motion)
        else:
            print("No motion detected. Rechecking.")
            #self.hints_label.config(text="No motion detected. Rechecking.")
            self.after(1000, self.check_motion)

                
    def check_motion_duration(self):
        """
        检查运动是否满足条件。
        :return: 如果满足条件，返回 True；否则返回 False。
        """
        if self.detect_motion_continuously():
            print("Motion duration satisfied. Stopping the alarm and starting posture recognition.")
            self.hints_label.config(text="Motion duration satisfied. Stopping the alarm and starting posture recognition.")
            pygame.mixer.music.stop()
            self.start_posture_recognition()
            self.after(40000, lambda: self.hints_label.config(text="Alarm Stopped, good job!! Have a nice day!!!"))
            self.after(100000, lambda: self.hints_label.config(text=""))
            
            return True
        else:
            print("Motion duration not satisfied. Rechecking.")
            self.hints_label.config(text="Motion duration not satisfied. Rechecking.")



    def detect_motion_continuously(self, total_duration=30):
        """
        检测给定时间内累积的运动总时长是否达到指定秒数。
        :param total_duration: 需要累积的总时长（秒）。
        :return: 如果累积运动时间达到指定秒数，返回 True；否则返回 False。
        """
        accumulated_time = 0
        start_time = datetime.now()
        print("30SECOND COUNTING.")
        self.hints_label.config(text="Duration counting for 30s, plz keep moving detected!")
        while accumulated_time < total_duration:
            if GPIO.input(self.motionPin):  # 检测到运动
                accumulated_time = (datetime.now() - start_time).total_seconds()
                print("20SECOND COUNTING.{accumulated_time}")
            time.sleep(1)

        return True



            
    def deactivate_alarm(self):
            # 停止闹钟并隐藏按钮
        self.terminate_posture_recognition()
        pygame.mixer.quit()
        GPIO.cleanup()
        #self.deactivate_alarm_button.config(state='disable')
#         self.destroy()
#         self.update_alarm_status(False)  # 更新闹钟状态

    def update_alarm_status(self, is_active):
        try:
            alarm_ref = db.collection('users').document(user_id).collection('alarmList').document(self.current_alarm_id)
            alarm_ref.update({'isActive': is_active})
            print(f"Alarm {self.current_alarm_id} status updated to {is_active}.")
        except Exception as e:
            print(f"Error updating alarm status: {e}")


    def on_closing(self):
        if self.camera_active and self.posture_process:
            self.terminate_posture_recognition()
        pygame.mixer.quit()
        GPIO.cleanup()
        if self.next_alarm_time:
            # Update the alarm status in Firebase
            try:
                alarms_ref = db.collection('users').document(user_id).collection('alarmList')
                for alarm in alarms_ref.get():
                    alarm_data = alarm.to_dict()
                    alarm_time = datetime.strptime(alarm_data.get('time', ''), '%I:%M %p').time()
                    alarm_datetime = datetime.combine(datetime.now().date(), alarm_time)
                    if alarm_datetime == self.next_alarm_time:
                        alarm.reference.update({'isActive': False})
                        print(f"Alarm {alarm.id} is deactivated.")
                        break
            except Exception as e:
                print(f"Error updating alarm status: {e}")
        self.destroy()
        
        
if __name__ == '__main__':
    app = VideoWindow()
    app.protocol("WM_DELETE_WINDOW", app.on_closing)
    app.mainloop()
