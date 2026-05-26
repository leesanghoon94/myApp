const express = require("express");
const port = 3333;
const app = express();
const db = require("./db");
const cors = require("cors");
const {
  register,
  requestCounter,
  responesTimeHistogram,
  errorCount,
  dbQueryDuration,
} = require("./metrics");

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (req.path === "/metrics") return next();
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const durationInSeconds = diff[0] + diff[1] / 1e9;
    responesTimeHistogram
      .labels(req.method, req.path, res.statusCode)
      .observe(durationInSeconds);

    if (res.statusCode >= 400) {
      errorCount.inc({
        method: req.method,
        route: req.path,
        status_code: res.statusCode,
      });
    }
  });
  requestCounter.inc({ method: req.method, route: req.path });
  next();
});

app.get("/api/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
});

app.get("/api", (req, res) => {
  res.send({ root: true });
});

app.get("/api/article", (req, res) => {
  const start = process.hrtime();
  db.query("select * from articles;", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "database error" });
    }
    const diff = process.hrtime(start);
    const latency = diff[0] + diff[1] / 1e9;
    dbQueryDuration.labels("select_all_articles").observe(latency);
    res.json(result);
  });
});

app.get("/api/article/:id", (req, res) => {
  const { id } = req.params;
  const start = process.hrtime();
  db.query("select * from articles where _id=?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internet Server Error" });
    }
    const diff = process.hrtime(start);
    const latency = diff[0] + diff[1] / 1e9;
    dbQueryDuration.labels("select_article_by_id").observe(latency);
    res.json(result);
  });
});

app.post("/api/article", (req, res) => {
  const start = process.hrtime();
  const title = req.body.title;
  const body = req.body.body;

  console.log("PUT HIT");
  console.log(req.params);
  console.log(req.body);

  db.query(
    "insert into articles (title,body) value(?,?)",
    [title, body],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "databases error" });
      }
      const diff = process.hrtime(start);
      const latency = diff[0] + diff[1] / 1e9;
      dbQueryDuration.labels("post_article").observe(latency);
      res.json(result);
    },
  );
});

app.put("/api/article/:id", (req, res) => {
  const start = process.hrtime();
  let { id } = req.params;
  let title = req.body.title;
  let body = req.body.body;
  db.query(
    "UPDATE articles set title= ?, body=? where _id= ?",
    [title, body, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(404).json({ error: "databases error " });
      }
      const diff = process.hrtime(start);
      const latency = diff[0] + diff[1] / 1e9;
      dbQueryDuration.labels("update_article_by_id").observe(latency);
      res.json(result);
    },
  );
});

app.delete("/api/article/:id", (req, res) => {
  const start = process.hrtime();
  const { id } = req.params;
  db.query("delete from articles where _id=?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(404).json({ error: "database error" });
    }
    const diff = process.hrtime(start);
    const latency = diff[0] + diff[1] / 1e9;
    dbQueryDuration.labels("delete_article").observe(latency);
    res.json(result);
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
