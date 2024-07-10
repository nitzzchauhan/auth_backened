

import nodemailer from 'nodemailer'














// const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "Gmail",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "admin@gmail.com",
        pass: "x",
    },
});

export default transporter

