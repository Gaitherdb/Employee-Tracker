const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');
const app = express();

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'myPw0rd',
      database: 'movies_db'
    },
    console.log(`Connected to the movies_db database.`)
  );

//Initial & total view of options 
const init = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'allOptions',
            message: `What would you like to do?`,
            choices: ['View All Employees', 'Add Employee', `Update Employee Role`, `View All Roles`, `Add Role`, `View All Departments`, `Add Department`, `Quit`],
        }
    ])
        .then((answer) => {
            switch (answer.allOptions) {
                case 'View All Employees':
                   
                    break;
                case 'Add Employee':
                    
                    break;
                    case 'Update Employee Role':
                   
                    break;
                case 'View All Roles':
                    
                    break;
                    case 'Add Role':
                   
                    break;
                case 'View All Departments':
                    
                    break;
                    case 'Add Department':
                   
                    break;
                default:
                    
                    break;
            }
        })
}

init();



