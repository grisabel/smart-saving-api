const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { "showExplorer": true }));

const port = (process.env.PORT || 3002);
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});