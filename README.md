# 12 SQL: Employee Tracker
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
## Description
### This is the module challenge 12 . This challenge is to create an application called Employee tracker. I worked on this application with the help of my tutor, my team and was doing practicing. I was going through the class recording, [Mozilla]( https://developer.mozilla.org/en-US/docs/Web/JavaScript "dev.Mozilla"), [w3schools](https://www.w3schools.com/js/ "w3Schools"), asked questions in [stackoverflow](https://stackoverflow.com "stackoverflow.com"). I took help from everyone while conpleting this challenge.This project uses MySql and Node through the command line to allow business owners to view and manage their departments, roles, and employees in order to organize and plan their business. In this homework assignment, our challenge is to architect and build a solution for managing a company's employees using node, inquirer, and MySQL.A command line application Content Management Systems for managing a company's employees where it can view and manage the departments, roles, and employees.


## Installation
* Cloned the given starter code
* To Run this application Node.js is required
* Install the npm install for the required npm pacakges

## This is my GitHub Repository which I named Employee-Tracker
[GitHub](https://github.com/jaya4ever/employee-tracker "GitHub Repository")



## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```



## Getting Started


* `department`

    * `id`: `INT PRIMARY KEY`

    * `name`: `VARCHAR(30)` to hold department name

* `role`

    * `id`: `INT PRIMARY KEY`

    * `title`: `VARCHAR(30)` to hold role title

    * `salary`: `DECIMAL` to hold role salary

    * `department_id`: `INT` to hold reference to department role belongs to

* `employee`

    * `id`: `INT PRIMARY KEY`

    * `first_name`: `VARCHAR(30)` to hold employee first name

    * `last_name`: `VARCHAR(30)` to hold employee last name

    * `role_id`: `INT` to hold reference to employee role

    * `manager_id`: `INT` to hold reference to another employee that is the manager of the current employee (`null` if the employee has no manager)

You might want to use a separate file that contains functions for performing specific SQL queries you'll need to use. A constructor function or class could be helpful for organizing these. You might also want to include a `seeds.sql` file to pre-populate your database, making the development of individual features much easier.

## Bonus

Try to add some additional functionality to your application, such as the ability to do the following:

* Update employee managers.

* View employees by manager.

* View employees by department.

* Delete departments, roles, and employees.

* View the total utilized budget of a department&mdash;in other words, the combined salaries of all employees in that department.



## Features Used in this application

* JavaScript
* Node.js
* MySQL
* npm packages
* Inquirer

## License

  Copyright (c) 2022 [GitHub](https://github.com/jaya4ever/employee-tracker)  **Note** This application is under the [MIT](https://MIT-license.org)



