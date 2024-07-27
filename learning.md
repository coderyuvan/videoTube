### Connecting database in MERN with debugging(lec-8)
- Created MongoDb Atlas account.
- Created a Database and connect I.P Address to access database from anywhere.
- Used `dotenv , mongoose , express` packages.
- Two important points about database connectivity: 

    1. When connecting to databases, handling potential data-not-found scenarios is essential. Employ try/catch blocks or promises to manage errors or we can also use promises.

        - key to remember : ( wrap in try-catch )
# 
    2. Database operations involve latency, and traditional synchronous code can lead to blocking, where the program waits for the database query to complete before moving on. So, we should async/await which allows for non-blocking execution, enabling the program to continue with other tasks while waiting for the database response. 

        - key to remember :  ( always remember the database is in another continent, so use async await)

    3. alwyas use IIFE BEGINING with ; 

- Used two approach to connect the database - 1. In Index File, 2. In Seprate DB file

- Assignments - 
    - console log `connectionInstance`
    - Read more about process.exit code

# lecture 9 error handling custom api

index.js m jb app export kri to ek promise mila h jo connectDB m lgega taaki vo listen kre or server
start ho ab promise mila h to .then .ctahc we can use in that function taki vo port listen kre
npm i cookie-parser cors installed theese 2

1.in app.js configure corss now 
 
use of cokkier-parser apne server user k browser ki cookies
accept and set kr paaoun uski cookies p ican use crud operations 


# LECTURE 10 user and video model
1.user m ek watch histroy naam ka object bnaayenge usme jpo v video vo user play krega uska id de denge
taaki histroy store kr ske

2. hr video ka ek owner uska thumbnail to dikhaate hi h na

3. username m index true kra bcoz kisi databse m ki field ko searchable bnana h vo v optimizable way m

4.mongoos agregate pagination true power of mongo db install in project
isko video file m export se phle use krna h

usp of project : mongoose aggragation pagination

5. in usermodel we use bycrypt it helps to hash our passwords(encrypt psass ko dycrpt)

6. install jwt for to create tkoen based on cryptography protected by seceret keyword

7. jwt :- ek bearer token means jo v isko bhejega usko yhe data bhejdega

# What is pagination in MongoDB?

Pagination in MongoDB refers to the process of dividing a large dataset into smaller, manageable chunks, called pages, to improve query performance and user experience. This is particularly useful when dealing with large collections that contain thousands or millions of documents.

# Why do we need pagination in MongoDB?

Without pagination, when you query a large collection, MongoDB would return all the matching documents in a single response, which can lead to:

Performance issues: Retrieving a large number of documents can be slow and resource-intensive, causing performance degradation.
Memory constraints: The MongoDB driver and your application may run out of memory when handling large result sets.
User experience: Displaying a massive amount of data to the user can be overwhelming and negatively impact the user experience.
How does pagination work in MongoDB?

MongoDB provides several ways to implement pagination, including:

Limit and Skip: Using the limit and skip operators to retrieve a specific number of documents, skipping a specified number of documents.
Cursor-based pagination: Using a cursor to iterate over the result set, retrieving a batch of documents at a time.
Aggregation framework: Using the aggregation framework to process and paginate data in a more efficient and flexible way.



# LECTURE 11 file uploading in backend
we will use multer 

strategy for file uploading 
user se file upload multer k through hi hogi

1: hm multer ka use user se file lenge and apne
local system p temporaily us file ko rkh denge

2:then clodinary ka use krte hue local stoarge se upload kr denge on clodinary


these 2 bcoz hnces of repload on server in production

if file uplaoding is doen successfully then remove from server


part 2 
creating a middleware ki file uplaod se phle meet me using multer docs for refer


# LECTURE 12 HTTP CRASH COURSE REFER NOTES


# LECTURE 13
created a controller user then a method 
we want ki yhe method tb cll ho jb koi url hit kre to for that we need to create route in route folder then created a router

2. user ka controller bna lia route bna lia export krlia ab usko app.js m import kro writw after all the midle wares

