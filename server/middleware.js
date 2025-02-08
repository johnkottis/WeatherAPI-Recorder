const fs = require('fs');
const path = require('path');

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return true;
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

const deleteAllSimilarLogs = (req, endpoint) => {
  const logDir = path.join(__dirname, 'logs', req.method);
  if (fs.existsSync(logDir)) {
    fs.readdirSync(logDir).forEach(file => {
      if (file.includes(endpoint)) {
        fs.rmSync(path.join(logDir, file), { recursive: true, force: true });
      }
    });
  }
};

const logRequest = (req, res, next) => {
  const requestData = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  };

  const logFilePath = path.join(__dirname, 'logs', req.method, req.url.replace(/\//g, '_'), 'request.json');
  ensureDirectoryExistence(logFilePath);

  fs.writeFile(logFilePath, JSON.stringify(requestData, null, 2), (err) => {
    if (err) console.error('Error logging request:', err);
  });

  next();
};

const logResponse = (req, res, next) => {
  const oldSend = res.send;

  res.send = function (body) {
    const responseData = {
      statusCode: res.statusCode,
      headers: res.getHeaders(),
      body: body,
    };

    const logFilePath = path.join(__dirname, 'logs', req.method, req.url.replace(/\//g, '_'), 'response.json');
    ensureDirectoryExistence(logFilePath);

    fs.writeFile(logFilePath, JSON.stringify(responseData, null, 2), (err) => {
      if (err) console.error('Error logging response:', err);
    });

    oldSend.apply(res, arguments);
  };

  next();
};

module.exports = { ensureDirectoryExistence, deleteAllSimilarLogs, logRequest, logResponse };