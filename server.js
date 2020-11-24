var mysql = require("mysql");
var inquirer = require("inquirer");

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
        "Create a mew role",
        "Update an employee",
        "Exit",
      ],
    })
    .then(function (answer) {
      console.log(answer);
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

          case "Update an employee":
            updateEmployee();
            break;

          case "Exit":
            connection.end();
            break;
        }
    });
};

function addEmployee() {
    inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?",
        validate: function(value) {
          if (value === "") {
            console.log("Please enter a name.");
            return false;
          }
          return true;
        }
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?",
        validate: function(value) {
          if (value === "") {
            console.log("Please enter a name.");
            return false;
          }
          return true;
        }
      }
    ])
    .then(function(answer) {
      console.log(answer);
      connection.query(
      "INSERT INTO employee SET ?", {
        first_name: answer.firstName,
        last_name: answer.lastName,
        role_id: 23
      }, 
      function(err, res) {
        if (err) throw err;
        runTracker();
        }
      );
    });
};

function addDepartment() {
    inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of this department?",
        validate: function(value) {
          if (value === "") {
            console.log("Please enter a name.");
            return false;
          }
          return true;
        }
      },
    ])
    .then(function(answer) {
      console.log(answer);
      connection.query(
      "INSERT INTO department SET ?", {
        name: answer.name
      }, 
      function(err, res) {
        if (err) throw err;
        runTracker();
        }
      );
    });
};
