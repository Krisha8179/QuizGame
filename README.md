## QuizGame

A node.js app for RealTime Quiz .

## Server features

1. Sets up middleware for user authentication (used JWT authenticatioin).
2. Connects to the MysqlDB using sequelize for CRUD operations.
3. Used Express server to serve API endpoints.
4. Intergrated sendInBlue to send mail.
5. Used socket to connect realtime chat.

## Description

* User can login through login page , if new user then user can register.
* Once the user logins, page will show the rooms which are available to join and play.
* A room will allow only two players to join. Once the room is full it will start the game.
* If there is no rooms are available to join then user can create a room and wait for the another player to join. And the created room will be displayed for all other users to join.
* Once the both users joins the room , it will show 5 seconds timer to start the game.
* After the 5 seconds , game will start and it will shows the questions on by one up to 5 question.
* Each question has 10 seconds to select the correct option. For correct option it will increase your score 10 points.
* Once after the 10 questions it will show the scores of two players on the screen, and also the player who won on the screen.
* After completing the game it will delete the room.

## API endpoints

1. **/user/signup**  - To register new users.
2. **/user/login**  - For login users.
7. **/password/updatePassword/:resetPasswordid**  - To upadate the password to DB.
8. **/password/resetPassword/:id**  - To reset the password.
9. **/password/forgotpassword**  - To use when you forgot password.
10. **/question/random-question**  - To get random questions from db.


## Dependencies

* Cors (Any origin works in our API)
* Express
* sequelize(to connect to mysql)
* Mysql (schemas)
* dotenv (get the .env file working with environment variables)
* bcrypt (Hash our password) 
* JWT (Jason Web Tokens)
* body parser(to parse the incoming body requests)


 
