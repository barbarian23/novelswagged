const express = require('express');
const app = express();
const port = 3003;

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./novel.json");

app.use('/', swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));

app.listen(port, function(){
  console.log(`Example app listening on port http://localhost:${port}`)
});