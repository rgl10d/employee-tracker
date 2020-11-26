var mysql = require("mysql");
var inquirer = require("inquirer");
// const { connect } = require("http2");

var connection = mysql.createConnection({
  host: "localhost",
  port: process.env.PORT || 3306,
  user: "root",
  password: "jungleJimothy-1211",
  database: "employees_db",
});

connection.connect(function (err) {
  if (err) throw err;
  runTracker();
});

// INITIAL QUESTION PROMPT FUNCTION
function runTracker() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all departments",
        "View all roles",
        "Add a new employee",
        "Create a new department",
        "Create a new role",
        "Update an employee role",
        "Delete an employee",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View all employees":
          viewEmployees();
          break;

        case "View all departments":
          viewDepartments();
          break;

        case "View all roles":
          viewRoles();
          break;

        case "Add a new employee":
          addEmployee();
          break;

        case "Create a new department":
          addDepartment();
          break;

        case "Create a new role":
          addRole();
          break;

        case "Update an employee role":
          updateEmployee();
          break;

        case "Delete an employee":
          deleteEmployee();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

// FUNCTION TO VIEW ALL EMPLOYEES
function viewEmployees() {
  connection.query(
    "SELECT employee.id, first_name, last_name, roles.title, department.name AS department, roles.salary FROM employee INNER JOIN roles ON employee.role_id = roles.role_id INNER JOIN department ON roles.department_id = department.department_id",
    (err, results) => {
      if (err) throw err;
      console.log("\n");
      console.table(results);
      console.log("===============================");
      console.log("\n \n \n \n \n \n \n");
    }
  );
  // RETURN TO MAIN LIST
  runTracker();
}

// FUNCTION TO VIEW ALL DEPARTMENTS
function viewDepartments() {
  connection.query("SELECT name FROM department", (err, results) => {
    if (err) throw err;
    console.log("\n");
    console.table(results);
    console.log("===============================");
    console.log("\n \n \n \n \n \n \n");
  });
  // RETURN TO MAIN LIST
  runTracker();
}

// FUNCTION TO VIEW ALL ROLES
function viewRoles() {
  connection.query("SELECT title FROM roles", (err, results) => {
    if (err) throw err;
    console.log("\n");
    console.table(results);
    console.log("===============================");
    console.log("\n \n \n \n \n \n \n");
  });
  // RETURN TO MAIN LIST
  runTracker();
}

// FUNCTION TO ADD A NEW EMPLOYEE (ADD MANAGER ID)
function addEmployee() {
  let roleArray = [];
  let employeeArray = [{ name: "None", value: null }];
  connection.query("SELECT title, role_id FROM roles", (err, results) => {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      roleArray.push({
        name: results[i].title,
        value: results[i].role_id,
      });
    }
    connection.query(
      "SELECT first_name, last_name, id FROM employee",
      (err, response) => {
        if (err) throw err;
        for (let i = 0; i < response.length; i++) {
          employeeArray.push({
            name: response[i].first_name + " " + response[i].last_name,
            value: response[i].id,
          });
        }
        inquirer
          .prompt([
            {
              name: "firstName",
              type: "input",
              message: "What is the employee's first name?",
              validate: function (value) {
                if (value === "") {
                  console.log("Please enter a name.");
                  return false;
                }
                return true;
              },
            },
            {
              name: "lastName",
              type: "input",
              message: "What is the employee's last name?",
              validate: function (value) {
                if (value === "") {
                  console.log("Please enter a name.");
                  return false;
                }
                return true;
              },
            },
            {
              name: "role",
              type: "list",
              message: "What is the employee's role?",
              choices: roleArray,
            },
            {
              name: "manager",
              type: "list",
              message: "Who is the employee's manager?",
              choices: employeeArray,
            },
          ])
          .then(function (answer) {
            for (var i = 0; i < results.length; i++) {
              if (answer.role === results[i].title) {
                answer.role = results[i].role_id;
              }
              if (answer.manager === results[i].last_name) {
                answer.manager = results[i].id;
              }
            }
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: answer.role,
                manager_id: answer.manager,
              },
              function (err, res) {
                if (err) throw err;
                runTracker();
              }
            );
          });
      }
    );
  });
}

// FUNCTION TO ADD A NEW DEPARTMENT
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of this department?",
        validate: function (value) {
          if (value === "") {
            console.log("Please enter a name.");
            return false;
          }
          return true;
        },
      },
    ])
    .then(function (answer) {
      console.log(answer);
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.name,
        },
        function (err, res) {
          if (err) throw err;
          runTracker();
        }
      );
    });
}

// FUNCTION TO ADD A NEW ROLE/JOB
function addRole() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the title of this role?",
          validate: function (value) {
            if (value === "") {
              console.log("Please enter a title.");
              return false;
            }
            return true;
          },
        },
        {
          name: "salary",
          type: "input",
          message: "What is salary of this role?",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          },
        },
        {
          name: "department",
          type: "list",
          message: "What department does this role belong to?",
          choices: () => {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].name);
            }
            return choiceArray;
          },
        },
      ])
      .then(function (answer) {
        for (var i = 0; i < results.length; i++) {
          if (answer.department === results[i].name) {
            answer.department = results[i].id;
          }
        }
        console.log(answer);
        connection.query(
          "INSERT INTO roles SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department,
          },
          function (err, res) {
            if (err) throw err;
            runTracker();
          }
        );
      });
  });
}

// FUNCTION TO UPDATE EXISTING EMPLOYEE ROLE
function updateEmployee() {
  let roleArray = [];
  let employeeArray = [];
  connection.query(
    "SELECT first_name, last_name, id FROM employee",
    (err, response) => {
      if (err) throw err;
      for (let i = 0; i < response.length; i++) {
        employeeArray.push({
          name: response[i].first_name + " " + response[i].last_name,
          value: response[i].id,
        });
      }
      connection.query("SELECT title, role_id FROM roles", (err, results) => {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
          roleArray.push({
            name: results[i].title,
            value: results[i].role_id,
          });
        }
        inquirer
          .prompt([
            {
              name: "employeeSelection",
              type: "list",
              message: "Which employee would you like to update?",
              choices: employeeArray,
            },
            {
              name: "roleSelection",
              type: "list",
              message: "What role will the employee have now?",
              choices: roleArray,
            }
          ])
          .then(function (answer) {
            connection.query(
              "UPDATE employee SET role_id = ? WHERE id = ?",
              [answer.roleSelection, answer.employeeSelection],
              function (err) {
                if (err) throw err;
                runTracker();
              }
            );
          });
      });
    }
  );
}
