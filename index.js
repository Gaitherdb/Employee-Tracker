const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');


const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'myPw0rd',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

//Initial & total view of options 
const prompts = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'allOptions',
            message: `What would you like to do?`,
            choices: ['View All Employees', 'Add Employee', `Update Employee Role`, `View All Roles`, `Add Role`, `View All Departments`, `Add Department`, `Quit`],
        }
    ])
        .then((answer) => {
            switch (answer.allOptions) {
                case 'View All Employees':
                    const viewAllEmpsql = `SELECT
                    employee.id,
                    employee.first_name,
                    employee.last_name,
                    department.department_name AS department,
                    roles.role_title AS role,
                    roles.role_salary AS salary,
                    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                    FROM employee
                    JOIN roles
                    ON employee.role_id = roles.id
                    JOIN department
                    ON roles.department_id = department.id
                    LEFT JOIN employee manager
                    ON employee.manager_id = manager.id
`;
                    db.query(viewAllEmpsql, (err, result) => {
                        if (err) { console.log(err); }
                        console.table(result);
                        prompts();
                    })
                    
                    break;
                case 'Add Employee':
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'first_name',
                            message: `What is the employee's first name?`,
                        },
                        {
                            type: 'input',
                            name: 'last_name',
                            message: `What is the employee's first name?`,
                        },
                        {
                            type: 'input',
                            name: 'last_name',
                            message: `What is the employee's first name?`,
                        },
                        {
                            type: 'input',
                            name: 'last_name',
                            message: `What is the employee's first name?`,
                        },
                    ])
                        .then((answers) => {
                            const addEmpsql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (${answers.first_name}, ${answers.last_name}, ${answers.role_id}, ${answers.manager_id});
                            `;
                            db.query(addEmpsql, (err, result) => {
                                if (err) { console.log(err); }
                                console.table(result);
                            })
                        })
                    break;
                case 'Update Employee Role':
                    const updateEmpRolesql = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
                    VALUES (${id}, ${first_name}, ${last_name}, ${role_id}, ${manager_id});
                    `;
                    db.query(updateEmpRolesql, (err, result) => {
                        if (err) { console.log(err); }
                        console.table(result);
                    })
                    break;
                case 'View All Roles':
                    const viewAllRolesql = `SELECT
    roles.id,
    roles.role_title AS role,
    roles.role_salary AS salary,
    department.department_id,
    department.department_name AS department
    FROM roles
    JOIN department
    ON roles.department_id = department.id
    `;
                    db.query(viewAllRolesql, (err, result) => {
                        if (err) { console.log(err); }
                        console.table(result);
                    })
                    break;
                case 'Add Role':
                    const addRolesql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (${first_name}, ${last_name}, ${role_id}, ${manager_id});
    `;
                    db.query(addRolesql, (err, result) => {
                        if (err) { console.log(err); }
                        console.table(result);
                    })
                    break;
                case 'View All Departments':
                    const viewAllDepsql = `SELECT 
                    department.id,
                    department.department_name AS department
                    FROM department
                    `;
                    db.query(viewAllDepsql, (err, result) => {
                        if (err) { console.log(err); }
                        console.table(result);
                    })
                    break;
                case 'Add Department':
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'department_name',
                            message: `What is the name of the deparment?`,
                        },
                    ])
                        .then((answers) => {
                            const addDepsql = `INSERT INTO department (department_name)
                                VALUES (${answers.department_name});
                                `;
                            db.query(addDepsql, (err, result) => {
                                if (err) { console.log(err); }
                                console.table(result);
                            })
                        })
                    break;
                default:
                    console.log("Ended CMS")
                    break;
            }
        })
};

const init = () => {
    prompts();
};

init();




