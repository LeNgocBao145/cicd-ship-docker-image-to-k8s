const { createApp } = require('./app');

const port = Number(process.env.PORT || 3000);
const server = createApp();

server.listen(port, '0.0.0.0', () => {
  console.log(`Task API listening on port ${port}`);
});
