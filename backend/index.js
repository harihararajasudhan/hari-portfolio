require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database');
    }
});

app.get('/users', (req, res) => {
    const query = 'SELECT * FROM info order by id desc';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).send('Error fetching users');
        } else {
            res.json(results);
        }
    });
});

app.post('/userreg', (req, res) => {
    const { name, mobile, city } = req.body;
    const query = 'INSERT INTO info (name,mobile,city) VALUES (?,?,?)';
    connection.query(query, [name, mobile, city], (err, results) => {
        if (err) {
            console.error('Error registering user:', err);
            res.status(500).send('Error registering user');
        } else {
            res.json({ message: 'User registered successfully' });
        }
    });
});
app.put('/userupdate/:id', (req, res) => {
    const id = req.params.id;
    const { name, mobile, city } = req.body;
    const query = 'UPDATE info SET name=?, mobile=?, city=? WHERE id=?';
    connection.query(query, [name, mobile, city, id], (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).send('Error updating user');
        } else {
            console.log(results);
            res.send("updated successfully");
        }
    });
});
app.delete('/userdelete/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM info WHERE id=?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.status(500).send('Error deleting user');
        } else {
            console.log(results);
            res.send("deleted successfully");
        }
    });
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    const sql = 'INSERT INTO contact (name, email, message) VALUES (?, ?, ?)';
    connection.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error saving contact message:', err);
            return res.status(500).send('Error saving contact message');
        }
        const mailOptions = {
            from: email,
            to: "hariraja212001@gmail.com",
            subject: 'New Contact Form Submission',
            html:
                `<h3>New Contact Form Submission</h3>
                 <p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong> ${message}</p>`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Error sending email');
            } else {
                console.log('Email sent:', info.response);
                res.json({ message: 'Contact form submitted and email sent successfully!' });
            }
        });
    });
});