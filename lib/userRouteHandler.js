
const User = require('../model/user')
const userUtil = require('../lib/userUtil')
const fileUtil = require('../lib/fileUtil')

let userRouteHandler = {}

userRouteHandler.Users = (data, callback) => {
    const acceptableHeaders = ["post", "get", "put"];
    if (acceptableHeaders.indexOf(data.method) > -1) {
        userRouteHandler._users[data.method](data, callback);
    } else {
        callback(405);
    }
};
 //main user route object
userRouteHandler._users = {};
 // route for creating new user

userRouteHandler._users.post = (data, callback) => {

    //if query string is provided, return a book, else register new user
    if (data.query.name && data.query.userid) {
        userUtil.read('users', data.query.userid, (err, user) => {
            if(!user) {
                callback(404, {message: "user not found"})
                return
            }
            if(user.requestedBooks.indexOf(data.query.name) > -1) {
                
                fileUtil.read('books', data.query.name, (err, book) => {
                if(!err) {
                    book.copiesAvailable +=1
                    const updatedBook = JSON.stringify(book)
                    fileUtil.write('books', data.query.name, updatedBook, (msg) =>{
                        if(msg) {
                            const returnedBookIndex = user.requestedBooks.indexOf(data.query.name)
                           user.requestedBooks.splice(returnedBookIndex, 1)
                           const updatedUser= JSON.stringify(user)
                           userUtil.write('users', data.query.userid, updatedUser, (msg) => {   
                           })
                           callback(200, {message: "Book returned successfully"})
                        }
                    })
                }
                
            })
                
            } 
        })
    } else {
        const newUser = new User(data.payload.username, data.payload.password)
        const userId = newUser.id
        userUtil.create('users', userId, newUser, (err) => {
           if (!err) {
               callback(200, { message: "user added successfully", data: null });
           } else {
               callback(400, { message: err });
           }
        })
    }
    

 }

 // route for requesting a book

 userRouteHandler._users.get = (data, callback) => {
    userUtil.read('users', data.query.userid, (err, user) => {
        if(err) {
            callback(404, {message: "user not found"})
            return
        }
        if(user.requestedBooks.indexOf(data.query.name) > -1 && data.query.name ) {
            callback(401, {message: 'You already borrowed this book'})
        }else {
            fileUtil.read('books', data.query.name, (err, book) => {
                if (!err && book) {
                    //decrease book count if book is available
                    if(book.copiesAvailable < 1) {
                        callback(404,{message:'Book unavailable'})
                        return
                    }
                    book.copiesAvailable -= 1
                    const updatedBook = JSON.stringify(book)
                    userUtil.write('books', data.query.name, updatedBook, (err, book) => {
                        if(!err) {
                            callback(200, {message:"resource updated"})
                        }
                    })

                    /*populate requested books array with the requested book's name, which can be used to fetch the books
                    borrowed later if needed*/
                    user.requestedBooks.push(data.query.name)
                    const updatedUser = JSON.stringify(user)
                    userUtil.write('users', data.query.userid, updatedUser, (err, user) => {
                        if(!err) {
                            callback(200, {message: "user updated"})
                        }
                        
                    })
                    callback(200, { message: 'book borrowed', book });

                } else {
                    callback(404, { err: err, data: data, message: 'could not retrieve user' });
                }
            })
        }
    })
 }        
   
 module.exports = userRouteHandler;
 

