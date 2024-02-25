#!/usr/bin/python3   
import RPi.GPIO as GPIO
import time
picam2.configure(camera_config)
picam2.start_preview(Preview.QTGL)  #preview remains on
# set up GPIO
motionPin = 18
GPIO.setmode(GPIO.BOARD)
GPIO.setup(motionPin, GPIO.IN)

# taking photo when motion detected
try:
    for i in range(1, 4):  # loop 3 times
        print("wait for motion...")
        while True:
            motion = GPIO.input(motionPin)
            if motion:  # if motion detected
                print("Motion detected!")              
                break  # end inner while loop and wait for next for loop
        time.sleep(5)  # 5 sec waiting time
except KeyboardInterrupt:
    print("Interrupted by user")

finally:
    GPIO.cleanup()
    print('GPIO Good to Go')

