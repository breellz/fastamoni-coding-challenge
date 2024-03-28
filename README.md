# fastamoni-coding-challenge

## Documentation 

Full documentation is available here

https://documenter.getpostman.com/view/11784799/2sA35Eb3ZJ

The load testing can be run by starting the server in one terminal and running 'test:load' in another. Forever gave issues on windows  
This collection is an api documentation to comprehensive web service using Node.js. The service is deployed on Render and exposes an API that can be consumed by any client. The main goals of this project are:
User Account Creation: The service allow users to create an account with basic information.
User Login: Users can log in to their accounts.
User Wallet: Each user should has a wallet associated with their account.
Transaction PIN: Users can create a transaction PIN for secure transactions.
Donations: Users can create a donation to another user (beneficiary).
Donation Count: Users can check how many donations they have made.
Thank You Message: The service should has the ability to send a special thank you message via email, when a user makes two or more donations.
Donation History: Users can view all donations they have made in a given period of time.

To protect against SQLInjection, I used TypeORM's createQueryBuilder method to build my queries.
TypeORM automatically escapes parameters to prevent SQL injection attacks. This means that any special characters in the parameters that could be used to manipulate the SQL query are escaped, rendering them harmless.
Additinal security improvement added
I validated and sanitized any user input to prevent other types of attacks as a means of additional security.
JWT Token Expiration: I Implemented token expiration for JWT tokens to limit the duration of an active user session.
Hashing Passwords and Pins: I hashed and salt passwords and pins using a secure hashing algorithm, bcrypt.



