var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: process.env.PORT || 8080,
  user: "root",
  password: "jungleJimothy-1211",
  database: "employees_db",
});

connection.connect(function (err) {
  if (err) throw err;
  runManager();
});

function runManager() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all Employees",
        "View all Departments",
        "View all Roles",
        "Add a new Employee",
        "Create a new Department",
        "Create a mew RP;e",
        "Update an Employee",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View all Employees":
          viewEmployees();
          break;

        case "View all Departments":
          viewDepartments();
          break;

        case "View all Roles":
          viewRoles();
          break;

        case "Add a new Employee":
          addEmployee();
          break;

        case "Create a new Department":
          addDepartment();
          break;

        case "Create a new Role":
          addRole();
          break;

        case "Update an Employee":
          updateEmployee();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}
