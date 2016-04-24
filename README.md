# Safran QR Tracker

Application to keep track of every interventions made on an equipement, by its name and serial number.

Using a QR code scanner to log any new intervention or check the history of an equipement, was a key element of the project

The following scanner application is recommended : Kairos Flash QR Reader :

* iOS : https://itunes.apple.com/us/app/kairos-flash-qr-reader-app/id635275252
* Android : https://play.google.com/store/apps/details?id=com.kairos.flash.client.android

**It is mandatory to enabled safari redirection for the iOS application**

**Please login to the website on your mobile device before scanning and trying to add new element to the application**

### How to use
---
* Use the application on desktop to check the history of every equipment
* Search equipment by name and every serial related to this equipement
* tracking page with equipment history and possiblity to add a new log

* On mobile, use the QR code scanner to simplify the tracking process


### QR code generator
---
http://www.qr-code-generator.com/

### URL format for QR code redirection
---
https://**YOUR_URL**/#/tracking?equipment=**EQUIPEMENT_NAME**&serial=**SERIAL_NUMBER**


## Technologies Stack
---

* FRONT
  * **AngularJS** Framework
  * **Sass** for CSS
* BACK
  * **Node.js/Express** Server
* OTHER
  * **Gulp** as Task runner for Js and Sass files
  
## Front
---

Edit the `configFile.json` and run `gulp config-files`, to update the configuration of the application.

Run `gulp watch` to start watching Js and Sass files


## Server
---
  
### Configuration file

You need to add a .env file in the root folder.

You can find an example of the file in the documentations folder: [.env](Documentations/dotenvfile.json).

The SECRET is required in order to allow only authorized users to signup

### Local installation
---

Install dependencies `npm install`<br>
Run the server with `nodemon`