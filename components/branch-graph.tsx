"use client";
import { Background, ReactFlow, Position, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Branch } from "@/lib/simulation/models";
export const COLORS = ["#60a5fa", "#c4a1ff", "#4dd6b0"];
export function BranchGraph({ title, branches, selected, onSelect }: { title: string; branches: Branch[]; selected: number; onSelect: (i: number) => void }) {
  const nodes: Node[] = [
    { id: "decision", position: { x: 190, y: 0 }, data: { label: title }, sourcePosition: Position.Bottom, style: { width: 230, background: "#182438", color: "#ecf3ff", border: "1px solid #41516b", borderRadius: 12, padding: 14 } },
    ...branches.map((b, i) => ({ id: b.id, position: { x: i * 210, y: 120 }, data: { label: `${String(i + 1).padStart(2, "0")} / ${b.name}` }, targetPosition: Position.Top, style: { width: 190, minHeight: 60, background: i === selected ? "#203550" : "#141e2c", color: "#e4edfb", border: `${i === selected ? 2 : 1}px solid ${COLORS[i]}`, borderRadius: 10, padding: 12, fontSize: 12 } })),
  ];
  const edges: Edge[] = branches.map((b, i) => ({ id: `edge-${b.id}`, source: "decision", target: b.id, type: "smoothstep", style: { stroke: COLORS[i], strokeWidth: selected === i ? 2.5 : 1, opacity: selected === i ? 1 : 0.5 } }));
  return <div className="branch-graph" role="img" aria-label="Decision connected to three conditional branches. Use the branch buttons below to select.">
    <ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.15 }} nodesDraggable={false} nodesConnectable={false} zoomOnScroll={false} panOnDrag={false} onNodeClick={(_, node) => { const i = branches.findIndex(b => b.id === node.id); if (i >= 0) onSelect(i); }} minZoom={0.3} maxZoom={1.2}>
      <Background color="#314058" gap={22} size={1} />
    </ReactFlow>
  </div>;
}
