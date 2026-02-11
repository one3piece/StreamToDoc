import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { MindMapNode } from '../types';

interface MindMapProps {
  data: MindMapNode;
}

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current || !wrapperRef.current) return;

    const width = wrapperRef.current.clientWidth;
    const height = 600;
    
    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-50, -50, width, height])
      .style("max-width", "100%")
      .style("height", "auto");

    const root = d3.hierarchy<MindMapNode>(data);
    const treeLayout = d3.tree<MindMapNode>().size([height - 100, width - 200]);

    treeLayout(root);

    const g = svg.append("g")
      .attr("transform", `translate(80, 50)`);

    // Links
    g.selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 1.5)
      .attr("d", d3.linkHorizontal()
        .x((d: any) => d.y)
        .y((d: any) => d.x) as any
      );

    // Nodes
    const node = g.selectAll(".node")
      .data(root.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`);

    // Node Circles
    node.append("circle")
      .attr("r", 6)
      .attr("fill", (d) => d.children ? "#4f46e5" : "#fff") // Indigo-600 for parents, white for leaves
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 2);

    // Node Labels
    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => d.children ? -12 : 12)
      .attr("text-anchor", (d) => d.children ? "end" : "start")
      .text((d) => d.data.name)
      .clone(true).lower() // Shadow for readability
      .attr("stroke", "white")
      .attr("stroke-width", 3);

  }, [data]);

  return (
    <div ref={wrapperRef} className="w-full h-[600px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden relative">
        <svg ref={svgRef}></svg>
        <div className="absolute bottom-4 right-4 text-xs text-slate-400 bg-white/80 p-2 rounded">
            Auto-generated from Content
        </div>
    </div>
  );
};

export default MindMap;
