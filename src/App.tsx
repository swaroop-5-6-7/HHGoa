import { useState, useEffect } from 'react';
import type { 
  RiskAssessment, 
  RegisterItem, 
  RiskCategory, 
  RiskStatus, 
  DetectedRisk 
} from './types/risk';
import { 
  initializeStorageIfEmpty, 
  getStoredAssessments, 
  saveStoredAssessment, 
  getStoredRegisterItems, 
  saveStoredRegisterItem, 
  updateRegisterItemStatus, 
  deleteStoredRegisterItem, 
  resetStorageToDemo 
} from './storage/localStorage';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { AssessmentView } from './components/Assessment/AssessmentView';
import { RiskRegisterView } from './components/RiskRegister/RiskRegisterView';
import { EngineDocsView } from './components/EngineDocs/EngineDocsView';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assess' | 'register' | 'engine'>('dashboard');
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [registerItems, setRegisterItems] = useState<RegisterItem[]>([]);
  const [categoryFilterForRegister, setCategoryFilterForRegister] = useState<RiskCategory | 'all'>('all');
  const [selectedAssessmentForView, setSelectedAssessmentForView] = useState<RiskAssessment | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and load from local storage
  useEffect(() => {
    initializeStorageIfEmpty();
    setAssessments(getStoredAssessments());
    setRegisterItems(getStoredRegisterItems());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Handlers for assessments
  const handleSaveAssessment = (newAssessment: RiskAssessment) => {
    saveStoredAssessment(newAssessment);
    const updated = getStoredAssessments();
    setAssessments(updated);

    // Auto-sync detected risks into register if they aren't already there
    let newlyAddedCount = 0;
    const currentReg = getStoredRegisterItems();
    
    newAssessment.risks.forEach((risk) => {
      const exists = currentReg.some(
        item => item.detectedPhrase.toLowerCase() === risk.detectedPhrase.toLowerCase() ||
                item.title.toLowerCase() === risk.title.toLowerCase()
      );
      if (!exists) {
        const regItem: RegisterItem = {
          id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: risk.title,
          category: risk.category,
          severity: risk.severity,
          status: 'open',
          detectedPhrase: risk.detectedPhrase,
          whyItMatters: risk.whyItMatters,
          recommendedAction: risk.recommendedAction,
          dateIdentified: Date.now(),
          lastUpdated: Date.now(),
          assessmentId: newAssessment.id
        };
        saveStoredRegisterItem(regItem);
        newlyAddedCount++;
      }
    });

    setRegisterItems(getStoredRegisterItems());

    if (newlyAddedCount > 0) {
      showToast(`Assessed & synced ${newlyAddedCount} new risks to Register.`);
    } else {
      showToast('Assessment completed.');
    }
  };

  // Add individual risk to register manually from assessment view
  const handleAddRiskToRegister = (risk: DetectedRisk) => {
    const regItem: RegisterItem = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: risk.title,
      category: risk.category,
      severity: risk.severity,
      status: 'open',
      detectedPhrase: risk.detectedPhrase,
      whyItMatters: risk.whyItMatters,
      recommendedAction: risk.recommendedAction,
      dateIdentified: Date.now(),
      lastUpdated: Date.now(),
      assessmentId: risk.id
    };

    saveStoredRegisterItem(regItem);
    setRegisterItems(getStoredRegisterItems());
    showToast(`Added "${risk.title}" to Risk Register.`);
  };

  // Add custom manual risk
  const handleAddCustomRisk = (item: RegisterItem) => {
    saveStoredRegisterItem(item);
    setRegisterItems(getStoredRegisterItems());
    showToast(`Logged custom risk: "${item.title}".`);
  };

  // Update status of a register item
  const handleUpdateStatus = (id: string, status: RiskStatus) => {
    updateRegisterItemStatus(id, status);
    setRegisterItems(getStoredRegisterItems());
    showToast(`Risk status updated to ${status}.`);
  };

  // Delete a register item
  const handleDeleteRegisterItem = (id: string) => {
    deleteStoredRegisterItem(id);
    setRegisterItems(getStoredRegisterItems());
    showToast('Risk item removed from register.');
  };

  // Save notes
  const handleSaveNotes = (id: string, notes: string) => {
    const item = registerItems.find(i => i.id === id);
    if (item) {
      const updated = { ...item, notes, lastUpdated: Date.now() };
      saveStoredRegisterItem(updated);
      setRegisterItems(getStoredRegisterItems());
      showToast('Mitigation notes saved.');
    }
  };

  // Reset to initial demo state
  const handleResetDemo = () => {
    if (window.confirm('Reset all assessment history and risks back to standard starter demo state?')) {
      resetStorageToDemo();
      setAssessments(getStoredAssessments());
      setRegisterItems(getStoredRegisterItems());
      setSelectedAssessmentForView(null);
      showToast('Demo data restored successfully.');
    }
  };

  // Export all data to JSON
  const handleExportData = () => {
    const backup = {
      product: 'RiskLens',
      exportedAt: new Date().toISOString(),
      assessments,
      registerItems
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `risklens-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported RiskLens data to JSON.');
  };

  // Category navigation from Dashboard to Register
  const handleNavigateToRegisterWithCategory = (category?: RiskCategory) => {
    setCategoryFilterForRegister(category || 'all');
    setActiveTab('register');
  };

  // Select assessment to view/re-analyze
  const handleSelectRecentAssessment = (assessment: RiskAssessment) => {
    setSelectedAssessmentForView(assessment);
    setActiveTab('assess');
  };

  // Open risk counter for navigation pill
  const openRiskCount = registerItems.filter(i => i.status === 'open').length;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'register') {
            setCategoryFilterForRegister('all');
          }
        }}
        openRiskCount={openRiskCount}
        onResetDemo={handleResetDemo}
        onExportData={handleExportData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
          <DashboardView
            assessments={assessments}
            registerItems={registerItems}
            onNavigateToAssess={() => {
              setSelectedAssessmentForView(null);
              setActiveTab('assess');
            }}
            onNavigateToRegister={handleNavigateToRegisterWithCategory}
            onSelectAssessment={handleSelectRecentAssessment}
            onUpdateRegisterStatus={(id, st) => handleUpdateStatus(id, st)}
          />
        )}

        {activeTab === 'assess' && (
          <AssessmentView
            existingRegisterItems={registerItems}
            onSaveAssessment={handleSaveAssessment}
            onAddToRegister={handleAddRiskToRegister}
            onNavigateToRegister={() => setActiveTab('register')}
            initialAssessment={selectedAssessmentForView}
          />
        )}

        {activeTab === 'register' && (
          <RiskRegisterView
            items={registerItems}
            onAddItem={handleAddCustomRisk}
            onUpdateStatus={handleUpdateStatus}
            onDeleteItem={handleDeleteRegisterItem}
            onSaveNotes={handleSaveNotes}
            initialCategoryFilter={categoryFilterForRegister}
          />
        )}

        {activeTab === 'engine' && (
          <EngineDocsView />
        )}

      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-sky-500/40 text-slate-100 text-xs shadow-xl shadow-black/50 animate-fadeIn font-medium">
          <CheckCircle2 className="w-4 h-4 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#060910] py-6 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">RiskLens</span>
            <span>—</span>
            <span>Local-first risk intelligence for startup founders. Zero external AI dependencies.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Client-Side Execution</span>
            <span>•</span>
            <span>Storage: LocalStorage</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
