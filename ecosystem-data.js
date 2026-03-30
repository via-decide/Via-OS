/**
 * scripts/ecosystem-data.js — VIA Ecosystem Dictionary
 * 
 * Maps the 34+ ViaDecide tools into 8 distinct Macro Zones.
 */

window.masterKeySigil = "0,-1|0,0|0,1|-1,1|-1,0|0,0|1,0|1,-1|1,0|1,1";

window.ZONES = [
  {
    id: "code-nexus",
    name: "Code Nexus",
    lore: "Architectural synthesis and automated protocol generation.",
    tools: [
      { id: "code-generator", name: "Code Generator", desc: "Generate boilerplate, scaffolding, and specs" },
      { id: "code-reviewer", name: "Code Reviewer", desc: "Validate quality, security, and compliance" },
      { id: "agent-builder", name: "Agent Builder", desc: "Build autonomous agents and workflows" },
      { id: "app-generator", name: "App Generator", desc: "Generate complete apps from specifications" },
      { id: "spec-builder", name: "Spec Builder", desc: "Create detailed technical requirements" }
    ]
  },
  {
    id: "creator-forge",
    name: "Creator Forge",
    lore: "Algorithmic ideation and output refinement.",
    tools: [
      { id: "prompt-alchemy", name: "Prompt Alchemy", desc: "Optimize prompts for max effectiveness" },
      { id: "script-generator", name: "Script Generator", desc: "Generate automations and procedural content" },
      { id: "export-studio", name: "Export Studio", desc: "Export work in multiple optimized formats" },
      { id: "idea-remixer", name: "Idea Remixer", desc: "Combine ideas into new creative outputs" }
    ]
  },
  {
    id: "research-matrix",
    name: "Research Matrix",
    lore: "Multi-source intelligence gathering and synthesis.",
    tools: [
      { id: "multi-source-research", name: "Multi-Source", desc: "Synthesize global documentation" },
      { id: "student-research", name: "Student Research", desc: "Academic and structured learning paths" }
    ]
  },
  {
    id: "logic-academy",
    name: "Logic Academy",
    lore: "Philosophical entity cartography and skill honing.",
    tools: [
      { id: "interview-prep", name: "Interview Prep", desc: "Comprehensive coaching algorithms" }
    ]
  },
  {
    id: "decision-core",
    name: "Decision Core",
    lore: "High-level strategic forecasting and logic hubs.",
    tools: [
      { id: "decision-brief", name: "Decision Brief", desc: "Structured business frameworks" },
      { id: "sales-dashboard", name: "Sales Dashboard", desc: "Track and optimize pipelines" },
      { id: "workflow-builder", name: "Workflow Builder", desc: "Create and optimize automations" },
      { id: "revenue-forecaster", name: "Revenue Forecaster", desc: "Project financial outcomes" },
      { id: "reality-check", name: "Reality Check", desc: "Validate decisions via reality testing" },
      { id: "decision-matrix", name: "Decision Matrix", desc: "Weighted criteria analysis" },
      { id: "opportunity-radar", name: "Opportunity Radar", desc: "Evaluate and prioritize systematically" }
    ]
  },
  {
    id: "utility-subsystem",
    name: "Utility Subsystem",
    lore: "Core operational routines and parsing systems.",
    tools: [
      { id: "tool-search-discovery", name: "Tool Search", desc: "Find the optimal problem solver" },
      { id: "output-evaluator", name: "Output Evaluator", desc: "Validate outputs against standards" },
      { id: "prompt-compare", name: "Prompt Compare", desc: "Analyze differing prompt results" },
      { id: "context-packager", name: "Context Packager", desc: "Optimize packages for AI context" },
      { id: "task-splitter", name: "Task Splitter", desc: "Decompose complex workflows" },
      { id: "template-vault", name: "Template Vault", desc: "Store and retrieve patterns" },
      { id: "meeting-cost-calculator", name: "Cost Math", desc: "Optimize operational efficiency" }
    ]
  },
  {
    id: "orchard-engine",
    name: "Orchard Engine",
    lore: "Merit-based progression matrix and competitive simulations.",
    tools: [
      { id: "orchard-engine", name: "Orchard Engine", desc: "Farming game \u0026 progression" },
      { id: "wings-of-fire-quiz", name: "Wings of Fire", desc: "Interactive knowledge testing" }
    ]
  },
  {
    id: "meta-synthesis",
    name: "Meta Synthesis",
    lore: "Self-replicating tooling algorithms and oversight routers.",
    tools: [
      { id: "tool-router", name: "Tool Router", desc: "Meta-Tool to route optimal solutions" },
      { id: "tool-factory", name: "Tool Factory", desc: "Meta-Tool to generate new tools" },
    ]
  },
  {
    id: "developer-vault",
    name: "[∞, ∞] Dharam Daxini / classified logs",
    lore: "Proprietary root level access. System authorship verified.",
    tools: [
      { id: "root-console", name: "Root Console", desc: "Access the motherboard heartbeat" }
    ]
  }
];
window.AppRegistry = {
  "0,0|1,0|2,0": "whatsapp://send",
  "0,1|1,1|2,1": "spotify://",
  "0,2|1,2|2,2": "vnd.youtube://"
};
