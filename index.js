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
const getManagers = () => {
    var managerssql = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
    FROM employee
    LEFT JOIN employee manager
    ON employee.manager_id = manager.id
    WHERE employee.manager_id IS NOT NULL`;
    db.query(managerssql, (err, result) => {
        if (err) { console.log(err); }
        console.log(result)
        console.log(typeof result)
        let array = JSON.stringify(result);
        console.log(array)
        console.log("parse")
        let parse = JSON.parse(array);
        console.log(parse)
        console.log(typeof parse)
        console.log(Object.values(parse))


        return
    })
}

const getRoles = () => {
    var rolessql = `SELECT role_id FROM roles`;
    db.query(rolessql, (err, result) => {
        if (err) { console.log(err); }
        let array = JSON.parse(JSON.stringify(result));
        console.log(array);
        return result;
    })
}
//Initial & total view of options 
const prompts = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'allOptions',
            message: `What would you like to do?`,
            choices: ['View All Employees', 'Add Employee', `Update Employee`, `View All Roles`, `Add Role`, `View All Departments`, `Add Department`, `Quit`],
        }
    ])
        .then((answers) => {
            switch (answers.allOptions) {
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
                    var roles = getRoles();
                    var managers = getManagers();
                    console.log(managers);
                    console.log(roles);
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'first_name',
                            message: `What is the employee's first name?`,
                        },
                        {
                            type: 'input',
                            name: 'last_name',
                            message: `What is the employee's last name?`,
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: `What is the employee's role?`,
                            choices: [roles],
                        },
                        {
                            type: 'list',
                            name: 'manager',
                            message: `Who is this employee's manager?`,
                            choices: [managers],
                        },
                    ])
                        .then((answers) => {
                            const addEmpsql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (${answers.first_name}, ${answers.last_name}, ${answers.role_id}, ${answers.manager_id});
                            `;
                            db.query(addEmpsql, (err, result) => {
                                if (err) { console.log(err); }
                                prompt();
                                console.table(result);
                            })
                        })
                    break;
                case 'Update Employee':
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'emp_id',
                            message: `To update an employee, enter their employee ID`
                        },
                        {
                            type: 'list',
                            name: 'role_or_manager',
                            message: `Update role or update manager?`,
                            choices: ['Role', 'Manager']
                        },
                    ])
                        .then((answers) => {
                            var emp_id = answers.emp_id;
                            switch (answers.role_or_manager) {
                                case 'Role':
                                    inquirer.prompt([
                                        {
                                            type: 'input',
                                            name: 'role',
                                            message: `Enter new role ID`
                                        },
                                    ])
                                        .then((answers) => {

                                            const updateRolesql = `UPDATE employee
                                        SET role_id = ${answers.role}
                                        WHERE id = ${emp_id}`;
                                            db.query(updateRolesql, (err, result) => {
                                                if (err) { console.log(err); }
                                                console.table(result);
                                                prompts();
                                            })
                                        })

                                case 'Manager':
                                    inquirer.prompt([
                                        {
                                            type: 'input',
                                            name: 'manager',
                                            message: `Enter new manager ID`
                                        },
                                    ])
                                        .then((answers) => {
                                            const updateManagersql = `UPDATE employee
                                            SET manager_id = ${answers.manager}
                                            WHERE id = ${emp_id}`;
                                            db.query(updateManagersql, (err, result) => {
                                                if (err) { console.log(err); }
                                                console.table(result);
                                                prompts();
                                            })
                                        })
                            }
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




