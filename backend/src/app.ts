import express from "express";
import cartRoutes from "./routes/cart.routes";
import checkoutRoutes from "./routes/checkout.routes";
import adminRoutes from "./routes/admin.routes";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

app.use(express.json());

app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/admin", adminRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
