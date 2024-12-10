const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');

const genericRoutes = require('./src/routes/routes');

app.use(cors());
app.use(express.json());
app.use('/api', genericRoutes);

// Function to print all routes (ai generated)
const printRoutes = (app) => {
  console.log('Available endpoints:');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) { // Routes registered directly on the app
      console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') { // Router middleware
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          console.log(`${Object.keys(handler.route.methods).join(', ').toUpperCase()} /api${handler.route.path}`);
        }
      });
    }
  });
};

app.listen(port, () => {
  console.log(`Server is running on "http://localhost:${port}"`);
  printRoutes(app);
});
