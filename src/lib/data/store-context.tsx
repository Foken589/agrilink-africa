'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  Farm,
  FarmUnit,
  LivestockBatch,
  LivestockMovement,
  MortalityRecord,
  FeedType,
  FeedInventory,
  FeedLog,
  TreatmentRecord,
  FarmTask,
  ActivityLog,
  ActivityEvidence,
  ProduceListing,
  RFQ,
  Quote,
  Order,
  OrderState,
  Transporter,
  DeliveryJob,
  Cooperative,
  CooperativeMember,
  Dispute,
  MarketPriceRecord,
  FarmAlert,
  ReviewStatus,
} from '@/types';
import {
  MOCK_USERS,
  INITIAL_FARMS,
  INITIAL_FARM_UNITS,
  INITIAL_LIVESTOCK_BATCHES,
  INITIAL_LIVESTOCK_MOVEMENTS,
  INITIAL_MORTALITY_RECORDS,
  INITIAL_FEED_TYPES,
  INITIAL_FEED_INVENTORY,
  INITIAL_FEED_LOGS,
  INITIAL_TREATMENT_RECORDS,
  INITIAL_TASKS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_PRODUCE_LISTINGS,
  INITIAL_RFQS,
  INITIAL_QUOTES,
  INITIAL_ORDERS,
  INITIAL_TRANSPORTERS,
  INITIAL_DELIVERY_JOBS,
  INITIAL_COOPERATIVES,
  INITIAL_COOPERATIVE_MEMBERS,
  INITIAL_DISPUTES,
  INITIAL_MARKET_PRICES,
  INITIAL_ALERTS,
} from './mock-store';
import { validateProposedMovement } from '../services/stock-calculator';

