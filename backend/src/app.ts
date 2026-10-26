import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { healthController } from "./controllers/health.controller.js";
import { loginController } from "./controllers/login.controller.js";
import { usersController } from "./controllers/users.controller.js";
import { checkDatabase } from "./db/pool.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { notFound } from "./middlewares/not-found.js";

type DatabaseCheck = () => Promise<void>;

export function createApp(databaseCheck: DatabaseCheck = checkDatabase) {
	const app = express();

	app.disable("x-powered-by");
	app.use(express.json({ limit: "1mb" }));

	// CORS middleware
	app.use((_request, response, next) => {
		response.header("Access-Control-Allow-Origin", "*");
		response.header(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, DELETE, OPTIONS",
		);
		response.header(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization",
		);
		if (_request.method === "OPTIONS") {
			return response.sendStatus(204);
		}
		next();
	});

	app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	app.get("/api/health/db", async (_request, response) => {
		try {
			await databaseCheck();
			response.json({ status: "ok", database: "up" });
		} catch (error) {
			console.error("Database health check failed", error);
			response.status(503).json({ status: "error", database: "down" });
		}
	});

	// TODO: Add an automated check that every exposed route is documented.
	app.use(healthController);
	app.use(loginController);
	app.use(usersController);

	app.use(notFound);

	app.use(errorHandler);

	return app;
}
