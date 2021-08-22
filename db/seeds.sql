INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO roles (role_title, role_salary, department_id)
VALUES  ("Sales Lead", 10000, 1),
        ("Salesperson", 80000, 1),
        ("Lead Engineer", 150000, 2),
        ("Engineer", 100000, 2),
        ("Accountant", 125000, 3),
        ("Lawyer", 145000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Sam", "Kash", 1, NULL),
        ("Steve", "Smith", 3, NULL),
        ("Mark", "Tri", 5, NULL),
        ("Jonathan", "Walker", 2, 1),
        ("TY", "June", 5, 3),
        ("David", "Smith", 4, 2),
        ("Simon", "Baretta", 6, NULL),
        ("Paul", "Moirrison", 2, 1),
        ("Henry", "Caboil", 4, 2),
        ("Ryan", "Mateor", 6, 7);

