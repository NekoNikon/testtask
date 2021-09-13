let path = require('path')
const { allEmployee, addEmployee, delEmployee, getEmployee, saveEmployee } = require('../models/db')

module.exports = (app) => {
    app.get('/getall' , allEmployee)
    app.post('/addemployee', addEmployee)
    app.post('/delemployee', delEmployee)
    app.post('/getemployee', getEmployee)
    app.post('/saveemployee', saveEmployee)
}

