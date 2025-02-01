# **Tone Buddy**  
## **Frontend of an ML-Powered Language Learning App**

---

<img src="/assets/media/logolfinal2.png" alt="Project Logo" width="150">


## **Motivation**
As a Computer Science major with a minor in Chinese Studies, I wanted to combine these two fields into a meaningful project. Mandarin Chinese, a tonal language, has **4 tones**, and the meaning of each word depends on using the correct tone.

For example:  
- **媽 (mā)**: 1st tone = *mother*  
- **罵 (mà)**: 4th tone = *scold*  

Messing up a tone can completely change the meaning of a sentence. This is a common challenge for learners of Mandarin. To address this, I created **Tone Buddy**, an app designed to help learners practice their tones using machine learning (ML).

---

## **Project Breakdown**
This repository is **Step 4** of the overall project: developing a **React Native frontend** for the app. Below is an overview of the full project workflow:

### **Step 1: Tone Classification Model**
- Trained a **Deep Convolutional Neural Network (CNN)** on spectrograms of native Mandarin speakers using:
  - **TensorFlow**
  - **Librosa** (for audio preprocessing)
  - **Python**
- The model predicts the tone of a given word based on its audio spectrogram.

### **Step 2: Dockerized ML Model**
- Deployed the pretrained ML model in a custom **Docker container**.
- The container performs the following:
  1. Accepts user audio input.
  2. Converts the audio into a spectrogram.
  3. Feeds the spectrogram into the ML model.
  4. Returns the predicted tone.

### **Step 3: Serverless Backend**
- Built a scalable backend using:
  - **AWS API Gateway** and **AWS Lambda** for serverless functions.
  - **Amazon S3** for storing user data and spectrogram files.
  - **AWS Fargate** for hosting the Docker container.

### **Step 4: Frontend (This Repository)**
- Developed a **React Native frontend** to provide an intuitive and engaging user experience for learners.

---

## **About This Repository**
This repository contains the **frontend** implementation of the Tone Buddy app that interacts with AWS Backend through API Gateway. Below is an overview of its structure:

### **Directory Structure**
- **`src/screens`**  
  Contains the primary user interface (UI) screens for the app.

- **`src/store`**  
  Includes Redux reducers for managing application state and async thunks for handling API calls.
  - **toneReducer.js** handles async calls and state managment for the tone detection
  - **userReducer.js** handles async calls and state managment for user streak / username / and accuracies
  - **imageReducer.js** fetches images from s3 bucket through presigned url
  - Al store reducers handle API Gateway calls

- **`src/navigation`**  
  Implements the app's navigation, including:
  - **Bottom Tab Navigator** (for main app sections)
  - **Stack Navigator** (for managing screen transitions).

- **`src/components`**  
  Houses reusable UI components like:
  - **VocabCard**
      - Swipable using ``react-native-reanimated``
      - Recording using ``expo-av``
  - **Header**
  - **UserRecap** - display user's stats across characters

- **`assests/media`**  
  Stores images and other static assets used in the project.

---

## **Key Features**
- **Tone Practice:** Enables learners to practice tones with real-time feedback.  
- **Interactive UI:** A user-friendly design powered by React Native.  
- **State Management:** Redux-powered architecture for robust state handling.  
- **Serverless Backend Integration:** Seamless communication with the AWS backend for data retrieval and model predictions.

## **Images & Demo**
<p align="center">
  <img src="/HomeScreen.PNG" width="200">
  <img src="/StreakScreen.PNG" width="200">
  <img src="/HelpScreen.PNG" width="200">
</p>



