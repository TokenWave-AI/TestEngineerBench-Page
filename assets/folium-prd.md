# Product Requirements Document

## Purpose

Folium is a Python library for creating interactive Leaflet.js maps. This PRD covers reliable JavaScript serialization, heatmap data handling, interactive drawing exports, TopoJSON overlays, and configurable Leaflet path styling for Python developers and integrators.

## User Interface And Interaction

Users create `folium.Map` objects and add layers or plugins through the public Python API, then render or save the resulting map as HTML. JavaScript options supplied through Folium configuration are emitted into the generated map. Users can add `folium.plugins.HeatMap` for weighted geographic points, `folium.plugins.Draw` for drawing and exporting GeoJSON, `folium.TopoJson` for TopoJSON overlays, and vector layers such as `PolyLine`, `Polygon`, `Circle`, and `CircleMarker` with Leaflet path options. The generated HTML exposes the corresponding Leaflet controls, overlays, styles, and downloads in a browser.

## Functional Requirements

### JavaScript serialization of dictionary options

- User goal: Configure map and layer options with Python dictionaries, including numeric keys.
- Primary interaction or public entry point: Pass dictionaries containing string or numeric keys to Folium options rendered with the `tojavascript` template filter.
- Expected outcome: The generated JavaScript is valid and preserves every dictionary key and value, including numeric keys, so Leaflet receives the intended options.
- User-visible errors or constraints: Values must remain JSON/JavaScript-serializable according to Folium's supported option types.
- Externally visible state change, when applicable: Rendered HTML contains the complete option object used by the browser.

### Weighted HeatMap data

- User goal: Display geographic points with optional intensity weights from Python lists, pandas-compatible data, or NumPy arrays.
- Primary interaction or public entry point: Instantiate `folium.plugins.HeatMap(data)` with rows shaped as `[latitude, longitude]` or `[latitude, longitude, weight]`.
- Expected outcome: Valid integer or floating-point NumPy weights are accepted and rendered as heatmap intensities without changing their geographic locations.
- User-visible errors or constraints: Coordinates must pass Folium location validation; data containing NaN values is rejected with a clear value error. The input must provide at least latitude and longitude for each point.
- Externally visible state change, when applicable: The generated map contains a Leaflet heat layer whose points and intensities reflect the supplied data.

### Draw export controls

- User goal: Draw and edit geometries on a map and download the collected shapes as GeoJSON.
- Primary interaction or public entry point: Add `folium.plugins.Draw(export=True)` to a map, optionally configuring `filename`, control `position`, `export_position`, drawing options, editing options, and event handlers.
- Expected outcome: Each enabled Draw instance displays a usable export link with a unique DOM id. Activating it prepares a download containing the current drawn feature group as GeoJSON, using the configured filename.
- User-visible errors or constraints: `export_position` accepts only `topright`, `topleft`, `bottomright`, or `bottomleft`; unsupported values produce a value error. Export is available only when enabled.
- Externally visible state change, when applicable: Drawn layers are added to the editable feature group, and the uniquely identified export link receives a data download target when activated. Multiple Draw controls on one map operate independently.

### TopoJSON geometry overlays

- User goal: Render a selected TopoJSON object on a Folium map, regardless of whether the object is represented as a collection or a standalone geometry.
- Primary interaction or public entry point: Instantiate `folium.TopoJson(data, object_path, ...)` with a mapping, an embedded file-like source, or another documented string source, and identify the desired object path.
- Expected outcome: The selected TopoJSON object is converted to a Leaflet GeoJSON layer and displayed, with optional styling, tooltips, layer-control settings, and smoothing.
- User-visible errors or constraints: The supplied object path and TopoJSON data must identify a supported TopoJSON object; invalid data or paths are reported during normal data loading or rendering.
- Externally visible state change, when applicable: A visible map overlay is created and can participate in layer controls, styling, and tooltips.

### Leaflet path option forwarding

- User goal: Use the full set of Leaflet path configuration options when creating Folium vector overlays.
- Primary interaction or public entry point: Pass documented snake_case or lowerCamelCase path options, including additional Leaflet options, through vector-layer constructors or `path_options`.
- Expected outcome: Recognised options are normalized to Leaflet names and unrecognised but valid Leaflet path options are retained and emitted to the browser instead of being discarded.
- User-visible errors or constraints: Option values must be compatible with Leaflet and JSON/JavaScript serialization. Explicit fill and color settings follow the documented precedence of the public API.
- Externally visible state change, when applicable: The rendered vector layer reflects all supplied path behavior, appearance, interaction, and placement options.

## Non-Functional Requirements

- Compatibility: Support the package's documented Python requirement of version 3.9 or newer and remain compatible with the Leaflet.js and plugin integrations used by Folium's generated HTML.
- Data fidelity: Preserve numeric values and option keys through Python-to-JavaScript rendering without silently dropping supported input.
- Validation and stability: Reject invalid geographic coordinates and NaN heatmap data predictably, and report invalid Draw control placement values clearly.
- Interoperability: Accept the documented data forms for heatmaps and TopoJSON, including NumPy-compatible point data, mappings, and file-like inputs.
- Isolation: Multiple interactive controls or overlays placed on the same map must retain independent browser identifiers and behavior.
- Resource and delivery model: Generated maps must remain self-contained with respect to embedded user data while loading the documented Leaflet and plugin resources required for browser interaction.
