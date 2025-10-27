var express = require('express');
var router = express.Router();

var controller = require('../controllers/userController')
const dir = '/dist'
// const dir = '/gulp'


router.get('/', function (req, res, next) {
    res.render('index', {title: 'Социальная сеть', users: controller.users});
});

router.get("/user/:id", (req, res, next) => {
    const id = req.params.id;
    let user = controller.getUser(id)
    if (!user) {
        res.status(404).send('User not found');
    } else {
        res.status(200).render('userProfile', {title: 'Социальная сеть', user: user});
    }
});

router.get("/user/:id/friends", (req, res, next) => {
    const id = req.params.id;
    let user = controller.getUser(id)
    if (!user) {
        res.status(404).send('User not found');
    } else {
        res.render('friends', {title: 'ANTISOCIAL SOCIAL', users: controller.getUserFriends(id)});
    }
});

router.post('/user/:id', (req, res) => {
    const optionsData = req.body;
    const id = req.params.id;
    let user = controller.getUser(id)


    switch (optionsData.method) {
        case 'op':
            user.role = 'admin'
            if (user.status === 'blocked') {
                if (user.info.email === '') {
                    user.status = 'not_verified'
                } else {
                    user.status = 'active'
                }
            }
            break

        case 'deop':
            user.role = 'user'
            break
        case 'ban':
            user.status = 'blocked'
            if (user.role === 'admin') {
                user.role = 'user'
            }
            break

        case 'unban':
            if (user.info.email === '') {
                user.status = 'not_verified'
            } else {
                user.status = 'active'
            }
            break
        default:
            break
    }
    res.json({userRole: user.role, userStatus: user.status})

    controller.saveUsers()
})

router.get('/user/:id/edit', function (req, res, next) {
    const id = req.params.id;
    let user = controller.getUser(id)
    if (!user) {
        res.status(404).send('Book not found');
    } else {
        res.render('edit', {title: "ANTISOCIAL SOCIAL", user: user});
    }
});

router.post('/user/:id/edit', function (req, res, next) {
    const id = req.params.id;
    const data = req.body;

    let user = controller.getUser(id)

    if (req.files) {
        const { image } = req.files;

        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = image.name.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).send('Invalid photo extension.');
        }

        image.mv('./public/images/' + image.name);

        user.info.photo = '../images/' + image.name;
    }

    user.info.first_name = data.first_name
    user.info.second_name = data.second_name

    if (data.email === '' || data.email.indexOf('@') === -1) {
        user.email = ''
        user.status = 'not_verified'
    } else {
        user.info.email = data.email
        user.status = 'active'
    }

    const date = new Date().toISOString().slice(0, 10)
    if (data.birthdate < date) {
        user.info.birthdate = data.birthdate
    }

    res.redirect(`/user/${id}`)
    console.log(controller.users)
    controller.saveUsers()
});

router.get('/user/:id/news', function (req, res, next) {
    const id = req.params.id;
    let user = controller.getUser(id)

    if (!user) {
        res.status(404).send('Book not found');
    } else {
        let news = controller.getUserNews(id)
        res.render('news', {title: "ANTISOCIAL SOCIAL", newsList: news});
    }

});

router.post('/sign_in', function (req, res, next) {
    const data = req.body
    let user = controller.getUser(data.key)

    if (user){
        res.json(user)
    }
    else {
        res.status(404).send('User not found')
    }

});

router.post('/reg', function (req, res, next) {
    const data = req.body
    let user = controller.createUser(data.email, data.first_name, data.second_name, data.birthdate)

    if (user){
        res.json(user)
    }
    else {
        res.status(404).send("Can't create a user!")
    }

});

const fs = require('fs');
const path = require('path');

