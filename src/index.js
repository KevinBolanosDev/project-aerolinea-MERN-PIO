import app from './app.js';
import { PORT } from './config.js';
import { connectDB } from './database/db.js';

connectDB();

app.listen(PORT, () => {
    console.log(`server is running on port http://localhost:${PORT}`);
});