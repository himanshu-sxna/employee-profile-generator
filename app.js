const Manager = require("./lib/manager");
const Engineer = require("./lib/engineer");
const Intern = require("./lib/intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { type } = require("os");


const addEmployee = () => {

    inquirer
    .prompt([
        
        {
            name: "add_employee",
            type: "confirm",
            message: "Would you like to add an employee?"
        },
    ])
    .then((answers) => {
        if (!answers.add_employee) {
            console.log("No more emplyees need to be added. Thank you for using the employee generator!");
        } else {
            getEmployeeInfo();
        }
    });
}

const getEmployeeInfo = async () => {

    const employeeTypes = ["Manager", "Engineer", "Intern"];

    const employeeInfo = await 

        inquirer
        .prompt([

            {
                name: "employee_name",
                type: "input",
                message: "Please enter Employee's name?",
                validate: (input) => {
                    if (input.length < 1){
                        console.log("A name is required");
                    } else {
                        return true;
                    }  
                }
            },
            {
                name:"employee_id",
                type: "input",
                message: "Please enter Employee ID: ?"
            },
            {
                name: "employee_email",
                type: "input",
                message: "Please enter email ?",
                validate: (email) => {
                    let valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
                    if(valid){
                        return true;
                    } else {
                        console.log("\nPlease enter a valid email.")
                    }
                }
            },
            {
                name: "employee_type",
                type: "list",
                message: "Please choose employee role?",
                choices: employeeTypes,
            }
        ])
        //return employeeInfo.employee_name, employeeInfo.employee_id, employeeInfo.employee_email;
    switch (employeeInfo.employee_type) {
        case "Manager":
            addManager(employeeInfo.employee_name, employeeInfo.employee_id, employeeInfo.employee_email);
            //console.log("Mgr");
            break;
        case "Engineer":
            //addEngineer();
            console.log("Eng");
            break;
        case "Intern":
            //addIntern();
            console.log("Int");
            break;
    }
}       

addEmployee();

const addManager = async (name, id, email) => {

    const getManagerInfo = await 
        
        inquirer
        .prompt ([

            {
                name:"manager_officeNumber",
                type: "number",
                message: "Please enter Manager's Office No: ?"
            }
        ])

    const mgr = new Manager (name, id, email, getManagerInfo.manager_officeNumber);

    console.log(mgr);
}