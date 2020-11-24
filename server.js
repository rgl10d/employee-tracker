var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: process.env.PORT || 8080,
  user: "root",
  password: "jungleJimothy-1211",
  database: "employees_db"
});