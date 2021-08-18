const cTable = require('console.table');

const viewAllEmployees = () => {
    const sql = `SELECT
    employee.id,
    employee.first_name,
    employee.last_name,
    department.deparment_name AS department
    roles.role_title AS role
    roles.role_salary AS salary
    employee.first_name, ` `, employee.last_name AS manager
    FROM employee
    JOIN roles
    ON employee.role_id = roles.id
    JOIN department
    ON roles.department_id = department.id
    LEFT JOIN employee manager
    ON employee.manager_id = manager.id
`;
    return db.query(sql, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
    })
};

const addEmployee = () => {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (${first_name}, ${last_name}, ${role_id}, ${manager_id});
    `;
    return db.query(sql, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
    })
}
const updateEmployeeRole = () => {
    const sql = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
    VALUES (${id}, ${first_name}, ${last_name}, ${role_id}, ${manager_id});
    `;
    return db.query(sql, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
    })
}
const viewAllRoles = () => {
    const sql = `SELECT
    roles.id,
    roles.role_title AS role,
    roles.role_salary AS salary,
    department.department_id,
    department.department_name AS department
    FROM roles
    JOIN department
    ON roles.department_id = department.id
    `;
    return db.query(sql, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
    })
}
const addRole = () => {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (${first_name}, ${last_name}, ${role_id}, ${manager_id});
    `;
    return db.query(sql, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
    })
}
const viewAllDepartments = () => {
    const sql = `SELECT 
    department.id,
    department.department_name AS department
    FROM department
    `;
    return db.query(sql, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
    })
}
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: `What is the name of the deparment?`,
        },
    ])
        .then((answers) => {
            const sql = `INSERT INTO department (department_name)
                VALUES (${answers.department_name});
                `;
            return db.query(sql, (err, result) => {
                if (err) { console.log(err); }
                console.table(result);
            })
        })

}
module.exports = { viewAllEmployees, addEmployee, updateEmployeeRole, viewAllRoles, addRole, viewAllDepartments, addDepartment };