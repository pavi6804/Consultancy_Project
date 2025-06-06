const app = require('./app.js'); // Import the Express app

require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
