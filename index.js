const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
require('dotenv').config();


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'employee_db',
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  startPrompt();
});

startPrompt = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ['View all employees', 'View all roles', 'View all departments', 'Add employee', 'Add role', 'Add department', 'Update employee role',]
    }
  ]).then((response) => {
    switch (response.action) {
      case "View all employees":
        viewAll("EMPLOYEE");
        break;
      case "View all roles":
        viewAll("ROLE");
        break;
      case "View all departments":
        viewAll("DEPARTMENT");
        break;
      case "Add employee":
        addNewEmployee();
        break;
      case "Add role":
        addNewRole();
        break;
      case "Add department":
        addNewDepartment();
        break;
      case "Update employee role":
        updateEmployeeRole();
        break;
      case "Exit":
        connection.end();
        break;
    }
  })
}

const viewAll = (table) => {
  let query;
  if (table === "DEPARTMENT") {
    query = `SELECT * FROM DEPARTMENT`;
  } else if (table === "ROLE") {
    query = `SELECT * FROM ROLE`;
  } else {
    query = `SELECT * FROM EMPLOYEE`;
  }

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);

    startPrompt();

  });
}
const addNewDepartment = () => {
  let questions = [
    {
      type: "input",
      name: "name",
      message: "What is the new department name?"
    }
  ];

  inquirer.prompt(questions)
    .then(response => {
      const query = `INSERT INTO department (name) VALUES (?)`;
      connection.query(query, [response.name], (err, res) => {
        if (err) throw err;
        console.log(`Successfully inserted ${response.name} department at id ${res.insertId}`);
        startPrompt();
      });
    })
    .catch(err => {
      console.error(err);
    });
}

const addNewRole = () => {
  const departments = [];
  connection.query(`SELECT * FROM DEPARTMENT`, (err, res) => {
    if (err) throw err;
    res.forEach(dep => {
      letqObj = {
        name: dep.name,
        value: dep.id
      }
      departments.push(qObj);
    });

    let questions = [
      {
        type: "input",
        name: "role",
        message: "What is the new role?"
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the new role?"
      },
      {
        type: "list",
        name: "department",
        message: "What department is the new role in?"
      }
    ];

    inquirer.prompt(questions)
      .then(response => {
        const query = `INSERT INTO ROLE (title, salary, department_id) VALUES (?)`;
        connection.query(query, [[response.title, response.salary, response.department]], (err, res) => {
          if (err) throw err;
          console.log(`Successfully inserted ${response.title} role at id ${res.insertID}`);
          startPrompt();
        });
      })
      .catch(err => {
        console.error(err);
      });
  });
}

const addNewEmployee = () => {
  connection.query("SELECT * FROM EMPLOYEE", (err, employeeRes) => {
    if (err) throw err;
    const employeeChoice = [
      {
        name: 'None',
        value: 0
      }
    ];

    employeeRes.forEach(({ first_name, last_name, id }) => {
      employeeChoice.push({
        name: first_name + " " + last_name,
        value: id
      });
    });

    connection.query("SELECT * FROM ROLE", (err, roleRes) => {
      if (err) throw err;
      const roleChoice = [];

      roleRes.forEach(({ title, id }) => {
        roleChoice.push({
          name: title,
          value: id
        });
      });

      console.log(roleChoice)


      let questions = [
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?"
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?"
        },
        {
          type: "list",
          name: "role_id",
          choices: roleChoice,
          message: "What is the employee's role?"
        },
        {
          type: "list",
          name: "manager_id",
          choices: employeeChoice,
          message: "Who is the employee's manager? (could be null)"
        }
      ]

      inquirer.prompt(questions)
        .then(response => {
          const query = `INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id) VALUES (?)`;
          let manager_id = response.manager_id !== 0 ? response.manager_id : null;
          connection.query(query, [[response.first_name, response.last_name, response.role_id, manager_id]], (err, res) => {
            if (err) throw err;
            console.log(`Successfully inserted employee ${response.first_name} ${response.last_name} with id ${res.insertId}`);
            startPrompt();
          });
        })
        .catch(err => {
          console.error(err);
        });
    })
  });
}


const updateEmployeeRole = () => {
  connection.query("SELECT * FROM EMPLOYEE", (err, employeeRes) => {
    if (err) throw err;
    const employeeChoice = [];
    employeeRes.forEach(({ first_name, last_name, id }) => {
      employeeChoice.push({
        name: first_name + " " + last_name,
        value: id
      });
    });

    connection.query("SELECT * FROM ROLE", (err, roleRes) => {
      if (err) throw err;
      const roleChoice = [];
      roleRes.forEach(({ title, id }) => {
        roleChoice.push({
          name: title,
          value: id
        });
      });

      let questions = [
        {
          type: "list",
          name: "id",
          choices: employeeChoice,
          message: "Which employee's role is being updated?"
        },
        {
          type: "list",
          name: "role_id",
          choices: roleChoice,
          message: "What is the employee's new role?"
        },
      ]

      inquirer.prompt(questions)
        .then(response => {
          const query = `UPDATE EMPLOYEE SET ? WHERE ?? = ?;`;
          connection.query(query, [
            { role_id: response.role_id },
            "id",
            response.id
          ], (err, res) => {
            if (err) throw err;

            console.log("Successfully updated employee's role");
            startPrompt();
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
  });
}

// db.query(INSERT_QUERY, {book_name: "Anthony's books"}, (err, result) =>{
//   console.log(err);
//   console.log(result);
// });