router.post('/set_photo', async function (req, res, next) {
    try {
        const data = req.body
        console.log('Setting photo for user:', data.key)
        
        let user = controller.getUser(data.key)

        if (user){
            let {image} = req.files
            if (image){
                console.log('Uploaded image:', image.name)

                const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
                const fileExtension = image.name.split('.').pop().toLowerCase();

                if (!allowedExtensions.includes(fileExtension)) {
                    return res.status(400).send('Invalid photo extension.');
                }

                // Используйте абсолютный путь
                const uploadDir = path.join(__dirname, 'public', 'images');
                const uploadPath = path.join(uploadDir, image.name);
                
                console.log('Upload directory:', uploadDir);
                console.log('Upload path:', uploadPath);

                // Создаем папку если не существует
                if (!fs.existsSync(uploadDir)) {
                    console.log('Creating directory:', uploadDir);
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                await image.mv(uploadPath);
                console.log('File moved successfully')

                user.info.photo = '../images/' + image.name;
                console.log('User photo path updated to:', user.info.photo)

                // Сохраняем пользователей
                controller.saveUsers()
                console.log('Users saved')

                console.log('Sending response...')
                res.json(user)
                console.log('Response sent successfully')
            } else {
                console.log('No image file received')
                res.status(400).send('No image file provided')
            }
        }
        else {
            console.log('User not found with key:', data.key)
            res.status(404).send('User not found')
        }
    } catch (error) {
        console.error('=== ERROR in /set_photo ===')
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
        res.status(500).send('Internal server error: ' + error.message)
    }
});

router.post('/delete_photo', function (req, res, next) {
    const data = req.body
    console.log('Deleting photo for user:', data.key);
    
    let user = controller.getUser(data.key)

    if (user){
        user.info.photo = '../images/icon-user.jpg'
        console.log('User photo reset to default:', user.info.photo);
        
        controller.saveUsers()
        res.json(user)
    }
    else {
        res.status(404).send('User not found')
    }
});

router.post('/friends', function (req, res, next) {
    const data = req.body
    let friends = controller.getUserFriends(data.key)

    if (friends){
        res.json(friends)
    }
    else {
        res.status(404).send('User not found')
    }

});

router.post('/delete_friend', function (req, res, next) {
    const data = req.body
    let user = controller.getUser(data.key)
    let friendID = data.friend

    if (user){
        user.friends.splice(user.friends.indexOf(friendID), 1)

        let friend = controller.getUser(friendID)
        friend.friends.splice(friend.friends.indexOf(data.key), 1)

        controller.saveUsers()
        res.json(user)
    }
    else {
        res.status(404).send('User not found')
    }

});

router.post('/add_friend', function (req, res, next) {
    const data = req.body
    let user = controller.getUser(data.key)
    let friendID = data.new_user

    if (user){
        user.friends.push(friendID)

        let friend = controller.getUser(friendID)
        friend.friends.push(data.key)

        controller.saveUsers()
        res.json(user)
    }
    else {
        res.status(404).send('User not found')
    }

});

router.post('/not_friends', function (req, res, next) {
    const data = req.body
    let user = controller.getUser(data.key)
    const all_users = controller.users
    let new_users = []

    if (user){
        if (user.friends){
            for (let new_user of all_users){
                if (!user.friends.includes(new_user.id) && new_user !== user && new_user.status !== 'blocked'){
                    new_users.push(new_user)
                }
            }

        }
        res.json(new_users)
    }
    else {
        res.status(404).send('User not found')
    }

});

router.post('/add_news', function (req, res, next) {
    const data = req.body
    let user = controller.getUser(data.userID)

    if (user){
        user.news.push({text: data.text, date: data.date})

        user.news = controller.filterNews(user.news)

        controller.saveUsers()
        res.json(user)
    }
    else {
        res.status(404).send('User not found')
    }

});

router.post('/get_news', function (req, res, next) {
    const data = req.body
    let user = controller.getUser(data.key)

    if (user){
        res.json(controller.getUserNews(data.key))
    }
    else {
        res.status(404).send('User not found')
    }

});

router.post('/add_message', function (req, res, next) {
    console.log("Received data:", req.body); // Логируем данные запроса для отладки
    
    try {
        const data = req.body;

        // Проверяем, что данные содержат все необходимые поля
        if (typeof data.userID === 'undefined' || typeof data.friendID === 'undefined' || 
            typeof data.text !== 'string' || typeof data.date !== 'string') {
            return res.status(400).send('Missing required fields');
        }

        // Получаем пользователя по ID
        let user = controller.getUser(data.userID);
        if (!user) {
            return res.status(404).send('User not found');
        }

        let friendID = data.friendID;
        // Ищем существующий диалог
        let dialog = user.messages.find(d => d.to === friendID);

        // Если диалог не найден, создаем новый
        if (!dialog) {
            dialog = { to: friendID, content: [] };
            user.messages.push(dialog);
        }

        // Добавляем новое сообщение в диалог
        dialog.content.push({ text: data.text, date: data.date });

        // Сохраняем обновленного пользователя
        controller.saveUsers();
        res.json(user);
    } catch (error) {
        console.error('Error in /add_message route:', error);
        res.status(500).send('Internal server error');
    }
});



module.exports = router;
