INSERT INTO department (name)
VALUES ("Engineering", "Sales", "Security");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 135000.00 , 1),
("Sale representative", 100000.00 , 2),
("Security Operator", 140000.00 , 3);


INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Carlie", "Simon" , 1, 2),
("Anna", "Biswas" , 2, 3),
("Heather", "Chauhan" , 4, 1),
("Sophiya", "Thom" , 3, 1);