interface StoreContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  switchUser: (userId: string) => void;

  farms: Farm[];
  addFarm: (farm: Omit<Farm, 'id' | 'createdAt'>) => Farm;

  farmUnits: FarmUnit[];
  addFarmUnit: (unit: Omit<FarmUnit, 'id' | 'createdAt'>) => FarmUnit;

  livestockBatches: LivestockBatch[];
  addLivestockBatch: (batch: Omit<LivestockBatch, 'id' | 'createdAt'>) => LivestockBatch;

  livestockMovements: LivestockMovement[];
  recordStockMovement: (
    batchId: string,
    movementType: LivestockMovement['movementType'],
    quantity: number,
    notes?: string,
    referenceId?: string
  ) => { success: boolean; error?: string };

  mortalityRecords: MortalityRecord[];
  recordMortality: (
    batchId: string,
    unitId: string,
    numberDead: number,
    suspectedCause: string,
    handlingMethod: string,
    notes?: string,
    evidencePhotoUrl?: string
  ) => { success: boolean; error?: string };

  feedTypes: FeedType[];
  feedInventory: FeedInventory[];
  feedLogs: FeedLog[];
  recordFeedLog: (log: Omit<FeedLog, 'id' | 'timeRecorded'>) => void;

  treatmentRecords: TreatmentRecord[];
  recordTreatment: (treatment: Omit<TreatmentRecord, 'id' | 'createdAt'>) => void;

  tasks: FarmTask[];
  addTask: (task: Omit<FarmTask, 'id' | 'createdAt' | 'status'>) => FarmTask;
  updateTaskStatus: (taskId: string, status: FarmTask['status']) => void;

  activityLogs: ActivityLog[];
  submitActivityReport: (
    taskId: string | undefined,
    farmId: string,
    unitId: string | undefined,
    taskTitle: string,
    description: string,
    quantityCompleted: number,
    unitOfMeasure: string,
    issueFlag: boolean,
    issueDetails: string | undefined,
    photoUrl?: string
  ) => ActivityLog;

  reviewActivityReport: (
    logId: string,
    action: ReviewStatus,
    feedbackNotes?: string
  ) => void;

  produceListings: ProduceListing[];
  addProduceListing: (listing: Omit<ProduceListing, 'id' | 'createdAt'>) => ProduceListing;

  rfqs: RFQ[];
  createRFQ: (rfq: Omit<RFQ, 'id' | 'createdAt' | 'quotesCount' | 'status'>) => RFQ;

  quotes: Quote[];
  submitQuote: (quote: Omit<Quote, 'id' | 'createdAt' | 'status'>) => Quote;

  orders: Order[];
  advanceOrderState: (
    orderId: string,
    nextState: OrderState,
    notes?: string
  ) => { success: boolean; error?: string };

  transporters: Transporter[];
  deliveryJobs: DeliveryJob[];
  updateDeliveryJobStatus: (jobId: string, status: DeliveryJob['dispatchStatus']) => void;

  cooperatives: Cooperative[];
  cooperativeMembers: CooperativeMember[];
  addCooperativeMember: (member: Omit<CooperativeMember, 'id' | 'joinDate'>) => void;

  disputes: Dispute[];
  marketPrices: MarketPriceRecord[];
  addMarketPrice: (price: Omit<MarketPriceRecord, 'id'>) => void;

  alerts: FarmAlert[];
  dismissAlert: (alertId: string) => void;

  resetToDemoData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'agrilink_storage_v1_';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]);
  const [farms, setFarms] = useState<Farm[]>(INITIAL_FARMS);
  const [farmUnits, setFarmUnits] = useState<FarmUnit[]>(INITIAL_FARM_UNITS);
  const [livestockBatches, setLivestockBatches] = useState<LivestockBatch[]>(INITIAL_LIVESTOCK_BATCHES);
  const [livestockMovements, setLivestockMovements] = useState<LivestockMovement[]>(INITIAL_LIVESTOCK_MOVEMENTS);
  const [mortalityRecords, setMortalityRecords] = useState<MortalityRecord[]>(INITIAL_MORTALITY_RECORDS);
  const [feedTypes] = useState<FeedType[]>(INITIAL_FEED_TYPES);
  const [feedInventory, setFeedInventory] = useState<FeedInventory[]>(INITIAL_FEED_INVENTORY);
  const [feedLogs, setFeedLogs] = useState<FeedLog[]>(INITIAL_FEED_LOGS);
  const [treatmentRecords, setTreatmentRecords] = useState<TreatmentRecord[]>(INITIAL_TREATMENT_RECORDS);
  const [tasks, setTasks] = useState<FarmTask[]>(INITIAL_TASKS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [produceListings, setProduceListings] = useState<ProduceListing[]>(INITIAL_PRODUCE_LISTINGS);
  const [rfqs, setRfqs] = useState<RFQ[]>(INITIAL_RFQS);
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [transporters] = useState<Transporter[]>(INITIAL_TRANSPORTERS);
  const [deliveryJobs, setDeliveryJobs] = useState<DeliveryJob[]>(INITIAL_DELIVERY_JOBS);
  const [cooperatives] = useState<Cooperative[]>(INITIAL_COOPERATIVES);
  const [cooperativeMembers, setCooperativeMembers] = useState<CooperativeMember[]>(INITIAL_COOPERATIVE_MEMBERS);
  const [disputes] = useState<Dispute[]>(INITIAL_DISPUTES);
  const [marketPrices, setMarketPrices] = useState<MarketPriceRecord[]>(INITIAL_MARKET_PRICES);
  const [alerts, setAlerts] = useState<FarmAlert[]>(INITIAL_ALERTS);

  // Hydrate from localStorage once on client mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
      if (savedUser) {
        const found = MOCK_USERS.find((u) => u.id === savedUser);
        if (found) setCurrentUser(found);
      }
      const savedBatches = localStorage.getItem(`${STORAGE_KEY_PREFIX}batches`);
      if (savedBatches) setLivestockBatches(JSON.parse(savedBatches));

      const savedMovements = localStorage.getItem(`${STORAGE_KEY_PREFIX}movements`);
      if (savedMovements) setLivestockMovements(JSON.parse(savedMovements));

      const savedOrders = localStorage.getItem(`${STORAGE_KEY_PREFIX}orders`);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedLogs = localStorage.getItem(`${STORAGE_KEY_PREFIX}activity_logs`);
      if (savedLogs) setActivityLogs(JSON.parse(savedLogs));
    } catch {
      // Ignore fallback in case of restricted storage
    }
  }, []);

  const switchUser = (userId: string) => {
    const found = MOCK_USERS.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, userId);
      } catch {}
    }
  };

  const addFarm = (farmData: Omit<Farm, 'id' | 'createdAt'>): Farm => {
    const newFarm: Farm = {
      ...farmData,
      id: `farm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      unitsCount: 0,
      totalLivestockCount: 0,
    };
    setFarms((prev) => [newFarm, ...prev]);
    return newFarm;
  };

  const addFarmUnit = (unitData: Omit<FarmUnit, 'id' | 'createdAt'>): FarmUnit => {
    const newUnit: FarmUnit = {
      ...unitData,
      id: `unit-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setFarmUnits((prev) => [...prev, newUnit]);

    // Update farm units count
    setFarms((prev) =>
      prev.map((f) => (f.id === unitData.farmId ? { ...f, unitsCount: (f.unitsCount || 0) + 1 } : f))
    );

    return newUnit;
  };

  const addLivestockBatch = (batchData: Omit<LivestockBatch, 'id' | 'createdAt'>): LivestockBatch => {
    const newBatch: LivestockBatch = {
      ...batchData,
      id: `batch-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setLivestockBatches((prev) => {
      const updated = [newBatch, ...prev];
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}batches`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Record initial opening stock movement
    const openingMovement: LivestockMovement = {
      id: `mvt-${Date.now()}`,
      batchId: newBatch.id,
      movementType: 'opening_stock',
      quantity: newBatch.openingQuantity,
      previousQuantity: 0,
      newQuantity: newBatch.openingQuantity,
      referenceId: `OPENING-${newBatch.batchCode}`,
      actorId: currentUser.id,
      notes: `Batch ${newBatch.batchCode} stocked at ${newBatch.acquisitionDate}`,
      createdAt: new Date().toISOString(),
    };

    setLivestockMovements((prev) => {
      const updated = [openingMovement, ...prev];
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}movements`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Update unit occupancy
    setFarmUnits((prev) =>
      prev.map((u) => (u.id === newBatch.unitId ? { ...u, currentOccupancy: newBatch.currentLiveQuantity } : u))
    );

    return newBatch;
  };

  const recordStockMovement = (
    batchId: string,
    movementType: LivestockMovement['movementType'],
    quantity: number,
    notes?: string,
    referenceId?: string
  ): { success: boolean; error?: string } => {
    const batch = livestockBatches.find((b) => b.id === batchId);
    if (!batch) {
      return { success: false, error: 'Target livestock batch not found.' };
    }

    const validation = validateProposedMovement(batch.currentLiveQuantity, movementType, quantity);
    if (!validation.isValid) {
      return { success: false, error: validation.errorMessage };
    }

    const newLiveStock = validation.newQuantity;
    const newMovement: LivestockMovement = {
      id: `mvt-${Date.now()}`,
      batchId,
      movementType,
      quantity,
      previousQuantity: batch.currentLiveQuantity,
      newQuantity: newLiveStock,
      referenceId: referenceId || `MANUAL-${Date.now()}`,
      actorId: currentUser.id,
      notes,
      createdAt: new Date().toISOString(),
    };

    setLivestockMovements((prev) => {
      const updated = [newMovement, ...prev];
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}movements`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setLivestockBatches((prev) => {
      const updated = prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              currentLiveQuantity: newLiveStock,
              biomassKg: parseFloat((newLiveStock * b.averageWeightKg).toFixed(2)),
            }
          : b
      );
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}batches`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Update unit occupancy
    setFarmUnits((prev) =>
      prev.map((u) => (u.id === batch.unitId ? { ...u, currentOccupancy: newLiveStock } : u))
    );

    return { success: true };
  };

  const recordMortality = (
    batchId: string,
    unitId: string,
    numberDead: number,
    suspectedCause: string,
    handlingMethod: string,
    notes?: string,
    evidencePhotoUrl?: string
  ): { success: boolean; error?: string } => {
    const movementResult = recordStockMovement(
      batchId,
      'mortality',
      numberDead,
      `Mortality: ${suspectedCause}. Handling: ${handlingMethod}. ${notes || ''}`
    );

    if (!movementResult.success) {
      return movementResult;
    }

    const newMortality: MortalityRecord = {
      id: `mort-${Date.now()}`,
      batchId,
      unitId,
      numberDead,
      recordedAt: new Date().toISOString(),
      suspectedCause,
      handlingMethod,
      workerId: currentUser.id,
      evidencePhotoUrl,
      notes,
      createdAt: new Date().toISOString(),
    };

    setMortalityRecords((prev) => [newMortality, ...prev]);

    // If death count is high (> 10), trigger biosecurity alert automatically
    if (numberDead >= 10) {
      const spikeAlert: FarmAlert = {
        id: `alt-${Date.now()}`,
        farmId: 'farm-sunrise-hub',
        unitId,
        severity: 'high',
        alertType: 'mortality_spike',
        title: `Mortality Alert: ${numberDead} Deaths Recorded`,
        message: `High mortality logged (${suspectedCause}). Immediate bio-security check recommended.`,
        createdAt: new Date().toISOString(),
        resolved: false,
      };
      setAlerts((prev) => [spikeAlert, ...prev]);
    }

    return { success: true };
  };

  const recordFeedLog = (logData: Omit<FeedLog, 'id' | 'timeRecorded'>) => {
    const newLog: FeedLog = {
      ...logData,
      id: `flog-${Date.now()}`,
      timeRecorded: new Date().toISOString(),
    };
    setFeedLogs((prev) => [newLog, ...prev]);

    // Deduct feed inventory
    setFeedInventory((prev) =>
      prev.map((inv) => {
        if (inv.feedTypeId === logData.feedTypeId) {
          const newKg = Math.max(0, inv.currentStockKg - logData.quantityKg);
          const newBags = parseFloat((newKg / 25).toFixed(1));
          return {
            ...inv,
            currentStockKg: newKg,
            currentStockBags: newBags,
          };
        }
        return inv;
      })
    );
  };

  const recordTreatment = (treatmentData: Omit<TreatmentRecord, 'id' | 'createdAt'>) => {
    const newTreatment: TreatmentRecord = {
      ...treatmentData,
      id: `treat-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTreatmentRecords((prev) => [newTreatment, ...prev]);
  };

  const addTask = (taskData: Omit<FarmTask, 'id' | 'createdAt' | 'status'>): FarmTask => {
    const newTask: FarmTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTaskStatus = (taskId: string, status: FarmTask['status']) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
  };

  const submitActivityReport = (
    taskId: string | undefined,
    farmId: string,
    unitId: string | undefined,
    taskTitle: string,
    description: string,
    quantityCompleted: number,
    unitOfMeasure: string,
    issueFlag: boolean,
    issueDetails: string | undefined,
    photoUrl?: string
  ): ActivityLog => {
    const evidenceList: ActivityEvidence[] = photoUrl
      ? [
          {
            id: `evi-${Date.now()}`,
            activityLogId: `act-${Date.now()}`,
            mediaType: 'photo',
            mediaUrl: photoUrl,
            fileSizeBytes: 350000,
            captureTimestamp: new Date().toISOString(),
            isTamperFlagged: false,
            uploadedAt: new Date().toISOString(),
          },
        ]
      : [];

    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      taskId,
      workerId: currentUser.id,
      workerName: currentUser.fullName,
      farmId,
      unitId,
      taskTitle,
      description,
      quantityCompleted,
      unitOfMeasure,
      timestampRecorded: new Date().toISOString(),
      issueFlag,
      issueDetails,
      reviewStatus: 'pending_review',
      evidence: evidenceList,
      createdAt: new Date().toISOString(),
    };

    setActivityLogs((prev) => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}activity_logs`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (taskId) {
      updateTaskStatus(taskId, 'completed');
    }

    return newLog;
  };

  const reviewActivityReport = (logId: string, action: ReviewStatus, feedbackNotes?: string) => {
    setActivityLogs((prev) => {
      const updated = prev.map((log) =>
        log.id === logId
          ? {
              ...log,
              reviewStatus: action,
              supervisorFeedback: feedbackNotes,
              reviewedBy: currentUser.fullName,
              reviewedAt: new Date().toISOString(),
            }
          : log
      );
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}activity_logs`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addProduceListing = (listingData: Omit<ProduceListing, 'id' | 'createdAt'>): ProduceListing => {
    const newListing: ProduceListing = {
      ...listingData,
      id: `list-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProduceListings((prev) => [newListing, ...prev]);
    return newListing;
  };

  const createRFQ = (rfqData: Omit<RFQ, 'id' | 'createdAt' | 'quotesCount' | 'status'>): RFQ => {
    const newRfq: RFQ = {
      ...rfqData,
      id: `rfq-${Date.now()}`,
      status: 'open',
      quotesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setRfqs((prev) => [newRfq, ...prev]);
    return newRfq;
  };

  const submitQuote = (quoteData: Omit<Quote, 'id' | 'createdAt' | 'status'>): Quote => {
    const newQuote: Quote = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };
    setQuotes((prev) => [newQuote, ...prev]);

    if (quoteData.rfqId) {
      setRfqs((prev) =>
        prev.map((r) => (r.id === quoteData.rfqId ? { ...r, quotesCount: r.quotesCount + 1, status: 'quotes_received' } : r))
      );
    }

    return newQuote;
  };

  const advanceOrderState = (
    orderId: string,
    nextState: OrderState,
    notes?: string
  ): { success: boolean; error?: string } => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found.' };

    const newHistoryItem = {
      id: `h-${Date.now()}`,
      state: nextState,
      actor: currentUser.fullName,
      actorRole: currentUser.role,
      timestamp: new Date().toISOString(),
      notes,
    };

    setOrders((prev) => {
      const updated = prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            currentState: nextState,
            updatedAt: new Date().toISOString(),
            history: [...o.history, newHistoryItem],
            paymentStatus:
              nextState === 'CONFIRMED'
                ? 'escrow_funded'
                : nextState === 'COMPLETED'
                ? 'released_to_seller'
                : nextState === 'CANCELLED'
                ? 'refunded'
                : o.paymentStatus,
          };
        }
        return o;
      });
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}orders`, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    return { success: true };
  };

  const updateDeliveryJobStatus = (jobId: string, status: DeliveryJob['dispatchStatus']) => {
    setDeliveryJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, dispatchStatus: status } : j)));
  };

  const addCooperativeMember = (memberData: Omit<CooperativeMember, 'id' | 'joinDate'>) => {
    const newMember: CooperativeMember = {
      ...memberData,
      id: `mem-${Date.now()}`,
      joinDate: new Date().toISOString().split('T')[0],
    };
    setCooperativeMembers((prev) => [...prev, newMember]);
  };

  const addMarketPrice = (priceData: Omit<MarketPriceRecord, 'id'>) => {
    const newPrice: MarketPriceRecord = {
      ...priceData,
      id: `prc-${Date.now()}`,
    };
    setMarketPrices((prev) => [newPrice, ...prev]);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a)));
  };

  const resetToDemoData = () => {
    setFarms(INITIAL_FARMS);
    setFarmUnits(INITIAL_FARM_UNITS);
    setLivestockBatches(INITIAL_LIVESTOCK_BATCHES);
    setLivestockMovements(INITIAL_LIVESTOCK_MOVEMENTS);
    setMortalityRecords(INITIAL_MORTALITY_RECORDS);
    setFeedInventory(INITIAL_FEED_INVENTORY);
    setFeedLogs(INITIAL_FEED_LOGS);
    setTreatmentRecords(INITIAL_TREATMENT_RECORDS);
    setTasks(INITIAL_TASKS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setProduceListings(INITIAL_PRODUCE_LISTINGS);
    setRfqs(INITIAL_RFQS);
    setQuotes(INITIAL_QUOTES);
    setOrders(INITIAL_ORDERS);
    setDeliveryJobs(INITIAL_DELIVERY_JOBS);
    setCooperativeMembers(INITIAL_COOPERATIVE_MEMBERS);
    setMarketPrices(INITIAL_MARKET_PRICES);
    setAlerts(INITIAL_ALERTS);

    try {
      localStorage.clear();
    } catch {}
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        allUsers: MOCK_USERS,
        switchUser,
        farms,
        addFarm,
        farmUnits,
        addFarmUnit,
        livestockBatches,
        addLivestockBatch,
        livestockMovements,
        recordStockMovement,
        mortalityRecords,
        recordMortality,
        feedTypes,
        feedInventory,
        feedLogs,
        recordFeedLog,
        treatmentRecords,
        recordTreatment,
        tasks,
        addTask,
        updateTaskStatus,
        activityLogs,
        submitActivityReport,
        reviewActivityReport,
        produceListings,
        addProduceListing,
        rfqs,
        createRFQ,
        quotes,
        submitQuote,
        orders,
        advanceOrderState,
        transporters,
        deliveryJobs,
        updateDeliveryJobStatus,
        cooperatives,
        cooperativeMembers,
        addCooperativeMember,
        disputes,
        marketPrices,
        addMarketPrice,
        alerts,
        dismissAlert,
        resetToDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
