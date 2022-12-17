INSERT INTO department (name)
VALUES ("Engineering"), 
("Sales"), 
("Security");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 100000.00 , 1),
("Sale representative", 90000.00 , 2),
("Security Operator", 110000.00 , 3);


INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Carlie", "Simon", 1, 1),
("Anna", "Biswas", 3, 1),
("Heather", "Chauhan",2 , 2),
("Sophiya", "Thom", 1, 4);
