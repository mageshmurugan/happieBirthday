const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cronJob = require('cron').CronJob;
const Dates = require('./models/dates')


const app = express();
app.use(express.urlencoded({ extended: true }));


// const dbUrl = 'mongodb://localhost:27017/dates';
const dbUrl = 'mongodb+srv://happybirthdaymessage:woV76BMccfoLYRjI@cluster1.ejllaob.mongodb.net/?retryWrites=true&w=majority'
// const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const authmail = nodemailer.createTransport({
    service: 'gmail',
    // host: 'smtp.ethereal.email',
    // port: 587,
    auth: {
        user: 'mageshmurugan64@gmail.com',
        pass: 'nwhlltxkjhonekoh'
    }
});

// app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
    res.render('date')
})

app.post('/', async (req, res) => {
    // console.log(req.body);
    const { names, email, date } = req.body;
    const m = date.split('-');
    const sp = m[0]
    const n = m.slice(1)
    // console.log(n)
    const tit = n.join('-');

    const a = tit.split('-');
    const b = a[0].charAt(0);
    if (b == '0') {
        a[0] = a[0].slice(1);
        // console.log(a)
    }
    const c = a[1].charAt(0);
    if (c == '0') {
        a[1] = a[1].slice(1);
    }
    const da = a.join(':');
    // console.log(da)

    const data = new Dates({ email: email, names: names, date: da, year: sp });
    await data.save();
    console.log(data)
    res.redirect('/')
})


setInterval(myFunction, 1000)

async function myFunction() {
    const date = new Date()
    // const timeZone = 'Asia/Kolkata';
    // const tim = d.getHours() + ':' + d.getMinutes()
    const formatters = [new Intl.DateTimeFormat('sv', { timeStyle: 'medium', dateStyle: 'short', timeZone: 'Asia/Kolkata' }),
    new Intl.DateTimeFormat('sv', { dateStyle: 'short', timeZone: 'Asia/Kolkata' })]
    // const formatters = [new Intl.DateTimeFormat('sv', { timeZone: 'Asia/Kolkata' })]
    formatters.forEach(fmt => console.log(fmt.format(date)))
    // let d = new Date().toLocaleString("en-us", { timeZone: 'Asia/kolkata' });
    // const gim = d.getMonth() + ':' + d.getDate()
    // console.log(tim)
    // console.log(gim)

}



const textJob = new cronJob('1 1 1 * * *', async function () {
    // const textJob = new cronJob('1 * * * * *', async function () {
    let d = new Date();
    const dat = d.getMonth() + 1 + ':' + d.getDate();
    const findDate = await Dates.find({
        date: dat
    });
    if (findDate) {
        for (let datq of findDate) {
            const mailOptions = {
                from: 'Happy Birthday <mageshmurugan64@gmail.com>',
                to: `${datq.names} <${datq.email}>`,
                subject: `Happy Birthday ${datq.names}`,
                text: `Wishing You the Best Birthday ${datq.names} `
                // html: `<div>
                // <h1>hello${datq.names}</h1>
                // </div>`

            };
            authmail.sendMail(mailOptions,
                function (error, info) {
                    if (error) {
                        console.log('ERROR')
                        console.log(error);
                    } else {
                        console.log('Email Sent :' + info.response);
                    }
                });
            // console.log(datq.year)
            // console.log(d.getFullYear() - datq.year)
        }

    }
}, null, true);

// happybirthdaymessage
// woV76BMccfoLYRjI

const port = process.env.PORT
app.listen(port, () => {
    console.log(`SERVING ON PORT ${port}`)
})