3.on declaration in app js of user router control will went to user router ki ab btaao url hit hua h now what to do

import user from .// if export defalut ho
import {abc} if xport {} aise ho rha h 




# LECTURE 14  logic building register controller

# task:user ko register kraana h 

steps:(Algoritm)
1: get user details from frontend
2: check for validation whether every field is emtered correctly or something are msising some format like email is wrong
3:check if user already exsist or not using usernmame,enmail
4:check for images,avatar using multer
5:upload them to cludinary,again check for avatar
6:if all is ok then save user to database
by creating a user object-create entry in db
7:remove password and refresh token feild from response we dont want ki user ko password bheja jaaye
8:check for user creation using a response
9: return response iff created user succesfully else return error

l# ec-15 debug ka and postman seekha 


# LECTURE-16 Access Refresh Token, Middleware and cookies in Backend

Access token -short term expire 
user ko validate isee krte h
jb tk h yhe tb tk jo v feaature jisme authentication req h we can use that ki hr koi server p file na daale


Refresh token- long term expiry
db m v save rkhte h user ko v dete h or user ko kheteh 1 api hit kro baar baar password daalne ki need na ha
afr tera or db ka refresh token same h to good 

# task :user registered ho gya h ab login ki bari

1.take details from user for login
2.username or email
3.find the user
4.if not find send msg else password check krao
5. if pssword check true  generate access and referesh tken and give to user
6.send cokkies


task :user ko logout kraao
1:find user and remove cookies
2:remove refresh token from db

khud ka middleware bnaya h iskleiye usko ache se prepare krna hoga 

# LECTURE-17 SAME TITLE AS 16
access token or refresh token ka kaam bs itna h ki user ko baar baar apna email password na dena pde

refresh token db m store rheta h to jb v hme need ho simply sko refresh kra lete h 
 agr 401 aa gya is an exapmle

 frontend wala ek api hit krakr access or refrsh token ko refresh kra leta h


# LECTURE -18 WRITING UPDATE CONTROLLERS
change currentPassword ka function
logic :- no tension ki token cokkie ka route m middleware lga denge

1:find user (ab user password chnge kr pa rha h  to vo logged in to h tbhi kr pa rha h bcoz middleware lgaya h jo req.user de rha h  )

# NEW password daala h to pre hook run hoga  


//Current user ko get krna h ka function
routing m dhyaan rkho router bnaya h authmiddle ka to use krna h taaki user midle

# // all details ka function

# // UPDATE FEilds ka function
1. use multer middleware taaki files accept ho
2. find user using auth middleware

//updating coverimage ka function



# // understanding subscription schema

hr baar ek new document bnta h jb v subcribe hota h channel 

to get number of subscriber : select no of document mathcing to that channel jiske subscriber chaiye then count that 
document to get subscriber

to get 1 user kitne channel ko subscribe kia h celect channel where user= that user

# // lecture 20 
writing pipelines :
araays return hota uske ander fir fields  in terms of object 
to tables ko join krn k lie lookup use krte h  uski fields
1. from konsi table ko join krna
2. locolfiled primary key
3. foriegnfield foreign key
as :""

get user channel profile ki  details ka fucntion 
1. kisi v channel p jaane k lie we need url to get that from req.params
2. check that if we got that user name or not 
3.apply aggregation pipeline match operator
then , {} m apply lookup


# LECTURE 21 subpipelines
1. pipeline m pipeline use krna h
 2. watch histroy nikaalne k lie video ki id lenge to look up krna pdega user ka videos se

 owner v to chaiye taaki uski value aaye or vo ek user h to hme ek or lookup krna hoga jo ki nested lookup hoga

 nested lookup q krna h bcoz 
watchhsitroy se join krte himultiple documents milenge for videos but unme owner nhi hoga to jaise hi yhe lookup hua usi tym k or lookup to get perfect document


req.user_id se hme string milega jo ki mongoose find findby id m automatic usse monogodb m behnd search kr lega