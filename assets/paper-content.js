// Manuscript excerpts, source-backed highlights, and published dataset inventory. See README.
const PAPER = {
  "abstract": "Autonomous software testing requires coding agents to translate functional requirements into executable tests and use the results to discover and validate defects. However, existing benchmarks evaluate coding agents on explicitly specified test generation tasks, commonly providing an issue description, a designated test entry point, or files to inspect, leaving the ability to determine what to test and where to investigate insufficiently evaluated. Relying on such clues bypasses the challenge of mapping requirements to implementations and proactively uncovering unknown defects. We propose <strong>TestEngineerBench</strong>, comprising 100 instances from 78 open source Python repositories across 16 application categories, with multiple recorded defects in each instance. Two independent tasks evaluate complementary capabilities: generating test suites and discovering defects through execution analysis. The evaluation combines test validity, defect detection, and coverage with localization precision and recall. Across seven frontier coding agents, results reveal that test validity and coverage decouple from defect exposure: agents achieve a 91.47% Head Pass Rate and 80.48% Change Focused Coverage alongside a 26.36% Fail-to-Pass Rate, while localization recall drops from 78.11% at the file level to 51.29% at the function level. Autonomous test generation improves file, function, and hunk localization recall by 4.99, 2.77, and 2.69 percentage points over relying solely on existing repository test suites.",
  "caption": "Conceptual comparison of representative benchmark settings and <strong>TestEngineerBench</strong>. <strong>(a)</strong> Issue-guided tasks provide a description of the faulty behavior. <strong>(b)</strong> Target-guided tasks specify investigation targets, such as files, functions, or entry interfaces. <strong>(c)</strong> TestEngineerBench provides a PRD, a pre-release repository, and a configured environment, leaving agents to determine what and where to test. Agents explore the repository, design and execute tests, and analyze the results to investigate multiple unknown defects. Two independent tasks evaluate test-suite quality and defect reporting.",
  "findings": [
    {
      "rq": 1,
      "title": "Test Validity Decouples from Defect Detection",
      "html": "<h4>Execution validity converts into defect exposure at low rates.</h4><p>Table 3 shows a numerical gap between test validity and defect exposure: mean HP reaches 91.47% across seven agents, while mean F2P is 26.36%. In an inspection of 49,317 registered tests from 500 evaluations across five systems, 67.44% pass on the repaired snapshot without failing on the defective snapshot, 24.17% satisfy F2P, and 8.39% fail on the repaired snapshot. The primary outcome is a test that executes successfully while leaving defective behavior unexposed. Across these evaluations, 5.60% contain passing repaired snapshot tests with zero F2P tests. Tests must distinguish supported behavior from deviations present in the defective implementation. Cases 1 and 3 demonstrate this pattern: broad passing suites leave explicit options or boundary contracts unchecked (see also Astra Cases 4–6).</p>\n<h4>Reaching patched code does not ensure behavioral discrimination.</h4><p>Across seven agents, EC averages 75.29% and CFG averages 80.48%, indicating broad execution of target functionality and reference fix regions. Table 4 groups each model&#x27;s instances by CFG. Even in the 80–100% coverage interval, mean F2P ranges from 24.24% to 37.82% across models. Executing most reference changed lines therefore does not ensure that submitted tests distinguish the defective and repaired snapshots. Tests can execute relevant lines without supplying defect-triggering inputs or checking the affected behavior. Cases 1 and 2 illustrate requirements-derived assertions exposing behavior left unchecked by repository tests, while Astra Case 5 provides a Task 1 example of assertions that distinguish the two snapshots.</p>\n<h4>Defect reporting loses recall at finer localization granularity.</h4><p>Task 2 measures agreement with reference defect locations across file, function, and hunk granularities. Mean Localization Recall (LR) drops by 26.81 percentage points from the file level (78.11%) to the function level (51.29%), and measures 51.88% at the hunk level. Localization Precision (LP) drops by 21.56 percentage points from the file level (75.33%) to the function level (53.77%) and rebounds to 68.78% at the hunk level under the τ = 3 line tolerance. Agents identify relevant source files; once isolating a defective function, they pinpoint the edit hunk with minimal recall loss. Between these stages, agents face difficulty isolating root cause functions among surrounding callers and helpers within identified files.</p>"
    },
    {
      "rq": 2,
      "title": "Agents Leave Substantial Gaps in Distinct Bug Localization",
      "html": "<h4>Agents localize less than half of reference bugs.</h4><p>Across evaluated frontier models, the percentage of reference bugs successfully localized ranges from 33.14% to 49.04% (Table 5). GPT-6-Astra attains 85.85% recall at the file level (Table 3), while localizing 49.04% of distinct reference bugs across scored instances. Identifying an affected file through test execution does not isolate the underlying defective functions and code modifications. Authoring tests that trigger visible runtime exceptions can expose repository files without covering the specific boundary inputs required to localize the full defect.</p>\n<h4>Defects spanning multiple files show lower localization.</h4><p>Localization rates depend on bug scope. Across models, agents localize 40.63%–59.05% of bugs located within a single file, while localization rates decrease to 2.00%–7.84% for bugs spanning multiple files (Table 5). Multi file defects involve contract mismatches and state transformations across component boundaries. Agents primarily write unit tests for isolated functions, producing test suites that omit execution paths traversing multiple modules. When a test fails, the agent investigates the immediate exception frame, leaving callers and dependent components uninspected.</p>\n<h4>Distribution of localized defects across instances.</h4><p>In instance level evaluations, agents localize every evaluable bug in 4.00% to 11.00% of instances. In 70.71% to 88.89% of instances, submissions contain a combination of localized and unlocalized defects. After localizing at least one bug in an instance, GPT-6-Astra leaves remaining coexisting bugs unlocalized in 83.00% of instances. Exploration frequently halts after confirming an initial failure, leaving coexisting defects in the repository undetected.</p>"
    },
    {
      "rq": 3,
      "title": "Discovery Capabilities Skew Across Defect Types",
      "html": "<h4>Incomplete behaviors create shared blind spots across models.</h4><p>Figure 3 shows low recall across several recurring defect categories. In the <em>Incomplete data processing</em> cohort (55 instances), function and hunk LR average 50.88% and 50.23% across the five models. The <em>Missing input validation</em> cohort (25 instances) yields hunk LR between 48.64% and 53.87%. Output cohorts also show low recall, with mean hunk LR of 51.83% for <em>Incorrect output</em> (19 instances) and 40.56% for <em>Incomplete output</em> (five instances). Weaknesses recur across data transformations, validation routines, and output serialization, indicating that uncompleted behaviors challenge testing across all evaluated agents.</p>\n<h4>Localization accuracy within identified files varies across defect types.</h4><p>Conditioning on complete file recall isolates localization failures within known files. Across the five models, 46 model instance records in the <em>Missing input validation</em> cohort identify every reference file; 95.65% omit reference functions and 93.48% omit reference hunks, with mean function and hunk LR at 66.51% and 60.71%. In the <em>Incorrect configuration</em> cohort, 89.58% and 91.67% of the 48 records with complete file recall omit functions and hunks. In the <em>Incorrect regular expression</em> cohort, omission rates drop to 44.00% across 25 complete file records, where mean function LR reaches 90.57%. Discovering all relevant files leaves differing residual gaps across defect types, with input validation and configuration requiring more specific inspection within discovered files.</p>\n<h4>Cohort recall metrics encompass omissions and uncredited predictions.</h4><p>The <em>Performance / resource issue</em> and <em>Incomplete data processing</em> cohorts yield similar mean hunk LR (53.67% and 50.23%), while their reports combine omissions and uncredited predictions differently (Table 6). In the performance cohort, 35.38% of reports attain complete hunk precision while omitting reference hunks, recovering 55.10% of reference hunks on average. In the incomplete data processing cohort, 81.45% of reports simultaneously omit reference hunks and include uncredited predictions, compared with 56.92% in the performance cohort. Recovering these defects requires wider reference coverage alongside selective candidate reporting.</p>"
    },
    {
      "rq": 4,
      "title": "Behavioral Failure Modes in Test Construction and Localization",
      "html": "<h4>Existing implementation behaviors replace specification based oracles.</h4><p>Assertion mismatches account for 31.6% of reviewed Task 1 failure mechanisms, and misconfigured mocks account for 37.5%; invalid input or setup accounts for 7.4%, API or parameter errors for 22.8%, syntax or collection failures for 1.5%, and runtime exceptions for 3.7%. Inspection of execution trajectories indicates that agents infer test oracles from repository outputs, default fixtures, and existing return patterns, leaving requirements from the PRD unencoded in assertions. The resulting test suites execute cleanly while validating existing defective behaviors, failing to produce assertions that distinguish defective implementations from repaired ones.</p>\n<h4>Causal tracing halts at initial failure locations.</h4><p>Among reviewed localization failure mechanisms, premature search termination accounts for 36.0%, evidence underuse for 30.9%, and dependency truncation for 25.0%. These failure modes reflect a shared pattern: upon observing a test failure or exception traceback, an agent anchors on the first visible error frame or entry point and halts exploration. Agents omit inspection of upstream caller hierarchies, cross file data flows, and execution logs needed to isolate the root cause. Submitted defect reports record immediate symptom locations while leaving the underlying defect path unexamined.</p>\n<h4>Defensive reporting trades completeness for precision.</h4><p>Reporting at an incorrect granularity accounts for 4.4% of reviewed localization failure mechanisms, while conservative omissions account for 19.9% and identifying symptoms as causes accounts for 25.0%. Faced with causal ambiguity, agents employ two reporting strategies: they report coarse scopes by naming test drivers, entry interfaces, or configuration files in place of production code, or they omit plausible candidate locations to prevent uncredited predictions from reducing precision scores. This pruning produces sparse reports that omit confirmed defect locations and reduce the completeness of findings.</p>"
    },
    {
      "rq": 5,
      "title": "Autonomous Testing Improves Defect Recall Beyond Existing Suites",
      "html": "<h4>Agent authored testing increases average recall across a subset of instances.</h4><p>Table 7 reports GPT-5.6-Sol results across 100 instances under two execution conditions: running repository provided tests and authoring tests from the PRD. Authoring tests increases instance averaged recall by 4.99 percentage points for files, 2.77 percentage points for functions, and 2.69 percentage points for hunks, while mean precision decreases by 2.74, 1.61, and 3.25 percentage points (differences computed before rounding). These recall gains concentrate in specific instances: function recall improves in 31% of instances and hunk recall improves in 35%, while the median paired change across all three granularities is zero. Authoring tests improves defect coverage in instances where additional tests support further discovery.</p>\n<h4>Recall gains expand partial discoveries through broader file identification.</h4><p>Among instances with improved function and hunk recall, 87.10% and 91.43% obtain nonzero recall under repository provided tests, indicating that autonomous testing expands partial discoveries. Higher file recall accompanies 70.97% of function improvements and 68.57% of hunk improvements. Authoring tests broadens the set of affected files identified while recovering additional functions and hunks. Cases 1–3 in Appendix app:trajectory_case_studies illustrate how the two testing settings produce different evidence for defect investigation.</p>\n<h4>Report growth exceeds matched locations and reduces precision.</h4><p>Agent authored testing increases reported function locations from 868 to 1{,}011 (+16.47%), while recovered reference functions increase from 521 to 572 (+9.79%). Reported hunks increase from 527 to 608 (+15.37%), while recovered reference hunks increase from 572 to 626 (+9.44%). Total reported locations increase at a higher rate than confirmed defect sites, which lowers mean function and hunk precision by 1.60 and 3.25 percentage points (Table 7). Among instances with improved recall, 51.61% at the function level and 40.00% at the hunk level show lower precision. Agent authored tests support broader discovery, while selecting candidate locations to report remains a constraint on precision.</p>"
    }
  ],
  "prd": "<h2>Product Requirements Document</h2>\n<h3>Purpose</h3>\n<p>Folium is a Python library for creating interactive Leaflet.js maps. This PRD covers reliable JavaScript serialization, heatmap data handling, interactive drawing exports, TopoJSON overlays, and configurable Leaflet path styling for Python developers and integrators.</p>\n<h3>User Interface And Interaction</h3>\n<p>Users create <code>folium.Map</code> objects and add layers or plugins through the public Python API, then render or save the resulting map as HTML. JavaScript options supplied through Folium configuration are emitted into the generated map. Users can add <code>folium.plugins.HeatMap</code> for weighted geographic points, <code>folium.plugins.Draw</code> for drawing and exporting GeoJSON, <code>folium.TopoJson</code> for TopoJSON overlays, and vector layers such as <code>PolyLine</code>, <code>Polygon</code>, <code>Circle</code>, and <code>CircleMarker</code> with Leaflet path options. The generated HTML exposes the corresponding Leaflet controls, overlays, styles, and downloads in a browser.</p>\n<h3>Functional Requirements</h3>\n<h4>JavaScript serialization of dictionary options</h4>\n<ul>\n<li>User goal: Configure map and layer options with Python dictionaries, including numeric keys.</li>\n<li>Primary interaction or public entry point: Pass dictionaries containing string or numeric keys to Folium options rendered with the <code>tojavascript</code> template filter.</li>\n<li>Expected outcome: The generated JavaScript is valid and preserves every dictionary key and value, including numeric keys, so Leaflet receives the intended options.</li>\n<li>User-visible errors or constraints: Values must remain JSON/JavaScript-serializable according to Folium&#x27;s supported option types.</li>\n<li>Externally visible state change, when applicable: Rendered HTML contains the complete option object used by the browser.</li>\n</ul>\n<h4>Weighted HeatMap data</h4>\n<ul>\n<li>User goal: Display geographic points with optional intensity weights from Python lists, pandas-compatible data, or NumPy arrays.</li>\n<li>Primary interaction or public entry point: Instantiate <code>folium.plugins.HeatMap(data)</code> with rows shaped as <code>[latitude, longitude]</code> or <code>[latitude, longitude, weight]</code>.</li>\n<li>Expected outcome: Valid integer or floating-point NumPy weights are accepted and rendered as heatmap intensities without changing their geographic locations.</li>\n<li>User-visible errors or constraints: Coordinates must pass Folium location validation; data containing NaN values is rejected with a clear value error. The input must provide at least latitude and longitude for each point.</li>\n<li>Externally visible state change, when applicable: The generated map contains a Leaflet heat layer whose points and intensities reflect the supplied data.</li>\n</ul>\n<h4>Draw export controls</h4>\n<ul>\n<li>User goal: Draw and edit geometries on a map and download the collected shapes as GeoJSON.</li>\n<li>Primary interaction or public entry point: Add <code>folium.plugins.Draw(export=True)</code> to a map, optionally configuring <code>filename</code>, control <code>position</code>, <code>export_position</code>, drawing options, editing options, and event handlers.</li>\n<li>Expected outcome: Each enabled Draw instance displays a usable export link with a unique DOM id. Activating it prepares a download containing the current drawn feature group as GeoJSON, using the configured filename.</li>\n<li>User-visible errors or constraints: <code>export_position</code> accepts only <code>topright</code>, <code>topleft</code>, <code>bottomright</code>, or <code>bottomleft</code>; unsupported values produce a value error. Export is available only when enabled.</li>\n<li>Externally visible state change, when applicable: Drawn layers are added to the editable feature group, and the uniquely identified export link receives a data download target when activated. Multiple Draw controls on one map operate independently.</li>\n</ul>\n<h4>TopoJSON geometry overlays</h4>\n<ul>\n<li>User goal: Render a selected TopoJSON object on a Folium map, regardless of whether the object is represented as a collection or a standalone geometry.</li>\n<li>Primary interaction or public entry point: Instantiate <code>folium.TopoJson(data, object_path, ...)</code> with a mapping, an embedded file-like source, or another documented string source, and identify the desired object path.</li>\n<li>Expected outcome: The selected TopoJSON object is converted to a Leaflet GeoJSON layer and displayed, with optional styling, tooltips, layer-control settings, and smoothing.</li>\n<li>User-visible errors or constraints: The supplied object path and TopoJSON data must identify a supported TopoJSON object; invalid data or paths are reported during normal data loading or rendering.</li>\n<li>Externally visible state change, when applicable: A visible map overlay is created and can participate in layer controls, styling, and tooltips.</li>\n</ul>\n<h4>Leaflet path option forwarding</h4>\n<ul>\n<li>User goal: Use the full set of Leaflet path configuration options when creating Folium vector overlays.</li>\n<li>Primary interaction or public entry point: Pass documented snake_case or lowerCamelCase path options, including additional Leaflet options, through vector-layer constructors or <code>path_options</code>.</li>\n<li>Expected outcome: Recognised options are normalized to Leaflet names and unrecognised but valid Leaflet path options are retained and emitted to the browser instead of being discarded.</li>\n<li>User-visible errors or constraints: Option values must be compatible with Leaflet and JSON/JavaScript serialization. Explicit fill and color settings follow the documented precedence of the public API.</li>\n<li>Externally visible state change, when applicable: The rendered vector layer reflects all supplied path behavior, appearance, interaction, and placement options.</li>\n</ul>\n<h3>Non-Functional Requirements</h3>\n<ul>\n<li>Compatibility: Support the package&#x27;s documented Python requirement of version 3.9 or newer and remain compatible with the Leaflet.js and plugin integrations used by Folium&#x27;s generated HTML.</li>\n<li>Data fidelity: Preserve numeric values and option keys through Python-to-JavaScript rendering without silently dropping supported input.</li>\n<li>Validation and stability: Reject invalid geographic coordinates and NaN heatmap data predictably, and report invalid Draw control placement values clearly.</li>\n<li>Interoperability: Accept the documented data forms for heatmaps and TopoJSON, including NumPy-compatible point data, mappings, and file-like inputs.</li>\n<li>Isolation: Multiple interactive controls or overlays placed on the same map must retain independent browser identifiers and behavior.</li>\n<li>Resource and delivery model: Generated maps must remain self-contained with respect to embedded user data while loading the documented Leaflet and plugin resources required for browser interaction.</li>\n</ul>",
  "prdText": "# Product Requirements Document\n\n## Purpose\n\nFolium is a Python library for creating interactive Leaflet.js maps. This PRD covers reliable JavaScript serialization, heatmap data handling, interactive drawing exports, TopoJSON overlays, and configurable Leaflet path styling for Python developers and integrators.\n\n## User Interface And Interaction\n\nUsers create `folium.Map` objects and add layers or plugins through the public Python API, then render or save the resulting map as HTML. JavaScript options supplied through Folium configuration are emitted into the generated map. Users can add `folium.plugins.HeatMap` for weighted geographic points, `folium.plugins.Draw` for drawing and exporting GeoJSON, `folium.TopoJson` for TopoJSON overlays, and vector layers such as `PolyLine`, `Polygon`, `Circle`, and `CircleMarker` with Leaflet path options. The generated HTML exposes the corresponding Leaflet controls, overlays, styles, and downloads in a browser.\n\n## Functional Requirements\n\n### JavaScript serialization of dictionary options\n\n- User goal: Configure map and layer options with Python dictionaries, including numeric keys.\n- Primary interaction or public entry point: Pass dictionaries containing string or numeric keys to Folium options rendered with the `tojavascript` template filter.\n- Expected outcome: The generated JavaScript is valid and preserves every dictionary key and value, including numeric keys, so Leaflet receives the intended options.\n- User-visible errors or constraints: Values must remain JSON/JavaScript-serializable according to Folium's supported option types.\n- Externally visible state change, when applicable: Rendered HTML contains the complete option object used by the browser.\n\n### Weighted HeatMap data\n\n- User goal: Display geographic points with optional intensity weights from Python lists, pandas-compatible data, or NumPy arrays.\n- Primary interaction or public entry point: Instantiate `folium.plugins.HeatMap(data)` with rows shaped as `[latitude, longitude]` or `[latitude, longitude, weight]`.\n- Expected outcome: Valid integer or floating-point NumPy weights are accepted and rendered as heatmap intensities without changing their geographic locations.\n- User-visible errors or constraints: Coordinates must pass Folium location validation; data containing NaN values is rejected with a clear value error. The input must provide at least latitude and longitude for each point.\n- Externally visible state change, when applicable: The generated map contains a Leaflet heat layer whose points and intensities reflect the supplied data.\n\n### Draw export controls\n\n- User goal: Draw and edit geometries on a map and download the collected shapes as GeoJSON.\n- Primary interaction or public entry point: Add `folium.plugins.Draw(export=True)` to a map, optionally configuring `filename`, control `position`, `export_position`, drawing options, editing options, and event handlers.\n- Expected outcome: Each enabled Draw instance displays a usable export link with a unique DOM id. Activating it prepares a download containing the current drawn feature group as GeoJSON, using the configured filename.\n- User-visible errors or constraints: `export_position` accepts only `topright`, `topleft`, `bottomright`, or `bottomleft`; unsupported values produce a value error. Export is available only when enabled.\n- Externally visible state change, when applicable: Drawn layers are added to the editable feature group, and the uniquely identified export link receives a data download target when activated. Multiple Draw controls on one map operate independently.\n\n### TopoJSON geometry overlays\n\n- User goal: Render a selected TopoJSON object on a Folium map, regardless of whether the object is represented as a collection or a standalone geometry.\n- Primary interaction or public entry point: Instantiate `folium.TopoJson(data, object_path, ...)` with a mapping, an embedded file-like source, or another documented string source, and identify the desired object path.\n- Expected outcome: The selected TopoJSON object is converted to a Leaflet GeoJSON layer and displayed, with optional styling, tooltips, layer-control settings, and smoothing.\n- User-visible errors or constraints: The supplied object path and TopoJSON data must identify a supported TopoJSON object; invalid data or paths are reported during normal data loading or rendering.\n- Externally visible state change, when applicable: A visible map overlay is created and can participate in layer controls, styling, and tooltips.\n\n### Leaflet path option forwarding\n\n- User goal: Use the full set of Leaflet path configuration options when creating Folium vector overlays.\n- Primary interaction or public entry point: Pass documented snake_case or lowerCamelCase path options, including additional Leaflet options, through vector-layer constructors or `path_options`.\n- Expected outcome: Recognised options are normalized to Leaflet names and unrecognised but valid Leaflet path options are retained and emitted to the browser instead of being discarded.\n- User-visible errors or constraints: Option values must be compatible with Leaflet and JSON/JavaScript serialization. Explicit fill and color settings follow the documented precedence of the public API.\n- Externally visible state change, when applicable: The rendered vector layer reflects all supplied path behavior, appearance, interaction, and placement options.\n\n## Non-Functional Requirements\n\n- Compatibility: Support the package's documented Python requirement of version 3.9 or newer and remain compatible with the Leaflet.js and plugin integrations used by Folium's generated HTML.\n- Data fidelity: Preserve numeric values and option keys through Python-to-JavaScript rendering without silently dropping supported input.\n- Validation and stability: Reject invalid geographic coordinates and NaN heatmap data predictably, and report invalid Draw control placement values clearly.\n- Interoperability: Accept the documented data forms for heatmaps and TopoJSON, including NumPy-compatible point data, mappings, and file-like inputs.\n- Isolation: Multiple interactive controls or overlays placed on the same map must retain independent browser identifiers and behavior.\n- Resource and delivery model: Generated maps must remain self-contained with respect to embedded user data while loading the documented Leaflet and plugin resources required for browser interaction.",
  "task1": "<p>The submission contains 159 tests (85 unit, 60 integration, 14 acceptance). Evaluator results: HP 83.65%, F2P 20.75%, EC 96.30%, and CFG 100.00%. There are 33 F2P tests, 26 tests that fail on the repaired snapshot, and 100 remaining tests that do not expose a reference defect (including two skipped DataFrame cases). The excerpts below retain the submitted function bodies; parameter lists, imports, helpers, and other tests are omitted.</p>\n<h4>Generated tests that expose reference defects</h4>\n<p><strong>Numeric dictionary keys</strong> (<code>test_serialization_unit.py</code>; selected parameter: <code>key=2</code>).</p>\n<pre><code>def test_numeric_dictionary_keys_are_preserved(key):\n    assert run_js(tojavascript({key: &#x27;color&#x27;, &#x27;other&#x27;: 4})) == {str(key): &#x27;color&#x27;, &#x27;other&#x27;: 4}</code></pre>\n<p class=\"test-outcome f2p\"><strong>Defective:</strong> fail, <code>AttributeError: &#x27;int&#x27; object has no attribute &#x27;split&#x27;</code>. <strong>Repaired:</strong> pass. <strong>F2P:</strong> yes.</p>\n<p><strong>Additional Leaflet options</strong> (<code>test_path_unit.py</code>; selected parameters: <code>key=&#x27;pane&#x27;</code>, <code>value=&#x27;customPane&#x27;</code>, <code>normalized=&#x27;pane&#x27;</code>).</p>\n<pre><code>def test_additional_leaflet_path_options_survive(key, value, normalized):\n    assert path_options(**{key: value})[normalized] == value</code></pre>\n<p class=\"test-outcome f2p\"><strong>Defective:</strong> fail, <code>KeyError: &#x27;pane&#x27;</code>. <strong>Repaired:</strong> pass. <strong>F2P:</strong> yes.</p>\n<h4>Generated tests that also fail on the repaired snapshot</h4>\n<p><strong>Quoted dictionary keys</strong> (<code>test_serialization_unit.py</code>; selected parameter: <code>key=&#x27;a&quot;b&#x27;</code>).</p>\n<pre><code>def test_string_keys_produce_valid_javascript(key):\n    assert run_js(tojavascript({key: 3})) == {key: 3}</code></pre>\n<p class=\"test-outcome\"><strong>Defective / repaired:</strong> fail / fail, <code>SyntaxError: Unexpected identifier &#x27;b&#x27;</code>. <strong>F2P:</strong> no.</p>\n<p><strong>Draw export placement</strong> (<code>test_draw_unit.py</code>; selected parameter: <code>position=&#x27;topright&#x27;</code>).</p>\n<pre><code>def test_all_documented_export_positions_are_accepted(position):\n    draw = Draw(export=True, export_position=position)\n    assert draw.export_position == position</code></pre>\n<p class=\"test-outcome\"><strong>Defective / repaired:</strong> fail / fail, <code>TypeError: Draw.__init__() got an unexpected keyword argument &#x27;export_position&#x27;</code>. <strong>F2P:</strong> no.</p>\n<h4>Generated tests that pass on both snapshots</h4>\n<p><strong>Ordinary JSON values</strong> (<code>test_serialization_unit.py</code>; selected parameter: <code>value=0</code>).</p>\n<pre><code>def test_json_values_round_trip(value):\n    assert run_js(tojavascript(value)) == value</code></pre>\n<p class=\"test-outcome\"><strong>Defective / repaired:</strong> pass / pass. <strong>F2P:</strong> no.</p>\n<p><strong>Boolean options</strong> (<code>test_path_unit.py</code>; selected parameter: <code>gradient=False</code>).</p>\n<pre><code>def test_gradient_boolean_preserved(gradient):\n    assert path_options(gradient=gradient)[&#x27;gradient&#x27;] is gradient</code></pre>\n<p class=\"test-outcome\"><strong>Defective / repaired:</strong> pass / pass. <strong>F2P:</strong> no.</p>",
  "task2Summary": "<p>The independently authored Task 2 suite has 64 failed tests, 29 passed tests, and seven pandas-only skips. The submitted report contains 15 agent-reported findings. Evaluator results: five of five reference bugs localized; file/function/hunk LR = 100.00%/100.00%/100.00%, and LP = 83.33%/40.00%/62.50%. The excerpt retains the report&#x27;s wording, with omitted fields, findings, and explanations marked by <code>...</code>.</p>",
  "report": "{\n  \"title\": \"15 confirmed Folium serialization, heatmap, Draw, TopoJSON, and path-option defects\",\n  \"status\": \"confirmed\",\n  \"severity\": \"high\",\n  \"test_results\": [\n    {\n      \"scope\": \"Final complete authored Pytest suite: 100 collected cases across all five PRD areas\",\n      \"cwd\": \"/workspace/repo\",\n      \"command\": \"/workspace/submission/repro.sh > /workspace/submission/evidence/run-console.log 2>&1\",\n      \"exit_code\": 1,\n      \"outcome\": \"64 failed, 29 passed, 7 skipped; no collection/runtime infrastructure errors in the final suite. Failures represent 15 source-grounded findings, not 64 separate bugs.\",\n      \"observed\": \"Draw: 10 failed/3 passed. HeatMap: 13 failed/14 passed/7 optional pandas skips. Serialization: 10 failed/4 passed. TopoJSON: 22 failed/5 passed. Vectors: 9 failed/3 passed. The script executes: python -m pytest /workspace/submission -vv --tb=short -rA --junitxml=/workspace/submission/evidence/results.xml .\",\n      \"evidence\": \"evidence/pytest.log\"\n    },\n    ...\n  ],\n  \"reproduction\": {\n    \"script\": \"repro.sh\",\n    \"command\": \"/workspace/submission/repro.sh\",\n    \"uses_authored_tests\": true,\n    ...\n    \"expected\": \"All supported serialization, heatmap, drawing, TopoJSON, and vector-option cases pass; deliberately invalid inputs produce the required errors. Independent Draw links preserve feature-group and filename identity.\",\n    \"actual\": \"64 assertion/exception failures confirm B01-B15. Normal string options, supported JsCode/Element references, ordinary heatmaps and location/NaN validation, single Draw export/event configuration, collection TopoJSON styling/tooltips, and documented vector normalization/fill precedence pass. Seven DataFrame cases are skipped solely for missing pandas.\",\n    \"evidence\": \"evidence/pytest.log\",\n    ...\n  },\n  \"locations\": [\n    {\"path\": \"folium/template.py\",\n     \"functions\": [{\"name\":\"tojavascript\"}],\n     \"lines\": [17,18],\n     \"finding\": \"B01 [high]: Numeric dictionary keys crash JavaScript option serialization. ...\"},\n    {\"path\": \"folium/plugins/heat_map.py\",\n     \"functions\": [{\"name\":\"HeatMap.__init__\"},{\"name\":\"<module>\"}],\n     \"lines\": [51,80,81,82],\n     \"finding\": \"B03 [high]: NumPy heatmap intensities are not made JSON serializable. ...\"},\n    {\"path\": \"folium/plugins/draw.py\",\n     \"functions\": [{\"name\":\"<module>\"}],\n     \"lines\": [61,77,126,127,130,133,134],\n     \"finding\": \"B05 [high]: Multiple Draw exports share one DOM id and overwrite each other. ...\"},\n    {\"path\": \"folium/features.py\",\n     \"functions\": [{\"name\":\"TopoJson.style_data\"},{\"name\":\"TopoJson.render\"}],\n     \"lines\": [1056,1057,1059,1066],\n     \"finding\": \"B07 [high]: TopoJson rendering unconditionally assumes a GeometryCollection. ...\"},\n    {\"path\": \"folium/features.py\",\n     \"functions\": [{\"name\":\"GeoJsonDetail.render\"}],\n     \"lines\": [1202,1203,1204,1205,1206,1207],\n     \"finding\": \"B13 [medium]: TopoJSON tooltips independently assume a nonempty geometry collection. ...\"},\n    {\"path\": \"folium/vector_layers.py\",\n     \"functions\": [{\"name\":\"path_options\"}],\n     \"lines\": [81,110,123,125,126],\n     \"finding\": \"B14 [medium]: Valid additional Leaflet path options are silently discarded. ...\"},\n    ...\n  ],\n  \"root_cause\": {\n    \"summary\": \"The confirmed failures arise from unchecked input-shape/type assumptions, incomplete option forwarding, and non-isolated generated identifiers. The 15 findings are separated below by their causal source logic; repeated parameterized failures are counted only once per finding.\",\n    ...\n  },\n  \"impact\": \"Valid maps fail during Python rendering for numeric option keys, common NumPy heatmap weights, and supported TopoJSON forms. Escaping defects can corrupt property names or break generated scripts. Multiple Draw exports can download the wrong feature group and filename, while one link is unusable. Export placement cannot be configured. Additional vector options silently lose interaction, placement, and attribution settings; show=False overlays remain initially visible; TopoJSON bounds can fail or encompass unrelated data. Severity is high overall for rendering and export/data-fidelity failures; individual severities are recorded in the finding entries.\",\n  \"constraints_and_disclosures\": [\n    \"Pandas, declared in requirements-dev.txt, was unavailable. Both installation attempts failed with package-index TLS/network errors. The initial collection error is preserved, and seven DataFrame-only tests skip explicitly. No pandas failure is claimed; NumPy/list reproductions independently confirm B03.\",\n    \"Draw handlers and TopoJSON visibility were evaluated in Node.js against documented DOM/Leaflet interfaces implemented by deterministic test doubles. These establish generated-code behavior and duplicate-id effects, but are not full-browser visual, real-download, or CDN integration tests.\",\n    ...\n  ]\n}",
  "cases": [
    {
      "id": "casegap",
      "number": 1,
      "title": "Passing Tests Leave an Option Contract Unchecked (GPT-5.6-Sol on Folium)",
      "meta": "<p><strong>Task Metadata:</strong> <code>python-visualization_folium/episode-0004</code> (Python; archived evaluation).</p>\n<p><strong>Agent &amp; Harness:</strong> GPT-5.6-Sol via Codex.</p>\n<p><strong>Test Suite:</strong> Repository-provided tests.</p>\n<p><strong>Execution Evidence:</strong> PRD-focused subset: 30 passed, zero failed.</p>\n<p><strong>Localization Recall (File / Function / Hunk):</strong> 20.00% / 0.00% / 0.00%.</p>\n<p><strong>Outcome:</strong> The report omits the recorded option-forwarding defect.</p>",
      "html": "<p><strong>Verbatim Test Command and Output (Step 25).</strong> The agent runs the following command in <code>/workspace/repo</code>; the output is saved in <code>evidence/prd_suite.raw.txt</code> with exit code zero.</p>\n<pre><code>python -m pytest -q tests/plugins/test_heat_map.py tests/test_features.py tests/test_vector_layers.py\n\n..............................                                           [100\n30 passed in 1.15s</code></pre>\n<p><strong>Verbatim Agent Narration (Step 28, excerpt).</strong></p>\n<blockquote>“Focused reproduction matches both failures exactly, and the PRD-targeted test set passes 30/30.”</blockquote>\n<p><strong>Failure Analysis:</strong> The existing vector-layer tests check default configurations and conversion of <code>fill_color</code> to <code>fillColor</code>, but contain no assertion that extra options such as <code>pane</code> are retained. Thus, passing tests of the relevant components leave this explicit requirement unchecked. The agent reports failures concerning stale map CSS and non-string icon colors, while the shared option-forwarding defect remains absent from its report.</p>"
    },
    {
      "id": "casediscovery",
      "number": 2,
      "title": "Requirements-Derived Assertions Expose a Shared Defect (GPT-5.6-Sol on Folium)",
      "meta": "<p><strong>Task Metadata:</strong> <code>python-visualization_folium/episode-0004</code> (Python; archived evaluation).</p>\n<p><strong>Agent &amp; Harness:</strong> GPT-5.6-Sol via Codex.</p>\n<p><strong>Test Suite:</strong> Agent-authored tests.</p>\n<p><strong>Execution Evidence:</strong> Five extra-option cases fail; all five fail again on reproduction.</p>\n<p><strong>Localization Recall (File / Function / Hunk):</strong> 80.00% / 71.43% / 71.43%.</p>\n<p><strong>Outcome:</strong> The report localizes the shared defect to <code>path_options</code>.</p>",
      "html": "<p><strong>Verbatim Submitted Test (written at Step 13, excerpt).</strong> The agent hypothesizes at Step 8 that <code>path_options</code> drops unconsumed keywords. It then parameterizes the assertion below over <code>PolyLine</code>, <code>Polygon</code>, <code>Rectangle</code>, <code>Circle</code>, and <code>CircleMarker</code>. The excerpt preserves lines 210–224 of <code>test_prd_behaviors.py</code>; the parameterization is omitted.</p>\n<pre><code>def test_vector_layers_preserve_additional_leaflet_path_options(factory):\n    layer = factory()\n\n    assert layer.options[&quot;pane&quot;] == &quot;labels&quot;\n    assert layer.options[&quot;renderer&quot;] == &quot;canvas-renderer&quot;\n    assert layer.options[&quot;interactive&quot;] is False\n    assert layer.options[&quot;customOption&quot;] == 7\n\n\ndef _extension_options():\n    return {\n        &quot;pane&quot;: &quot;labels&quot;,\n        &quot;renderer&quot;: &quot;canvas-renderer&quot;,\n        &quot;interactive&quot;: False,\n        &quot;custom_option&quot;: 7,\n    }</code></pre>\n<p><strong>Verbatim Test Output (Step 16, PolyLine case).</strong> The 27-case suite has six passes and 21 failures, with zero JUnit errors. All five extra-option cases fail at the same assertion; <code>full-run.txt</code> records:</p>\n<pre><code>&gt;       assert layer.options[&quot;pane&quot;] == &quot;labels&quot;\n               ^^^^^^^^^^^^^^^^^^^^^\nE       KeyError: &#x27;pane&#x27;\n\n../submission/test_prd_behaviors.py:212: KeyError</code></pre>\n<p><strong>Success Analysis:</strong> The new assertion directly checks the PRD&#x27;s extra-option contract. The agent traces the failures to <code>folium/vector_layers.py</code>, function <code>path_options</code>, including lines 123, 125, and 126. This helper consumes named options and merges <code>extra_options</code>, but discards the remaining <code>kwargs</code>; all five constructors depend on it. The reference fix for <code>python-visualization_folium-pr-2272</code> adds <code>default.update(kwargs)</code> before the return, agreeing with this diagnosis. The five failures therefore exercise one shared recorded defect.</p>"
    },
    {
      "id": "caseboundary",
      "number": 3,
      "title": "Thousands of Passing Tests Miss Boundary Failures (GPT-5.6-Sol on Textual)",
      "meta": "<p><strong>Task Metadata:</strong> <code>textual/episode-0001</code> (Python).</p>\n<p><strong>Agent &amp; Harness:</strong> GPT-5.6-Sol via Codex, paired testing conditions.</p>\n<p><strong>Execution Evidence:</strong> Existing suite: 3,448 passed; authored suite: 19 passed, three failed.</p>\n<p><strong>Localization Recall (File / Function / Hunk):</strong> Repository-provided: 0.00% / 0.00% / 0.00%; agent-authored: 18.18% / 9.52% / 2.78%.</p>\n<p><strong>Outcome:</strong> Authored boundary checks yield failures and nonzero reference agreement.</p>",
      "html": "<p><strong>Verbatim Existing-Suite Command and Output.</strong> The initial run has 437 failures under <code>NO_COLOR=1</code> and <code>TERM=dumb</code>. The agent adjusts only these terminal-color variables and reruns the full suite. The command and final output in <code>evidence/full_pytest_color_enabled_output.txt</code> are:</p>\n<pre><code>env -u NO_COLOR TERM=xterm-256color python -m pytest -q\n\n445 snapshots passed.\n3448 passed, 3 skipped, 4 xfailed, 1 xpassed in 292.80s (0:04:52)</code></pre>\n<p><strong>Verbatim Authored Test (submitted source, lines 189–195).</strong> The same PRD requires Rich-compatible rendering of plain and styled text. The new suite includes this boundary check for an unstyled renderable at zero opacity:</p>\n<pre><code>def test_zero_text_opacity_handles_unstyled_rich_segments() -&gt; None:\n    console = Console(width=20, color_system=&quot;truecolor&quot;)\n    renderable = TextOpacity(Text(&quot;plain&quot;, end=&quot;&quot;), opacity=0)\n\n    rendered = list(console.render(renderable))\n\n    assert &quot;&quot;.join(segment.text for segment in rendered) == &quot; &quot; * len(&quot;plain&quot;)</code></pre>\n<p><strong>Verbatim Failure Output (<code>pytest-full.txt</code>, excerpt).</strong></p>\n<pre><code>&gt;               invisible_style = _from_color(bgcolor=style.bgcolor)\n                                                      ^^^^^^^^^^^^^\nE               AttributeError: &#x27;NoneType&#x27; object has no attribute &#x27;bgcolor&#x27;\n\nsrc/textual/renderables/text_opacity.py:80: AttributeError\n\n3 failed, 19 passed in 1.07s</code></pre>\n<p><strong>Analysis:</strong> The zero-opacity branch assumes every Rich segment has a style, although valid unstyled text produces <code>style=None</code>. The other two failures concern an out-of-range CSI-u Unicode value and an rxvt control-down sequence decoded as control-up. Focused reproductions repeat the rendering failure and both parser failures; a separate run has 16 passing controls. The agent reports the parser table, parser function, and rendering branch. The pair shows that a large passing suite can leave specific requirements-derived boundary checks unresolved, while the low hunk recall also shows that these failures do not yield comprehensive reference localization.</p>"
    },
    {
      "id": "caseastrweak",
      "number": 4,
      "title": "Broad Test Registration Without Defect Exposure (GPT-6-Astra on Apache Superset)",
      "meta": "<p><strong>Task Metadata:</strong> <code>apache_superset/episode-0003</code> (Python).</p>\n<p><strong>Agent &amp; Harness:</strong> GPT-6-Astra via Codex.</p>\n<p><strong>Operational Metrics:</strong> HP 100.00% / F2P 0.00% / EC 56.82% / CFG 69.23% / Num 99.</p>\n<p><strong>Outcome:</strong> The registered suite is compatible with the repaired snapshot but exposes none of the recorded defects.</p>",
      "html": "<p><strong>Verbatim Agent Narration (Step 40).</strong></p>\n<blockquote>“The suite now runs end to end: 99 tests collect, with 17 passing and 64 expected failures that directly expose supplied implementation regressions; 18 xpasses show behaviors already fixed in this checkout.”</blockquote>\n<p><strong>Failure Analysis:</strong> The agent invests in broad unit, integration, and acceptance coverage and reports a clean collection, yet the verifier records no F2P test. The trajectory treats expected-failure outcomes and xpasses as evidence of progress, but those outcomes do not establish a test that separates the defective and repaired snapshots. This case isolates the RQ1 gap between a large, executable submission and defect-discriminating assertions.</p>"
    },
    {
      "id": "caseastrasuccess",
      "number": 5,
      "title": "Requirements-Derived Assertions Expose Multiple Defects (GPT-6-Astra on Folium)",
      "meta": "<p><strong>Task Metadata:</strong> <code>python-visualization_folium/episode-0004</code> (Python; archived evaluation).</p>\n<p><strong>Agent &amp; Harness:</strong> GPT-6-Astra via Codex.</p>\n<p><strong>Operational Metrics:</strong> HP 95.54% / F2P 33.12% / EC 88.57% / CFG 100.00% / Num 157.</p>\n<p><strong>Outcome:</strong> Requirements-derived tests expose multiple defective behaviors while retaining high validity and change coverage.</p>",
      "html": "<p><strong>Verbatim Agent Narration (Step 9).</strong></p>\n<blockquote>“The code suggests several gaps worth testing: NumPy weights may remain non-serializable, TopoJSON styling assumes a geometry collection, and extra vector options appear to be dropped.”</blockquote>\n<p><strong>Verbatim Submitted Assertion (Step 10, excerpt).</strong></p>\n<pre><code>def test_each_vector_constructor_forwards_options(kind):\n    layer = vector(kind, interactive=False, pane=&quot;customPane&quot;, ...)\n    assert layer.options[&quot;interactive&quot;] is False</code></pre>\n<p><strong>Success Analysis:</strong> The agent converts the PRD into concrete serialization, geometry, and option-forwarding checks. On the defective snapshot, the focused run reports <code>KeyError: &#x27;interactive&#x27;</code> for the vector-option assertion; the full submission records 99 passes and 58 failures, and the verifier credits 33.12% of registered tests as F2P. The case shows how a requirements-derived oracle can turn broad code coverage into discriminating defect exposure.</p>"
    },
    {
      "id": "caseastraassert",
      "number": 6,
      "title": "Assertion Oracle Mismatch Under a Familiar API (GPT-6-Astra on Ax)",
      "meta": "<p><strong>Task Metadata:</strong> <code>facebook_Ax/episode-0004</code> (Python).</p>\n<p><strong>Agent &amp; Harness:</strong> GPT-6-Astra via Codex.</p>\n<p><strong>Operational Metrics:</strong> HP 19.26% / F2P 3.70% / EC 61.04% / CFG 20.00% / Num 135.</p>\n<p><strong>Outcome:</strong> Many tests fail on the repaired snapshot because their expected transformed values do not match the public API behavior.</p>",
      "html": "<p><strong>Verbatim Failing Assertion (<code>test_standardization.py</code>).</strong></p>\n<pre><code>assert oc.objective.weights == pytest.approx(\n    [weights[0] * 2, weights[1] * 20]\n)\nE assert [2.0, -3.0] == approx([4.0, -60.0])</code></pre>\n<p><strong>Failure Analysis:</strong> The test encodes an inferred rescaling rule that conflicts with the documented contract. The same assertion passes on the defective snapshot but fails on the repaired snapshot, so it cannot count as F2P and instead lowers HP. The trajectory&#x27;s final audit reports 135 tests, 91 passes, and 44 failures; the verifier credits only 3.70% F2P. This case exposes assertion mismatch as a direct construction failure even when the suite exercises the target transformation code.</p>"
    }
  ],
  "repositories": [
    {
      "repo": "element-hq/synapse",
      "url": "https://github.com/element-hq/synapse",
      "category": "Communications",
      "instances": 1,
      "defects": 13,
      "kloc": 283.0
    },
    {
      "repo": "letta-ai/letta",
      "url": "https://github.com/letta-ai/letta",
      "category": "Communications",
      "instances": 1,
      "defects": 5,
      "kloc": 161.8
    },
    {
      "repo": "apache/superset",
      "url": "https://github.com/apache/superset",
      "category": "Data Analysis",
      "instances": 4,
      "defects": 26,
      "kloc": 1017.0
    },
    {
      "repo": "bashtage/arch",
      "url": "https://github.com/bashtage/arch",
      "category": "Data Analysis",
      "instances": 2,
      "defects": 10,
      "kloc": 42.2
    },
    {
      "repo": "comet-ml/opik",
      "url": "https://github.com/comet-ml/opik",
      "category": "Data Analysis",
      "instances": 1,
      "defects": 5,
      "kloc": 1005.1
    },
    {
      "repo": "Data-Centric-AI-Community/data-profiling",
      "url": "https://github.com/Data-Centric-AI-Community/data-profiling",
      "category": "Data Analysis",
      "instances": 1,
      "defects": 4,
      "kloc": 16.5
    },
    {
      "repo": "e2nIEE/pandapower",
      "url": "https://github.com/e2nIEE/pandapower",
      "category": "Data Analysis",
      "instances": 1,
      "defects": 5,
      "kloc": 84.6
    },
    {
      "repo": "lmfit/lmfit-py",
      "url": "https://github.com/lmfit/lmfit-py",
      "category": "Data Analysis",
      "instances": 1,
      "defects": 4,
      "kloc": 10.7
    },
    {
      "repo": "python-visualization/folium",
      "url": "https://github.com/python-visualization/folium",
      "category": "Data Analysis",
      "instances": 2,
      "defects": 11,
      "kloc": 6.5
    },
    {
      "repo": "pyvista/pyvista",
      "url": "https://github.com/pyvista/pyvista",
      "category": "Data Analysis",
      "instances": 1,
      "defects": 7,
      "kloc": 119.8
    },
    {
      "repo": "skforecast/skforecast",
      "url": "https://github.com/skforecast/skforecast",
      "category": "Data Analysis",
      "instances": 1,
      "defects": 4,
      "kloc": 112.8
    },
    {
      "repo": "airbytehq/airbyte",
      "url": "https://github.com/airbytehq/airbyte",
      "category": "Database",
      "instances": 1,
      "defects": 4,
      "kloc": 525.5
    },
    {
      "repo": "ansible/awx",
      "url": "https://github.com/ansible/awx",
      "category": "Database",
      "instances": 1,
      "defects": 5,
      "kloc": 113.2
    },
    {
      "repo": "coleifer/peewee",
      "url": "https://github.com/coleifer/peewee",
      "category": "Database",
      "instances": 1,
      "defects": 5,
      "kloc": 35.5
    },
    {
      "repo": "dagster-io/dagster",
      "url": "https://github.com/dagster-io/dagster",
      "category": "Database",
      "instances": 1,
      "defects": 4,
      "kloc": 1107.0
    },
    {
      "repo": "datahub-project/datahub",
      "url": "https://github.com/datahub-project/datahub",
      "category": "Database",
      "instances": 2,
      "defects": 13,
      "kloc": 1760.3
    },
    {
      "repo": "dgunning/edgartools",
      "url": "https://github.com/dgunning/edgartools",
      "category": "Database",
      "instances": 3,
      "defects": 14,
      "kloc": 922.5
    },
    {
      "repo": "django-haystack/django-haystack",
      "url": "https://github.com/django-haystack/django-haystack",
      "category": "Database",
      "instances": 1,
      "defects": 5,
      "kloc": 15.5
    },
    {
      "repo": "facebook/Ax",
      "url": "https://github.com/facebook/Ax",
      "category": "Database",
      "instances": 3,
      "defects": 14,
      "kloc": 150.7
    },
    {
      "repo": "Farama-Foundation/Gymnasium",
      "url": "https://github.com/Farama-Foundation/Gymnasium",
      "category": "Database",
      "instances": 1,
      "defects": 6,
      "kloc": 32.0
    },
    {
      "repo": "mealie-recipes/mealie",
      "url": "https://github.com/mealie-recipes/mealie",
      "category": "Database",
      "instances": 1,
      "defects": 5,
      "kloc": 107.3
    },
    {
      "repo": "mlflow/mlflow",
      "url": "https://github.com/mlflow/mlflow",
      "category": "Database",
      "instances": 1,
      "defects": 6,
      "kloc": 1417.3
    },
    {
      "repo": "pyproj4/pyproj",
      "url": "https://github.com/pyproj4/pyproj",
      "category": "Database",
      "instances": 1,
      "defects": 5,
      "kloc": 94.2
    },
    {
      "repo": "materialsproject/pymatgen",
      "url": "https://github.com/materialsproject/pymatgen",
      "category": "Desktop Environment",
      "instances": 1,
      "defects": 5,
      "kloc": 237.1
    },
    {
      "repo": "erocarrera/pefile",
      "url": "https://github.com/erocarrera/pefile",
      "category": "File Formats",
      "instances": 1,
      "defects": 4,
      "kloc": 6.6
    },
    {
      "repo": "jmcnamara/XlsxWriter",
      "url": "https://github.com/jmcnamara/XlsxWriter",
      "category": "File Formats",
      "instances": 1,
      "defects": 5,
      "kloc": 33.8
    },
    {
      "repo": "jupyter/nbconvert",
      "url": "https://github.com/jupyter/nbconvert",
      "category": "File Formats",
      "instances": 1,
      "defects": 6,
      "kloc": 33.1
    },
    {
      "repo": "python-excel/xlrd",
      "url": "https://github.com/python-excel/xlrd",
      "category": "File Formats",
      "instances": 1,
      "defects": 5,
      "kloc": 9.4
    },
    {
      "repo": "rommapp/romm",
      "url": "https://github.com/rommapp/romm",
      "category": "Games/Entertainment",
      "instances": 1,
      "defects": 5,
      "kloc": 233.9
    },
    {
      "repo": "Tuxemon/Tuxemon",
      "url": "https://github.com/Tuxemon/Tuxemon",
      "category": "Games/Entertainment",
      "instances": 1,
      "defects": 6,
      "kloc": 127.0
    },
    {
      "repo": "home-assistant/supervisor",
      "url": "https://github.com/home-assistant/supervisor",
      "category": "Home Automation",
      "instances": 1,
      "defects": 8,
      "kloc": 82.9
    },
    {
      "repo": "boto/boto3",
      "url": "https://github.com/boto/boto3",
      "category": "Internet",
      "instances": 1,
      "defects": 5,
      "kloc": 8.5
    },
    {
      "repo": "camel-ai/camel",
      "url": "https://github.com/camel-ai/camel",
      "category": "Internet",
      "instances": 4,
      "defects": 25,
      "kloc": 160.2
    },
    {
      "repo": "cherrypy/cherrypy",
      "url": "https://github.com/cherrypy/cherrypy",
      "category": "Internet",
      "instances": 1,
      "defects": 6,
      "kloc": 17.3
    },
    {
      "repo": "encode/httpcore",
      "url": "https://github.com/encode/httpcore",
      "category": "Internet",
      "instances": 1,
      "defects": 8,
      "kloc": 8.2
    },
    {
      "repo": "googleapis/google-api-python-client",
      "url": "https://github.com/googleapis/google-api-python-client",
      "category": "Internet",
      "instances": 1,
      "defects": 5,
      "kloc": 9.2
    },
    {
      "repo": "pallets/flask",
      "url": "https://github.com/pallets/flask",
      "category": "Internet",
      "instances": 1,
      "defects": 6,
      "kloc": 10.4
    },
    {
      "repo": "python-restx/flask-restx",
      "url": "https://github.com/python-restx/flask-restx",
      "category": "Internet",
      "instances": 1,
      "defects": 5,
      "kloc": 13.7
    },
    {
      "repo": "cuthbertLab/music21",
      "url": "https://github.com/cuthbertLab/music21",
      "category": "Multimedia",
      "instances": 1,
      "defects": 4,
      "kloc": 122.1
    },
    {
      "repo": "deepchem/deepchem",
      "url": "https://github.com/deepchem/deepchem",
      "category": "Multimedia",
      "instances": 1,
      "defects": 4,
      "kloc": 56.0
    },
    {
      "repo": "harry0703/MoneyPrinterTurbo",
      "url": "https://github.com/harry0703/MoneyPrinterTurbo",
      "category": "Multimedia",
      "instances": 3,
      "defects": 13,
      "kloc": 31.8
    },
    {
      "repo": "Kometa-Team/Kometa",
      "url": "https://github.com/Kometa-Team/Kometa",
      "category": "Multimedia",
      "instances": 1,
      "defects": 5,
      "kloc": 31.5
    },
    {
      "repo": "morpheus65535/bazarr",
      "url": "https://github.com/morpheus65535/bazarr",
      "category": "Multimedia",
      "instances": 1,
      "defects": 4,
      "kloc": 993.8
    },
    {
      "repo": "hummingbot/hummingbot",
      "url": "https://github.com/hummingbot/hummingbot",
      "category": "Office/Business",
      "instances": 1,
      "defects": 5,
      "kloc": 242.7
    },
    {
      "repo": "meta-pytorch/captum",
      "url": "https://github.com/meta-pytorch/captum",
      "category": "Office/Business",
      "instances": 1,
      "defects": 9,
      "kloc": 43.6
    },
    {
      "repo": "GPflow/GPflow",
      "url": "https://github.com/GPflow/GPflow",
      "category": "Scientific/Engineering",
      "instances": 1,
      "defects": 5,
      "kloc": 10.4
    },
    {
      "repo": "kubeflow/pipelines",
      "url": "https://github.com/kubeflow/pipelines",
      "category": "Scientific/Engineering",
      "instances": 1,
      "defects": 5,
      "kloc": 425.5
    },
    {
      "repo": "NeuroTechX/moabb",
      "url": "https://github.com/NeuroTechX/moabb",
      "category": "Scientific/Engineering",
      "instances": 2,
      "defects": 9,
      "kloc": 64.6
    },
    {
      "repo": "online-ml/river",
      "url": "https://github.com/online-ml/river",
      "category": "Scientific/Engineering",
      "instances": 1,
      "defects": 5,
      "kloc": 37.6
    },
    {
      "repo": "PyDMD/PyDMD",
      "url": "https://github.com/PyDMD/PyDMD",
      "category": "Scientific/Engineering",
      "instances": 1,
      "defects": 4,
      "kloc": 2.8
    },
    {
      "repo": "data-privacy-stack/presidio",
      "url": "https://github.com/data-privacy-stack/presidio",
      "category": "Security",
      "instances": 3,
      "defects": 15,
      "kloc": 37.1
    },
    {
      "repo": "demisto/content",
      "url": "https://github.com/demisto/content",
      "category": "Security",
      "instances": 1,
      "defects": 7,
      "kloc": 1647.4
    },
    {
      "repo": "domainaware/parsedmarc",
      "url": "https://github.com/domainaware/parsedmarc",
      "category": "Security",
      "instances": 1,
      "defects": 5,
      "kloc": 27.3
    },
    {
      "repo": "oauthlib/oauthlib",
      "url": "https://github.com/oauthlib/oauthlib",
      "category": "Security",
      "instances": 1,
      "defects": 7,
      "kloc": 10.3
    },
    {
      "repo": "ossf/cve-bin-tool",
      "url": "https://github.com/ossf/cve-bin-tool",
      "category": "Security",
      "instances": 1,
      "defects": 4,
      "kloc": 47.5
    },
    {
      "repo": "PurpleAILAB/Decepticon",
      "url": "https://github.com/PurpleAILAB/Decepticon",
      "category": "Security",
      "instances": 1,
      "defects": 4,
      "kloc": 123.5
    },
    {
      "repo": "arrow-py/arrow",
      "url": "https://github.com/arrow-py/arrow",
      "category": "Software Development",
      "instances": 1,
      "defects": 15,
      "kloc": 11.9
    },
    {
      "repo": "ContextLab/hypertools",
      "url": "https://github.com/ContextLab/hypertools",
      "category": "Software Development",
      "instances": 1,
      "defects": 4,
      "kloc": 2.0
    },
    {
      "repo": "damnever/pigar",
      "url": "https://github.com/damnever/pigar",
      "category": "Software Development",
      "instances": 1,
      "defects": 4,
      "kloc": 1.9
    },
    {
      "repo": "dask/distributed",
      "url": "https://github.com/dask/distributed",
      "category": "Software Development",
      "instances": 1,
      "defects": 4,
      "kloc": 96.4
    },
    {
      "repo": "davidhalter/parso",
      "url": "https://github.com/davidhalter/parso",
      "category": "Software Development",
      "instances": 1,
      "defects": 5,
      "kloc": 9.4
    },
    {
      "repo": "evennia/evennia",
      "url": "https://github.com/evennia/evennia",
      "category": "Software Development",
      "instances": 1,
      "defects": 5,
      "kloc": 94.0
    },
    {
      "repo": "facebookresearch/hydra",
      "url": "https://github.com/facebookresearch/hydra",
      "category": "Software Development",
      "instances": 1,
      "defects": 5,
      "kloc": 35.2
    },
    {
      "repo": "flwrlabs/flower",
      "url": "https://github.com/flwrlabs/flower",
      "category": "Software Development",
      "instances": 1,
      "defects": 4,
      "kloc": 202.9
    },
    {
      "repo": "inventree/InvenTree",
      "url": "https://github.com/inventree/InvenTree",
      "category": "Software Development",
      "instances": 1,
      "defects": 5,
      "kloc": 186.2
    },
    {
      "repo": "jacebrowning/memegen",
      "url": "https://github.com/jacebrowning/memegen",
      "category": "Software Development",
      "instances": 1,
      "defects": 5,
      "kloc": 3.5
    },
    {
      "repo": "jupyter/jupyter\\_client",
      "url": "https://github.com/jupyter/jupyter\\_client",
      "category": "Software Development",
      "instances": 1,
      "defects": 6,
      "kloc": 8.7
    },
    {
      "repo": "langchain-ai/langchain",
      "url": "https://github.com/langchain-ai/langchain",
      "category": "Software Development",
      "instances": 2,
      "defects": 10,
      "kloc": 257.5
    },
    {
      "repo": "pydantic/pydantic",
      "url": "https://github.com/pydantic/pydantic",
      "category": "Software Development",
      "instances": 1,
      "defects": 5,
      "kloc": 148.1
    },
    {
      "repo": "UKGovernmentBEIS/inspect\\_ai",
      "url": "https://github.com/UKGovernmentBEIS/inspect\\_ai",
      "category": "Software Development",
      "instances": 1,
      "defects": 4,
      "kloc": 526.9
    },
    {
      "repo": "saltstack/salt",
      "url": "https://github.com/saltstack/salt",
      "category": "System",
      "instances": 1,
      "defects": 5,
      "kloc": 839.3
    },
    {
      "repo": "siliconcompiler/siliconcompiler",
      "url": "https://github.com/siliconcompiler/siliconcompiler",
      "category": "System",
      "instances": 2,
      "defects": 10,
      "kloc": 69.3
    },
    {
      "repo": "aws/aws-cli",
      "url": "https://github.com/aws/aws-cli",
      "category": "Terminals",
      "instances": 1,
      "defects": 5,
      "kloc": 81.1
    },
    {
      "repo": "Azure/azure-cli",
      "url": "https://github.com/Azure/azure-cli",
      "category": "Terminals",
      "instances": 1,
      "defects": 4,
      "kloc": 1966.1
    },
    {
      "repo": "boto/botocore",
      "url": "https://github.com/boto/botocore",
      "category": "Terminals",
      "instances": 3,
      "defects": 14,
      "kloc": 70.7
    },
    {
      "repo": "Textualize/textual",
      "url": "https://github.com/Textualize/textual",
      "category": "Terminals",
      "instances": 1,
      "defects": 4,
      "kloc": 79.8
    },
    {
      "repo": "nltk/nltk",
      "url": "https://github.com/nltk/nltk",
      "category": "Text Processing",
      "instances": 1,
      "defects": 6,
      "kloc": 84.9
    },
    {
      "repo": "pemistahl/lingua-py",
      "url": "https://github.com/pemistahl/lingua-py",
      "category": "Text Processing",
      "instances": 1,
      "defects": 4,
      "kloc": 5.3
    }
  ],
  "histogram": [
    29,
    45,
    12,
    7,
    4,
    1,
    0,
    0,
    0,
    1,
    0,
    1
  ],
  "instructions": [
    {
      "title": "Task 1: Test Generation",
      "text": "You are an experienced software test engineer applying a Test-Driven Development (TDD) approach.\nYour task is to design tests that ensure only correct implementations (following the documentation) pass, while\nincorrect implementations would fail.\n\nYour goal is to discover software problems by writing and executing test cases. Do not only describe tests or\nreturn them in chat: save the executable tests in the task output directory, run them in the provided environment,\ninspect the results, and revise the tests when necessary.\n\nYou are given the following information:\n- Dependencies\n- Test entry inferences\n- Prd Documentation\n\nYour tasks:\n1. Infer the intended behavior of the repo from the prd documentation.\n2. Design a set of comprehensive test cases that cover:\n   - Basic functionality with valid inputs and expected outputs.\n   - Boundary conditions and edge cases.\n   - Invalid inputs and error handling.\n   - Potential issues with dependency interactions.\n3. Write executable test code using Pytest.\n4. Ensure tests are designed to differentiate between correct and incorrect implementations:\n   - At least one test should expose an incorrect implementation that does not fully follow the documented behavior.\n   - A correct implementation should pass all tests.\n5. Use all three complementary testing approaches to test the software comprehensively:\n   - Unit testing for isolated function or method behavior.\n   - Integration testing for interactions among repository components or dependencies.\n   - Acceptance testing for externally observable end-to-end or user-facing behavior.\n6. Save the complete executable test suite and any required test data under `/workspace/submission/`.\n7. Use the environment instructions to configure the provided environment and run the complete test suite.\n   Ensure the generated tests are executable with Pytest and that a correct implementation passes the suite.\n\n## Exploration and completion protocol\n\nDo not stop after writing a small representative sample of tests. Treat test design as an\niterative exploration task and work through the repository behavior systematically:\n\n1. Build a checklist from every capability and public surface in the PRD. For each item,\n   consider at least one normal case, one boundary or unusual case, and one invalid,\n   failure, or state-transition case when that behavior is applicable. Include dependency\n   interactions and externally observable workflows, not only isolated helper functions.\n2. Work in multiple batches. For a non-trivial repository, plan several exploration\n   batches; start each batch with some tests, then run the complete suite,\n   inspect failures, and keep the passing tests. After the first batch, continue\n   with the next unchecked PRD behavior instead of declaring success because the current\n   tests pass.\n3. Use coverage as feedback when it is available in the task environment. Compare the\n   executed lines with the production entry functions and ranges described by the task\n   information. For uncovered regions, decide whether they represent another behavior\n   or a genuinely unreachable/non-behavioral line; add a focused test for the former and\n   record the reason for the latter in your final notes.\n4. Before stopping, perform a completion audit: every applicable PRD capability has a\n   test attempt, all three categories have meaningful tests, the suite has been run from\n   the task-local environment, and each test has a stable unique ID in\n   `testcase_categories.json`. A passing suite alone is not a completion signal.\n\nThere is no fixed universal number of test cases: the required amount is determined by\nthe behavior checklist and the remaining coverage gaps. Continue until that checklist\nand the coverage-driven review are complete, subject to the available execution budget.\n\n## Environment\n\nUse the preconfigured Harbor environment. Read the PRD at `/workspace/prd.md`, then run tests from the repository root: `/workspace/repo`\n\n\n## Requirements for the generated tests\n- Use Pytest and keep the complete suite executable in the provided repository environment; if the environment has problems, you may install the missing dependencies yourself.\n- Apply unit, integration, and acceptance testing as complementary approaches for comprehensive coverage.\n- Write `/workspace/submission/testcase_categories.json` with one object per testcase, containing `id` and exactly one\n  `category` value from `unit_test`, `integration_test`, or `acceptance_test`. The JSON must cover every testcase\n  in the executable suite and include all three testing approaches.\n- Put test modules, fixtures, test data, and `testcase_categories.json` in `/workspace/submission/`.\n- Run the complete suite after writing it by using the preconfigured environment described above.\n- Do not modify production code, dependency manifests, the test runner configuration, or files outside the output\n  directory.\n\n- Write /workspace/submission/test_cases.json with id, category, and an exact pytest_nodeid for every testcase. The logical ID need not appear in the Python function name; parametrized cases must use their full collected node ID. Verify every node ID with pytest --collect-only.\n\n## Output Format\nThe output is the complete executable test suite and `/workspace/submission/testcase_categories.json`."
    },
    {
      "title": "Task 2: Defect Discovery and Reporting",
      "text": "You are an experienced software test engineer applying a systematic test-execution and bug-localization approach.\nYour task is to inspect one repository and its neutral PRD, write and run focused temporary test cases against the provided repository,\nidentify source-grounded software problems, and produce a report.\n\nYou are given:\n- PRD document\n- The visible repository source\n- The repository's declared dependencies\n\nYour tasks:\n1. Read the PRD and inspect the repository source, public interfaces, dependencies, and relevant documentation.\n2. Design a test suite, execute it, analyze the run results, and try to uncover all hidden defects in the repository. It may cover:\n   - Basic functionality with valid inputs and expected outputs.\n   - Boundary conditions and edge cases.\n   - Invalid inputs and error handling.\n   - Potential issues with dependency interactions.\n3. Write executable test code using Pytest. Base assertions on intended behavior so that correct implementations pass and incorrect implementations fail.\n4. If there are issues with the runtime environment, you may perform fixes yourself, such as installing dependencies via pip install.\n5. Save the complete executable test suite and any required test data under `/workspace/submission/`.\n6. Use the environment instructions to configure the provided environment and run the complete test suite.\n   Analyze observed results against expected behavior, investigate failures, and reproduce suspected bugs.\n7. Trace confirmed failures to their causal source files, functions, and lines. Write a complete report\n   to `/workspace/submission/report.json`, including test results, reproduction evidence, and root-cause analysis.\n\n## Environment\n\nThe Harbor image exposes the model inputs at fixed paths. Read the PRD first from `/workspace/prd.md`, then inspect\nand run the repository from `/workspace/repo`:\n\n    cd /workspace/repo\n\nUse the dependencies configured by `environment/Dockerfile`; do not recreate or replace the task environment (you can still fix the environment via pip install), and do not look for the repository or PRD beside the task directory. If setup has an infrastructure problem, record it in `constraints_and_disclosures` and do not claim it is a product failure without an independent reproduction.\n\n## Output Format\n\nThe output is the complete executable test suite, execution evidence, and `/workspace/submission/report.json`.\nWhen a targeted reproduction script is useful, include `/workspace/submission/repro.sh`.\nThe report's top-level structure must match this format:\n\n```json\n{\n  \"title\": \"short problem title\",\n  \"status\": \"confirmed|suspected|blocked\",\n  \"severity\": \"critical|high|medium|low|unknown\",\n  \"test_results\": [\n    {\n      \"scope\": \"test scope\",\n      \"cwd\": \"working directory\",\n      \"command\": \"exact command\",\n      \"exit_code\": 0,\n      \"outcome\": \"what happened\",\n      \"observed\": \"relevant output or failure\",\n      \"evidence\": \"relative raw evidence path\"\n    }\n  ],\n  \"reproduction\": {\n    \"script\": \"repro.sh\",\n    \"command\": \"/workspace/submission/repro.sh\",\n    \"uses_authored_tests\": true,\n    \"steps\": [\"reproduction step\"],\n    \"expected\": \"documented or correct behavior\",\n    \"actual\": \"observed incorrect behavior\",\n    \"evidence\": \"relative raw evidence path\",\n    \"environment_note\": \"environment limitation or intervention\"\n  },\n  \"locations\": [\n    {\n      \"path\": \"repository-relative/source.py\",\n      \"functions\": [\n        {\"name\": \"Class.method\"}\n      ],\n      \"lines\": [42, 43],\n      \"finding\": \"source-grounded causal finding\"\n    }\n  ],\n  \"root_cause\": {\n    \"summary\": \"causal explanation\",\n    \"mechanism\": [\"causal step\"],\n    \"required_guard\": \"required behavioral or code guard, when applicable\",\n    \"evidence\": [\"relative evidence path\"]\n  },\n  \"impact\": \"user-visible or system impact\",\n  \"constraints_and_disclosures\": [\"setup, dependency, intervention, or scope disclosure\"]\n}\n```\n\nUse one JSON report object to describe the bugs you identify. Preserve exact commands, exit codes, outcomes, observed failures, and evidence paths. If an authored test run is blocked by the environment, record it as infrastructure evidence and do not claim it is a product failure without an independent reproduction.\n\n## Localization Detail Requirements\n\nThe `locations` array must report every finding at all three localization granularities:\n\n- File: `path` is the repository-relative source file.\n- Function: include a `functions` array under that file, with each function's exact `name`. Use a qualified name such as `Class.method` when applicable; use `<module>` for module-level code.\n- Code line: Each file entry must include a `lines` array containing the 1-based source-code line numbers of the exact lines relevant to the bug. Do not use vague ranges when precise line numbers can be identified.\n\nThe `path`, `functions`, and `lines` fields must be siblings within each file entry. The `lines` array describes relevant locations throughout that file, including locations outside function bodies. Do not nest `lines` inside individual function entries.\n\nUse this shape (and repeat it for every affected file):\n\n```json\n\"locations\": [\n  {\n    \"path\": \"pkg/module.py\",\n    \"functions\": [\n      {\"name\": \"<module>\"},\n      {\"name\": \"Class.method\"}\n    ],\n    \"lines\": [5, 42, 43]\n  }\n]\n```\n\nAlways provide the file, function, and exact line details.\n\nDo not produce a separate failure analysis or prose report in place of submission/report.json."
    }
  ],
  "highlights": [
    {
      "label": "Test validity & detection",
      "points": [
        [
          "Validity and exposure",
          "Across seven agents, mean HP reaches 91.47%, while mean F2P is 26.36%."
        ],
        [
          "High coverage",
          "Even in the 80–100% CFG interval, mean F2P ranges from 24.24% to 37.82%."
        ],
        [
          "Root-cause localization",
          "Mean localization recall falls from 78.11% for files to 51.29% for functions."
        ]
      ]
    },
    {
      "label": "Distinct bug localization",
      "points": [
        [
          "Distinct bug recovery",
          "Agents localize 33.14–49.04% of reference bugs across the evaluated models."
        ],
        [
          "Across file boundaries",
          "Localization falls to 2.00–7.84% for multi-file bugs, versus 40.63–59.05% for single-file bugs."
        ],
        [
          "Coexisting defects",
          "Every evaluable bug is localized in only 4.00–11.00% of instances."
        ]
      ]
    },
    {
      "label": "Discovery by defect type",
      "points": [
        [
          "Shared blind spots",
          "Mean hunk recall is 40.56% for incomplete output and 50.23% for incomplete data processing."
        ],
        [
          "Input validation",
          "The missing-input-validation cohort has mean hunk recall of 51.32%."
        ],
        [
          "Within known files",
          "Of 46 complete-file-recall records in that cohort, 95.65% still omit reference functions."
        ]
      ]
    },
    {
      "label": "Failure mechanisms",
      "points": [
        [
          "Test oracles",
          "Assertion mismatches and misconfigured mocks account for 31.6% and 37.5% of reviewed Task 1 failure mechanisms."
        ],
        [
          "Causal tracing",
          "Premature search termination accounts for 36.0% of reviewed localization failure mechanisms; evidence underuse accounts for 30.9%."
        ],
        [
          "Reporting",
          "Symptoms reported as causes (25.0%) and conservative omissions (19.9%) leave defect locations unreported."
        ]
      ]
    },
    {
      "label": "Effect of new tests",
      "points": [
        [
          "Recall gains",
          "Agent-authored tests improve file, function, and hunk recall by 4.99, 2.77, and 2.69 percentage points."
        ],
        [
          "Uneven improvements",
          "Function recall improves in 31% of instances and hunk recall in 35%; the median paired change is zero."
        ],
        [
          "Precision tradeoff",
          "Mean precision decreases at all three granularities in the same GPT-5.6-Sol comparison."
        ]
      ]
    }
  ],
  "cohorts": [
    {
      "name": "Incomplete data processing",
      "values": [
        76.83,
        72.03,
        50.88,
        50.58,
        50.23,
        65.7
      ]
    },
    {
      "name": "Missing input validation",
      "values": [
        81.87,
        74.95,
        52.54,
        53.59,
        51.32,
        70.36
      ]
    },
    {
      "name": "Incomplete error handling",
      "values": [
        76.51,
        73.38,
        51.85,
        53.88,
        50.62,
        68.62
      ]
    },
    {
      "name": "Incomplete configuration",
      "values": [
        73.97,
        80.3,
        52.08,
        57.37,
        44.95,
        69.66
      ]
    },
    {
      "name": "Incomplete output",
      "values": [
        71.89,
        76.13,
        48.17,
        59.59,
        40.56,
        65.26
      ]
    },
    {
      "name": "Incorrect data processing",
      "values": [
        79.04,
        75.09,
        54.71,
        54.28,
        52.89,
        67.95
      ]
    },
    {
      "name": "Incorrect input validation",
      "values": [
        81.89,
        76.85,
        56.35,
        50.37,
        51.46,
        69.45
      ]
    },
    {
      "name": "Incorrect path / resource",
      "values": [
        87.62,
        72.0,
        66.52,
        48.97,
        59.95,
        66.81
      ]
    },
    {
      "name": "Incorrect output",
      "values": [
        76.08,
        71.71,
        52.54,
        56.16,
        51.83,
        66.54
      ]
    },
    {
      "name": "Incorrect configuration",
      "values": [
        85.65,
        76.06,
        59.89,
        49.6,
        55.08,
        67.65
      ]
    },
    {
      "name": "Incorrect regular expression",
      "values": [
        76.12,
        79.55,
        59.0,
        58.41,
        54.38,
        71.53
      ]
    },
    {
      "name": "Performance / resource issue",
      "values": [
        81.15,
        84.4,
        54.87,
        62.57,
        53.67,
        82.28
      ]
    },
    {
      "name": "Typo / symbol error",
      "values": [
        87.69,
        73.58,
        75.75,
        50.24,
        79.46,
        69.34
      ]
    },
    {
      "name": "Variable initialization error",
      "values": [
        81.43,
        85.38,
        57.28,
        63.88,
        49.54,
        76.01
      ]
    },
    {
      "name": "Generic data-operation error",
      "values": [
        98.89,
        84.95,
        77.41,
        72.67,
        62.84,
        80.66
      ]
    },
    {
      "name": "Missing type conversion",
      "values": [
        80.0,
        66.36,
        66.33,
        48.73,
        60.25,
        58.02
      ]
    },
    {
      "name": "Loop / control-flow error",
      "values": [
        94.4,
        73.82,
        63.92,
        62.32,
        66.45,
        70.28
      ]
    }
  ],
  "failureMechanisms": {
    "tests": [
      [
        "Misconfigured mocks",
        37.5
      ],
      [
        "Assertion mismatches",
        31.6
      ],
      [
        "API / parameter errors",
        22.8
      ],
      [
        "Invalid input / setup",
        7.4
      ],
      [
        "Runtime exceptions",
        3.7
      ],
      [
        "Syntax / collection",
        1.5
      ]
    ],
    "localization": [
      [
        "Premature termination",
        36.0
      ],
      [
        "Evidence underuse",
        30.9
      ],
      [
        "Dependency truncation",
        25.0
      ],
      [
        "Symptoms as causes",
        25.0
      ],
      [
        "Conservative omissions",
        19.9
      ],
      [
        "Incorrect granularity",
        4.4
      ]
    ]
  },
  "pairedTesting": {
    "recall": [
      [
        74.81,
        79.8
      ],
      [
        49.82,
        52.59
      ],
      [
        49.53,
        52.22
      ]
    ],
    "precision": [
      [
        78.0,
        75.26
      ],
      [
        60.16,
        58.55
      ],
      [
        73.59,
        70.34
      ]
    ]
  }
};
