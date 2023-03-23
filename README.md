<h1> Node Authentication </h1>

<h2> Tech Used : </h2>

1. Node.JS
2. Express.JS
3. MongoDB
4. Passport.JS

### Features :

1.  SignUp :

```
- Users can registered themselves
- Error notification will display if the password and confirm password doesnot match
- Encrypted password will be stored in Database
-Error notification will display if we try to signup with the email which is already been registered

```

2.  Login

```
- On sign In user can redirect to homepage with signout and reset button.
- user can login / signup with google authentication
- password will be compared with encrypted password

```

3. Reset Password

```
when user click on reset button after successfully login, an email will be sent to the user's registered email with a link to reset the password.

- when we click the link present in gmail , it will redirect to the change password page.

- once the user entered the new password and submit it ,password will be updated and encrypted password will stored

```

<hr>

## How to use :

### step 1: clone the repo

```
git clone :  https://github.com/Rk344300/Node_Authentication.git

```

### step 2: to install the dependencies

```
npm install

```

### step 3: Put your secret key in the secretKey file

### create a file with secretKeys filename i.e secretKeys.js

### make sure to fill the details.

```
# SESSION SECRET KEY
const SESSION_SECRET_KEY = Enter_Your_Session_Key;

#NODEMAILER EMAIL AND PASSWORD
const TRANSPORTER_EMAIL = ENTER_TRANSPORTER_EMAIL;
const TRANSPORTER_PASSWORD = ENTER_TRANSPORTER_PASSWORD;
const EMAIL_NODEMAILER =ENTER_EMAIL_NODEMAILER

#JWT SECRET
const JWT_SECRET = ENTER_JWT_SECRET;

# PASSPORT GOOGLE CLIENT ID AND SECRET
const PASSPORT_GOOGLE_CLIENTID = ENTER_YOUR_PASSPORT_GOOGLE_CLIENTID
const PASSPORT_GOOGLE_CLIENTSECRET = ENTER_YOUR_PASSPORT_GOOGLE_CLIENTSECRET ;


```

#### Step 4 :- Install Redis

```
sudo apt-get install redis-server
```

#### Step 5 :- Run redis server

```
redis-server
```

#### Step 6 :- To run the application

```
npm start

Application will be running on the PORT - 7000

```

## Folder Structure :-

```
.gitignore
README.md
assets
   |-- css
   |   |-- home_page.css
   |   |-- navbar.css
   |   |-- reset-pass.css
       |-- user_sign_in.css
       |-- user_sign_up.css
config
   |-- flash-middleware.js
   |-- kue.js
   |-- mongoose.js
   |-- nodemailer.js
   |-- passport-google-oauth.js
   |-- passport-local-strategy.js
controllers
   |-- home_controller.js
   |-- users_controller.js
mailers
   |-- reset-password-mailer.js
models
   |-- user.js
routes
   |-- index.js
   |-- users.js
views
   |-- mailer
   |   |-- reset-password.ejs
   |-- home_page.ejs
   |-- layout.ejs
   |-- navbar.ejs
   |-- reset-pass.ejs
   |-- user_sign_in.ejs
   |-- user_sign_up.ejs
worker
   |-- reset-password-worker.js
index.js
package-lock.json
package.json
secretKeys.js
```
