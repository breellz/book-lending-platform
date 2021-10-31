This file contains the documentation of all the changes I made, including how to interact with the api

I added a userRoutehandler to make provision for the registration of new users, request for books and return of the requested book.

I also added a user model in the model directory for the creation of new users and generation of library IDs

I added a userUtil file to save users to the filesystem and a userRoutehandler file to  handle all requests related to user functions

creating new user:

endpoint: localhost:8080/users
payload: {
    "username": "",
    "password":""
}
method: "POST"

======================================================================

Request for a book:

queryString: localhost:8080/users?name=v77xzkwnwdcnia630nsi9x02yh0243&userid=oni0o0

method: GET

name =  name of the book to be requested

userid = name of the user in the filesystem

(if run once the book is borrowed but if run subsequent times, you get an error that the book has already been borrowed, so you have to return the book before you can borrow again. Also the book count gets reduced by 1)

======================================================================

Return a book

queryString: localhost:8080/users?name=v77xzkwnwdcnia630nsi9x02yh0243&userid=oni0o0

name = name of the book to be returned(as saved in the filesystem)

(if book hasnt been borrowed you cannot return it. if it has, copies available is incremented by 1 and book removed from user model)
