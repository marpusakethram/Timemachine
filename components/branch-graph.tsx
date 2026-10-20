"use client";
import { Background, ReactFlow, Position, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Branch } from "@/lib/simulation/models";
// Mid-tone path colors that hold contrast on both the light and dark canvas.
export const COLORS = ["#2a9d8a", "#c9822b", "#4d6bff"];
export function BranchGraph({ title, branches, selected, onSelect }: { title: string; branches: Branch[]; selected: number; onSelect: (i: number) => void }) {
  const nodes: Node[] = [
    { id: "decision", position: { x: 190, y: 0 }, data: { label: title }, sourcePosition: Position.Bottom, style: { width: 230, background: "var(--surface-2)", color: "var(--ink)", border: "1px solid var(--rule-strong)", borderRadius: 10, padding: 14, fontWeight: 500 } },
    ...branches.map((b, i) => ({ id: b.id, position: { x: i * 210, y: 120 }, data: { label: `${i + 1}. ${b.name}` }, targetPosition: Position.Top, style: { width: 190, minHeight: 60, background: i === selected ? "var(--accent-soft)" : "var(--surface)", color: "var(--ink)", border: `${i === selected ? 2 : 1}px solid ${COLORS[i]}`, borderRadius: 10, padding: 12, fontSize: 12 } })),
  ];
  const edges: Edge[] = branches.map((b, i) => ({ id: `edge-${b.id}`, source: "decision", target: b.id, type: "smoothstep", style: { stroke: COLORS[i], strokeWidth: selected === i ? 2.5 : 1, opacity: selected === i ? 1 : 0.5 } }));
  return <div className="branch-graph" role="img" aria-label="Decision connected to three conditional branches. Use the branch buttons below to select.">
    <ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.15 }} nodesDraggable={false} nodesConnectable={false} zoomOnScroll={false} panOnDrag={false} onNodeClick={(_, node) => { const i = branches.findIndex(b => b.id === node.id); if (i >= 0) onSelect(i); }} minZoom={0.3} maxZoom={1.2}>
      <Background color="var(--rule-strong)" gap={22} size={1} />
    </ReactFlow>
  </div>;
}
