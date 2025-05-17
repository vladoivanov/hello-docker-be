const request = require('supertest');
const app = require('./app');

// Mock the db module
jest.mock('./db', () => ({
    getMessages: jest.fn(),
    saveMessage: jest.fn(),
}));

const db = require('./db');

describe('Message API (mocked db)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /messages', () => {
        it('returns a list of messages from mocked db', async () => {
            db.getMessages.mockResolvedValue([
                { id: 1, content: 'Hello mock 1' },
                { id: 2, content: 'Hello mock 2' },
            ]);

            const res = await request(app).get('/messages');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0]).toEqual({ id: 1, content: 'Hello mock 1' });
            expect(db.getMessages).toHaveBeenCalledTimes(1);
        });

        it('returns 500 on db failure', async () => {
            db.getMessages.mockRejectedValue(new Error('db failed'));

            const res = await request(app).get('/messages');

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('POST /submit', () => {
        it('saves a message and returns 201', async () => {
            db.saveMessage.mockResolvedValue();

            const res = await request(app)
                .post('/submit')
                .send({ message: 'New mock message' });

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual({ status: 'ok' });
            expect(db.saveMessage).toHaveBeenCalledWith('New mock message');
        });

        it('returns 400 for empty message', async () => {
            const res = await request(app).post('/submit').send({ message: '' });

            expect(res.statusCode).toBe(400);
            expect(db.saveMessage).not.toHaveBeenCalled();
        });

        it('returns 500 on db failure', async () => {
            db.saveMessage.mockRejectedValue(new Error('insert fail'));

            const res = await request(app)
                .post('/submit')
                .send({ message: 'fail me' });

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error');
        });
    });
});
