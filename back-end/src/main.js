import express from "express";
import dotenv from "dotenv";
import sql from "./db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.get("/counters", async (req, res) => {
  try {
    const counters = await sql`
      SELECT id, name, description, event_total, event_count
      FROM counter_summary
    `;
    res.json(counters);
  } catch (err) {
    console.error("GET /counters error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/counter", async (req, res) => {
  try {
    const rawName = req.body.name;
    if (typeof rawName !== "string" || rawName.trim().length === 0) {
      return res.status(400).json({ error: "invalid name" });
    }
    const name = rawName.trim();

    const rawDescription = req.body.description;
    const description = typeof rawDescription === "string" ? rawDescription.trim() : "";

    const inserted = await sql`
      INSERT INTO counter (name, description)
      VALUES (${name}, ${description})
      RETURNING *
    `;

    res.status(201).json(inserted[0]);
  } catch (err) {
    console.error("POST /counter error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/counter/:id", async (req, res) => {
  try {
    const rawName = req.body.name;
    if (typeof rawName !== "string" || rawName.trim().length === 0) {
      return res.status(400).json({ error: "invalid name" });
    }
    const name = rawName.trim();

    const rawDescription = req.body.description;
    if (typeof rawDescription !== "string") {
      return res.status(400).json({ error: "invalid description" });
    }
    const description = rawDescription.trim();

    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const updated = await sql`
      UPDATE counter
      SET name = ${name}, description = ${description}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (updated.length === 0) {
      return res.status(404).json({ error: "counter not found" });
    }

    res.json(updated[0]);
  } catch (err) {
    console.error("PUT /counter/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/counter/:id", async (req, res) => {
  try {
    const rawIncrement = req.body.increment;
    const increment = typeof rawIncrement === "number" && rawIncrement > 0 ? rawIncrement : 1;

    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const [eventInsert] = await sql`
      INSERT INTO event (counter_id, increment, created_at)
      VALUES (${id}, ${increment}, NOW())
      RETURNING *
    `;

    if (!eventInsert) {
      return res.status(500).json({ error: "Failed to log increment event" });
    }
    res.json(
      eventInsert,
    );
  } catch (err) {
    console.error("POST /counter/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

function listenAsync(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Server started on port ${port}`);
      resolve(server);
    });
    server.on('error', reject);
  });
}

(async () => {
  try {
    await initializeDatabase();
  } catch (err) {
    console.error("Failed to initialize or start server:", err);
    process.exit(1);
  }

  await listenAsync(PORT);
})();
