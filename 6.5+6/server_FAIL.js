var http = require("http");
var fs = require("fs");
var fsPromises = require("fs/promises");
var url = require("url");

http
  .createServer(async function (req, res) {
    let filename = "./pages/home.html";
    let q = url.parse(req.url, true);
    const pathName = q.pathname;
    const pathArr = pathName.split("/").slice(1);
    switch (pathArr[0]) {
      case "":
        await getPageFitTo("/pages/home", "html", res);
        break;
      case "pages":
        await getPageFitTo(pathName, "html", res);
        break;
      case "files":
        if (pathArr.length === 1) {
          await getPageFitTo("/files/files", "html", res);
        } else {
          await getPageFitTo(pathName, "txt", res);
        }
        break;
      case "contacts":
        if (pathArr.length > 2) {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end("404 Not Found");
        } else if (pathArr.length === 1) {
          await getPageFitTo(`/db/contacts`, "json", res);
        } else {
          await filterDataById(`/db/contacts`, "contacts", pathArr[1], res);
        }
        break;
      case "comps":
        if (pathArr.length > 3) {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end("404 Not Found");
        } else if (pathArr.length === 1) {
          await getPageFitTo(`/comps/comps`, "html", res);
        } else {
          await calculateResult(pathArr[1], Number.parseInt(pathArr[2]), res);
        }
        break;
      default:
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("404 Not Found");
        break;
    }
    res.end();
  })
  .listen(8080);

function getPageFitTo(pathName, type, res) {
  return fsPromises.readFile(`.${pathName}.${type}`, function (err, data) {
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
  // return res.end();
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
  // return res.end();
}

function calcFactorial(number) {
  return `i can't do factorial for ${number} because i am tired :/`;
}

function getNumPrimes(number) {
  return `i can't do primes for ${number} because i am stupid D:`;
}
