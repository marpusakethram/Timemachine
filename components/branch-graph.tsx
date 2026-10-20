"use client";
import { Background, ReactFlow, Position, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Branch } from "@/lib/simulation/models";
export const COLORS = ["#2e6be6", "#e39a0b", "#0e9f74"];
export const PATH_LETTERS = ["A", "B", "C"];
export function BranchGraph({ title, branches, selected, onSelect }: { title: string; branches: Branch[]; selected: number; onSelect: (i: number) => void }) {
  const nodes: Node[] = [
    { id: "decision", position: { x: 190, y: 0 }, data: { label: title }, sourcePosition: Position.Bottom, style: { width: 230, background: "#1c2a33", color: "#ffffff", border: "1px solid #1c2a33", borderRadius: 14, padding: 12, fontWeight: 600, fontSize: 12 } },
    ...branches.map((b, i) => ({ id: b.id, position: { x: i * 210, y: 120 }, data: { label: `Path ${PATH_LETTERS[i]}: ${b.name}` }, targetPosition: Position.Top, style: { width: 190, minHeight: 56, background: i === selected ? `${COLORS[i]}18` : "#ffffff", color: "#1c2a33", border: `${i === selected ? 2 : 1}px solid ${i === selected ? COLORS[i] : "#dbe0e6"}`, borderRadius: 14, padding: 12, fontSize: 12, fontWeight: i === selected ? 600 : 500 } })),
  ];
  const edges: Edge[] = branches.map((b, i) => ({ id: `edge-${b.id}`, source: "decision", target: b.id, type: "smoothstep", style: { stroke: selected === i ? COLORS[i] : "#c3cbd4", strokeWidth: selected === i ? 2 : 1 } }));
  return <div className="branch-graph" role="img" aria-label="Decision connected to three conditional branches. Use the branch buttons below to select.">
    <ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.15 }} nodesDraggable={false} nodesConnectable={false} zoomOnScroll={false} panOnDrag={false} onNodeClick={(_, node) => { const i = branches.findIndex(b => b.id === node.id); if (i >= 0) onSelect(i); }} minZoom={0.3} maxZoom={1.2}>
      <Background color="#dbe0e6" gap={20} size={1} />
    </ReactFlow>
  </div>;
}
