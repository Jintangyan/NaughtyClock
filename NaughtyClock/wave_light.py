import cv2
import numpy as np
from picamera2 import Picamera2
import mediapipe as mp
import time

# Initialize MediaPipe Pose.
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose()

# Function to check if the posture is 'Wavy Light'
def is_wavy_light_posture(landmarks, frame_width):
    # Get landmarks for fingertips and wrists
    left_index = landmarks.landmark[mp_pose.PoseLandmark.LEFT_INDEX.value]
    right_wrist = landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST.value]
    right_index = landmarks.landmark[mp_pose.PoseLandmark.RIGHT_INDEX.value]

    # Calculate the position of the right palm approximately using the wrist and index finger
    right_palm_x = (right_wrist.x + right_index.x) / 2
    right_palm_y = (right_wrist.y + right_index.y) / 2

    # Calculate distance between left index fingertip and the approximate center of the right palm
    distance = np.sqrt((left_index.x - right_palm_x) ** 2 + (left_index.y - right_palm_y) ** 2) * frame_width

    # Set a threshold for how close the index finger should be to the palm
    distance_threshold = 50  # This threshold can be adjusted according to the camera's resolution and distance from the subject

    # If the distance is less than the threshold we assume the 'Wavy Light' pose is matched
    return distance < distance_threshold


def posture_recognition():
    try:
        # Initialize Picamera2
        piCam = Picamera2()
        camera_resolution = (800, 480)
        piCam.preview_configuration.main.size = camera_resolution
        piCam.preview_configuration.main.format = "RGB888"
        piCam.preview_configuration.align()
        piCam.configure("preview")
        piCam.start()
        print("Camera preview started")

        while True:
            frame = piCam.capture_array()
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(frame_rgb)
            frame_resized = cv2.resize(frame, camera_resolution)

            if results.pose_landmarks:
                mp_drawing.draw_landmarks(frame_resized, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
                wavy_light_matched = is_wavy_light_posture(results.pose_landmarks, frame_resized.shape[0], frame_resized.shape[1])
                
                posture_text = "Wavy Light: Matched" if wavy_light_matched else ""
                
                cv2.putText(frame_resized, posture_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            cv2.imshow("Pose Recognition", frame_resized)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        pose.close()
        piCam.stop()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    print("Script started")
    posture_recognition()
    print("Script ended")
