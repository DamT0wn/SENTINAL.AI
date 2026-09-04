import React, { useState, useMemo } from "react";
import {
  ActiveTab,
  Post,
  Account,
  Campaign,
  ThreatAlert
} from "./types";
import {
  MOCK_POSTS,
  MOCK_ACCOUNTS,
  INITIAL_CAMPAIGNS,
  INITIAL_ALERTS
} from "./data/mockData";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { AccountIntelligenceDrawer } from "./components/AccountIntelligenceDrawer";
import { ThreatSimulationModal } from "./components/ThreatSimulationModal";
import { CsvImportModal } from "./components/CsvImportModal";

// Views
import { OverviewView } from "./views/OverviewView";
import { SocialAnalyticsView } from "./views/SocialAnalyticsView";
import { PostAnalyzerView } from "./views/PostAnalyzerView";
import { TrendsView } from "./views/TrendsView";
import { AudienceView } from "./views/AudienceView";
import { CampaignIntelligenceView } from "./views/CampaignIntelligenceView";
import { NetworkIntelligenceView } from "./views/NetworkIntelligenceView";
import { CyberSafetyView } from "./views/CyberSafetyView";
import { ThreatCenterView } from "./views/ThreatCenterView";
import { SettingsView } from "./views/SettingsView";

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [activeScenario, setActiveScenario] = useState<"all" | "normal" | "cyberbullying" | "coordinated">("all");

  // Core Dataset State
  const [allPosts, setAllPosts] = useState<Post[]>(MOCK_POSTS);
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [alerts, setAlerts] = useState<ThreatAlert[]>(INITIAL_ALERTS);

  // Selected Entities for Deep Dives
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>("CAMP-2026-042");
  const [selectedAccountUsername, setSelectedAccountUsername] = useState<string | null>(null);
  const [selectedPostForAnalysis, setSelectedPostForAnalysis] = useState<Post | null>(null);

  // Modals & Drawers
  const [isSimulationOpen, setIsSimulationOpen] = useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
  const [threatDetected, setThreatDetected] = useState<boolean>(false);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);

  // Filter posts by active scenario
  const currentPosts = useMemo(() => {
    if (activeScenario === "all") return allPosts;
    return allPosts.filter((p) => p.scenario === activeScenario);
  }, [allPosts, activeScenario]);

  // Selected Account Object for Drawer
  const selectedAccount = useMemo(() => {
    if (!selectedAccountUsername) return null;
    return accounts.find((a) => a.username === selectedAccountUsername) || null;
  }, [accounts, selectedAccountUsername]);

  // Handler for direct routing from alerts/cards
  const handleNavigate = (tab: ActiveTab, targetId?: string) => {
    setActiveTab(tab);
    if (targetId) {
      if (tab === "campaigns" || tab === "network") {
        setSelectedCampaignId(targetId);
      } else if (tab === "audience") {
        setSelectedAccountUsername(targetId);
      }
    }
  };

  // Handler for analyzing a specific post
  const handleAnalyzePost = (post: Post) => {
    setSelectedPostForAnalysis(post);
    setActiveTab("post-analyzer");
  };

  // Threat Simulation Completed (Scenario C trigger)
  const handleCompleteSimulation = () => {
    setThreatDetected(true);
    setActiveScenario("coordinated");

    // Prepend a high-priority critical alert if not already present
    const simAlert: ThreatAlert = {
      id: `alert-sim-${Date.now()}`,
      title: "COORDINATED INAUTHENTIC BEHAVIOR SWARM DETECTED",
      severity: "CRITICAL",
      description:
        "8 synthetic bot accounts identified publishing identical #CleanEnergyHoax text and obfuscated URL links within a 5-minute temporal window.",
      targetRoute: "campaigns",
      targetId: "CAMP-2026-042",
      timestamp: "Just now"
    };

    setAlerts((prev) => [simAlert, ...prev.filter((a) => a.id !== simAlert.id)]);
  };

  // CSV Import Success
  const handleImportSuccess = (importedPosts: Post[]) => {
    setAllPosts(importedPosts);
    setActiveScenario("all");

    // Extract unique accounts from imported posts
    const accountMap = new Map<string, Account>();
    importedPosts.forEach((p) => {
      if (!accountMap.has(p.username)) {
        accountMap.set(p.username, {
          id: `imported-${p.username}`,
          username: p.username,
          displayName: p.displayName || p.username,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
          accountAgeDays: Math.floor(Math.random() * 200) + 10,
          followerCount: p.followerCount || 500,
          followingCount: 250,
          verified: false,
          totalPosts: 1,
          repeatedContentRate: 0.1,
          behaviorScore: Math.floor(Math.random() * 50) + 20,
          botProbability: Math.floor(Math.random() * 40) + 10,
          riskLevel: "LOW",
          burstActivity: false,
          sharedHashtags: p.hashtags || [],
          campaignIds: []
        });
      }
    });

    setAccounts(Array.from(accountMap.values()));
    setActiveTab("overview");
  };

  // Reset to original synthetic benchmark data
  const handleResetData = () => {
    setAllPosts(MOCK_POSTS);
    setAccounts(MOCK_ACCOUNTS);
    setCampaigns(INITIAL_CAMPAIGNS);
    setAlerts(INITIAL_ALERTS);
    setActiveScenario("all");
    setThreatDetected(false);
    setSelectedCampaignId("CAMP-2026-042");
    setSelectedAccountUsername(null);
  };

  return (
    <div className="flex h-screen bg-[#111827] text-[#F8FAFC] font-sans antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeScenario={activeScenario}
        setActiveScenario={setActiveScenario}
        onOpenSimulation={() => setIsSimulationOpen(true)}
        onOpenCsvImport={() => setIsCsvModalOpen(true)}
        threatCount={alerts.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top App Bar */}
        <TopBar
          onOpenSimulation={() => setIsSimulationOpen(true)}
          threatDetected={threatDetected}
          simulationRunning={simulationRunning}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto pb-16">
          {activeTab === "overview" && (
            <OverviewView
              posts={currentPosts}
              accounts={accounts}
              campaigns={campaigns}
              alerts={alerts}
              onOpenSimulation={() => setIsSimulationOpen(true)}
              onNavigate={handleNavigate}
              onSelectAccount={(username) => setSelectedAccountUsername(username)}
              onAnalyzePost={handleAnalyzePost}
            />
          )}

          {activeTab === "social-analytics" && (
            <SocialAnalyticsView
              posts={currentPosts}
              accounts={accounts}
              onSelectAccount={(username) => setSelectedAccountUsername(username)}
              onAnalyzePost={handleAnalyzePost}
            />
          )}

          {activeTab === "post-analyzer" && (
            <PostAnalyzerView initialPost={selectedPostForAnalysis} />
          )}

          {activeTab === "trends" && (
            <TrendsView
              posts={currentPosts}
              onSelectTopic={(topic) => {
                setActiveTab("social-analytics");
              }}
            />
          )}

          {activeTab === "audience" && (
            <AudienceView
              accounts={accounts}
              posts={currentPosts}
              onSelectAccount={(username) => setSelectedAccountUsername(username)}
            />
          )}

          {activeTab === "campaigns" && (
            <CampaignIntelligenceView
              campaigns={campaigns}
              accounts={accounts}
              posts={currentPosts}
              selectedCampaignId={selectedCampaignId}
              onSelectCampaign={(id) => setSelectedCampaignId(id)}
              onNavigateToNetwork={(cid) => {
                if (cid) setSelectedCampaignId(cid);
                setActiveTab("network");
              }}
              onSelectAccount={(username) => setSelectedAccountUsername(username)}
            />
          )}

          {activeTab === "network" && (
            <NetworkIntelligenceView
              campaigns={campaigns}
              accounts={accounts}
              posts={currentPosts}
              selectedCampaignId={selectedCampaignId}
              onSelectAccount={(username) => setSelectedAccountUsername(username)}
              onSelectCampaign={(id) => {
                setSelectedCampaignId(id);
                setActiveTab("campaigns");
              }}
            />
          )}

          {activeTab === "cyber-safety" && (
            <CyberSafetyView
              posts={currentPosts}
              onAnalyzePost={handleAnalyzePost}
            />
          )}

          {activeTab === "threat-center" && (
            <ThreatCenterView
              alerts={alerts}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === "settings" && (
            <SettingsView onResetData={handleResetData} />
          )}
        </main>
      </div>

      {/* Account Intelligence Dossier Drawer */}
      <AccountIntelligenceDrawer
        account={selectedAccount}
        posts={allPosts}
        isOpen={!!selectedAccountUsername}
        onClose={() => setSelectedAccountUsername(null)}
        onSelectCampaign={(cid) => {
          setSelectedCampaignId(cid);
          setActiveTab("campaigns");
        }}
      />

      {/* Centerpiece Threat Simulation Modal */}
      <ThreatSimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        onCompleteSimulation={handleCompleteSimulation}
        onInvestigateCampaign={() => {
          setSelectedCampaignId("CAMP-2026-042");
          setActiveTab("campaigns");
        }}
      />

      {/* CSV Dataset Import Modal */}
      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImportSuccess={handleImportSuccess}
        onResetToDemo={handleResetData}
      />
    </div>
  );
}
