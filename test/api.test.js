require('dotenv').config(); // Load environment variables from .env file

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const { default: axios } = require('axios');

chai.use(chaiHttp);

const baseUrl = "https://gorest.co.in"
const bearerToken = process.env.BEARER_TOKEN;

describe('Automation API Testing', () => {
    let userId;


    //POST Create New User
    it('[Positive] - POST Create a new user', async function() {
        const createUser = {
            name: 'rizqi fajar',
            email: 'fajar@gmail.com',
            gender: 'male',
            status: 'active'
        };
    
        try {
            const response = await axios.post(`${baseUrl}/public/v2/users`, createUser, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                }
            });
            expect(response.status).to.equal(201);
            userId = response.data.id;
        } catch (error) {
        }
        
    
        
    })

    //POST Create New User Negative Test (invalid email)
    it('[Negative] - POST Create a new user (invalid email)', async function() {
        const createUser = {
            name: 'rizqi fajar',
            email: 'fajarbukanemail',
            gender: 'male',
            status: 'active'
        };
        try{
            const response = await axios.post(`${baseUrl}/public/v2/users`, createUser, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                }
            });
        } catch (error) {
            expect(error.response.status).to.equal(422);
        }
        
    })

    //GET User Details
    it('[Positive] - GET user details', async function() {

        const response = await axios.get(`${baseUrl}/public/v2/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });
        expect(response.status).to.equal(200);
        expect(response.data.id).to.equal(userId);
        expect(response.data.name).to.equal('rizqi fajar');
        expect(response.data.email).to.equal('fajar@gmail.com');
        expect(response.data.gender).to.equal('male');
        expect(response.data.status).to.equal('active');
    })

    
    //GET User Details NEGATIVE (non-existent id)
    it('[Negative] - GET user details (non-existent id)', async function() {
        

        try{
            const response = await axios.get(`${baseUrl}/public/v2/users/111`, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                }
                
            });
        } catch (error) {
            expect(error.response.status).to.equal(404);
        }
    })
    
    it('[Negative] - GET User Details [invalid token]', async () => {
        const invalidToken = 'invalid_token_here';
    
        try {
          await axios.get(baseUrl, {
            headers: { Authorization: `Bearer ${invalidToken}` }
          });
        } catch (error) {
          expect(error.response.status).to.equal(401);
        }
      });

    //PUT Update User
    it('[Positive] - PUT Update user', async function() {
        const UpdateUser = {
            name: 'hanya fajar',
            email: 'rizqi@gmail.com',
            gender: 'male',
            status: 'active'  
        };
    
        const response = await axios.put(`${baseUrl}/public/v2/users/${userId}`, UpdateUser, {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });
        expect(response.status).to.equal(200);
        expect(response.data.id).to.equal(userId);
        expect(response.data.name).to.equal('hanya fajar');
        expect(response.data.email).to.equal('rizqi@gmail.com');
        expect(response.data.gender).to.equal('male');
        expect(response.data.status).to.equal('active'); 
    })

    //PUT Update User Negative (gender field)
    it('[Negative] - PUT Update user (fill gender aside from male and female)', async function() {
        const UpdateUser = {
            name: 'hanya fajar',
            email: 'rizqi@gmail.com',
            gender: 'trans',
            status: 'active'  
        };
        try {
            const response = await axios.put(`${baseUrl}/public/v2/users/${userId}`, UpdateUser, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                }
            });
        } catch (error) {
            expect(error.response.status).to.equal(422);
        }
    })

    //Delete User
    it('[Positive] - Delete user', async function() {

        const response = await axios.delete(`${baseUrl}/public/v2/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });
    
        expect(response.status).to.equal(204);
    })

    //Delete User Negative Testing
    it('[Negative] - Delete user (non-existent id)', async function() {

        try{
            const response = await axios.delete(`${baseUrl}/public/v2/users/123`, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                }
            });
        } catch (error) {
            expect(error.response.status).to.equal(404);
        }
    })


});