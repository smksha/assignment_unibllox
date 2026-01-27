import express from "express";
import { Request, Response } from "express";
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

app.get("/health", (_req: Request, res: Response) => {
  res.send("OK");
});

export default app;
