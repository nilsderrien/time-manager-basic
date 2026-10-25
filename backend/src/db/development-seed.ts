import { readFile } from "node:fs/promises";
import { pool } from "./pool.js";

const seedFilePath =
	process.env.SEED_FILE_PATH ?? `${process.cwd()}/../database/populate.sql`;

export async function seedDevelopmentDatabase(): Promise<void> {
	if (process.env.NODE_ENV !== "development") {
		return;
	}

	const client = await pool.connect();

	try {
		await client.query("BEGIN");
		await client.query("SELECT pg_advisory_xact_lock(748391)");

		const result = await client.query<{ count: string }>(
			"SELECT COUNT(*)::text AS count FROM users",
		);

		if (result.rows[0]?.count !== "0") {
			await client.query("COMMIT");
			return;
		}

		const seedSql = await readFile(seedFilePath, "utf8");
		await client.query(seedSql);
		await client.query("COMMIT");
		console.info("Development database populated");
	} catch (error) {
		await client.query("ROLLBACK");
		throw new Error(
			`Unable to populate development database from ${seedFilePath}`,
			{
				cause: error,
			},
		);
	} finally {
		client.release();
	}
}
