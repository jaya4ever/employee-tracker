const mysql = require('mysql2/promise');
const { prompt } = require("inquirer");
let dataB;

promptUser();

async function init() {
    dataB = await mysql.createConnection(
        {
            host: '127.0.0.1',
            user: 'root',
            password: '7777',
            database: 'department_db'
        },
        console.log(`Connected to the employees_db database.`)
    );
}

console.log("***********************************")
console.log("*                                 *")
console.log("*   EMPLOYEE TRACKER              *")
console.log("*                                 *")
console.log("***********************************")

async function promptUser() {
    await init()

    const [departments] = await dataB.execute("select department.id, department.name from department")

    const [roles] = await dataB.execute("SELECT department.name, role.title, role.id, role.salary FROM role JOIN department ON role.department_id = department.id;")

    const [employees] = await dataB.execute(`select employee.id, employee.first_name, employee.last_name, role.title as roleTitle, department.name as departmentName, role.salary, manager.first_name AS managerName
    from (
    (employee JOIN role ON role_id = role.id)
    left join 
    (select * from employee) as manager
    on manager.id = employee.manager_id
    JOIN 
    department 
    ON department_id = department.id
    );`)
    // Initial prompt
    const { option } = await prompt([{
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
    }])

    console.log(`You chose to: ${option}`)
    // If statement conditions check which option was selected, and call the appropriate function or query. Calls promptUser again so they can choose more options after one is fulfilled - some call in if statements, others call within individual function
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

}

async function addDepartment() {
    const { newDepartment } = await prompt([{
        type: 'input',
        name: 'newDepartment',
        message: 'Enter the department name you want to add to the list.',
    }])
    console.log(newDepartment);

    const departmentName = newDepartment;
    let query = 'INSERT into department (name) VALUES (?)';
    let args = [departmentName];
    const help = await dataB.query(query, args);
    console.log(`Added department named ${departmentName}`);
    const [departments] = await dataB.execute("select * from department")
    console.table(departments);

    promptUser();
}

async function addRole(departments) {


    const response = await prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the new role.',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary of the new role.',
        },
        {
            type: 'list',
            name: 'department',
            message: 'Choose the department for the new role.',
            choices: departments.map(department => ({ name: department.name, value: department }))
        },
    ])


    const { title, salary, department } = response
    console.log(title, salary, department);

    const roleTitle = title;
    const roleSalary = salary;
    const roleDepartment = department.id;

    let query = 'INSERT into role (title, salary, department_id) VALUES (?, ?, ?)';
    let args = [roleTitle, roleSalary, roleDepartment];
    const help = await dataB.query(query, args);
    console.log(`Added role titled ${roleTitle} with salary of ${roleSalary}`);

    const [roles] = await dataB.execute("SELECT department.name, role.title, role.id, role.salary FROM role JOIN department ON role.department_id = department.id;")
    console.table(roles);

    promptUser();
}


async function addEmployeePrompt(roles, employees) {
    const response = await prompt([
        {
            type: 'input',
            name: 'firstName',
            message: `Enter the new employee's first name.`,
        },
        {
            type: 'input',
            name: 'lastName',
            message: `Enter the new employee's last name.`,
        },
        {
            type: 'list',
            name: 'role',
            message: `Choose the new employee's role.`,
            choices: roles.map(role => ({ name: role.title, value: role }))
        },
        {
            type: 'list',
            name: 'manager',
            message: `Who is the new employee's manager?`,
            choices: employees.map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee }))
        },
    ])

    const { firstName, lastName, role, manager } = response
    console.log(firstName);
    console.log(lastName);
    console.log(role.id);
    console.log(firstName, lastName, role, manager);

    const employeeFN = firstName;
    const employeeLS = lastName;
    const employeeRole = role.id;
    const employeeManager = manager.id

    let query = 'INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    let args = [employeeFN, employeeLS, employeeRole, employeeManager];
    const help = await dataB.query(query, args);
    console.log(`Added employee named ${employeeFN} ${employeeLS}.`);

    const [updatedEmployees] = await dataB.execute("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, department.name, role.title, role.salary FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);")
    console.table(updatedEmployees);

    promptUser();
}


async function updateEmployeePrompt() {
    const [roles] = await dataB.execute("select * from role")
    const [employees] = await dataB.execute("select * from employee")
    const response = await prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee do you want to update?',
            choices: employees.map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee }))
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is their new role?',
            choices: roles.map(role => ({ name: role.title, value: role }))
        },
    ])

    const { employee, role } = response
    console.log(employee, role);

    const employeeName = employee.first_name;
    const roleTitle = role.title;
    const employeeId = employee.id;
    const newRole = role.id;

    let query = 'UPDATE employee SET role_id=? where id=?;';
    let args = [newRole, employeeId];
    const help = await dataB.query(query, args);
    console.log(`Updated ${employeeName}'s role to ${roleTitle}`);

    const [updatedEmployees] = await dataB.execute("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, department.name, role.title, role.salary FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);")
    console.table(updatedEmployees);

    promptUser();

}