//defining variables for the required package
const mysql = require('mysql2/promise');
const { prompt } = require("inquirer");

let dataB;


inquirerUser();

async function init() {
    dataB = await mysql.createConnection(
        {
            // need help from tutor to create the .env variable to save my credentials
            host: '127.0.0.1',
            user: 'root',
            password: '7777',
            database: 'department_db'
        },
        console.log(`Connected to the department_db database.`)
    );
}

console.log("***********************************")
console.log("*                                 *")
console.log("*   EMPLOYEE MANAGER              *")
console.log("*                                 *")
console.log("***********************************")

// function is starting to view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
async function inquirerUser() {
    await init()

   // when view the department then showing department names and department ids
    const [departments] = await dataB.execute("SELECT department.id, department.name FROM department")
    // when view roles then showing with the job title, role id, the department that role belongs to, and the salary for that role
    const [roles] = await dataB.execute("SELECT department.name, role.title, role.id, role.salary FROM role JOIN department ON role.department_id = department.id;")
    // when view employess then it is presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
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
    // Initial prompt
    const { option } = await prompt([{
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
    }])

    console.log(`You chose to: ${option}`)
    // If statement conditions check which option was selected, and call the appropriate function or query. Calls inquirerUser again so they can choose more options after one is fulfilled - some call in if statements, others call within individual function
    if (option === 'View all departments') {
        console.table(departments)
        inquirerUser();
    } else if (option === 'View all roles') {
        console.table(roles)
        inquirerUser();
    } else if (option === 'View all employees') {
        console.table(employees)
        inquirerUser();
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
// when choosing the department then enter the name of the department and that department is added to the database
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

    inquirerUser();
}
//when choosing the role then enter the name, salary, and department for the role and that role is added to the database
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

    inquirerUser();
}

// when choosing the employee then enter the employee’s first name, last name, role, and manager, and that employee is added to the database
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

    inquirerUser();
}

// when choosing to update an employee role then select an employee to update and their new role and this information is updated in the database 
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

    inquirerUser();

}