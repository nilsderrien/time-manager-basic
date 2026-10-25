import { Router } from "express";
import { pool } from "../db/pool.js";

export const usersController = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Liste les utilisateurs actifs (informations non sensibles)
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   role:
 *                     type: string
 */
usersController.get("/api/users", async (_request, response, next) => {
	try {
		const { rows } = await pool.query(
			"SELECT id, first_name, last_name, role FROM users WHERE is_active ORDER BY id",
		);
		response.json(rows);
	} catch (error) {
		next(error);
	}
});
