import assert from "node:assert/strict";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, describe, it } from "node:test";
import { createApp } from "../../src/app.js";
import { checkDatabase, pool } from "../../src/db/pool.js";

async function get(server: Server, path: string) {
	const { port } = server.address() as AddressInfo;
	const response = await fetch(`http://127.0.0.1:${port}${path}`);
	return { status: response.status, body: await response.json() };
}

describe("GET /api/health/db", () => {
	let ok: Server;
	let ko: Server;

	before(() => {
		ok = createApp(async () => {}).listen(0);
		ko = createApp(async () => {
			throw new Error("down");
		}).listen(0);
	});

	after(() => {
		ok.close();
		ko.close();
	});

	it("returns 200 when the database is reachable", async () => {
		const res = await get(ok, "/api/health/db");
		assert.equal(res.status, 200);
		assert.equal(res.body.database, "up");
	});

	it("returns 503 when the database is unreachable", async () => {
		const res = await get(ko, "/api/health/db");
		assert.equal(res.status, 503);
		assert.equal(res.body.database, "down");
	});
});

describe("real database access", { skip: !process.env.DB_HOST }, () => {
	after(() => pool.end());

	it("answers SELECT 1 and has the schema loaded", async () => {
		await checkDatabase();
		const { rows } = await pool.query(
			"SELECT to_regclass('public.users') AS users, to_regclass('public.leave_requests') AS leave_requests",
		);
		assert.ok(rows[0].users);
		assert.ok(rows[0].leave_requests);
	});
});
