import React, { useMemo, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Node,
  Edge
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Campaign, Account, Post } from "../types";
import { Network, Info, ShieldAlert, Hash, Globe, Users } from "lucide-react";

interface NetworkIntelligenceViewProps {
  campaigns: Campaign[];
  accounts: Account[];
  posts: Post[];
  selectedCampaignId?: string | null;
  onSelectAccount: (username: string) => void;
  onSelectCampaign: (campaignId: string) => void;
}

export const NetworkIntelligenceView: React.FC<NetworkIntelligenceViewProps> = ({
  campaigns,
  accounts,
  posts,
  selectedCampaignId,
  onSelectAccount,
  onSelectCampaign
}) => {
  const activeCampaign =
    campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  // Construct React Flow graph data
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Center Node: The Campaign
    const campaignId = activeCampaign ? activeCampaign.id : "CAMP-2026-042";
    const campaignName = activeCampaign ? activeCampaign.name : "Coordinated Solar Disinfo Swarm";

    nodes.push({
      id: campaignId,
      type: "default",
      position: { x: 350, y: 220 },
      data: {
        label: (
          <div className="p-3 text-center">
            <span className="text-[10px] font-mono text-[#F87171] uppercase block font-bold">
              THREAT CAMPAIGN HUB
            </span>
            <span className="text-xs font-bold text-[#F8FAFC] block mt-0.5">
              {campaignName}
            </span>
            <span className="text-[9px] font-mono text-[#94A3B8] block mt-1">
              Score: {activeCampaign?.threatScore || 87}/100 • {(activeCampaign?.accountsInvolved || activeCampaign?.accounts || []).length || 8} Accounts
            </span>
          </div>
        )
      },
      style: {
        background: "#1D2638",
        color: "#F8FAFC",
        border: "2px solid #F87171",
        borderRadius: "14px",
        width: 240,
        boxShadow: "0 0 25px rgba(248, 113, 113, 0.25)"
      }
    });

    // Hashtag Nodes (Top)
    const hashtags = [
      { id: "tag-cleanenergyhoax", label: "#CleanEnergyHoax", x: 200, y: 50 },
      { id: "tag-solarscam", label: "#SolarScam", x: 400, y: 40 },
      { id: "tag-greentaxlies", label: "#GreenTaxLies", x: 600, y: 60 },
    ];

    hashtags.forEach((h) => {
      nodes.push({
        id: h.id,
        position: { x: h.x, y: h.y },
        data: {
          label: (
            <div className="px-3 py-1.5 text-center">
              <span className="text-[11px] font-mono font-bold text-[#22D3EE] flex items-center justify-center gap-1">
                <Hash className="w-3 h-3" /> {h.label}
              </span>
              <span className="text-[9px] text-[#94A3B8] font-mono block">
                Cluster Keyword
              </span>
            </div>
          )
        },
        style: {
          background: "#151B2E",
          border: "1px solid #22D3EE",
          borderRadius: "8px",
          color: "#22D3EE"
        }
      });

      edges.push({
        id: `edge-camp-${h.id}`,
        source: campaignId,
        target: h.id,
        animated: true,
        style: { stroke: "#22D3EE", strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#22D3EE" }
      });
    });

    // URL Node (Top-Right)
    const urlNodeId = "url-dossier";
    nodes.push({
      id: urlNodeId,
      position: { x: 700, y: 220 },
      data: {
        label: (
          <div className="p-2.5 text-center">
            <span className="text-[10px] font-mono text-[#FBBF24] font-bold block flex items-center justify-center gap-1">
              <Globe className="w-3 h-3" /> https://bit.ly/grid-dossier-2026
            </span>
            <span className="text-[9px] text-[#94A3B8] font-mono block mt-0.5">
              Shared Malicious Target Link
            </span>
          </div>
        )
      },
      style: {
        background: "#151B2E",
        border: "1px solid #FBBF24",
        borderRadius: "8px",
        color: "#FBBF24"
      }
    });

    edges.push({
      id: `edge-camp-url`,
      source: campaignId,
      target: urlNodeId,
      style: { stroke: "#FBBF24", strokeDasharray: "4 4" }
    });

    // Account Nodes arranged in a lower semicircle
    const campaignAccList = activeCampaign?.accountsInvolved || activeCampaign?.accounts || [];
    const relevantAccounts = accounts.filter((a) =>
      campaignAccList.includes(a.username)
    );

    const radius = 260;
    const centerObj = { x: 420, y: 240 };
    const totalAcc = relevantAccounts.length || 8;

    relevantAccounts.forEach((acc, idx) => {
      const angle = Math.PI * (0.15 + (0.7 * idx) / (totalAcc - 1));
      const x = centerObj.x + radius * Math.cos(angle) - 60;
      const y = centerObj.y + radius * Math.sin(angle);

      const nodeId = `acc-${acc.username}`;

      nodes.push({
        id: nodeId,
        position: { x, y },
        data: {
          username: acc.username,
          label: (
            <div className="p-2 text-center select-none cursor-pointer">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#F87171] animate-ping" />
                <span className="text-xs font-bold text-[#F8FAFC]">
                  @{acc.username}
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#94A3B8] block">
                Bot: <strong className="text-[#F87171]">{acc.botProbability}%</strong> • Age: {acc.accountAgeDays}d
              </span>
              <span className="text-[8px] uppercase tracking-wider text-[#4F7CFF] block mt-1 font-bold">
                CLICK TO INSPECT
              </span>
            </div>
          )
        },
        style: {
          background: "#151B2E",
          border: "1.5px solid #F87171",
          borderRadius: "10px",
          width: 140,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)"
        }
      });

      // Edge from Campaign to Account
      edges.push({
        id: `edge-camp-${nodeId}`,
        source: campaignId,
        target: nodeId,
        animated: true,
        style: { stroke: "#F87171", strokeWidth: 1.5 }
      });

      // Connect Account to URL
      if (idx % 2 === 0) {
        edges.push({
          id: `edge-acc-url-${idx}`,
          source: nodeId,
          target: urlNodeId,
          style: { stroke: "#FBBF24", strokeWidth: 1, opacity: 0.6 }
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [activeCampaign, accounts]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Handle node click
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.id.startsWith("acc-")) {
        const username = node.data?.username as string;
        if (username) {
          onSelectAccount(username);
        }
      } else if (node.id.startsWith("CAMP-")) {
        onSelectCampaign(node.id);
      }
    },
    [onSelectAccount, onSelectCampaign]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#151B2E] border border-[#253149] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F8FAFC] flex items-center gap-2.5">
            <Network className="w-7 h-7 text-[#4F7CFF]" />
            CAMPAIGN NETWORK INTELLIGENCE
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Graph visualization of coordinated accounts, narrative anchors, shared hyperlinked assets, and swarm topology.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-[#F87171]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]" /> Campaign / Accounts
          </span>
          <span className="flex items-center gap-1.5 text-[#22D3EE]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" /> Hashtags
          </span>
          <span className="flex items-center gap-1.5 text-[#FBBF24]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" /> Shared URL
          </span>
        </div>
      </div>

      {/* Network Graph Stage */}
      <div className="bg-[#111827] border border-[#253149] rounded-2xl h-[560px] relative overflow-hidden shadow-2xl">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
          attributionPosition="bottom-left"
          className="bg-[#111827]"
        >
          <Background color="#253149" gap={20} size={1} />
          <Controls className="bg-[#1D2638] border border-[#253149] text-[#F8FAFC] rounded-lg overflow-hidden fill-white" />
          <MiniMap
            nodeColor={(node) => {
              if (node.id.startsWith("acc-")) return "#F87171";
              if (node.id.startsWith("tag-")) return "#22D3EE";
              if (node.id.startsWith("url-")) return "#FBBF24";
              return "#4F7CFF";
            }}
            maskColor="rgba(17, 24, 39, 0.8)"
            className="bg-[#151B2E] border border-[#253149] rounded-lg"
          />
        </ReactFlow>

        {/* Overlay Note */}
        <div className="absolute top-4 left-4 bg-[#151B2E]/90 backdrop-blur-sm border border-[#253149] p-3 rounded-xl text-xs text-[#94A3B8] max-w-sm pointer-events-none shadow-lg">
          <div className="flex items-center gap-1.5 font-bold text-[#F8FAFC] mb-1">
            <Info className="w-3.5 h-3.5 text-[#4F7CFF]" />
            <span>Interactive Graph Navigation</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Click any account node (bottom arc) to view its full behavioral dossier, risk breakdown, and recommended moderation actions. Drag or zoom to explore.
          </p>
        </div>
      </div>
    </div>
  );
};
