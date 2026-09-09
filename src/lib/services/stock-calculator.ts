// AgriLink Africa - Livestock Stock Ledger & Metric Calculator

import { LivestockBatch, LivestockMovement, LivestockMovementType } from '@/types';

export interface StockCalculationResult {
  batchId: string;
  calculatedLiveQuantity: number;
  recordedLiveQuantity: number;
  hasDiscrepancy: boolean;
  totalMortality: number;
  mortalityRatePct: number;
  totalAdditions: number;
  totalBirths: number;
  totalSales: number;
  totalCulls: number;
  totalTransfersIn: number;
  totalTransfersOut: number;
}

/**
 * Strictly computes batch live stock based on movements:
 * Opening + Additions + Births + TransfersIn - Sales - Mortality - Culls - TransfersOut
 */
export function calculateBatchStockFromMovements(
  batch: LivestockBatch,
  movements: LivestockMovement[]
): StockCalculationResult {
  const batchMovements = movements.filter((m) => m.batchId === batch.id);

  let totalAdditions = 0;
  let totalBirths = 0;
  let totalTransfersIn = 0;
  let totalSales = 0;
  let totalMortality = 0;
  let totalCulls = 0;
  let totalTransfersOut = 0;

  for (const m of batchMovements) {
    switch (m.movementType) {
      case 'addition_purchase':
        totalAdditions += m.quantity;
        break;
      case 'birth_hatch_stocking':
        totalBirths += m.quantity;
        break;
      case 'transfer_in':
        totalTransfersIn += m.quantity;
        break;
      case 'sale':
        totalSales += m.quantity;
        break;
      case 'mortality':
        totalMortality += m.quantity;
        break;
      case 'culling':
        totalCulls += m.quantity;
        break;
      case 'transfer_out':
        totalTransfersOut += m.quantity;
        break;
      case 'opening_stock':
        // Base opening is on batch.openingQuantity
        break;
    }
  }

  const calculatedLiveQuantity =
    batch.openingQuantity +
    totalAdditions +
    totalBirths +
    totalTransfersIn -
    (totalSales + totalMortality + totalCulls + totalTransfersOut);

  const baseline = batch.openingQuantity + totalAdditions + totalBirths;
  const mortalityRatePct = baseline > 0 ? (totalMortality / baseline) * 100 : 0;

  return {
    batchId: batch.id,
    calculatedLiveQuantity: Math.max(0, calculatedLiveQuantity),
    recordedLiveQuantity: batch.currentLiveQuantity,
    hasDiscrepancy: calculatedLiveQuantity !== batch.currentLiveQuantity,
    totalMortality,
    mortalityRatePct: parseFloat(mortalityRatePct.toFixed(2)),
    totalAdditions,
    totalBirths,
    totalSales,
    totalCulls,
    totalTransfersIn,
    totalTransfersOut,
  };
}

/**
 * Validates a proposed stock reduction movement.
 * Throws an error if deduction exceeds current live stock.
 */
export function validateProposedMovement(
  currentQuantity: number,
  movementType: LivestockMovementType,
  quantityToMove: number
): { isValid: boolean; newQuantity: number; errorMessage?: string } {
  if (quantityToMove <= 0) {
    return {
      isValid: false,
      newQuantity: currentQuantity,
      errorMessage: 'Quantity must be a positive number greater than 0.',
    };
  }

  const isDeduction = ['sale', 'mortality', 'culling', 'transfer_out'].includes(movementType);

  if (isDeduction) {
    if (quantityToMove > currentQuantity) {
      return {
        isValid: false,
        newQuantity: currentQuantity,
        errorMessage: `Cannot deduct ${quantityToMove} heads/birds. Current live stock is only ${currentQuantity}. Negative stock is strictly prohibited.`,
      };
    }
    return {
      isValid: true,
      newQuantity: currentQuantity - quantityToMove,
    };
  }

  return {
    isValid: true,
    newQuantity: currentQuantity + quantityToMove,
  };
}

/**
 * Calculates Feed Conversion Ratio (FCR): Total Feed Consumed (kg) / Total Weight Gained (kg)
 */
export function calculateFCR(totalFeedKg: number, totalBiomassGainedKg: number): number {
  if (totalBiomassGainedKg <= 0) return 0;
  return parseFloat((totalFeedKg / totalBiomassGainedKg).toFixed(2));
}
