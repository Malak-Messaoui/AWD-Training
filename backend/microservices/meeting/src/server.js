const { Eureka } = require('eureka-js-client');
const app = require('./app');

const PORT = process.env.PORT || 8083;

const client = new Eureka({
  instance: {
    app: 'MEETING',
    instanceId: `meeting:${PORT}`,
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: `http://localhost:${PORT}`,
    port: { '$': Number(PORT), '@enabled': true },
    vipAddress: 'meeting',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/',
  },
});

app.listen(PORT, () => {
  console.log(`meeting microservice running on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/swagger-ui`);

  // Étape 2 : enregistrement dans Eureka après le démarrage du serveur
  client.start((error) => {
    console.log(error || 'MEETING enregistré dans Eureka');
  });
});

// Étape 4 : désenregistrement propre à l'arrêt (Ctrl+C)
process.on('SIGINT', () => {
  client.stop(() => {
    console.log('MEETING désenregistré de Eureka');
    process.exit();
  });
});