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
        var manager = { key: JSON.stringify(parse[i].id), value: temp }
        managers.push(manager)
    }
    return managers;
}
const getRoles = async () => {
    var rolessql = `SELECT id, role_title
     FROM roles`;
    var result = await db.promise().query(rolessql);
    let array = JSON.stringify(result[0]);
    let parse = JSON.parse(array);
    var roles = [];
    for (i = 0; i < parse.length; i++) {
        let temp = parse[i].role_title;
        var role = { key: JSON.stringify(parse[i].id), value: temp }
        roles.push(role)
    }
    return roles;
}
const getEmployees = async () => {
    var empsql = `SELECT DISTINCT id, CONCAT(first_name, ' ', last_name) AS Name
     FROM employee`;
    var result = await db.promise().query(empsql);
    let array = JSON.stringify(result[0]);
    let parse = JSON.parse(array);
    var emps = [];
    for (i = 0; i < parse.length; i++) {
        let temp = parse[i].Name;
        var emp = { key: JSON.stringify(parse[i].id), value: temp }
        emps.push(emp)
    }
    return emps;
}
const getDepartment = async () => {
    var depsql = `SELECT id, department_name AS Name
     FROM department`;
    var result = await db.promise().query(depsql);
    let array = JSON.stringify(result[0]);
    let parse = JSON.parse(array);
    var deps = [];
    for (i = 0; i < parse.length; i++) {
        let temp = parse[i].Name;
        var dep = { key: JSON.stringify(parse[i].id), value: temp }
        deps.push(dep)
    }
    console.log(deps);
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
        .then((answers) => {
            switch (answers.allOptions) {
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
const viewAllEmployees = () => {
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

}
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
            type: 'expand',
            name: 'role',
            message: `What is the employee's role ID? Enter h for options.`,
            choices: roles,
        },
        {
            type: 'expand',
            name: 'manager',
            message: `Enter the employee's manager's ID Enter h for options.`,
            choices: managers,
        },
    ])
    //converts name of role selected to corresponding role id
    for (i = 0; i < roles.length; i++) {
        if (addEmpPrompt.role === roles[i].value) {
            var role_id = roles[i].key;
        }
    }
    //converts manager name selected and converts to corresponding manager id
    for (i = 0; i < managers.length; i++) {
        if (addEmpPrompt.manager === managers[i].value) {
            var manager_id = managers[i].key;
        }
    }
    //adds employee data into database
    const addEmpsql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${addEmpPrompt.first_name}", "${addEmpPrompt.last_name}", ${role_id}, ${manager_id});
        `;
    db.query(addEmpsql, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
        prompts();
    })

}

const updateEmployee = async () => {
    var Employees = await getEmployees();
    //Gets employee ID to alter their role or manager
    var updateEmpPrompt = await inquirer.prompt([
        {
            type: 'expand',
            name: 'emp_id',
            message: `To update an employee, enter their employee ID. Enter h for options.`,
            choices: Employees,
        },
        {
            type: 'list',
            name: 'role_or_manager',
            message: `Update role or update manager?`,
            choices: ['Role', 'Manager'],
        },
    ])
    for (i = 0; i < Employees.length; i++) {
        if (updateEmpPrompt.emp_id === Employees[i].value) {
            var emp_id = Employees[i].key;
        }
    }
    switch (updateEmpPrompt.role_or_manager) {
        case 'Role':
            var roles = await getRoles();
            var updateRole = await inquirer.prompt([
                {
                    type: 'expand',
                    name: 'role',
                    message: `Enter new role ID. Enter h for options.`,
                    choices: roles,
                },
            ])
            //converts name of employee selected to corresponding employee id
            for (i = 0; i < roles.length; i++) {
                if (updateRole.role === roles[i].value) {
                    var role_id = roles[i].key;
                }
            }
            const updateRolesql = `UPDATE employee
                    SET role_id = ${role_id}
                    WHERE id = ${emp_id}`;
            db.query(updateRolesql, (err, result) => {
                if (err) { console.log(err); }
                console.table(result);
                prompts();
            })

        case 'Manager':
            var managers = await getManagers();
            var updateManager = await inquirer.prompt([
                {
                    type: 'expand',
                    name: 'manager',
                    message: `Enter new manager ID. Enter 'h' for options.`,
                    choices: managers,
                },
            ])
            //converts manager name selected and converts to corresponding manager id
            for (i = 0; i < managers.length; i++) {
                if (updateManager.manager === managers[i].value) {
                    var manager_id = managers[i].key;
                }
            }
            const updateManagersql = `UPDATE employee
                        SET manager_id = ${manager_id}
                        WHERE id = ${emp_id}`;
            db.query(updateManagersql, (err, result) => {
                if (err) { console.log(err); }
                console.table(result);
                prompts();
            })
    }
}

const viewAllRoles = () => {
    const viewAllRolesql = `SELECT
    roles.id,
    roles.role_title AS role,
    roles.role_salary AS salary,
    roles.department_id,
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

const addRoles = async () => {
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
            type: 'expand',
            name: 'department',
            message: `What is department for this role? Enter h for options.`,
            choices: departments,
        },
    ])
    for (i = 0; i < departments.length; i++) {
        if (addRolePrompt.department === departments[i].value) {
            var department_id = departments[i].key;
        }
    }
    const addRolesql = `INSERT INTO roles (role_title, role_salary, department_id)
    VALUES ("${addRolePrompt.title}", ${addRolePrompt.salary}, ${department_id});
    `;
    db.query(addRolesql, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
        prompts();
    })
}
const viewAllDepartments = () => {
    const viewAllDepsql = `SELECT 
    department.id,
    department.department_name AS department
    FROM department
    `;
    db.query(viewAllDepsql, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
        prompts();
    })
}
const addDepartment = async () => {
    let addDepartmentPrompt = await inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: `What is the name of the deparment?`,
        },
    ])
    const addDepsql = `INSERT INTO department (department_name)
                VALUES ("${addDepartmentPrompt.department_name}");
                `;
    db.query(addDepsql, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
        prompts();
    })

}
const init = () => {
    prompts();
};

init();




