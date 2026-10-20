"use client";
import { Background, ReactFlow, Position, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Branch } from "@/lib/simulation/models";
export const COLORS = ["#2f6fde", "#d9631e", "#0e8a6f"];
export function BranchGraph({ title, branches, selected, onSelect }: { title: string; branches: Branch[]; selected: number; onSelect: (i: number) => void }) {
  const nodes: Node[] = [
    { id: "decision", position: { x: 190, y: 0 }, data: { label: title }, sourcePosition: Position.Bottom, style: { width: 230, background: "#0e1726", color: "#ffffff", border: "1px solid #0e1726", borderRadius: 8, padding: 12, fontWeight: 600, fontSize: 12 } },
    ...branches.map((b, i) => ({ id: b.id, position: { x: i * 210, y: 120 }, data: { label: `${String(i + 1).padStart(2, "0")} / ${b.name}` }, targetPosition: Position.Top, style: { width: 190, minHeight: 56, background: i === selected ? `${COLORS[i]}14` : "#ffffff", color: "#0e1726", border: `${i === selected ? 2 : 1}px solid ${i === selected ? COLORS[i] : "#d5dae1"}`, borderRadius: 8, padding: 12, fontSize: 12, fontWeight: i === selected ? 600 : 500 } })),
  ];
  const edges: Edge[] = branches.map((b, i) => ({ id: `edge-${b.id}`, source: "decision", target: b.id, type: "smoothstep", style: { stroke: selected === i ? COLORS[i] : "#b8c0cc", strokeWidth: selected === i ? 2 : 1 } }));
  return <div className="branch-graph" role="img" aria-label="Decision connected to three conditional branches. Use the branch buttons below to select.">
    <ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.15 }} nodesDraggable={false} nodesConnectable={false} zoomOnScroll={false} panOnDrag={false} onNodeClick={(_, node) => { const i = branches.findIndex(b => b.id === node.id); if (i >= 0) onSelect(i); }} minZoom={0.3} maxZoom={1.2}>
      <Background color="#dfe3e8" gap={20} size={1} />
    </ReactFlow>
  </div>;
}
