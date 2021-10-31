const helper = require('../lib/helper')

class User {
    constructor(username, password) {
        this.username = username
        this.password = password
        this.id = helper.libraryIdGenerator()
        this.requestedBooks = []
    }
}


module.exports = User