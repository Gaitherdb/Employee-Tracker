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
)
//returns name and manager_id of managers as an array of objects with name as name, and manager_id as value
const getManagers = async () => {
    var managerssql = `SELECT DISTINCT m.id, CONCAT(m.first_name, ' ', m.last_name) AS Manager
    FROM employee
    LEFT JOIN employee m
    ON employee.manager_id = m.id
    WHERE employee.manager_id IS NOT NULL`;
    var result = await db.promise().query(managerssql);
    let array = JSON.stringify(result[0]);
    let parse = JSON.parse(array);
    var managers = [];
    for (i = 0; i < parse.length; i++) {
        let temp = parse[i].Manager;
        var manager = { name: temp, value: JSON.stringify(parse[i].id) }
        managers.push(manager)
    }
    return managers;
}
//returns role id & title as an array of objects with id as roles as name and role_id as value
const getRoles = async () => {
    var rolessql = `SELECT DISTINCT id, role_title
     FROM roles`;
    var result = await db.promise().query(rolessql);
    let array = JSON.stringify(result[0]);
    let parse = JSON.parse(array);
    var roles = [];
    for (i = 0; i < parse.length; i++) {
        let temp = parse[i].role_title; 
        var role = { name: temp, value: JSON.stringify(parse[i].id)}
        roles.push(role)
    }
    return roles;
}
//returns first & last name of employees as an array of objects with name as name, and id as value
const getEmployees = async () => {
    var empsql = `SELECT DISTINCT id, CONCAT(first_name, ' ', last_name) AS Name
     FROM employee
     ORDER BY id`;
    var result = await db.promise().query(empsql);
    let array = JSON.stringify(result[0]);
    let parse = JSON.parse(array);
    var emps = [];
    for (i = 0; i < parse.length; i++) {
        let temp = parse[i].Name;
        var emp = { name: temp, value: JSON.stringify(parse[i].id) }
        emps.push(emp)
    }
    return emps;
}
//returns id and name of departments as an array of objects with department name as name and id as value
const getDepartment = async () => {
    var depsql = `SELECT DISTINCT id, department_name AS Name
     FROM department`;
    var result = await db.promise().query(depsql);
    let array = JSON.stringify(result[0]);
    let parse = JSON.parse(array);
    var deps = [];
    for (i = 0; i < parse.length; i++) {
        let temp = parse[i].Name;
        var dep = { name: temp, value: JSON.stringify(parse[i].id)}
        deps.push(dep)
    }
    return deps;
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
        .then((answer) => {
            switch (answer.allOptions) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee':
                    updateEmployee();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Role':
                    addRoles();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                default:
                    console.log("Press Ctrl C to Quit")
                    break;
            }
        })
};
//displays a new table formed joining all tables to display all employees
const viewAllEmployees = async () => {
    let viewTypes = await inquirer.prompt([
        {
            type: 'list',
            name: 'view_type',
            message: `How would you like to view employees by?`,
            choices: ['ID', 'Manager', 'Department'],
        },
    ])
    switch (viewTypes.view_type) {
        case 'ID':
            const viewbyIDsql = `
            SELECT
            employee.id,
            employee.first_name,
            employee.last_name,
            department.department_name AS department,
            roles.role_title AS role,
            roles.role_salary AS salary,
            CONCAT(alias_manager.first_name, ' ', alias_manager.last_name) AS manager
            FROM employee
            JOIN roles
            ON employee.role_id = roles.id
            JOIN department
            ON roles.department_id = department.id
            LEFT JOIN employee alias_manager
            ON employee.manager_id = alias_manager.id
            ORDER BY
            employee.id
`;
            db.query(viewbyIDsql, (err, result) => {
                if (err) { console.log(err); }
                console.table(result);
                prompts();
            })
            break;

        case 'Manager':
            const viewbyMansql = `
            SELECT
            employee.id,
            employee.first_name,
            employee.last_name,
            department.department_name AS department,
            roles.role_title AS role,
            roles.role_salary AS salary,
            CONCAT(alias_manager.first_name, ' ', alias_manager.last_name) AS manager
            FROM employee
            JOIN roles
            ON employee.role_id = roles.id
            JOIN department
            ON roles.department_id = department.id
            LEFT JOIN employee alias_manager
            ON employee.manager_id = alias_manager.id
            ORDER BY
            manager
`;
            db.query(viewbyMansql, (err, result) => {
                if (err) { console.log(err); }
                console.table(result);
                prompts();
            })
            break;

        case 'Department':
            const viewbyDepsql = `
            SELECT
            employee.id,
            employee.first_name,
            employee.last_name,
            department.department_name AS department,
            roles.role_title AS role,
            roles.role_salary AS salary,
            CONCAT(alias_manager.first_name, ' ', alias_manager.last_name) AS manager
            FROM employee
            JOIN roles
            ON employee.role_id = roles.id
            JOIN department
            ON roles.department_id = department.id
            LEFT JOIN employee alias_manager
            ON employee.manager_id = alias_manager.id
            ORDER BY
            department
`;
            db.query(viewbyDepsql, (err, result) => {
                if (err) { console.log(err); }
                console.table(result);
                prompts();
            })
            break;
    }
}
//prompts input for neccesary data to create new employees
const addEmployee = async () => {
    //gets all manager names and ids
    var managers = await getManagers();
    //gets all roles and ids
    var roles = await getRoles();

    let addEmpPrompt = await inquirer.prompt([
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
            choices: roles,
        },
        {
            type: 'list',
            name: 'manager',
            message: `Who is the employee's manager?`,
            choices: managers,
        },
    ])
    var role_id = addEmpPrompt.role;
    var manager_id = addEmpPrompt.manager;
    //adds employee data into database
    const addEmpsql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${addEmpPrompt.first_name}", "${addEmpPrompt.last_name}", ${role_id}, ${manager_id});
        `;
    db.query(addEmpsql, (err, result) => {
        if (err) { console.log(err); }
        console.log("Added new employee.")
        prompts();
    })

}
//prompts input to update current employee data
const updateEmployee = async () => {
    //returns array containing name and id of every employee to select from in prompt
    var Employees = await getEmployees();
    var updateEmpPrompt = await inquirer.prompt([
        {
            type: 'list',
            name: 'emp_id',
            message: `Select an employee to update.`,
            choices: Employees,
        },
        {
            type: 'list',
            name: 'role_or_manager',
            message: `Update role or update manager?`,
            choices: ['Role', 'Manager'],
        },
    ])
    var emp_id = updateEmpPrompt.emp_id

    //if prompt choice was role OR manager
    switch (updateEmpPrompt.role_or_manager) {
        case 'Role':
            //returns role id & title as an array of objects with id as key and title as value
            var roles = await getRoles();
            var updateRole = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: `Select this employee's role.`,
                    choices: roles,
                },
            ])
            var role_id = updateRole.role;
            //update employee role for employee with selected ID
            const updateRolesql = `UPDATE employee
                    SET role_id = ${role_id}
                    WHERE id = ${emp_id}`;
            db.query(updateRolesql, (err, result) => {
                if (err) { console.log(err); }
                console.log("Updated employee.")
                prompts();
            })
            break;

        case 'Manager':
            //returns manager id & name as an array of objects with id as key and name as value
            var managers = await getManagers();
            var updateManager = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'new_or_exist',
                    message: `Create new manager or select existing manager?`,
                    choices: ['Create new', 'Existing'],
                },
            ])
            switch (updateManager.new_or_exist) {
                case 'Create new':
                    var newManager = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: `Select this employee's manager.`,
                            choices: Employees,
                        },
                    ])
                    var newManager_id = newManager.manager;
                    //update employee's manager for employee with selected ID
                    const updateNewManagersql = `UPDATE employee
                        SET manager_id = ${newManager_id}
                        WHERE id = ${emp_id}`;
                    db.query(updateNewManagersql, (err, result) => {
                        if (err) { console.log(err); }
                        console.log("Updated employee.")
                        prompts();
                    })
                    break;

                case 'Existing':
                    var existManager = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: `Select this employee's manager.`,
                            choices: managers,
                        },
                    ])
                    var manager_id = existManager.manager;
                    //update employee's manager for employee with selected ID
                    const updateManagersql = `UPDATE employee
                        SET manager_id = ${manager_id}
                        WHERE id = ${emp_id}`;
                    db.query(updateManagersql, (err, result) => {
                        if (err) { console.log(err); }
                        console.log("Updated employee.")
                        prompts();
                    })
                    break;
            }
            break;
    }
}
//displays a table with all exisiting roles joined with department table
const viewAllRoles = () => {
    const viewAllRolesql = `
    SELECT DISTINCT
    roles.id,
    roles.role_title AS role,
    roles.role_salary AS salary,
    department.department_name AS department
    FROM roles
    JOIN department
    ON roles.department_id = department.id
`;
    db.query(viewAllRolesql, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
        prompts();
    })
}
//prompts input to add a new role
const addRoles = async () => {
    //returns id and name of departments as an array of objects with id as key, and name as value
    var departments = await getDepartment();
    let addRolePrompt = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: `What is the title of the role?`,
        },
        {
            type: 'input',
            name: 'salary',
            message: `What is the salary for this role?`,
        },
        {
            type: 'list',
            name: 'department',
            message: `What is department for this role?`,
            choices: departments,
        },
    ])
    var department_id = addRolePrompt.department;
    console.log(department_id);
    //add roles data into database
    const addRolesql = `INSERT INTO roles (role_title, role_salary, department_id)
    VALUES ("${addRolePrompt.title}", ${addRolePrompt.salary}, ${department_id});
    `;
    db.query(addRolesql, (err, result) => {
        if (err) { console.log(err); }
        console.log("Added new role.")
        prompts();
    })
}
//displays a table with all exisiting departments
const viewAllDepartments = () => {
    const viewAllDepsql = `
    SELECT DISTINCT
    department.id,
    department.department_name AS Departments
    FROM department
    `;
    db.query(viewAllDepsql, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
        prompts();
    })
}
//prompts input to add a new department
const addDepartment = async () => {
    let addDepartmentPrompt = await inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: `What is the name of the deparment?`,
        },
    ])
    //add department data into database
    const addDepsql = `INSERT INTO department (department_name)
                VALUES ("${addDepartmentPrompt.department_name}");
                `;
    db.query(addDepsql, (err, result) => {
        if (err) { console.log(err); }
        console.log("Added new department.")
        prompts();
    })

}

prompts();




