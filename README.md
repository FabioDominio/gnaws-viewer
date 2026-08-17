# @gnaws/viewer

> *See the graph. Spot the waste.*

[![npm](https://img.shields.io/npm/v/@gnaws/viewer)](https://www.npmjs.com/package/@gnaws/viewer)
[![license](https://img.shields.io/badge/license-AGPL--3.0-blue)](LICENSE)
[![node](https://img.shields.io/node/v/@gnaws/viewer)](package.json)

Interactive browser-based visualization of AWS resource graphs built by [@gnaws/cli](https://www.npmjs.com/package/@gnaws/cli). Powered by [sigma.js](https://www.sigmajs.org/) and [Graphology](https://graphology.github.io/).

## Installation

```bash
npm install -g @gnaws/viewer
# or run without installing:
npx @gnaws/viewer
```

Requires Node.js >= 24.

## Usage

```bash
# Serve a graph exported from @gnaws/cli
npx @gnaws/viewer --graph ./graph.json

# Start the viewer and load a graph from the browser
npx @gnaws/viewer

Open http://localhost:3000 in your browser.

# Custom port
npx @gnaws/viewer -p 8080 -g ./graph.json
```
Open http://localhost:8080 in your browser.

## Options

| Option | Short | Default | Description |
|--------|-------|---------|-------------|
| `--port` | `-p` | `3000` | HTTP server port |
| `--graph` | `-g` | — | Path to a graph JSON file to serve |

## Example workflow

```bash
# 1. Scan your AWS account and export the graph
npx @gnaws/cli
gnaws> /scan my-profile
gnaws> /export json graph.json
gnaws> /quit

# 2. Visualize it
npx @gnaws/viewer --graph ./graph.json
```

## Loading a graph

There are two ways to load graph data:

1. **CLI flag** — Pass `--graph path/to/graph.json` and the file is served automatically
2. **Browser file picker** — If no graph is served, a drag-and-drop overlay lets you load one from disk

You can also reload or switch graphs at any time using the **Load New Graph** button in the sidebar.

## Controls

| Action | Effect |
|--------|--------|
| Hover | Highlight node |
| Click node | Focus node + neighbors, show details |
| Click empty area | Unfocus |
| Esc | Unfocus |
| Scroll | Zoom |
| Drag | Pan |
| Search box | Filter by name, ID, or type |

## Features

- **ForceAtlas2 layout** — automatic graph spatialization with no overlaps
- **Resource icons** — official AWS Architecture Icons for each resource type
- **Category filters** — toggle Networking, Compute, Storage, IAM, Monitoring
- **Node details** — click a node to see all attributes and connections
- **Dark theme** — optimized for long exploration sessions

## Development

```bash
npm install
npm run dev -- --graph path/to/graph.json
npm run typecheck
npm run lint
npm run build
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Support

If GNAWS saves you money on your AWS bill, consider sponsoring the project.

[![Sponsor on GitHub](https://img.shields.io/badge/sponsor-GitHub-pink?logo=github)](https://github.com/sponsors/FabioDominio)
[![Sponsor on PayPal](https://img.shields.io/badge/sponsor-PayPal-blue?logo=paypal)](https://paypal.me/drdominiof)

## License

AGPL-3.0 — see [LICENSE](LICENSE).

### AWS Architecture Icons

The icons in `public/icons/` are the official [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/) (Q3 2026), distributed unmodified under [CC BY-ND 2.0](https://creativecommons.org/licenses/by-nd/2.0/).
© Amazon Web Services, Inc. or its affiliates. All rights reserved.

---

*Not affiliated with or endorsed by Amazon Web Services.*
