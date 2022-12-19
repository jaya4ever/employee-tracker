// defining required packages
const mysql = require('mysql2');
const {inquirer} = require('inquirer');

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
async function inquirerUser(){
    await init()
    const [departments] = await dataB.execute("SELECT department.id, department.name FROM department")
    const [roles] = await dataB.execute("SELECT role.id, role.title, role.salary FROM role JOIN department ON role.department_id = department.id;" )
    const [employees] = await dataB.execute(`SELECT employee.id, employee.first_name, employee.last_name, role.title as roleTitle, department.name as departmentName, role.salary, manager.first_name AS managerName
    FROM (
    (employee JOIN role ON role_id = role.id)
    left join 
    (SELECT * FROM employee) as manager
    on manager.id = employee.manager_id
    JOIN 
    department 
    ON department_id = department.id
    );`)
}
const { option } = await inquirer([{
    type: 'list',
    name: 'option',
    message: 'What would you like to do?',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
}])
//choosing an option
console.log(`Choose an option: ${option}`);

if (option === 'View all departments') {
    console.table(departments)
    promptUser();
} else if (option === 'View all roles') {
    console.table(roles)
    promptUser();
} else if (option === 'View all employees') {
    console.table(employees)
    promptUser();
} else if (option === 'Add a department') {
    addDepartment();
} else if (option === 'Add a role') {
    addRole(departments);
} else if (option === 'Add an employee') {
    addEmployeePrompt(roles, employees);
} else if (option === "Update an employee role") {
    updateEmployeePrompt();
} else { process.exit() };


