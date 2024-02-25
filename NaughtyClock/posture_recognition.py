import cv2
from picamera2 import Picamera2
import mediapipe as mp
import time

# Initialize MediaPipe Pose.
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose()

# Adjust these thresholds according to your criteria for similarity
PRAY_SIMILARITY_THRESHOLD = 0.1
STOP_SIMILARITY_THRESHOLD = 0.1

# Function to calculate similarity based on distance and threshold
def calculate_similarity(distance, threshold):
    return max(0, 1 - (distance / threshold))

# Function to check if the posture is 'Pray'
def is_pray_posture(landmarks, frame_height, frame_width):
    left_wrist = landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST.value]
    right_wrist = landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST.value]
    lw_x, lw_y = int(left_wrist.x * frame_width), int(left_wrist.y * frame_height)
    rw_x, rw_y = int(right_wrist.x * frame_width), int(right_wrist.y * frame_height)
    distance = ((lw_x - rw_x) ** 2 + (lw_y - rw_y) ** 2) ** 0.5
    wrist_threshold = 10
    return calculate_similarity(distance, wrist_threshold)

# Function to check if the posture is 'Stop'
def is_stop_posture(landmarks, frame_height, frame_width):
    left_elbow = landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW.value]
    right_elbow = landmarks.landmark[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
    left_wrist = landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST.value]
    right_wrist = landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST.value]

    le_x, le_y = int(left_elbow.x * frame_width), int(left_elbow.y * frame_height)
    re_x, re_y = int(right_elbow.x * frame_width), int(right_elbow.y * frame_height)
    lw_x, lw_y = int(left_wrist.x * frame_width), int(left_wrist.y * frame_height)
    rw_x, rw_y = int(right_wrist.x * frame_width), int(right_wrist.y * frame_height)

    # Calculate the distances
    left_distance = ((lw_x - le_x) ** 2 + (lw_y - le_y) ** 2) ** 0.5
    right_distance = ((rw_x - re_x) ** 2 + (rw_y - re_y) ** 2) ** 0.5
    elbow_wrist_threshold = 10  # Adjust as needed

    # Calculate average similarity score for both arms
    left_similarity = calculate_similarity(left_distance, elbow_wrist_threshold)
    right_similarity = calculate_similarity(right_distance, elbow_wrist_threshold)
    average_similarity = (left_similarity + right_similarity) / 2
    return average_similarity


# Function to identify posture
def identify_posture(landmarks, frame_height, frame_width, chosen_posture):
    if chosen_posture == "Pray":
        return is_pray_posture(landmarks, frame_height, frame_width)
    elif chosen_posture == "Stop":
        return is_stop_posture(landmarks, frame_height, frame_width)


def posture_recognition(chosen_posture):
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
                similarity_score = identify_posture(results.pose_landmarks, frame_resized.shape[0], frame_resized.shape[1], chosen_posture)
                
                match = similarity_score >= (PRAY_SIMILARITY_THRESHOLD if chosen_posture == "Pray" else STOP_SIMILARITY_THRESHOLD)
                posture_text = "Great! Posture matched!" if match else ""
                if match:
                    cv2.putText(frame_resized, posture_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    cv2.imshow("Pose Recognition", frame_resized)
                    cv2.waitKey(1)  # Display the frame to ensure the text is shown
                    time.sleep(3)  # Keep the message for 3 seconds
                    break  # After showing the message, break from the loop

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
    chosen_posture = "Pray" # or "Stop"
    print("Script started")
    result = posture_recognition(chosen_posture)
    print(f"Result: {result}")
    print("Script ended")
