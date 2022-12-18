// defining required packages
const sql = require('mysql2');
const inquirer = require('inquirer');

let dataB;

 inquirerUser();
 async function init() {
    dataB = await mysql.createConnection(
        {
            //TODO: use the .env 
            host: '127.0.0.1',
            user: 'root',
            password: '7777',
            database: 'department_db'
        },
        console.log(`Connected to the department_db database.`)
    );
}