const mongoose = require("mongoose");

const dataBaseConnection = async () => {
    try {
        const base = await mongoose.connect("mongodb://localhost:27017/auth01");
        console.log("dataBase connected");
    } catch (error) {
        onsole.log(error);
    }
};

module.exports = dataBaseConnection;
