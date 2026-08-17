#!/usr/bin/env node

import {createServer} from "node:http";
import type {IncomingMessage, ServerResponse} from "node:http";
import {readFile, access} from "node:fs/promises";
import {resolve, extname, join} from "node:path";
import {parseArgs} from "node:util";

const pkgPath = join(
    import.meta.dirname,
    "..",
    "package.json"
);
const pkg = JSON.parse(await readFile(
    pkgPath,
    "utf-8"
)) as {"version": string};

const {values} = parseArgs({
    "options": {
        "port": {
            "type": "string",
            "short": "p",
            "default": "3000"
        },
        "graph": {
            "type": "string",
            "short": "g"
        }
    }
});

const port = parseInt(
    values.port,
    10
);
const graphPath = values.graph
    ? resolve(values.graph)
    : null;

// Validate graph file exists if specified
if (graphPath) {

    try {

        await access(graphPath);

    } catch {

        console.error(`\n  ❌ Graph file not found: ${graphPath}\n`);
        process.exit(1);

    }

}

const publicDir = join(
    import.meta.dirname,
    "..",
    "public"
);

const MIME_TYPES: Record<string, string> = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".svg": "image/svg+xml"
};

async function handleRequest (req: IncomingMessage, res: ServerResponse): Promise<void> {

    const url = new URL(
        req.url ?? "/",
        `http://localhost:${String(port)}`
    );
    let pathname = url.pathname;

    // Serve version
    if (pathname === "/api/version") {

        res.writeHead(
            200,
            {"Content-Type": "application/json"}
        );
        res.end(JSON.stringify({"version": pkg.version}));
        return;

    }

    // Serve graph.json from --graph path
    if (pathname === "/graph.json" && graphPath) {

        try {

            const data = await readFile(graphPath);
            res.writeHead(
                200,
                {"Content-Type": "application/json"}
            );
            res.end(data);
            return;

        } catch {

            res.writeHead(
                500,
                {"Content-Type": "text/plain"}
            );
            res.end("Error reading graph file");
            return;

        }

    }

    // Default to index.html
    if (pathname === "/") {

        pathname = "/index.html";

    }

    // Serve static files from public/
    const filePath = join(
        publicDir,
        pathname
    );

    // Prevent directory traversal
    if (!filePath.startsWith(publicDir)) {

        res.writeHead(
            403,
            {"Content-Type": "text/plain"}
        );
        res.end("Forbidden");
        return;

    }

    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] ?? "application/octet-stream";

    try {

        const data = await readFile(filePath);
        res.writeHead(
            200,
            {"Content-Type": contentType}
        );
        res.end(data);

    } catch {

        res.writeHead(
            404,
            {"Content-Type": "text/plain"}
        );
        res.end("Not found");

    }

}

const server = createServer((req, res) => {

    void handleRequest(
        req,
        res
    );

});

server.listen(
    port,
    () => {

        console.log(`\n  🔍 GNAWS Viewer running at http://localhost:${String(port)}\n`);
        if (graphPath) {

            console.log(`  📊 Graph: ${graphPath}\n`);

        }

    }
);
