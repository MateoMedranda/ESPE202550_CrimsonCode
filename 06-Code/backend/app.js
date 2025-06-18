const express = require('express');
const cors = require('cors');
const path = require('path');

const profileRoutes = require('./routes/profileRoutes');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../06-Code')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../06-Code/index.php')); 
});

app.use('/api/profiles', profileRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
