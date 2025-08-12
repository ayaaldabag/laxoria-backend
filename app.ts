import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";

// i18n initialization
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "ar", "fr"],
    backend: {
      loadPath: path.join(__dirname, "../locales/{{lng}}/translation.json")
    }
  });

const app = express();
app.use(cors());
app.use(express.json());

// i18n middleware
app.use(middleware.handle(i18next));

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ ok: true, message: req.t("welcome") });
});

export default app;
