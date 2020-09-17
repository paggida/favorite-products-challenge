import app from './app';

const apiPort = process.env.PORT || 3000;

app.listen(apiPort, () => {
  console.log(`Swagger url: http://localhost:${apiPort}/api/v1/doc`);
});
