const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const { type } = require("os");
const render = require("./lib/htmlRenderer");


// array to store all employees
const allEmployees = [];
// function to check if user wants to start storing employee data
const addEmployee = () => {
    inquirer
    .prompt([
        {
            name: "add_employee",
            type: "confirm",
            message: "Would you like to add an employee?"
        },
        {
            name: "generate_roster",
            type: "confirm",
            message: "Would you like to generate the roster now?",
            when: allEmployees.length >= 1
            // the above prompt asks the user to generate the roster
            // only if they have finished entering all employee details
            // this prompt only triggers when there is atleast 1 employee object in the allEmployees array
            // and the user has said no to the first prompt which asks to add an employee
        }
    ])
    .then((answers) => {
        // conditional blocks to generate the above prompts or call the getEmplyeeInfo function
        if (answers.generate_roster) {
            console.log("No more employees to be added.\n Generating your roster");
            writeFunction();
        }else if (!answers.add_employee) {
            console.log("No more employees to be added. Thank you for using the employee profile generator!");
        } 
         else {
            getEmployeeInfo();
        }
    });
}

const getEmployeeInfo = async () => {

    const employeeTypes = ["Manager", "Engineer", "Intern"];
    // options for employee_type prompt

    const employeeInfo = await 

        inquirer
        .prompt([
            {
                name: "employee_name",
                type: "input",
                message: "Please enter Employee's name?",
                // employee name cannot be blank
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
                message: "Please enter Employee ID?"
            },
            {
                name: "employee_email",
                type: "input",
                message: "Please enter email ?",
                // regex to check for email validation
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
        
    // switch statement to ascertain which type of employee the data is for i.e Manger, Engineer or Intern
    // it triggers the respective employee role functions below
    // it calls the respective functions based on user choice for employee_type prompt
    // each function is passed the Employee class requirements of name, id & email
    switch (employeeInfo.employee_type) {
        case "Manager":
            addManager(employeeInfo.employee_name, employeeInfo.employee_id, employeeInfo.employee_email);
            break;
        case "Engineer":
            addEngineer(employeeInfo.employee_name, employeeInfo.employee_id, employeeInfo.employee_email);
            break;
        case "Intern":
            addIntern(employeeInfo.employee_name, employeeInfo.employee_id, employeeInfo.employee_email);
            break;
    }
}       

// Generates a new Manager class instance 
// logs that particular instance to the console for the user
// pushes the generated class iinstance to the allEmployees array
const addManager = async (name, id, email) => {

    const getManagerInfo = await 
        
        inquirer
        .prompt ([
            {
                name:"manager_officeNumber",
                type: "number",
                message: "Please enter Manager's Office Number?"
            }
        ])

    const mgr = new Manager (name, id, email, getManagerInfo.manager_officeNumber);
    allEmployees.push(mgr);
    console.log("A new manager has been added to the roster.")
    console.log(mgr);
    console.log(`All Employees:\n${JSON.stringify(allEmployees)}`);
    addEmployee();
}

// Generates a new Engineer class instance 
// logs that particular instance to the console for the user
// pushes the generated class iinstance to the allEmployees array
const addEngineer = async (name, id, email) => {

    const getEngineerInfo = await 
        
        inquirer
        .prompt ([
            {
                name:"engineer_gitUsername",
                type: "input",
                message: "Please enter Engineer's Github username?",
                // Github username cannot be blank
                validate: (username) => {
                    if (username.length < 1) {
                        console.log("\nUsername is required.")
                    } else {
                        return true;
                    }
                }
            }
        ])

    const engnr = new Engineer (name, id, email, getEngineerInfo.engineer_gitUsername);
    allEmployees.push(engnr);
    console.log("A new engineer has been added to the roster.");
    console.log(engnr);
    console.log(`All Employees:\n${JSON.stringify(allEmployees)}`);
    addEmployee();
}

// Generates a new Intern class instance 
// logs that particular instance to the console for the user
// pushes the generated class iinstance to the allEmployees array
const addIntern = async (name, id, email) => {

    const getInternInfo = await 
        
        inquirer
        .prompt ([

            {
                name:"intern_school",
                type: "input",
                message: "Please enter school name for Intern?",
                // Intern school name cannot be blank 
                validate: (schoolName) => {
                    if (schoolName.length < 1) {
                        console.log("\nSchool name is required.")
                    } else {
                        return true;
                    }
                }
            }
        ])

    const intern = new Intern (name, id, email, getInternInfo.intern_school);
    allEmployees.push(intern);
    console.log("A new intern has been added to the roster.")
    console.log(intern);
    console.log(`All Employees:\n${JSON.stringify(allEmployees)}`);
    addEmployee();
}

const writeFunction = async () => {

    let html = await render(allEmployees);

    try {
        fs.writeFileSync(outputPath, html);
        } catch(err) {
          // An error occurred
          console.error(err);
        }
}

// initiate function on startup
addEmployee();