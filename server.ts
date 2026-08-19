import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API route for handling secure vessel inquiries
  app.post("/api/inquire", async (req, res) => {
    const { name, company, scope, localTimestamp } = req.body;

    if (!name || !scope) {
      return res.status(400).json({ error: "Name and project scope are required fields." });
    }

    try {
      console.log("-----------------------------------------");
      console.log(`[INCOMING INQUIRY] ${new Date().toISOString()}`);
      console.log(`Name: ${name}`);
      console.log(`Company/Studio: ${company || "None / Independent"}`);
      console.log(`Timestamp (Local): ${localTimestamp || "N/A"}`);
      console.log(`Scope & Specifications:`);
      console.log(scope);
      console.log("-----------------------------------------");

      // Respond back successfully
      return res.json({ success: true });
    } catch (error: any) {
      console.error("Error logging inquiry:", error);
      return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Vite middleware for development or serving index.html in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started and running on port ${PORT}`);
  });
}

startServer();
