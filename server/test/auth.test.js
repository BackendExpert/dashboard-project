const request = require('supertest');
const express = require('express');

jest.mock('../controllers/auth.controller', () => ({
    createAuth: jest.fn((req, res) => {
        res.status(201).json({ message: 'Auth created' });
    }),
    verifyOTP: jest.fn((req, res) => {
        res.status(200).json({ message: 'OTP verified' });
    }),
}));

const authRoutes = require('../routes/auth.route');
const authController = require('../controllers/auth.controller');

describe('Auth Routes', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/auth', authRoutes);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /auth/create-auth', () => {
        it('should call createAuth controller and return 201', async () => {
            const response = await request(app)
                .post('/auth/create-auth')
                .send({ email: 'test@test.com' });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Auth created');
            expect(authController.createAuth).toHaveBeenCalledTimes(1);
        });
    });

    describe('POST /auth/verify-otp', () => {
        it('should call verifyOTP controller and return 200', async () => {
            const response = await request(app)
                .post('/auth/verify-otp')
                .send({ otp: '123456' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('OTP verified');
            expect(authController.verifyOTP).toHaveBeenCalledTimes(1);
        });
    });
});
