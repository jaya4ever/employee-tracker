INSERT INTO department (name)
VALUES ("Engineering"), 
("Sales"), 
("Security"),
("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 100000.00 , 1),
("Sale representative", 90000.00 , 2),
("Security Operator", 110000.00 , 3),
("Lead Engineer", 150000.00, 2),
("Accountant", 125000.00, 3),
("Lawyer", 190000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rachael", "Manateal", 1, null),
       ("Kalien", "Estee", 2, 1),
       ("Abhishek", "Kochiram", 2, 1),
       ("Leena", "Singal", 3, null),
       ("Pameal", "Rai", 4, 4),
       ("Seema", "Srivastav", 4, 4),
       ("Welson", "Simpson", 5, null);
      
