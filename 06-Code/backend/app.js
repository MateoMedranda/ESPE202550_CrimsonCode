const express = require('express');
const cors = require('cors');

const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');
const actionRoutes = require('./routes/actionRoutes');
const reminderRoutes = require('./routes/remindersRoutes');
//const activityRoutes = require('./routes/activityRoutes');
//const environmentRoutes = require('./routes/environmentalPlanRoutes');
//const controlRoutes = require('./routes/controlRoutes');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/profile', profileRoutes);
app.use('/api/user',userRoutes)
app.use('/api/action', actionRoutes);
app.use('/api/reminder', reminderRoutes);
//app.use('/api/activity', activityRoutes);
//app.use('/api/environment', environmentRoutes);
//app.use('/api/control', controlRoutes);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
