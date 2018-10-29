const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {User} = require('./../db/models/user');

const {ObjectID} = require('mongodb');
const {populateUsers} = require('./seed/seed');

beforeEach(populateUsers);

describe('POST /users',()=>{
    let password = 'testpass';
    let username = 'testuserOne';

    it('should create a new user',(done)=>{
        request(app)
        .post('/users')
        .send({
            username,
            password
        })
        .expect(200)
        .expect((res)=>{
           
        })
    });
});