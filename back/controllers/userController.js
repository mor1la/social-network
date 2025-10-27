class Controller {
    constructor() {
        this.users = require("../users.json");
        this.count = this.users.length;
    }

    filterNews(news) {
        news.sort(compare)
        return news
    }

    getUserNews(userID) {
        const userFriends = this.getUserFriends(userID)

        if (userFriends !== []) {
            const news = []

            for (const friend of userFriends) {
                news.push(...friend.news.map((elem) => {
                    return {
                        text: elem.text,
                        date: elem.date,
                        author: friend
                    }
                }))
            }

            return this.filterNews(news)
        }

        return []
    }

    getUser(userID) {
        return this.users.find(user => user.id === Number(userID));
    }

    getUserFriends(userID) {
        const user = this.getUser(userID)

        if (user) {
            let friends = []

            for (const friendID of user.friends) {
                let friend = this.getUser(friendID)
                if (friend && friend.status !== 'blocked') {
                    friends.push(friend)
                }
            }

            return friends
        }

        return []
    }

    saveUsers() {
        fs.writeFileSync('./users.json', JSON.stringify(this.users, null, 2))
    }

    createUser(email, first_name, second_name, birthdate) {
        let maxID = -1
        for (const user of this.users) {
            maxID = user.id >= maxID ? user.id : maxID
            if (user.info.email === email) {
                return null
            }
        }

        let re = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')
        let valid_email = re.test(email) ? email : ''
        let valid_birthdate = new Date(birthdate) <= new Date() ? birthdate : ''

        this.users.push({
            id: maxID + 1,
            role: 'user',
            status: valid_email !== '' ? 'active' : 'not_verified',
            info: {
                email: valid_email,
                first_name: first_name,
                second_name: second_name,
                birthdate: valid_birthdate,
                photo: '../images/icon-user.jpg'
            },
            friends: [],
            news: [],
            messages: []
        })

        this.saveUsers()

        return this.getUser(maxID + 1)

    }

}


function compare(a, b) {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return dateB - dateA;
}


const controller = new Controller();
const fs = require('fs')

module.exports = controller;
