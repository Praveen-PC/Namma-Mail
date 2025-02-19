
const db = require('../model/db');
const bcrypt = require('bcrypt');

const postUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    
    try {
        const userRole = role || 'user';
        const checkUser = 'SELECT * FROM userdetails WHERE email = ?';
        const [result] = await db.query(checkUser, [email]);

        if (result.length > 0) {
            return res.status(409).send({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO userdetails (username, email, password, role) VALUES (?, ?, ?, ?)';
        await db.query(sql, [name, email, hashedPassword, userRole]);

        res.status(201).send({ message: "User Registered Successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const sql = "SELECT * FROM userdetails";
        const [users] = await db.query(sql);

        const userWithTicketCount = await Promise.all(users.map(async (user) => {
            const ticketPerUser = "SELECT COUNT(*) AS ticketCount FROM ticketdetails WHERE user_id = ?";
            const [ticketResult] = await db.query(ticketPerUser, [user.id]);

            return { ...user, ticketCount: ticketResult[0].ticketCount || 0 };
        }));

        res.status(200).send(userWithTicketCount);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const sql = 'UPDATE userdetails SET role = ? WHERE id = ?';
        const [result] = await db.query(sql, [role, id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({ message: `Role updated to ${role}` });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'DELETE FROM userdetails WHERE id = ?';
        const [result] = await db.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = { postUser, getUser, updateUser, deleteUser };
