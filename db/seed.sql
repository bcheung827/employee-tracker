INSERT INTO department (name)
VALUES ("sales"),
    ("engineering"),
    ("finance"),
    ("legal"),
    ("service");

SELECT * FROM DEPARTMENT;

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
    ("Salesperson", 80000, 1),
    ("Lead Engineer", 150000, 2),
    ("Software Engineer", 120000, 2),
    ("Account Manager", 160000, 3),
    ("Accountant", 125000, 3),
    ("Legal Team Lead", 250000, 4),
    ("Lawyer", 190000, 4),
    ("Customer Service", 80000, 5);

SELECT * FROM ROLE;

INSERT INTO employee(first_name, last_name, role_id)
VALUES ("Brandon", "Cheung", 2)
    ("Teresa", "Vu", 3)
    ("Ben", "Liu", 1)
    ("Pio", "Park", 4)
    ("Andy", "Li", 5)

SELECT * FROM EMPLOYEE;