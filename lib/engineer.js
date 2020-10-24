const Employee = require("../lib/employee");

class Engineer extends Employee {

    constructor(name, id, email, gitUsername) {

        super(name, id, email);
        this.github = gitUsername;
    }

    getGithub() {

        return this.github;
    }

    getRole()   {

        return "Engineer";
    }
}

module.exports = Engineer;