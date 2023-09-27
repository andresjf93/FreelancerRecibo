const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

// Configurar el destino del proxy basado en la variable de entorno ASPNETCORE_HTTPS_PORT o ASPNETCORE_URLS
const target = env.ASPNETCORE_HTTPS_PORT
    ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
    : env.ASPNETCORE_URLS
        ? env.ASPNETCORE_URLS.split(';')[0]
        : 'http://localhost:51768';

const context = [
    "/weatherforecast",
    "/api/recibo"
];

module.exports = function(app) {
  const appProxy = createProxyMiddleware(context, {
    proxyTimeout: 10000,
    target: target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  });

  app.use(appProxy);
};
