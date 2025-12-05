# FrontalFriend - Mobile Application

Developed during INIT Build Mobile Development Fall 2025

Team Lead: Eric T. Campillo

Authors: Eric T. Campillo, Alejandro Cordovilla, Gabriel Suarez, Yousuf Habouh

Description:
FrontalFriend is a mobile app that allows users to login to interact with an AI to improve mental health, a destress feature that plays relaxing videos, a reminders feature for medications or other activities, a physical health feature that allows users to store their steps, hours slept, quality of sleep, a contact feature that shows mental health resources and information, and finally an important documents feature that allows users to store important documents to a cloud on supabase for easy access.  

Tech Stack: JavaScript / React Native / Expo Go / Firebase / Supabase / OpenAI GPT-4 

Project Demo: https://drive.google.com/file/d/1YhBCOl9uCzJsyFO0a9d3keIYrqP_oLv-/view?usp=sharing

Installation Instructions:

To install FrontalFriend, you will need to install Node.js and npm as your dependency manager first, available here: -- (https://nodejs.org/en/).

You must then clone the Github repository onto your local machine. You may do this in any file on your computer by doing cd {file path} command in your terminal before running the following clone command in your terminal as well.


git clone https://github.com/flamemik/FrontalFriend

After the repository is cloned, you must go into it by doing cd FrontalFriend in your terminal. Then run these commands in your terminal to install the necessary dependencies:


npm install --global expo-cli
npm install && expo install

Install the expo client on your mobile device or install the Android/Iphone simulator on your computer

iOS: https://apps.apple.com/app/apple-store/id982107779

Android: https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www

Finally, you will need to setup the OpenAI API key to open the chat feature. After this, the application should be ready to start using the command expo start in your command line. This will open a window where Expo will create a QR code on your computer that you can scan with the mobile Expo app to open the application on your smartphone. You may have to wait a minute while your project bundles and loads for the first time. If using a simulator to run the app on your computer, using npm start instead will show instructions on how to run it on the simulator.



API Keys
Please ask Alejandro to obtain the OpenAI API Key for the chat feature.
