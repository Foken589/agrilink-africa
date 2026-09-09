// AgriLink Africa - TypeScript Domain Definitions

export type UserRole =
  | 'farmer'
  | 'livestock_farmer'
  | 'poultry_farmer'
  | 'fish_farmer'
  | 'cattle_rearer'
  | 'crop_farmer'
  | 'cooperative'
  | 'buyer'
  | 'aggregator'
  | 'transporter'
  | 'agricultural_service_provider'
  | 'worker'
  | 'admin';

export type FarmUnitType =
  | 'poultry_house'
  | 'fish_pond'
  | 'cattle_herd'
  | 'goat_sheep_pen'
  | 'piggery'
  | 'rabbitry'
  | 'apiary'
  | 'crop_field'
  | 'mixed';

export type LivestockMovementType =
  | 'opening_stock'
  | 'addition_purchase'
  | 'birth_hatch_stocking'
  | 'transfer_in'
  | 'transfer_out'
  | 'sale'
  | 'mortality'
  | 'culling';

export type FarmTaskType =
  | 'feeding'
  | 'cleaning'
  | 'watering'
  | 'vaccination'
  | 'medication'
  | 'pond_maintenance'
  | 'stocking'
  | 'harvesting'
  | 'weighing'
  | 'egg_collection'
  | 'milking'
  | 'breeding'
  | 'deworming'
  | 'equipment_maintenance'
  | 'custom';

export type ReviewStatus =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'correction_requested';

export type OrderState =
  | 'REQUESTED'
  | 'QUOTED'
  | 'ACCEPTED'
  | 'CONFIRMED'
  | 'SCHEDULED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'CANCELLED';

export type PriceSourceType =
  | 'verified_bulletin'
  | 'aggregator_receipt'
  | 'user_submitted'
  | 'estimated_model';

export type Currency = 'NGN' | 'KES' | 'GHS' | 'UGX' | 'USD';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  organizationId?: string;
  avatarUrl?: string;
  country: string;
  stateRegion: string;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  createdAt: string;
}

export interface Farm {
  id: string;
  ownerId: string;
  name: string;
  country: string;
  stateProvince: string;
  lgaDistrict: string;
  sizeHectares: number;
  primaryActivity: string;
  coordinatesLat?: number;
  coordinatesLng?: number;
  biosecurityLevel: string;
  status: 'active' | 'dormant' | 'quarantine';
  createdAt: string;
  unitsCount?: number;
  totalLivestockCount?: number;
}

export interface FarmUnit {
  id: string;
  farmId: string;
  name: string;
  unitType: FarmUnitType;
  capacity: number;
  currentOccupancy: number;
  dimensionsSpecs?: string;
  status: 'active' | 'sanitizing' | 'idle';
  createdAt: string;
}

export interface LivestockBatch {
  id: string;
  unitId: string;
  farmId: string;
  batchCode: string;
  speciesType: string;
  breedStrain: string;
  acquisitionDate: string;
  supplierName?: string;
  openingQuantity: number;
  currentLiveQuantity: number;
  ageWeeksOrMonths: string;
  averageWeightKg: number;
  biomassKg: number;
  status: 'active' | 'harvested' | 'sold' | 'depleted' | 'quarantined';
  notes?: string;
  photos: string[];
  createdAt: string;
}

export interface LivestockMovement {
  id: string;
  batchId: string;
  movementType: LivestockMovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  referenceId?: string;
  actorId?: string;
  notes?: string;
  createdAt: string;
}

