const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const { errorHandler } = require('./middleware/errorMiddleware');
const http = require('http');
const connectDB = require('./config/dbConnect');
const port = process.env.PORT || 5000;
const app = express();

connectDB();

const __dir = path.resolve();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const server = http.createServer(app);

app.use('/projectX/api/accounts', require('./routes/accountRoutes'));	

app.use(express.static(path.join(__dir, '/client/dist')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dir, 'client', 'dist', 'index.html'));
});

app.use(errorHandler);

server.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = { app, server };
