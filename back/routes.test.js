const request = require('supertest');
const usersController = require('./controllers/userController');

const app = require("./app");

describe('GET /users/:id', () => {
    it('should respond with status 200 when the user is found', async () => {
        const response = await request(app).get('/user/1');

        expect(response.status).toBe(200);
    });

    it('should respond with a 404 status when the user is not found', async () => {
        const response = await request(app).get('/user/120');

        expect(response.status).toBe(404);
    });
});
