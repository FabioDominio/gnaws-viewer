/**
 * Sigma.js graph renderer for AWS resource graphs.
 *
 * Usage:
 *   import { renderGraph } from "./sigmaRenderer";
 *   import graph from "./graph.json"; // or built from ResourceService
 *
 *   const container = document.getElementById("graph-container")!;
 *   const renderer = renderGraph(container, graph);
 *
 * Requirements:
 *   npm install sigma @sigma/node-image graphology
 *
 * The graph nodes must have:
 *   - `resourcetype`: string (maps to icon/color via resourceTypeConfig)
 *   - `label`: string
 *   - `x`, `y`: number (layout positions)
 */

import Sigma from "sigma";
import {createNodeImageProgram} from "@sigma/node-image";
import type {AbstractGraph} from "graphology-types";
import {getResourceTypeConfig} from "./resourceTypeConfig.js";

export interface SigmaRendererOptions {

    /** Base path to the icons directory (e.g., "/assets/icons/" or "./icons/") */
    "iconsBasePath": string;

    /** Enable hover/click interactions */
    "interactive"?: boolean;
}

/**
 * Prepare a Graphology graph for sigma.js rendering by adding
 * `image`, `color`, and `size` attributes based on resourcetype.
 */
export function prepareGraphForSigma (graph: AbstractGraph, iconsBasePath: string): void {

    const basePath = iconsBasePath.endsWith("/")
        ? iconsBasePath
        : `${iconsBasePath}/`;

    graph.forEachNode((node, attributes) => {

        const resourceType = (attributes.resourcetype as string | undefined) ?? "region";
        const config = getResourceTypeConfig(resourceType);

        graph.setNodeAttribute(
            node,
            "image",
            `${basePath}${config.icon}`
        );
        graph.setNodeAttribute(
            node,
            "color",
            config.color
        );
        graph.setNodeAttribute(
            node,
            "type",
            "pictogram"
        );

        // Scale node size based on degree (more connections = larger)
        const degree = graph.degree(node);
        const size = Math.max(
            4,
            Math.min(
                20,
                4 + degree * 0.5
            )
        );
        graph.setNodeAttribute(
            node,
            "size",
            size
        );

    });

    // Style edges
    graph.forEachEdge((edge) => {

        graph.setEdgeAttribute(
            edge,
            "color",
            "#cccccc"
        );
        graph.setEdgeAttribute(
            edge,
            "size",
            0.5
        );

    });

}

/**
 * Render a Graphology graph with sigma.js using AWS resource icons.
 */
export function renderGraph (container: HTMLElement, graph: AbstractGraph, options: SigmaRendererOptions): Sigma {

    // Prepare node attributes for rendering
    prepareGraphForSigma(
        graph,
        options.iconsBasePath
    );

    // Create the pictogram node renderer
    const nodePictogramProgram = createNodeImageProgram({
        "drawingMode": "color",
        "padding": 0.15
    });

    // Initialize sigma
    const sigma = new Sigma(
        graph,
        container,
        {
            "nodeProgramClasses": {
                "pictogram": nodePictogramProgram
            },
            "defaultNodeType": "pictogram",
            "labelRenderedSizeThreshold": 8,
            "labelFont": "Inter, system-ui, sans-serif",
            "labelSize": 12,
            "labelColor": {"color": "#333333"},
            "edgeReducer": (edge, data) => ({
                ...data,
                "hidden": false
            }),
            "nodeReducer": (node, data) => ({
                ...data,
                "highlighted": false
            })
        }
    );

    // Interactive features
    if (options.interactive !== false) {

        // Hover: highlight neighbors
        let hoveredNode: string | null = null;

        sigma.on(
            "enterNode",
            ({node}) => {

                hoveredNode = node;
                sigma.refresh();

            }
        );

        sigma.on(
            "leaveNode",
            () => {

                hoveredNode = null;
                sigma.refresh();

            }
        );

        // Override reducers for hover highlighting
        sigma.setSetting(
            "nodeReducer",
            (node, data) => {

                if (hoveredNode) {

                    if (node === hoveredNode || graph.hasEdge(
                        node,
                        hoveredNode
                    ) || graph.hasEdge(
                        hoveredNode,
                        node
                    )) {

                        return {...data,
                            "highlighted": true};

                    }
                    return {...data,
                        "color": "#f0f0f0",
                        "highlighted": false};

                }
                return data;

            }
        );

        sigma.setSetting(
            "edgeReducer",
            (edge, data) => {

                if (hoveredNode) {

                    const source = graph.source(edge);
                    const target = graph.target(edge);
                    if (source === hoveredNode || target === hoveredNode) {

                        return {...data,
                            "color": "#333333",
                            "size": 2};

                    }
                    return {...data,
                        "hidden": true};

                }
                return data;

            }
        );

    }

    return sigma;

}
