import cv2
import numpy as np
from picamera2 import Picamera2
import mediapipe as mp
import time

# Initialize MediaPipe Pose.
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose()

# Threshold for the strong pose similarity
STRONG_SIMILARITY_THRESHOLD = 0.7

# Function to calculate similarity based on the angle and a threshold
def calculate_similarity(angle, threshold):
    similarity = max(0, 1 - (abs(angle - threshold) / threshold))
    return similarity

# Function to check if the posture is 'Strong'
def is_strong_posture(landmarks, frame_height, frame_width):
    left_shoulder = landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    right_shoulder = landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    left_elbow = landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW.value]
    right_elbow = landmarks.landmark[mp_pose.PoseLandmark.RIGHT_ELBOW.value]

    def calculate_angle(shoulder, elbow):
        shoulder_x, shoulder_y = shoulder.x * frame_width, shoulder.y * frame_height
        elbow_x, elbow_y = elbow.x * frame_width, elbow.y * frame_height
        angle = np.abs(np.arctan2(elbow_y - shoulder_y, elbow_x - shoulder_x) * (180 / np.pi))
        return angle

    left_arm_angle = calculate_angle(left_shoulder, left_elbow)
    right_arm_angle = calculate_angle(right_shoulder, right_elbow)

    ideal_angle = 170  # Slightly less than 180 to allow for a strong pose

    left_similarity = calculate_similarity(left_arm_angle, ideal_angle)
    right_similarity = calculate_similarity(right_arm_angle, ideal_angle)

    similarity_score = (left_similarity + right_similarity) / 2
    return similarity_score

def run_posture_recognition(time_limit=60):
    # Initialize PiCamera2
    piCam = Picamera2()
    camera_resolution = (800, 480)
    piCam.preview_configuration.main.size = camera_resolution
    piCam.preview_configuration.main.format = "RGB888"
    piCam.preview_configuration.align()
    piCam.configure("preview")
    piCam.start()
    print("Camera preview started")

    start_time = time.time()
    recogniton_success = False # Default to failure

    try:
        while True:
            # Capture frame and process it
            frame = piCam.capture_array()
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(frame_rgb)
            frame_resized = cv2.resize(frame, camera_resolution)

            # Display "Posture Strong" message by default
            cv2.putText(frame_resized, "Posture Strong", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.imshow("Pose Recognition", frame_resized)

            if results.pose_landmarks:
                mp_drawing.draw_landmarks(frame_resized, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
                similarity_score = is_strong_posture(results.pose_landmarks, frame_resized.shape[1], frame_resized.shape[0])
                
                if similarity_score >= STRONG_SIMILARITY_THRESHOLD:
                    # Posture is matched
                    cv2.putText(frame_resized, "Great! You did it!", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    cv2.imshow("Pose Recognition", frame_resized)
                    cv2.waitKey(1)  # Display the frame to ensure the text is shown
                    time.sleep(3)  # Hold the message for 3 seconds
                    recogniton_success = True  # Success
                    break

            if (time.time() - start_time) > time_limit:
                # Time limit exceeded
                cv2.putText(frame_resized, "Oppppps, you failed presenting the posture!", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                cv2.imshow("Pose Recognition", frame_resized)
                cv2.waitKey(1)  # Display the frame to ensure the text is shown
                time.sleep(3)  # Hold the message for 3 seconds
                recogniton_success = False  # Failure
                break

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        pose.close()
        piCam.stop()
        cv2.destroyAllWindows()
        return recogniton_success

if __name__ == "__main__":
    print("Script started")
    recogniton_result = run_posture_recognition()
    print(f"Result: {recogniton_result}")
    print("Script ended")