export interface MortalityRecord {
  id: string;
  batchId: string;
  unitId: string;
  numberDead: number;
  recordedAt: string;
  suspectedCause: string;
  handlingMethod: string;
  workerId?: string;
  evidencePhotoUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface FeedType {
  id: string;
  name: string;
  category: string;
  manufacturer?: string;
  proteinPercentage?: number;
  standardBagKg: number;
  unitCost: number;
  notes?: string;
}

export interface FeedInventory {
  id: string;
  farmId: string;
  feedTypeId: string;
  feedTypeName: string;
  currentStockBags: number;
  currentStockKg: number;
  lowStockThresholdKg: number;
  storageLocation?: string;
  expiryDate?: string;
  lastRestockedAt: string;
}

export interface FeedLog {
  id: string;
  unitId: string;
  batchId: string;
  feedTypeId: string;
  quantityKg: number;
  feedingSession: 'morning' | 'afternoon' | 'evening' | 'night';
  timeRecorded: string;
  workerId?: string;
  photoUrl?: string;
  notes?: string;
}

export interface TreatmentRecord {
  id: string;
  unitId: string;
  batchId: string;
  treatmentType: 'vaccine' | 'antibiotic' | 'dewormer' | 'vitamin' | 'water_treatment';
  drugName: string;
  dosage: string;
  administrationRoute: string;
  administeredBy?: string;
  withdrawalPeriodDays: number;
  withdrawalEndDate?: string;
  notes?: string;
  createdAt: string;
}

export interface FarmTask {
  id: string;
  farmId: string;
  unitId?: string;
  unitName?: string;
  title: string;
  description?: string;
  taskType: FarmTaskType;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  createdBy?: string;
  createdAt: string;
}

export interface WorkerAssignment {
  id: string;
  farmId: string;
  workerId: string;
  workerName: string;
  unitIds: string[];
  roleTitle: string;
  isActive: boolean;
  assignedAt: string;
}

export interface ActivityLog {
  id: string;
  taskId?: string;
  workerId: string;
  workerName: string;
  farmId: string;
  unitId?: string;
  unitName?: string;
  taskTitle: string;
  description?: string;
  quantityCompleted?: number;
  unitOfMeasure?: string;
  timestampRecorded: string;
  issueFlag: boolean;
  issueDetails?: string;
  reviewStatus: ReviewStatus;
  evidence: ActivityEvidence[];
  supervisorFeedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface ActivityEvidence {
  id: string;
  activityLogId: string;
  mediaType: 'photo' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  fileSizeBytes?: number;
  captureTimestamp: string;
  gpsApproxLat?: number;
  gpsApproxLng?: number;
  isTamperFlagged: boolean;
  uploadedAt: string;
}

export interface ProduceListing {
  id: string;
  sellerId: string;
  sellerName: string;
  farmId?: string;
  commodityName: string;
  category: string;
  varietyBreed: string;
  quantityAvailable: number;
  unitOfMeasure: string;
  qualityGrade: string;
  unitPriceExpected: number;
  currency: Currency;
  minimumOrderQty: number;
  availabilityStatus: 'ready_now' | 'harvest_in_progress' | 'pre_order';
  approximateLocation: string; // obfuscated for public
  description?: string;
  photos: string[];
  isActive: boolean;
  verificationBadge: string;
  createdAt: string;
}

export interface RFQ {
  id: string;
  buyerId: string;
  buyerName: string;
  commodityNeeded: string;
  category: string;
  requiredQuantity: number;
  unitOfMeasure: string;
  maxBudgetUnit?: number;
  currency: Currency;
  deliveryDestination: string;
  deadlineDate: string;
  notes?: string;
  status: 'open' | 'quotes_received' | 'awarded' | 'closed';
  quotesCount: number;
  createdAt: string;
}

export interface Quote {
  id: string;
  rfqId?: string;
  listingId?: string;
  sellerId: string;
  sellerName: string;
  offeredQuantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: Currency;
  validityDate: string;
  deliveryLeadDays: number;
  notes?: string;
  status: 'submitted' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  listingId?: string;
  commodityName: string;
  currentState: OrderState;
  quantity: number;
  unitOfMeasure: string;
  subtotalAmount: number;
  logisticsAmount: number;
  platformFeeAmount: number;
  totalAmount: number;
  currency: Currency;
  paymentStatus: 'pending' | 'escrow_funded' | 'released_to_seller' | 'refunded';
  shippingAddress: string;
  authorizedPickupAddress?: string; // Revealed only when CONFIRMED
  authorizedContactPhone?: string;
  transporterName?: string;
  waybillNumber?: string;
  pickupOtp?: string;
  deliveryOtp?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  history: OrderStateHistory[];
}

export interface OrderStateHistory {
  id: string;
  state: OrderState;
  actor: string;
  actorRole: string;
  timestamp: string;
  notes?: string;
}

export interface Transporter {
  id: string;
  profileId: string;
  companyName: string;
  verifiedBadge: boolean;
  ratingAverage: number;
  totalDeliveries: number;
  activeOperatingRegions: string[];
  vehiclesCount: number;
}

export interface DeliveryJob {
  id: string;
  orderId: string;
  orderNumber: string;
  commodityName: string;
  quantity: number;
  unitOfMeasure: string;
  transporterId: string;
  transporterName: string;
  dispatchStatus: 'pending_assignment' | 'assigned' | 'arrived_at_pickup' | 'goods_loaded' | 'en_route' | 'delivered_pending_signoff' | 'confirmed';
  waybillNumber: string;
  pickupOtp: string;
  deliveryOtp: string;
  originRegion: string;
  destinationAddress: string;
  authorizedPickupDetails?: string;
  departureTime?: string;
  estimatedArrival?: string;
  completedAt?: string;
}

export interface MarketPriceRecord {
  id: string;
  commodityName: string;
  category: string;
  marketName: string;
  city: string;
  country: string;
  stateRegion: string;
  wholesalePrice: number;
  retailPrice: number;
  unitOfMeasure: string;
  currency: Currency;
  priceDate: string;
  dataSourceType: PriceSourceType;
  verificationBadge: string;
  priceTrendPct: number;
  notes?: string;
}

export interface Cooperative {
  id: string;
  name: string;
  registrationCode: string;
  country: string;
  region: string;
  memberCount: number;
  totalAcreage: number;
  collectiveListingsCount: number;
  activeBatchesCount: number;
  bankAccountName?: string;
}

export interface CooperativeMember {
  id: string;
  cooperativeId: string;
  farmerId: string;
  farmerName: string;
  membershipNumber: string;
  farmSizeAcres: number;
  cropsOrLivestock: string;
  joinDate: string;
  status: 'active' | 'suspended';
}

export interface Dispute {
  id: string;
  orderId: string;
  orderNumber: string;
  openedById: string;
  openedByName: string;
  respondentId: string;
  respondentName: string;
  disputeReason: string;
  claimAmount: number;
  currency: Currency;
  status: 'opened' | 'under_investigation' | 'evidence_requested' | 'arbitration_scheduled' | 'resolved_refund' | 'resolved_release_payout' | 'dismissed';
  resolutionNotes?: string;
  evidenceAttachments: string[];
  createdAt: string;
  resolvedAt?: string;
}

export interface FarmAlert {
  id: string;
  farmId: string;
  unitId?: string;
  unitName?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  alertType:
    | 'mortality_spike'
    | 'unusual_feed_consumption'
    | 'overdue_task'
    | 'unreviewed_evidence'
    | 'expiring_treatment'
    | 'low_feed_inventory'
    | 'stock_discrepancy'
    | 'unusual_movement';
  title: string;
  message: string;
  createdAt: string;
  resolved: boolean;
}
