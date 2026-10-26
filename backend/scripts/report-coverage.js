import { appendFile, readFile } from "node:fs/promises";

const [lcovPath = "coverage/lcov.info", testExitCodeArgument = "0"] =
	process.argv.slice(2);
const testExitCode = Number.parseInt(testExitCodeArgument, 10);
const threshold = Number(process.env.COVERAGE_THRESHOLD ?? "80");

if (!Number.isInteger(testExitCode) || testExitCode < 0) {
	console.error("Test exit code must be a non-negative integer.");
	process.exit(1);
}

if (!Number.isFinite(threshold) || threshold < 0 || threshold > 100) {
	console.error("COVERAGE_THRESHOLD must be a number between 0 and 100.");
	process.exit(1);
}

function reportSummary(summary) {
	const summaryPath = process.env.GITHUB_STEP_SUMMARY;
	if (summaryPath) {
		return appendFile(summaryPath, `${summary}\n`);
	}

	console.log(summary);
}

function reportAnnotation(level, message) {
	if (process.env.GITHUB_ACTIONS === "true") {
		console.log(`::${level}::${message}`);
		return;
	}

	const log = level === "error" ? console.error : console.warn;
	log(message);
}

let lcov;
try {
	lcov = await readFile(lcovPath, "utf8");
} catch (error) {
	if (error.code !== "ENOENT") {
		throw error;
	}

	await reportSummary(`| Coverage | unavailable | ${threshold}% | KO |`);
	reportAnnotation(
		"error",
		`The backend test run did not produce ${lcovPath}.`,
	);
	process.exit(1);
}

let totalLines = 0;
let coveredLines = 0;
for (const line of lcov.split(/\r?\n/)) {
	if (!line.startsWith("DA:")) {
		continue;
	}

	const [, hitCount] = line.slice(3).split(",");
	if (hitCount === undefined || !/^\d+$/.test(hitCount)) {
		throw new Error(`Invalid LCOV line record: ${line}`);
	}

	totalLines += 1;
	if (Number(hitCount) > 0) {
		coveredLines += 1;
	}
}

const coveragePercent =
	totalLines === 0 ? 0 : (coveredLines / totalLines) * 100;
const coverageOk = coveragePercent >= threshold;
const coverageStatus =
	testExitCode !== 0 ? "KO" : coverageOk ? "OK" : "WARNING";
const summary = [
	"## Backend test coverage",
	"| Metric | Result | Threshold | Status |",
	"| --- | ---: | ---: | :---: |",
	`| Line coverage | ${coveragePercent.toFixed(2)}% (${coveredLines}/${totalLines}) | ${threshold}% | ${coverageStatus} |`,
].join("\n");

await reportSummary(summary);

if (!coverageOk) {
	reportAnnotation(
		"warning",
		`Backend line coverage is below the ${threshold}% target: ${coveragePercent.toFixed(2)}% (${coveredLines}/${totalLines} lines).`,
	);
}

if (testExitCode !== 0) {
	reportAnnotation(
		"error",
		`Backend test run failed with exit code ${testExitCode}.`,
	);
	process.exit(testExitCode);
}
