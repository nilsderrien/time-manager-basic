import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app-error.js";

function isInvalidJsonError(error: unknown): boolean {
	return (
		error instanceof SyntaxError &&
		typeof error === "object" &&
		error !== null &&
		"body" in error
	);
}

export const errorHandler: ErrorRequestHandler = (
	error,
	_request,
	response,
	next,
) => {
	if (response.headersSent) {
		next(error);
		return;
	}

	if (isInvalidJsonError(error)) {
		response.status(400).json({
			error: {
				code: "INVALID_JSON",
				message: "Le corps de la requête doit contenir un JSON valide",
			},
		});
		return;
	}

	if (error instanceof AppError) {
		const errorResponse = {
			code: error.code,
			message: error.message,
			...(error.details === undefined ? {} : { details: error.details }),
		};

		response.status(error.statusCode).json({ error: errorResponse });
		return;
	}

	console.error(error);
	response.status(500).json({
		error: {
			code: "INTERNAL_ERROR",
			message: "Une erreur interne est survenue",
		},
	});
};
