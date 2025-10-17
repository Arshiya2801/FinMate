
import React, { useState, useEffect } from "react";
import { SplitBill, Transaction, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Plus, Users, DollarSign } from "lucide-react";
import { useAppContext } from "@/components/AppContext";

import SplitBillsHeader from "../components/splitbills/SplitBillsHeader";
import ActiveSplits from "../components/splitbills/ActiveSplits";
import CreateSplitModal from "../components/splitbills/CreateSplitModal";
import SplitBillStats from "../components/splitbills/SplitBillStats";

export default function SplitBillsPage() {
  const [splitBills, setSplitBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user: currentUser } = useAppContext(); // Get currentUser from context

  useEffect(() => {
    loadSplitBills();
  }, []); // currentUser is now from context, no need to load it here

  const loadSplitBills = async () => {
    try {
      setIsLoading(true);
      const data = await SplitBill.list("-created_date");
      setSplitBills(data);
    } catch (error) {
      console.error("Error loading split bills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSplit = async (splitData) => {
    try {
      await SplitBill.create({
        ...splitData,
        created_by: currentUser.email,
        status: 'active'
      });
      await loadSplitBills();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating split:", error);
    }
  };

  const handleSettleUp = async (splitId, settlementData) => {
    try {
      await SplitBill.update(splitId, settlementData);
      await loadSplitBills();
    } catch (error) {
      console.error("Error settling split:", error);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <SplitBillsHeader onCreateNew={() => setShowCreateModal(true)} />

      {/* Stats */}
      <SplitBillStats splitBills={splitBills} currentUser={currentUser} isLoading={isLoading} />

      {/* Active Splits */}
      <ActiveSplits 
        splitBills={splitBills} 
        currentUser={currentUser}
        isLoading={isLoading}
        onSettleUp={handleSettleUp}
        onRefresh={loadSplitBills}
      />

      {/* Create Split Modal */}
      <CreateSplitModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateSplit}
        currentUser={currentUser}
      />
    </div>
  );
}
