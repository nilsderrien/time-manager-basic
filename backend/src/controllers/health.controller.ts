import { Router } from "express";

export const healthController = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Vérifie que l'API est disponible
 *     responses:
 *       200:
 *         description: L'API est disponible
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - status
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
healthController.get("/api/health", (_request, response) => {
	response.json({ status: "ok" });
});
