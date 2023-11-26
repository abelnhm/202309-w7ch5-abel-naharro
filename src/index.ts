import { createServer } from 'http';
import { app } from './app.js';
import { dbConnect } from './services/db.connect.js';
import { debug } from 'console';

const PORT = process.env.PORT || 3030;
const server = createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug(`Connect to DB: ${mongoose.connection.db.databaseName}`);
  })
  .catch((error) => server.emit(error));

server.on('listening', () => {
  console.log('Listening on port', PORT);
});
