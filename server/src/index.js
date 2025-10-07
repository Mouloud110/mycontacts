require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const contactRoutes = require('./routes/contact.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => res.json({ ok: true }));


app.use('/auth', authRoutes);
app.use('/contacts', contactRoutes);


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


module.exports = app;


if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  connectDB()
    .then(() => app.listen(PORT, () => {
      console.log(` API http://localhost:${PORT}`);
      console.log(` Docs http://localhost:${PORT}/docs`);
    }))
    .catch(err => {
      console.error(' DB connection failed', err);
      process.exit(1);
    });
}