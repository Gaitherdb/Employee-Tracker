
# Employee Tracker
  ## ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

  ## Description
  A command-line Content Management System (CMS) that allows a user to view and edit employees, roles or departments. This is intended for a company who wants to have access to viewing and managing employees to help organize and plan their business.
  
  Each employee has an ID based on when they were entered into the system, a first and last name, a role, a department which corresponds with the role, a salary based on their role, and a manager if needed. 

  The choices available are:
  * View all employees by id, manager, or department
  * Add a new employee
  * Update employee role or manager (Can create new manager or update to an existing manager)
  * View all roles
  * Add a new role
  * View all departments
  * Add a new department

  While creating this app, I used Node.js to run the index javascript file which runs the inquirer module to prompt questions, while using MySQL to handle the database and console.table module to display data in tables in the command-line interface. 

  ## Table of Contents
  * [Installation](#installation)
  * [Usage](#usage)
  * [License](#license)
  * [Contributing](#contributing)
  * [Questions](#questions)
  
  ## Installation
  To install Node.js, follow the documentation [Node.js](https://coding-boot-camp.github.io/full-stack/nodejs/how-to-install-nodejs)

  To install MySQL, follow the documentation [MySQL](https://dev.mysql.com/downloads/installer/)

  To install necessary dependencies, run the following command: 
  ```
  npm i
  ```
  
  ## Usage
  Log in to MySQL and source the schema.sql. Source the seeds.sql if you want preset data. Set the path to the Employee-Tracker folder in the terminal, run the index.js file by typing `node index.js`. Use the up and down keys to toggle through options and answer the questions to get results in the terminal.

  Walkthrough video: [Walkthrough](https://drive.google.com/file/d/1ot_XHWxXZL3CpUnbza4OABMXyJ0xQAp8/view)

  ## License  
  This project is licensed under the terms of the [MIT License](https://opensource.org/licenses/MIT).

  ## Contributing
  I am the sole author of this repo and I am not currently looking for contributors.


  ## Questions
  If you have any questions about the repo, open an issue or contact me directly at Gaitherdb@gmail.com. You can find more of my work at [Gaitherdb](https://github.com/Gaitherdb).