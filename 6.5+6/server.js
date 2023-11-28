var http = require("http");
var fs = require("fs");
var fsPromises = require("fs/promises");
var url = require("url");

http
  .createServer(function (req, res) {
    let filename = "./pages/home.html";
    let q = url.parse(req.url, true);
    const pathName = q.pathname;
    const pathArr = pathName.split("/").slice(1);
    switch (pathArr[0]) {
      case "":
        getPageFitTo("/pages/home", "html", res);
        break;
      case "pages":
        getPageFitTo(pathName, "html", res);
        break;
      case "files":
        if (pathArr.length === 1) {
          getPageFitTo("/files/files", "html", res);
        } else {
          getPageFitTo(pathName, "txt", res);
        }
        break;
      case "contacts":
        if (pathArr.length > 2) {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end("404 Not Found");
        } else if (pathArr.length === 1) {
          getPageFitTo(`/db/contacts`, "json", res);
        } else {
          filterDataById(`/db/contacts`, "contacts", pathArr[1], res);
        }
        break;
      case "comps":
        if (pathArr.length > 3) {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end("404 Not Found");
        } else if (pathArr.length === 1) {
          getPageFitTo(`/comps/comps`, "html", res);
        } else {
          calculateResult(pathArr[1], Number.parseInt(pathArr[2]), res);
        }
        break;
      default:
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404 Not Found");
        break;
    }
  })
  .listen(8080);

function getPageFitTo(pathName, type, res) {
  fs.readFile(`.${pathName}.${type}`, function (err, data) {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end("404 Not Found");
    }

    switch (type) {
      case "txt":
        res.writeHead(200, { "Content-Type": "text/plain" });
        break;
      case "json":
        res.writeHead(200, { "Content-Type": "application/json" });
      default:
        res.writeHead(200, { "Content-Type": `text/${type}` });
        break;
    }

    res.write(data);
    return res.end();
  });
}

async function filterDataById(pathName, dataName, id, res) {
  const rawData = await fsPromises.readFile(
    `.${pathName}.json`,
    "utf-8",
    function (err, data) {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/html" });
        return res.end("404 Not Found");
      }
      return data;
    }
  );
  const data = JSON.parse(rawData)[dataName];
  const result = data.filter((item) => {
    return item.id == id;
  });
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(result));
  return res.end();
}

function calculateResult(method, number, res) {
  let result;
  if (method === "fact") {
    result = calcFactorial(number);
  } else if (method === "primes") {
    result = getNumPrimes(number);
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    return res.end("404 Not Found");
  }
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write(`the result is: ${result}`);
  return res.end();
}

function calcFactorial(number) {
  return `i can't do factorial for ${number} because i am tired :/`;
}

function getNumPrimes(number) {
  return `i can't do primes for ${number} because i am stupid D:`;
}
