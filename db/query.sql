SELECT
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