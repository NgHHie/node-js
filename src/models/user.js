const connection = require('../configs/database');

const User = function(user){
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
};

User.create = async (newUser, result) => {
    try {
        const res = await connection.query("INSERT INTO Userslog SET ?", newUser);
        console.log("created user: ", { id: res.insertId, ...newUser });
        return { id: res.insertId, ...newUser };
    } catch (err) {
        console.error("error: ", err);
        throw err;
    }
};

User.findByEmail = async (email, result) => {
    try {
        const [res] = await connection.query(`SELECT * from Userslog WHERE email = '${email}'`);
        if (res.length) {
            const { password, ...filteredRes } = res[0];
            // return filteredRes;
            return res[0];
        }
        return null;
    } catch (err) {
        console.error("error: ", err);
        throw err;
    }
};

User.verify = async (email) => {
    try {
        const res = await connection.query(
            "UPDATE Userslog SET email_verified_at = ? WHERE email = ?",
            [new Date(), email]
        );

        if (res.affectedRows == 0) {
            throw { kind: "not_found" };
        }

        return { email: email };
    } catch (err) {
        console.log("error: ", err);
        throw err;
    }
};

module.exports = User;