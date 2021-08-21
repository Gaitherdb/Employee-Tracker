INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance");

INSERT INTO roles (role_title, role_salary, department_id)
VALUES  ("Sales Lead", 10000, 1),
        ("Salesperson", 80000, 1),
        ("Engineer", 100000, 2),
        ("Accountant", 125000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Sam", "Kash", 1, NULL),
        ("Steve", "Smith", 3, NULL),
        ("Mark", "Tri", 4, NULL),
        ("Jonathan", "Walker", 2, 1),
        ("TY", "June", 4, 3),
        ("David", "Smith", 3, 2);