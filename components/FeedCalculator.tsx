import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Pencil, Trash2 } from 'lucide-react'; // Import Lucide icons

// Define Firebase config and app ID using global variables provided by the environment
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase (will be done once in the App component's useEffect)
let firebaseApp;
let db;
let auth;

// Data for livestock nutritional needs and materials
const livestockNeeds: Record<string, any> = {
  "broiler_starter": {
    name: "دجاج لاحم - بادئ (0-14 يوم)",
    targets: {
      protein: { min: 22, max: 24, unit: "%" },
      energy: { min: 3000, max: 3100, unit: "كيلو كالوري/كجم" },
      calcium: { min: 0.9, max: 1.1, unit: "%" },
      phosphorus: { min: 0.45, max: 0.55, unit: "%" },
      lysine: { min: 1.3, max: 1.4, unit: "%" },
      methionine: { min: 0.5, max: 0.6, unit: "%" },
    },
    critical: ["protein", "energy", "calcium", "phosphorus", "lysine", "methionine"]
  },
  "broiler_grower": {
    name: "دجاج لاحم - نامي (15-28 يوم)",
    targets: {
      protein: { min: 20, max: 22, unit: "%" },
      energy: { min: 3100, max: 3200, unit: "كيلو كالوري/كجم" },
      calcium: { min: 0.85, max: 1.0, unit: "%" },
      phosphorus: { min: 0.4, max: 0.5, unit: "%" },
      lysine: { min: 1.15, max: 1.25, unit: "%" },
      methionine: { min: 0.45, max: 0.55, unit: "%" },
    },
    critical: ["protein", "energy", "calcium", "phosphorus", "lysine", "methionine"]
  },
  "broiler_finisher": {
    name: "دجاج لاحم - ناهي (29+ يوم)",
    targets: {
      protein: { min: 18, max: 20, unit: "%" },
      energy: { min: 3150, max: 3250, unit: "كيلو كالوري/كجم" },
      calcium: { min: 0.8, max: 0.9, unit: "%" },
      phosphorus: { min: 0.4, max: 0.5, unit: "%" },
      lysine: { min: 1.0, max: 1.1, unit: "%" },
      methionine: { min: 0.4, max: 0.5, unit: "%" },
    },
    critical: ["protein", "energy", "calcium", "phosphorus", "lysine", "methionine"]
  },
  "layer_pullets": {
    name: "بدارى بياض (نمو)",
    targets: {
      protein: { min: 15, max: 17, unit: "%" },
      energy: { min: 2750, max: 2850, unit: "كيلو كالوري/كجم" },
      calcium: { min: 1.0, max: 1.2, unit: "%" },
      phosphorus: { min: 0.4, max: 0.5, unit: "%" },
      lysine: { min: 0.7, max: 0.8, unit: "%" },
      methionine: { min: 0.3, max: 0.4, unit: "%" },
    },
    critical: ["protein", "energy", "calcium", "phosphorus"]
  },
  "layer_production": {
    name: "دجاج بياض (إنتاج)",
    targets: {
      protein: { min: 16, max: 18, unit: "%" },
      energy: { min: 2800, max: 2900, unit: "كيلو كالوري/كجم" },
      calcium: { min: 3.5, max: 4.2, unit: "%" },
      phosphorus: { min: 0.35, max: 0.45, unit: "%" },
      lysine: { min: 0.8, max: 0.9, unit: "%" },
      methionine: { min: 0.35, max: 0.45, unit: "%" },
    },
    critical: ["protein", "energy", "calcium", "phosphorus", "lysine", "methionine"]
  },
  "sheep_maintenance": {
    name: "أغنام (حفظ/تربية)",
    targets: {
      protein: { min: 9, max: 11, unit: "%" },
      energy: { min: 2000, max: 2200, unit: "كيلو كالوري/كجم" },
      fiber: { min: 20, max: 28, unit: "%" },
      calcium: { min: 0.4, max: 0.6, unit: "%" },
      phosphorus: { min: 0.2, max: 0.3, unit: "%" },
    },
    critical: ["protein", "energy", "fiber", "calcium", "phosphorus"]
  },
  "sheep_fattening": {
    name: "أغنام (تسمين)",
    targets: {
      protein: { min: 13, max: 15, unit: "%" },
      energy: { min: 2500, max: 2700, unit: "كيلو كالوري/كجم" },
      fiber: { min: 16, max: 22, unit: "%" },
      calcium: { min: 0.6, max: 0.8, unit: "%" },
      phosphorus: { min: 0.3, max: 0.4, unit: "%" },
    },
    critical: ["protein", "energy", "fiber", "calcium", "phosphorus"]
  }
};

const predefinedMaterialsData = [
  {
    id: "corn",
    name: "ذرة",
    type: "raw",
    nutrients: { protein: 0.08, energy: 3400, fiber: 0.02, calcium: 0.0002, phosphorus: 0.0028, lysine: 0.0025, methionine: 0.0018 }, // per kg
    quality: "good",
    pricePerKg: 1.5,
    maxInclusion: 0.65 // 65% max
  },
  {
    id: "barley",
    name: "شعير",
    type: "raw",
    nutrients: { protein: 0.11, energy: 3000, fiber: 0.05, calcium: 0.0005, phosphorus: 0.0035, lysine: 0.004, methionine: 0.002 },
    quality: "good",
    pricePerKg: 1.3,
    maxInclusion: 0.40
  },
  {
    id: "soybean_meal",
    name: "كسبة فول الصويا",
    type: "raw",
    nutrients: { protein: 0.44, energy: 2500, fiber: 0.06, calcium: 0.0025, phosphorus: 0.006, lysine: 0.027, methionine: 0.006 },
    quality: "excellent",
    pricePerKg: 2.8,
    maxInclusion: 0.35
  },
  {
    id: "wheat_bran",
    name: "نخالة القمح",
    type: "raw",
    nutrients: { protein: 0.15, energy: 1800, fiber: 0.1, calcium: 0.001, phosphorus: 0.01, lysine: 0.006, methionine: 0.002 },
    quality: "moderate",
    pricePerKg: 0.9,
    maxInclusion: 0.20
  },
  {
    id: "dates_waste",
    name: "مخلفات التمور / تمر فرز",
    type: "waste",
    nutrients: { protein: 0.03, energy: 2900, fiber: 0.04, calcium: 0.001, phosphorus: 0.001, lysine: 0.0005, methionine: 0.0002 },
    quality: "good",
    pricePerKg: 0.6,
    maxInclusion: 0.15 // High sugar, can cause laxative effects if too high
  },
  {
    id: "date_pits",
    name: "نوى التمر المطحون",
    type: "waste",
    nutrients: { protein: 0.06, energy: 1600, fiber: 0.18, calcium: 0.002, phosphorus: 0.001, lysine: 0.002, methionine: 0.001 },
    quality: "moderate",
    pricePerKg: 0.4,
    maxInclusion: 0.10 // Good for sheep, limit for poultry
  },
  {
    id: "rhodes_grass",
    name: "حشيشة الرودس",
    type: "raw",
    nutrients: { protein: 0.09, energy: 1800, fiber: 0.32, calcium: 0.004, phosphorus: 0.0015, lysine: 0.003, methionine: 0.001 },
    quality: "moderate",
    pricePerKg: 0.8,
    maxInclusion: 0.60 // Ruminants mostly
  },
  {
    id: "alfalfa_hay",
    name: "دريس البرسيم",
    type: "raw",
    nutrients: { protein: 0.18, energy: 2000, fiber: 0.28, calcium: 0.012, phosphorus: 0.002, lysine: 0.008, methionine: 0.002 },
    quality: "moderate",
    pricePerKg: 1.1,
    maxInclusion: 0.50
  },
  {
    id: "fish_meal",
    name: "مسحوق السمك",
    type: "raw",
    nutrients: { protein: 0.60, energy: 2800, fiber: 0.01, calcium: 0.04, phosphorus: 0.02, lysine: 0.04, methionine: 0.015 },
    quality: "excellent",
    pricePerKg: 4.5,
    maxInclusion: 0.05 // Prevents fishy taste in meat/eggs
  },
  {
    id: "bone_meal",
    name: "مسحوق عظم",
    type: "raw",
    nutrients: { protein: 0.05, energy: 500, fiber: 0.0, calcium: 0.25, phosphorus: 0.12, lysine: 0.002, methionine: 0.0005 },
    quality: "low",
    pricePerKg: 1.8,
    maxInclusion: 0.05
  },
  {
    id: "calcium_carbonate",
    name: "كربونات الكالسيوم (حجر جيري)",
    type: "raw",
    nutrients: { protein: 0.0, energy: 0, fiber: 0.0, calcium: 0.38, phosphorus: 0.0, lysine: 0.0, methionine: 0.0 },
    quality: "low",
    pricePerKg: 0.7,
    maxInclusion: 0.10
  },
  {
    id: "premix",
    name: "بريمكس فيتامينات ومعادن",
    type: "raw",
    nutrients: { protein: 0.0, energy: 0, fiber: 0.0, calcium: 0.10, phosphorus: 0.05, lysine: 0.05, methionine: 0.05 }, // Concentrated
    quality: "excellent",
    pricePerKg: 15.0,
    maxInclusion: 0.02 // Standard 1-2% inclusion
  },
  {
    id: "dried_bread",
    name: "خبز مجفف",
    type: "waste",
    nutrients: { protein: 0.09, energy: 3000, fiber: 0.02, calcium: 0.0005, phosphorus: 0.0015, lysine: 0.003, methionine: 0.001 },
    quality: "good",
    pricePerKg: 0.5,
    maxInclusion: 0.20 // High salt potential
  },
  {
    id: "vegetable_waste",
    name: "مخلفات خضروات",
    type: "waste",
    nutrients: { protein: 0.02, energy: 800, fiber: 0.15, calcium: 0.005, phosphorus: 0.001, lysine: 0.001, methionine: 0.0005 },
    quality: "low",
    pricePerKg: 0.2,
    maxInclusion: 0.10 // High moisture content
  },
  {
    id: "fruit_peels",
    name: "قشور الفاكهة",
    type: "waste",
    nutrients: { protein: 0.01, energy: 1200, fiber: 0.1, calcium: 0.002, phosphorus: 0.0005, lysine: 0.0005, methionine: 0.0002 },
    quality: "low",
    pricePerKg: 0.1,
    maxInclusion: 0.10
  },
  {
    id: "molasses",
    name: "دبس",
    type: "raw",
    nutrients: { protein: 0.03, energy: 2800, fiber: 0.0, calcium: 0.008, phosphorus: 0.0005, lysine: 0.001, methionine: 0.0005 },
    quality: "good",
    pricePerKg: 0.8,
    maxInclusion: 0.05 // Laxative if too high
  },
  {
    id: "sunflower_meal",
    name: "كسبة عباد الشمس",
    type: "raw",
    nutrients: { protein: 0.35, energy: 2200, fiber: 0.12, calcium: 0.003, phosphorus: 0.009, lysine: 0.012, methionine: 0.005 },
    quality: "excellent",
    pricePerKg: 2.5,
    maxInclusion: 0.15
  },
  {
    id: "meat_bone_meal",
    name: "مسحوق اللحم والعظم",
    type: "raw",
    nutrients: { protein: 0.50, energy: 2600, fiber: 0.01, calcium: 0.08, phosphorus: 0.04, lysine: 0.03, methionine: 0.008 },
    quality: "excellent",
    pricePerKg: 3.5,
    maxInclusion: 0.07
  },
  {
    id: "soy_hulls",
    name: "قشور فول الصويا",
    type: "raw",
    nutrients: { protein: 0.12, energy: 1800, fiber: 0.35, calcium: 0.002, phosphorus: 0.001, lysine: 0.005, methionine: 0.001 },
    quality: "moderate",
    pricePerKg: 0.6,
    maxInclusion: 0.15
  },
  {
    id: "bakery_waste",
    name: "مخلفات المخابز الصناعية",
    type: "waste",
    nutrients: { protein: 0.10, energy: 3200, fiber: 0.03, calcium: 0.001, phosphorus: 0.002, lysine: 0.004, methionine: 0.0015 },
    quality: "good",
    pricePerKg: 0.4,
    maxInclusion: 0.25
  }
];


// Helper function to calculate total nutrients from a formula
const calculateTotalNutrients = (formula, allMaterials, bagWeightKg) => {
  const totalNutrients = {
    protein: 0, energy: 0, fiber: 0, calcium: 0, phosphorus: 0, lysine: 0, methionine: 0
  };

  Object.entries(formula).forEach(([materialId, weightKg]) => {
    const material = allMaterials.find(m => m.id === materialId);
    if (material && weightKg > 0) { // Only consider materials with positive weight
      for (const nutrient in material.nutrients) {
        if (totalNutrients.hasOwnProperty(nutrient)) {
          // Energy is per kg, others are percentages (converted to decimal for calculation)
          if (nutrient === 'energy') {
            totalNutrients[nutrient] += material.nutrients[nutrient] * weightKg;
          } else {
            totalNutrients[nutrient] += material.nutrients[nutrient] * weightKg;
          }
        }
      }
    }
  });

  // Convert total nutrient amounts back to percentages for protein, calcium, phosphorus, lysine, methionine, fiber
  // Energy remains total kcal
  const finalNutrientPercentages = {};
  if (bagWeightKg > 0) {
    for (const nutrient in totalNutrients) {
      if (nutrient === 'energy') {
        finalNutrientPercentages[nutrient] = totalNutrients[nutrient] / bagWeightKg; // kcal/kg
      } else {
        finalNutrientPercentages[nutrient] = (totalNutrients[nutrient] / bagWeightKg) * 100; // %
      }
    }
  } else {
    // If bagWeightKg is 0, all nutrients are 0
    for (const nutrient in totalNutrients) {
      finalNutrientPercentages[nutrient] = 0;
    }
  }

  return finalNutrientPercentages;
};

// Helper function to get feedback about the formula's nutrient levels
const getFormulaFeedback = (finalNutrients, targets, criticalNutrients, errorMarginFactorForFeedback, allMaterials, selectedMaterialIds, currentFormula, bagWeightKg) => {
    let perfectCount = 0;
    let suitableCount = 0;
    let totalCritical = criticalNutrients.length;
    let marginOfError = ""; // Declare variable to prevent ReferenceError
    const nutrientFeedback = [];
    const adjustmentSuggestions = [];
    const selectedIdsSet = new Set(selectedMaterialIds); // For quick lookup


    criticalNutrients.forEach(nutrient => {
        const target = targets[nutrient];
        const actual = finalNutrients[nutrient];
        const nutrientNameArabic =
            nutrient === 'protein' ? 'البروتين' :
            nutrient === 'energy' ? 'الطاقة' :
            nutrient === 'calcium' ? 'الكالسيوم' :
            nutrient === 'phosphorus' ? 'الفوسفور' :
            nutrient === 'lysine' ? 'اللايسين' :
            nutrient === 'methionine' ? 'الميثيونين' :
            nutrient === 'fiber' ? 'الألياف' :
            nutrient;
        const unit = target?.unit || '%';

        // Use the specific errorMarginFactorForFeedback for evaluation
        const minRange = target.min * (1 - errorMarginFactorForFeedback);
        const maxRange = target.max * (1 + errorMarginFactorForFeedback);

        const isWithinPerfect = (actual >= target.min && actual <= target.max);
        const isWithinAcceptableMargin = (actual >= minRange && actual <= maxRange);

        if (isWithinPerfect) {
            perfectCount++;
            nutrientFeedback.push(`${nutrientNameArabic}: ضمن النطاق المثالي (${actual.toFixed(nutrient === 'energy' ? 0 : 2)} ${unit}).`);
        } else if (isWithinAcceptableMargin) {
            suitableCount++; // Counting as suitable if within the allowed error margin
            nutrientFeedback.push(`${nutrientNameArabic}: ضمن النطاق المقبول (${actual.toFixed(nutrient === 'energy' ? 0 : 2)} ${unit}).`);
        } else {
            if (actual < minRange) {
                nutrientFeedback.push(`${nutrientNameArabic}: منخفض جدًا! (الفعلي: ${actual.toFixed(nutrient === 'energy' ? 0 : 2)} ${unit}، الهدف: ${target.min.toFixed(nutrient === 'energy' ? 0 : 1)}-${target.max.toFixed(nutrient === 'energy' ? 0 : 1)} ${unit}).`);

                // Suggestion for deficiency: find materials not currently selected
                const neededPercentagePoint = minRange - actual; // How much percentage points are needed
                let neededAmountInKgOfPureNutrient;
                if (nutrient === 'energy') {
                    neededAmountInKgOfPureNutrient = neededPercentagePoint * bagWeightKg; // kcal needed
                } else {
                    neededAmountInKgOfPureNutrient = (neededPercentagePoint / 100) * bagWeightKg; // kg of pure nutrient needed
                }

                const potentialAdditions = allMaterials
                    .filter(m => !selectedIdsSet.has(m.id)) // Not currently selected
                    .filter(m => m.nutrients[nutrient] > 0) // Must contribute to this nutrient
                    .sort((a, b) => {
                        // Sort by nutrient content per price (higher is better)
                        const valA = a.nutrients[nutrient] / (a.pricePerKg || 0.01);
                        const valB = b.nutrients[nutrient] / (b.pricePerKg || 0.01);
                        return valB - valA;
                    });

                let numSuggestions = 0;
                for (const material of potentialAdditions) {
                    if (numSuggestions >= 2) break; // Suggest up to 2 materials per deficient nutrient

                    let materialNutrientValue = material.nutrients[nutrient];
                    if (materialNutrientValue > 0) {
                        let suggestedWeight = neededAmountInKgOfPureNutrient / materialNutrientValue;
                        // Cap suggested weight to a reasonable amount, e.g., max 20% of bag weight
                        suggestedWeight = Math.max(0.1, Math.min(suggestedWeight, bagWeightKg * 0.2));

                        if (suggestedWeight > 0.1) {
                            adjustmentSuggestions.push({
                                id: `${nutrient}-${material.id}-add`,
                                text: `لزيادة ${nutrientNameArabic}: حاول إضافة حوالي ${suggestedWeight.toFixed(1)} كجم من ${material.name} (تكلفة ${material.pricePerKg.toFixed(2)} ريال/كجم).`,
                                type: 'add',
                                nutrient: nutrient,
                                materialId: material.id,
                                amount: suggestedWeight
                            });
                            numSuggestions++;
                        }
                    }
                }

            } else { // actual > maxRange
                nutrientFeedback.push(`${nutrientNameArabic}: مرتفع جدًا! (الفعلي: ${actual.toFixed(nutrient === 'energy' ? 0 : 2)} ${unit}، الهدف: ${target.min.toFixed(nutrient === 'energy' ? 0 : 1)}-${target.max.toFixed(nutrient === 'energy' ? 0 : 1)} ${unit}).`);

                // Suggestion for excess: find materials in current formula to reduce
                const excessPercentagePoint = actual - maxRange;

                const currentContributors = Object.entries(currentFormula)
                    .map(([matId, weight]) => {
                        const material = allMaterials.find(m => m.id === matId);
                        return { material, weight, contribution: material ? material.nutrients[nutrient] * weight : 0 };
                    })
                    .filter(item => item.contribution > 0)
                    .sort((a, b) => b.contribution - a.contribution);

                if (currentContributors.length > 0) {
                    const worstContributor = currentContributors[0];
                    let estimatedReduction = 0;
                    if (nutrient === 'energy') {
                        estimatedReduction = (excessPercentagePoint * bagWeightKg) / (worstContributor.material.nutrients[nutrient] || 0.001);
                    } else {
                        estimatedReduction = (excessPercentagePoint / 100) * bagWeightKg / (worstContributor.material.nutrients[nutrient] || 0.001);
                    }

                    estimatedReduction = Math.min(estimatedReduction, worstContributor.weight * 0.5);
                    estimatedReduction = Math.max(estimatedReduction, 0.1);

                    if (estimatedReduction > 0.1) {
                         adjustmentSuggestions.push({
                            id: `${nutrient}-${worstContributor.material.id}-reduce`,
                            text: `لخفض ${nutrientNameArabic}: حاول تقليل حوالي ${estimatedReduction.toFixed(1)} كجم من ${worstContributor.material.name} لكل كيس.`,
                            type: 'reduce',
                            nutrient: nutrient,
                            materialId: worstContributor.material.id,
                            amount: estimatedReduction
                        });
                    }
                }
            }
        }
    });

    if (perfectCount === totalCritical) {
      marginOfError = "مثالي";
    } else if (perfectCount + suitableCount === totalCritical) {
      marginOfError = "مناسب";
    } else {
      marginOfError = "منخفض";
    }

    return { marginOfError, nutrientFeedback, adjustmentSuggestions };
};


// Main calculation logic - now includes optimization for predefined types
const calculateFeedFormula = (selectedMaterialIds, livestockType, bagWeightKg, allMaterials, formulaType, customFormula = {}) => {
  const targets = livestockNeeds[livestockType].targets;
  const criticalNutrients = livestockNeeds[livestockType].critical;

  // If no materials selected, return an error
  if (selectedMaterialIds.length === 0) {
      return { error: "الرجاء اختيار مادة واحدة على الأقل لإنشاء التركيبة." };
  }

  // If custom formula, use it directly
  if (formulaType === 'custom') {
    const currentTotalWeight = Object.values(customFormula).reduce((sum, weight) => sum + weight, 0);
    let finalCustomFormula = {};
    if (currentTotalWeight > 0) {
      const scaleFactor = bagWeightKg / currentTotalWeight;
      for (const matId in customFormula) {
        finalCustomFormula[matId] = Math.max(0, customFormula[matId] * scaleFactor);
      }
    } else if (selectedMaterialIds.length > 0) {
        // If custom formula is empty but materials are selected, distribute evenly
        const perMaterial = bagWeightKg / selectedMaterialIds.length;
        selectedMaterialIds.forEach(mId => finalCustomFormula[mId] = perMaterial);
    } else {
        return { error: "الرجاء تحديد كميات للمواد المختارة في التركيبة المخصصة. (يجب أن يكون مجموع الكميات أكبر من صفر)" };
    }

    const finalNutrients = calculateTotalNutrients(finalCustomFormula, allMaterials, bagWeightKg);
    const estimatedCostPerBag = Object.entries(finalCustomFormula).reduce((sum, [materialId, weight]) => {
      const material = allMaterials.find(m => m.id === materialId);
      return sum + (material ? material.pricePerKg * weight : 0);
    }, 0);
    // For custom, feedback is based on 0% error margin for strictness
    // Pass currentFormula to getFormulaFeedback for suggestions
    return { formula: finalCustomFormula, finalNutrients, estimatedCostPerBag, ...getFormulaFeedback(finalNutrients, targets, criticalNutrients, 0, allMaterials, Object.keys(finalCustomFormula), finalCustomFormula, bagWeightKg) };
  }

  // Optimization for 'perfect', 'suitable', 'low' formula types
  let errorMarginFactor = 0; // Default for perfect
  if (formulaType === 'perfect') { // User requested 10% for perfect as lowest error
    errorMarginFactor = 0.10;
  } else if (formulaType === 'suitable') { // User requested 15% for suitable
    errorMarginFactor = 0.15;
  } else if (formulaType === 'low') { // User requested 20% for low
    errorMarginFactor = 0.20;
  }

  let currentFormula = {};
  let bestFormula = {};
  let bestCost = Infinity;
  let bestScore = -Infinity; // Score based on how well targets are met and cost

  const MAX_ITERATIONS = 5000; // Increased iterations for better optimization
  const ADJUSTMENT_STEP = 0.01; // Smaller adjustment for finer tuning

  // Initialize formula: distribute bagWeightKg evenly among selected materials
  const initialPerMaterialWeight = bagWeightKg / selectedMaterialIds.length;
  selectedMaterialIds.forEach(mId => {
    currentFormula[mId] = initialPerMaterialWeight;
  });

  // Helper to evaluate a formula for optimization
  const evaluateOptimizationFormula = (formulaToEvaluate) => {
    const currentNutrients = calculateTotalNutrients(formulaToEvaluate, allMaterials, bagWeightKg);
    let cost = 0;
    let inclusionPenalty = 0;

    Object.entries(formulaToEvaluate).forEach(([materialId, weight]) => {
      const material = allMaterials.find(m => m.id === materialId);
      if (material) {
        cost += material.pricePerKg * weight;
        const maxAllowedKg = (material.maxInclusion || 1.0) * bagWeightKg;
        if (weight > maxAllowedKg) {
          inclusionPenalty += (weight - maxAllowedKg) * 10000; // Massive penalty for exceeding max inclusion
        }
      }
    });

    let nutrientSatisfactionScore = 0;
    let criticalNutrientDeviation = 0; // Sum of deviations from target range
    let totalCriticalCount = criticalNutrients.length;

    criticalNutrients.forEach(nutrient => {
      const target = targets[nutrient];
      const actual = currentNutrients[nutrient];

      // Calculate the allowed min/max based on the formula's error margin
      const minTargetAllowed = target.min * (1 - errorMarginFactor);
      const maxTargetAllowed = target.max * (1 + errorMarginFactor);

      if (actual >= minTargetAllowed && actual <= maxTargetAllowed) {
        nutrientSatisfactionScore += 1; // 1 point for meeting target within allowed margin
      } else {
        // Penalize for deviation outside the allowed margin
        if (actual < minTargetAllowed) {
          criticalNutrientDeviation += (minTargetAllowed - actual);
        } else if (actual > maxTargetAllowed) {
          criticalNutrientDeviation += (actual - maxTargetAllowed);
        }
      }
    });

    // A scoring system that prioritizes meeting nutrient targets, then minimizes cost.
    // Maximize nutrientSatisfactionScore, minimize criticalNutrientDeviation, minimize cost.
    // Normalize deviation and cost to make them comparable.
    const normalizedDeviationPenalty = criticalNutrientDeviation > 0 ? (criticalNutrientDeviation / (totalCriticalCount * 10)) : 0; // Arbitrary scaling
    const costPenalty = cost / 100; // Scale cost to be comparable to nutrient score

    const overallScore = (nutrientSatisfactionScore * 100) - (normalizedDeviationPenalty * 50) - costPenalty - inclusionPenalty; // Higher is better

    return { currentNutrients, cost, overallScore, nutrientSatisfactionScore, criticalNutrientDeviation };
  };

  let { currentNutrients: initialNutrients, cost: initialCost, overallScore: initialOverallScore } = evaluateOptimizationFormula(currentFormula);
  bestFormula = { ...currentFormula };
  bestCost = initialCost;
  bestScore = initialOverallScore;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    let changedInIteration = false;
    let currentBestImprovement = -Infinity;
    let currentBestFormulaCandidate = null;

    // Try adjusting each material
    for (const materialId of selectedMaterialIds) {
      // Try increasing the material
      let formulaIncreased = { ...currentFormula };
      formulaIncreased[materialId] = (formulaIncreased[materialId] || 0) + ADJUSTMENT_STEP;
      const totalWeightIncreased = Object.values(formulaIncreased).reduce((sum, w) => sum + w, 0);
      if (totalWeightIncreased <= bagWeightKg * 1.05) { // Allow slight overshoot for normalization later
        const { overallScore: scoreIncreased } = evaluateOptimizationFormula(formulaIncreased);
        if (scoreIncreased > currentBestImprovement) {
          currentBestImprovement = scoreIncreased;
          currentBestFormulaCandidate = formulaIncreased;
        }
      }

      // Try decreasing the material
      let formulaDecreased = { ...currentFormula };
      if ((formulaDecreased[materialId] || 0) - ADJUSTMENT_STEP >= 0) {
        formulaDecreased[materialId] = (formulaDecreased[materialId] || 0) - ADJUSTMENT_STEP;
        const { overallScore: scoreDecreased } = evaluateOptimizationFormula(formulaDecreased);
        if (scoreDecreased > currentBestImprovement) {
          currentBestImprovement = scoreDecreased;
          currentBestFormulaCandidate = formulaDecreased;
        }
      }
    }

    if (currentBestFormulaCandidate && currentBestImprovement > evaluateOptimizationFormula(currentFormula).overallScore) {
      currentFormula = currentBestFormulaCandidate;
      changedInIteration = true;

      // Update best overall formula if current is better
      const { overallScore: currentOverallScore, cost: currentCost } = evaluateOptimizationFormula(currentFormula);
      if (currentOverallScore > bestScore) {
        bestScore = currentOverallScore;
        bestFormula = { ...currentFormula };
        bestCost = currentCost;
      }
    }

    if (!changedInIteration) {
      // If no improvement in this iteration, try a random jump to escape local optima
      if (i < MAX_ITERATIONS * 0.8) { // Only do random jumps for first 80% of iterations
          const randomMaterialId = selectedMaterialIds[Math.floor(Math.random() * selectedMaterialIds.length)];
          const randomChange = (Math.random() * 2 - 1) * (bagWeightKg * 0.05); // +/- 5% of bag weight
          currentFormula[randomMaterialId] = Math.max(0, (currentFormula[randomMaterialId] || 0) + randomChange);
      } else {
        break; // No improvement and not doing random jumps, so break
      }
    }
  }

  // Normalize the best found formula to exactly bagWeightKg
  let finalOptimizedFormula = {};
  const totalBestWeight = Object.values(bestFormula).reduce((sum, w) => sum + w, 0);
  if (totalBestWeight > 0) {
    const scaleFactor = bagWeightKg / totalBestWeight;
    for (const matId in bestFormula) {
      finalOptimizedFormula[matId] = Math.max(0, bestFormula[matId] * scaleFactor);
    }
  } else {
    // If no materials were assigned weight, distribute evenly as a fallback
    const perMaterial = bagWeightKg / selectedMaterialIds.length;
    selectedMaterialIds.forEach(mId => finalOptimizedFormula[mId] = perMaterial);
  }

  const finalNutrients = calculateTotalNutrients(finalOptimizedFormula, allMaterials, bagWeightKg);
  const estimatedCostPerBag = Object.entries(finalOptimizedFormula).reduce((sum, [materialId, weight]) => {
    const material = allMaterials.find(m => m.id === materialId);
    return sum + (material ? material.pricePerKg * weight : 0);
  }, 0);

  // Get final feedback based on the actual error margin used for the formula type
  // This will now also generate suggestions based on deviations from ideal targets
  const { marginOfError, nutrientFeedback, adjustmentSuggestions } = getFormulaFeedback(finalNutrients, targets, criticalNutrients, errorMarginFactor, allMaterials, selectedMaterialIds, finalOptimizedFormula, bagWeightKg);

  // No longer return an error if criteria are not met, just provide feedback and suggestions
  return { formula: finalOptimizedFormula, finalNutrients, estimatedCostPerBag, marginOfError, nutrientFeedback, adjustmentSuggestions };
};

// Component for the Calculator Page
const CalculatorPage = ({
  selectedLivestock, setSelectedLivestock,
  selectedFormulaOption, setSelectedFormulaOption,
  selectedCustomFormula, setSelectedCustomFormula,
  numBags, setNumBags,
  bagWeightKg,
  calculationResult, setCalculationResult,
  selectedSuggestions, setSelectedSuggestions,
  allMaterials // Pass all materials, including custom ones
}) => {

  const rawMaterials = useMemo(() => allMaterials.filter(m => m.type === 'raw'), [allMaterials]);
  const wasteMaterials = useMemo(() => allMaterials.filter(m => m.type === 'waste'), [allMaterials]);

  // New state to hold selected materials for optimization (checkboxes)
  const [selectedMaterialIdsForOptimization, setSelectedMaterialIdsForOptimization] = useState([]);

  // Effect to initialize selectedMaterialIdsForOptimization when allMaterials changes (e.g., custom materials load)
  // Or when livestock changes, ensuring a reasonable default selection
  useEffect(() => {
    // Default to selecting some common materials or all if none are selected
    if (allMaterials.length > 0 && selectedMaterialIdsForOptimization.length === 0) {
        const defaultSelected = allMaterials.filter(m => ['corn', 'soybean_meal', 'barley'].includes(m.id)).map(m => m.id);
        if (defaultSelected.length > 0) {
            setSelectedMaterialIdsForOptimization(defaultSelected);
        } else {
            setSelectedMaterialIdsForOptimization(allMaterials.map(m => m.id)); // Select all if no common ones
        }
    }
  }, [allMaterials, selectedMaterialIdsForOptimization.length]);


  // Handle checkbox change for material selection (for optimization pool and custom formula)
  const handleMaterialSelectionChange = (materialId, isChecked) => {
    setSelectedMaterialIdsForOptimization(prev => {
      if (isChecked) {
        return [...prev, materialId];
      } else {
        return prev.filter(id => id !== materialId);
      }
    });

    if (!isChecked) {
      // If unchecked, remove it from custom formula
      setSelectedCustomFormula(prev => {
        const newFormula = { ...prev };
        delete newFormula[materialId];
        return newFormula;
      });
    }

    // When a material selection changes, clear previous results
    setCalculationResult(null);
  };

  // Handle quantity change for material in custom mode
  const handleMaterialQuantityChange = (materialId, quantity) => {
    setSelectedCustomFormula(prev => {
      const newFormula = { ...prev };
      const parsedQuantity = parseFloat(quantity);
      if (!isNaN(parsedQuantity) && parsedQuantity >= 0) {
        newFormula[materialId] = parsedQuantity;
      } else if (quantity === '') {
        newFormula[materialId] = 0; // Allow empty input temporarily, but treat as 0 for calculation
      }
      return newFormula;
    });
  };

  // Get Tailwind classes for material quality
  const getQualityClass = (quality) => {
    switch (quality) {
      case 'excellent': return 'border-brand-500 ring-2 ring-brand-300'; // مثالي
      case 'good': return 'border-brand-400 ring-2 ring-blue-200'; // مناسب
      case 'moderate': return 'border-yellow-400 ring-2 ring-yellow-200'; // مناسب
      case 'low': return 'border-red-400 ring-2 ring-red-200'; // منخفض
      default: return 'border-gray-200';
    }
  };

  // Handle calculation for initial or custom formula
  const handleCalculate = () => {
    let result;
    if (selectedFormulaOption === "custom") {
      const currentTotalWeight = Object.values(selectedCustomFormula).reduce((sum, weight) => sum + weight, 0);

      if (currentTotalWeight === 0 && Object.keys(selectedCustomFormula).length === 0) {
        setCalculationResult({ error: "الرجاء اختيار مادة واحدة على الأقل وتحديد كمياتها للتركيبة المخصصة." });
        return;
      } else if (currentTotalWeight === 0 && Object.keys(selectedCustomFormula).length > 0) {
        setCalculationResult({ error: "الرجاء تحديد كميات للمواد المختارة في التركيبة المخصصة. (يجب أن يكون مجموع الكميات أكبر من صفر)" });
        return;
      }

      // Pass the selected materials for custom formula, and the custom formula itself
      result = calculateFeedFormula(Object.keys(selectedCustomFormula), selectedLivestock, bagWeightKg, allMaterials, selectedFormulaOption, selectedCustomFormula);

    } else {
      // For optimized formulas ('perfect', 'suitable', 'low')
      if (selectedMaterialIdsForOptimization.length === 0) {
          setCalculationResult({ error: "الرجاء اختيار مادة واحدة على الأقل لإنشاء التركيبة المحسنة." });
          return;
      }
      result = calculateFeedFormula(selectedMaterialIdsForOptimization, selectedLivestock, bagWeightKg, allMaterials, selectedFormulaOption);
    }
    setCalculationResult(result);
    setSelectedSuggestions([]); // Clear suggestions on any new calculation
  };

  // Handle checkbox change for adjustment suggestions
  const handleSuggestionCheckboxChange = (suggestionId) => {
    setSelectedSuggestions(prev =>
      prev.includes(suggestionId)
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId]
    );
  };

  // Handle applying selected suggestions and re-calculating
  const handleApplySuggestions = () => {
    if (!calculationResult || calculationResult.error || selectedSuggestions.length === 0) {
      return;
    }

    // Start with the current custom formula (only applicable if selectedFormulaOption is 'custom')
    let newFormula = { ...selectedCustomFormula };

    const suggestionsToApply = calculationResult.adjustmentSuggestions.filter(sug =>
      selectedSuggestions.includes(sug.id)
    );

    suggestionsToApply.forEach(sug => {
      const materialId = sug.materialId;
      const amount = sug.amount;

      if (sug.type === 'add') {
        newFormula[materialId] = (newFormula[materialId] || 0) + amount;
      } else if (sug.type === 'reduce') {
        newFormula[materialId] = Math.max(0, (newFormula[materialId] || 0) - amount);
        // If material weight becomes negligible, remove it from the formula
        if (newFormula[materialId] < 0.01) {
            delete newFormula[materialId];
        }
      }
    });

    // Update the selected custom formula state
    setSelectedCustomFormula(newFormula);
    // Trigger a new calculation with the updated custom formula
    // This will implicitly call handleCalculate which normalizes and calculates.
    handleCalculate();
  };


  // Memoize the list of important nutrients for display
  const importantNutrientsForLivestock = useMemo(() => {
    if (!selectedLivestock) return [];
    const livestock = livestockNeeds[selectedLivestock];
    return Object.keys(livestock.targets);
  }, [selectedLivestock]);

  return (
    <div className="p-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-brand-700 mb-8 flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calculator text-brand-600"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><path d="M8 10h8"/><path d="M8 14h8"/><path d="M8 18h8"/></svg>
          حاسبة أعلاف الماشية
      </h1>

      {/* Livestock Selection */}
      <div className="mb-8 p-6 bg-brand-50 rounded-2xl border border-brand-100 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-brand-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sheep text-brand-600"><path d="M18 5c-1.7 0-3.4.2-4.4 1.2L10 10l.6.6A1.5 1.5 0 0 1 9 12h-.6l-2 3.4c-.7 1.2-1 2.5-1 3.4a2 2 0 0 0 2 2h.6A2 2 0 0 0 8 20.4l.4-1.5s.9-.6 1.6-.9c.7-.3 1.4-.5 2-.5h.4c1.1 0 2.2-.3 3-.8l2-1.2c1.2-.7 1.8-2 1.8-3.3V9a4 4 0 0 0-4-4Z"/><path d="M12 10a4 4 0 0 0 4-4V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.2"/><path d="M12 10a4 4 0 0 1-4-4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v.2"/></svg>
          اختر نوع الماشية
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(livestockNeeds).map(([key, value]) => (
            <label key={key} className="flex items-center p-3 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition duration-200 border border-gray-200">
              <input
                type="radio"
                name="livestock"
                value={key}
                checked={selectedLivestock === key}
                onChange={(e) => setSelectedLivestock(e.target.value)}
                className="form-radio h-5 w-5 text-brand-600 border-gray-300 focus:ring-brand-500"
              />
              <span className="mr-3 text-lg font-medium text-gray-700">{value.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Formulation Type Selection */}
      <div className="mb-8 p-6 bg-brand-50 rounded-2xl border border-brand-100 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-brand-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package text-brand-600"><path d="m7.5 4.27 9 5.15"/><path d="M2.5 10.1l9 5.15 9-5.15"/><path d="m7.5 19.73 9-5.15"/><path d="M12 22.46v-7.15"/><path d="M12 2v7.15"/><path d="M12 7.15 2.5 2.05"/><path d="M12 7.15 21.5 2.05"/><path d="M12 14.85 2.5 19.95"/><path d="M12 14.85 21.5 19.95"/></svg>
          اختر نوع التركيبة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <label className="flex items-center p-3 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition duration-200 border border-gray-200">
            <input
              type="radio"
              name="formulaOption"
              value="custom"
              checked={selectedFormulaOption === "custom"}
              onChange={() => setSelectedFormulaOption("custom")}
              className="form-radio h-5 w-5 text-brand-600 border-gray-300 focus:ring-brand-500"
            />
            <span className="mr-3 text-lg font-medium text-gray-700">تركيبة مخصصة</span>
          </label>
          <label className="flex items-center p-3 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition duration-200 border border-gray-200">
            <input
              type="radio"
              name="formulaOption"
              value="perfect"
              checked={selectedFormulaOption === "perfect"}
              onChange={() => setSelectedFormulaOption("perfect")}
              className="form-radio h-5 w-5 text-brand-600 border-gray-300 focus:ring-brand-500"
            />
            <span className="mr-3 text-lg font-medium text-gray-700">مثالية (خطأ 10% كحد أقصى)</span>
          </label>
          <label className="flex items-center p-3 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition duration-200 border border-gray-200">
            <input
              type="radio"
              name="formulaOption"
              value="suitable"
              checked={selectedFormulaOption === "suitable"}
              onChange={() => setSelectedFormulaOption("suitable")}
              className="form-radio h-5 w-5 text-brand-600 border-gray-300 focus:ring-brand-500"
            />
            <span className="mr-3 text-lg font-medium text-gray-700">مناسبة (خطأ 15% كحد أقصى)</span>
          </label>
          <label className="flex items-center p-3 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition duration-200 border border-gray-200">
            <input
              type="radio"
              name="formulaOption"
              value="low"
              checked={selectedFormulaOption === "low"}
              onChange={() => setSelectedFormulaOption("low")}
              className="form-radio h-5 w-5 text-brand-600 border-gray-300 focus:ring-brand-500"
            />
            <span className="mr-3 text-lg font-medium text-gray-700">منخفضة (خطأ 20% كحد أقصى)</span>
          </label>
        </div>
      </div>


      {/* Materials Selection (Conditionally rendered/disabled) */}
      <div className={`mb-8 p-6 bg-brand-50 rounded-2xl border border-brand-100 shadow-sm`}>
        <h2 className="text-xl md:text-2xl font-bold text-brand-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wheat text-brand-600"><path d="M2 22 16 8"/><path d="M16 22 2 8"/><path d="M10 16.5V2"/><path d="M14 15.5V2"/><path d="M12 2C10.5 6 10 10 10 16.5C10 19.833 11.5 22 14 22c2.5 0 4-2.167 4-5.5C18 10 17.5 6 16 2"/></svg>
          اختر المواد المتاحة
        </h2>
        {/* Quality Legend */}
        <div className="mb-4 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-2 justify-center">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-brand-500"></span> مثالي
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-brand-400"></span> مناسب (جيد)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span> مناسب (متوسط)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-400"></span> منخفض
          </span>
        </div>

        {/* Raw Materials Section */}
        <h3 className="text-lg font-semibold text-gray-700 mb-2 mt-4">مواد خام:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rawMaterials.map(material => (
            <label // Wrap the entire div content in a label
              key={material.id}
              className={`flex items-center p-3 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition duration-200 border ${getQualityClass(material.quality)}`}
            >
              <input
                type="checkbox"
                checked={selectedMaterialIdsForOptimization.includes(material.id)} // Control by new state
                onChange={(e) => handleMaterialSelectionChange(material.id, e.target.checked)}
                className="form-checkbox h-5 w-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
              />
              <span className="mr-3 text-lg font-medium text-gray-700">{material.name}</span>
              {selectedFormulaOption === 'custom' && ( // Only show input for custom formula
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={selectedCustomFormula.hasOwnProperty(material.id) ? selectedCustomFormula[material.id] : ''}
                  onChange={(e) => handleMaterialQuantityChange(material.id, e.target.value)}
                  className="w-20 p-1 border border-gray-300 rounded-md text-center text-sm mr-2"
                  disabled={!selectedMaterialIdsForOptimization.includes(material.id)} // Disable if not selected
                />
              )}
              <span className="text-sm text-gray-500 mr-auto">كجم ({material.pricePerKg.toFixed(2)} ريال/كجم)</span>
            </label>
          ))}
        </div>

        {/* Waste Materials Section */}
        <h3 className="text-lg font-semibold text-gray-700 mb-2 mt-6">مخلفات غذائية:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wasteMaterials.map(material => (
            <label // Wrap the entire div content in a label
              key={material.id}
              className={`flex items-center p-3 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition duration-200 border ${getQualityClass(material.quality)}`}
            >
              <input
                type="checkbox"
                checked={selectedMaterialIdsForOptimization.includes(material.id)} // Control by new state
                onChange={(e) => handleMaterialSelectionChange(material.id, e.target.checked)}
                className="form-checkbox h-5 w-5 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
              />
              <span className="mr-3 text-lg font-medium text-gray-700">{material.name}</span>
              {selectedFormulaOption === 'custom' && ( // Only show input for custom formula
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={selectedCustomFormula.hasOwnProperty(material.id) ? selectedCustomFormula[material.id] : ''}
                  onChange={(e) => handleMaterialQuantityChange(material.id, e.target.value)}
                  className="w-20 p-1 border border-gray-300 rounded-md text-center text-sm mr-2"
                  disabled={!selectedMaterialIdsForOptimization.includes(material.id)} // Disable if not selected
                />
              )}
              <span className="text-sm text-gray-500 mr-auto">كجم ({material.pricePerKg.toFixed(2)} ريال/كجم)</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bag Settings */}
      <div className="mb-8 p-6 bg-brand-50 rounded-2xl border border-brand-100 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-brand-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package text-brand-600"><path d="m7.5 4.27 9 5.15"/><path d="M2.5 10.1l9 5.15 9-5.15"/><path d="m7.5 19.73 9-5.15"/><path d="M12 22.46v-7.15"/><path d="M12 2v7.15"/><path d="M12 7.15 2.5 2.05"/><path d="M12 7.15 21.5 2.05"/><path d="M12 14.85 2.5 19.95"/><path d="M12 14.85 21.5 19.95"/></svg>
          إعدادات الأكياس
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label htmlFor="numBags" className="block text-gray-700 text-lg font-medium mb-2">عدد الأكياس المراد صنعها:</label>
            <input
              type="number"
              id="numBags"
              value={numBags}
              onChange={(e) => setNumBags(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-brand-500 focus:border-brand-500 text-lg text-center"
            />
          </div>
          <div className="flex-1 w-full">
            <label htmlFor="bagWeight" className="block text-gray-700 text-lg font-medium mb-2">وزن الكيس الواحد:</label>
            <input
              type="text"
              id="bagWeight"
              value={`${bagWeightKg} كجم`}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 shadow-sm text-lg text-center"
            />
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="text-center mb-8">
        <button
          onClick={handleCalculate}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-300 text-xl"
        >
          حساب تركيبة العلف
        </button>
      </div>

      {/* Results Display */}
      {calculationResult && (
        <div className="p-6 bg-brand-50 rounded-2xl border border-brand-100 shadow-lg">
          {calculationResult.error ? (
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-2">تنبيه</h2>
              <p className="text-gray-700 text-lg">{calculationResult.error}</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-brand-800 mb-4 text-center">النتائج</h2>
              {/* Final Formula Per Bag */}
              <h3 className="text-xl font-semibold text-brand-700 mb-3">تركيبة العلف لكل كيس (50 كجم):</h3>
              <div className="bg-white p-4 rounded-xl shadow-inner mb-6">
                {Object.entries(calculationResult.formula).length > 0 ? (
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-lg">
                    {Object.entries(calculationResult.formula)
                      .filter(([, weight]) => weight > 0.01) // Only show materials with significant weight
                      .sort((a, b) => b[1] - a[1]) // Sort by weight descending
                      .map(([materialId, weight]) => {
                        const material = allMaterials.find(m => m.id === materialId);
                        const percentage = (weight / bagWeightKg) * 100;
                        return (
                          <li key={materialId} className="flex justify-between items-center">
                            <span>{material ? material.name : materialId}:</span>
                            <span className="font-mono text-brand-600">
                              {weight.toFixed(2)} كجم ({percentage.toFixed(1)}%)
                            </span>
                          </li>
                        );
                      })}
                  </ul>
                ) : (
                  <p className="text-gray-600 text-center">لم يتم تحديد تركيبة. يرجى اختيار مواد مناسبة.</p>
                )}
              </div>

              {/* Total Formula for All Bags */}
              <h3 className="text-xl font-semibold text-brand-700 mb-3">إجمالي تركيبة العلف لـ {numBags} كيس ({numBags * bagWeightKg} كجم):</h3>
              <div className="bg-white p-4 rounded-xl shadow-inner mb-6">
                {Object.entries(calculationResult.formula).length > 0 ? (
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-lg">
                    {Object.entries(calculationResult.formula)
                      .filter(([, weight]) => weight > 0.01)
                      .sort((a, b) => b[1] - a[1])
                      .map(([materialId, weight]) => {
                        const material = allMaterials.find(m => m.id === materialId);
                        const totalWeight = weight * numBags;
                        return (
                          <li key={materialId} className="flex justify-between items-center">
                            <span>{material ? material.name : materialId}:</span>
                            <span className="font-mono text-purple-600">
                              {totalWeight.toFixed(2)} كجم
                            </span>
                          </li>
                        );
                      })}
                  </ul>
                ) : (
                  <p className="text-gray-600 text-center">لم يتم تحديد تركيبة بعد.</p>
                )}
              </div>

              {/* Estimated Cost */}
              <h3 className="text-xl font-semibold text-brand-700 mb-3">التكلفة التقديرية:</h3>
              <div className="bg-white p-4 rounded-xl shadow-inner mb-6 text-center">
                <p className="text-lg text-gray-700 mb-2">
                  تكلفة الكيس الواحد (50 كجم):{' '}
                  <span className="font-bold text-brand-700">{calculationResult.estimatedCostPerBag.toFixed(2)} ريال سعودي</span>
                </p>
                <p className="text-xl font-bold text-brand-800">
                  إجمالي التكلفة لـ {numBags} كيس: {' '}
                  {(calculationResult.estimatedCostPerBag * numBags).toFixed(2)} ريال سعودي
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  (الأسعار تقديرية وقد تختلف في السوق)
                </p>
              </div>


              {/* Final Formula Nutrients */}
              <h3 className="text-xl font-semibold text-brand-700 mb-3">المغذيات في التركيبة النهائية (لكل كجم):</h3>
              <div className="bg-white p-4 rounded-xl shadow-inner mb-6">
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-lg">
                  {importantNutrientsForLivestock.map(nutrientKey => {
                    const actualValue = calculationResult.finalNutrients[nutrientKey];
                    const target = livestockNeeds[selectedLivestock].targets[nutrientKey];
                    const unit = target?.unit || '%';
                    const isEnergy = nutrientKey === 'energy';

                    let displayValue = actualValue;

                    const isWithinTarget = target ? (actualValue >= target.min && actualValue <= target.max) : false;
                    const textColor = isWithinTarget ? 'text-brand-600' : 'text-red-600';

                    let label = nutrientKey;
                    switch(nutrientKey) {
                      case 'protein': label = 'بروتين'; break;
                      case 'energy': label = 'طاقة'; break;
                      case 'calcium': label = 'كالسيوم'; break;
                      case 'phosphorus': label = 'فوسفور'; break;
                      case 'lysine': label = 'لايسين'; break;
                      case 'methionine': label = 'ميثيونين'; break;
                      case 'fiber': label = 'ألياف'; break;
                      default: break;
                    }

                    return (
                      <li key={String(nutrientKey)} className="flex justify-between items-center">
                        <span>{label}:</span>
                        <span className={`font-mono ${textColor}`}>
                          {Number(displayValue || 0).toFixed(isEnergy ? 0 : 2)} {String(unit)}
                          {target ? (
                            <span className="text-gray-500 text-sm mr-2">
                              (الهدف: {Number(target.min).toFixed(isEnergy ? 0 : 1)}-{Number(target.max).toFixed(isEnergy ? 0 : 1)} {String(unit)})
                            </span>
                          ) : null}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Margin of Error and Detailed Advice */}
              <h3 className="text-xl font-semibold text-brand-700 mb-3">هامش الخطأ ونصائح مفصلة:</h3>
              <div className="bg-white p-4 rounded-xl shadow-inner mb-6 text-center">
                <span className={
                  calculationResult.marginOfError === "مثالي" ? "text-brand-600 text-2xl font-bold" :
                  calculationResult.marginOfError === "مناسب" ? "text-yellow-600 text-2xl font-bold" :
                  "text-red-600 text-2xl font-bold"
                }>
                  {String(calculationResult.marginOfError)}
                </span>
                <p className="text-gray-600 text-base mt-2 mb-4">
                  {calculationResult.marginOfError === "مثالي" ? "التركيبة تلبي جميع الاحتياجات الغذائية الحرجة بدقة." : null}
                  {calculationResult.marginOfError === "مناسب" ? "التركيبة تلبي معظم الاحتياجات الغذائية الحرجة ضمن نطاق مقبول (ضمن 10% من الهدف)." : null}
                  {calculationResult.marginOfError === "منخفض" ? "التركيبة لا تلبي بعض الاحتياجات الغذائية الحرجة بشكل كافٍ. قد تحتاج إلى تغيير المواد المختارة." : null}
                </p>
                {calculationResult.nutrientFeedback && calculationResult.nutrientFeedback.length > 0 && (
                  <div className="text-right mt-4">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">تحليل المغذيات:</h4>
                    <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                      {calculationResult.nutrientFeedback.map((feedback, index) => (
                        <li key={index}>{feedback}</li>
                      ))}
                    </ul>
                    {/* Adjustment suggestions are now always displayed if they exist */}
                    {calculationResult.adjustmentSuggestions && calculationResult.adjustmentSuggestions.length > 0 && (
                      <div className="mt-4 p-3 bg-brand-50 rounded-lg border border-brand-200">
                        <h4 className="text-lg font-semibold text-brand-700 mb-2">اقتراحات لتعديل التركيبة:</h4>
                        <ul className="list-none text-brand-800 text-base space-y-1"> {/* Changed to list-none for checkbox alignment */}
                          {calculationResult.adjustmentSuggestions.map((suggestion) => (
                            <li key={suggestion.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={suggestion.id}
                                checked={selectedSuggestions.includes(suggestion.id)}
                                onChange={() => handleSuggestionCheckboxChange(suggestion.id)}
                                className="form-checkbox h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-blue-500 ml-2"
                              />
                              <label htmlFor={suggestion.id} className="cursor-pointer">{suggestion.text}</label>
                            </li>
                          ))}
                        </ul>
                        {selectedFormulaOption === 'custom' && ( // Only show apply button for custom
                            <button
                              onClick={handleApplySuggestions}
                              disabled={selectedSuggestions.length === 0}
                              className={`mt-4 bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ${selectedSuggestions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              تطبيق الاقتراحات وإعادة الحساب
                            </button>
                        )}
                        <p className="text-sm text-gray-600 mt-2">
                          (هذه الاقتراحات تقديرية. يرجى تعديل اختيار المواد يدوياً وإعادة الحساب لرؤية التأثير النهائي.)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Total Production */}
              <h3 className="text-xl font-semibold text-brand-700 mb-3">إجمالي الإنتاج:</h3>
              <div className="bg-white p-4 rounded-xl shadow-inner text-center text-2xl font-bold text-purple-700">
                {numBags * bagWeightKg} كجم من العلف
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Component for Material Management Page
const MaterialManagerPage = ({ userId, db, allMaterials, setCustomMaterials }) => {
  const defaultNewMaterialState = {
    name: '',
    type: 'raw',
    pricePerKg: 0,
    nutrients: { protein: 0, energy: 0, fiber: 0, calcium: 0, phosphorus: 0, lysine: 0, methionine: 0 },
    quality: 'good' // Default quality
  };

  const [newMaterial, setNewMaterial] = useState(defaultNewMaterialState);
  const [editingMaterial, setEditingMaterial] = useState(null); // Stores the material object being edited
  const [message, setMessage] = useState('');

  // Function to get the current form data (either new or editing)
  const getCurrentFormData = () => editingMaterial || newMaterial;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const targetStateSetter = editingMaterial ? setEditingMaterial : setNewMaterial;

    targetStateSetter(prev => {
      if (name.startsWith('nutrient_')) {
        const nutrientName = name.split('_')[1];
        // Ensure that the value is parsed as a float, or set to 0 if empty
        const parsedValue = parseFloat(value);
        return {
          ...prev,
          nutrients: {
            ...prev.nutrients,
            [nutrientName]: isNaN(parsedValue) ? 0 : parsedValue
          }
        };
      } else {
        // For pricePerKg, ensure it's parsed as float, or 0 if empty
        if (name === 'pricePerKg') {
          const parsedValue = parseFloat(value);
          return { ...prev, [name]: isNaN(parsedValue) ? 0 : parsedValue };
        }
        return { ...prev, [name]: value };
      }
    });
  };

  const handleSaveMaterial = async () => {
    if (!db || !userId) {
      setMessage('خطأ: لم يتم تهيئة قاعدة البيانات أو معرف المستخدم غير متاح.');
      return;
    }
    const materialToSave = getCurrentFormData();
    if (!materialToSave.name.trim()) { // Ensure name is not just whitespace
      setMessage('الرجاء إدخال اسم المادة.');
      return;
    }
    if (materialToSave.pricePerKg <= 0) { // Price must be positive
      setMessage('الرجاء إدخال سعر الكيلو (يجب أن يكون أكبر من 0).');
      return;
    }

    try {
      if (editingMaterial && editingMaterial.docId) {
        // Case 1: Editing an existing custom material (has docId)
        const materialRef = doc(db, `artifacts/${appId}/users/${userId}/custom_materials`, editingMaterial.docId);
        await updateDoc(materialRef, {
          name: materialToSave.name,
          type: materialToSave.type,
          pricePerKg: parseFloat(materialToSave.pricePerKg),
          nutrients: { ...materialToSave.nutrients },
          quality: materialToSave.quality
        });
        setMessage('تم تحديث المادة بنجاح!');
      } else if (editingMaterial && !editingMaterial.docId) { // This means it was a predefined material being edited
        // Case 2: Editing a predefined material for the first time (no docId, but it's in editingMaterial)
        // Save it as a new custom material
        const materialToAdd = {
          ...materialToSave, // Use the current form data
          id: crypto.randomUUID(), // Generate a new unique ID for this custom version
          pricePerKg: parseFloat(materialToSave.pricePerKg),
          nutrients: { ...materialToSave.nutrients },
          userId: userId
        };
        const materialsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/custom_materials`);
        await addDoc(materialsCollectionRef, materialToAdd);
        setMessage('تم حفظ النسخة المخصصة من المادة بنجاح!');
      } else {
        // Case 3: Adding a brand new custom material (no editingMaterial)
        const materialToAdd = {
          ...newMaterial,
          id: crypto.randomUUID(),
          pricePerKg: parseFloat(newMaterial.pricePerKg),
          nutrients: { ...newMaterial.nutrients },
          userId: userId
        };
        const materialsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/custom_materials`);
        await addDoc(materialsCollectionRef, materialToAdd);
        setMessage('تمت إضافة المادة بنجاح!');
      }
      // Reset form after save
      setEditingMaterial(null);
      setNewMaterial(defaultNewMaterialState);
    } catch (error) {
      console.error("Error saving document: ", error);
      setMessage(`خطأ في حفظ المادة: ${error.message}`);
    }
  };

  const handleEditMaterial = (material) => {
    // Load the material into the form for editing.
    // If it's a predefined material, it won't have a docId,
    // which will be used in handleSaveMaterial to determine if it's an add or update.
    setEditingMaterial({ ...material });
    setMessage(''); // Clear any previous messages
  };

  const handleCancelEdit = () => {
    setEditingMaterial(null);
    setNewMaterial(defaultNewMaterialState); // Reset form to default new material state
    setMessage('');
  };

  const handleDeleteMaterial = async (materialDocId) => {
    if (!db || !userId) {
        setMessage('خطأ: لم يتم تهيئة قاعدة البيانات أو معرف المستخدم غير متاح.');
        return;
    }
    try {
        const materialRef = doc(db, `artifacts/${appId}/users/${userId}/custom_materials`, materialDocId);
        await deleteDoc(materialRef);
        setMessage('تم حذف المادة بنجاح!');
    } catch (error) {
        console.error("Error deleting document: ", error);
        setMessage(`خطأ في حذف المادة: ${error.message}`);
    }
  };

  const getQualityText = (quality) => {
    switch (quality) {
      case 'excellent': return 'مثالي';
      case 'good': return 'جيد';
      case 'moderate': return 'متوسط';
      case 'low': return 'منخفض';
      default: return 'غير معروف';
    }
  };

  const getQualityClass = (quality) => {
    switch (quality) {
      case 'excellent': return 'text-brand-600';
      case 'good': return 'text-brand-500';
      case 'moderate': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Determine which materials are custom (have a docId from Firestore)
  const isCustomMaterial = (material) => material.hasOwnProperty('docId');

  const currentFormData = getCurrentFormData();

  return (
    <div className="p-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-purple-700 mb-8 flex items-center justify-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package-plus text-purple-600"><path d="M5 12V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M12 5V2"/><path d="M12 22v-3"/><path d="M18 12h-5"/><path d="M12 7.15 2.5 2.05"/><path d="M12 7.15 21.5 2.05"/><path d="M12 14.85 2.5 19.95"/><path d="M12 14.85 21.5 19.95"/><path d="M2 12h3"/><path d="M19 12h3"/></svg>
        إدارة المواد
      </h1>

      {/* Add/Edit New Material Form */}
      <div className="mb-8 p-6 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-purple-800 mb-4">
          {editingMaterial ? 'تعديل المادة' : 'إضافة مادة جديدة'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="materialName" className="block text-gray-700 text-sm font-medium mb-1">اسم المادة:</label>
            <input
              type="text"
              id="materialName"
              name="name"
              value={currentFormData.name}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="مثال: دقيق الذرة"
            />
          </div>
          <div>
            <label htmlFor="materialType" className="block text-gray-700 text-sm font-medium mb-1">النوع:</label>
            <select
              id="materialType"
              name="type"
              value={currentFormData.type}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="raw">خام</option>
              <option value="waste">مخلفات</option>
            </select>
          </div>
          <div>
            <label htmlFor="pricePerKg" className="block text-gray-700 text-sm font-medium mb-1">السعر لكل كجم (ريال سعودي):</label>
            <input
              type="number"
              step="0.01"
              min="0"
              id="pricePerKg"
              name="pricePerKg"
              value={currentFormData.pricePerKg}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="quality" className="block text-gray-700 text-sm font-medium mb-1">الجودة (للعرض فقط):</label>
            <select
              id="quality"
              name="quality"
              value={currentFormData.quality}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="excellent">مثالي</option>
              <option value="good">جيد</option>
              <option value="moderate">متوسط</option>
              <option value="low">منخفض</option>
            </select>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mb-2">البيانات الغذائية (لكل كجم):</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {Object.keys(currentFormData.nutrients).map(nutrientKey => (
            <div key={nutrientKey}>
              <label htmlFor={`nutrient_${nutrientKey}`} className="block text-gray-700 text-sm font-medium mb-1">
                {nutrientKey === 'protein' ? 'بروتين (%)' :
                 nutrientKey === 'energy' ? 'طاقة (كيلو كالوري)' :
                 nutrientKey === 'fiber' ? 'ألياف (%)' :
                 nutrientKey === 'calcium' ? 'كالسيوم (%)' :
                 nutrientKey === 'phosphorus' ? 'فوسفور (%)' :
                 nutrientKey === 'lysine' ? 'لايسين (%)' :
                 nutrientKey === 'methionine' ? 'ميثيونين (%)' : nutrientKey}
              </label>
              <input
                type="number"
                step="0.0001"
                min="0"
                id={`nutrient_${nutrientKey}`}
                name={`nutrient_${nutrientKey}`}
                value={currentFormData.nutrients[nutrientKey]}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSaveMaterial}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 hover:scale-105"
          >
            {editingMaterial ? 'تحديث المادة' : 'إضافة المادة'}
          </button>
          {editingMaterial && (
            <button
              onClick={handleCancelEdit}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 hover:scale-105"
            >
              إلغاء التعديل
            </button>
          )}
        </div>
        {message && <p className="mt-4 text-center text-sm font-medium text-gray-700">{message}</p>}
      </div>

      {/* List All Materials in a Table */}
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">جميع المواد المتاحة:</h2>
        {allMaterials.length === 0 ? (
          <p className="text-gray-600 text-center">لا توجد مواد لعرضها.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">
                  الاسم
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">
                  النوع
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">
                  السعر/كجم (ريال)
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">
                  الجودة
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">
                  بروتين (%)
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">
                  طاقة (كيلو كالوري)
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">
                  ألياف (%)
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-b border-b border-gray-300">
                  كالسيوم (%)
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">
                  فوسفور (%)
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">
                  لايسين (%)
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">
                  ميثيونين (%)
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">
                  إجراء
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allMaterials.map(material => (
                <tr key={material.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {material.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {material.type === 'raw' ? 'خام' : 'مخلفات'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {material.pricePerKg.toFixed(2)}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm ${getQualityClass(material.quality)}`}>
                    {getQualityText(material.quality)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {material.nutrients.protein.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {material.nutrients.energy.toFixed(0)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {material.nutrients.fiber.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {material.nutrients.calcium.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {material.nutrients.phosphorus.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {material.nutrients.lysine.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {material.nutrients.methionine.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditMaterial(material)}
                          className="text-brand-600 hover:text-brand-800 transition-colors duration-150 p-1 rounded-md hover:bg-brand-100"
                          aria-label={`تعديل ${material.name}`}
                        >
                          <Pencil size={18} />
                        </button>
                        {isCustomMaterial(material) ? (
                            <button
                              onClick={() => handleDeleteMaterial(material.docId)}
                              className="text-red-600 hover:text-red-800 transition-colors duration-150 p-1 rounded-md hover:bg-red-100"
                              aria-label={`حذف ${material.name}`}
                            >
                              <Trash2 size={18} />
                            </button>
                        ) : (
                            <span className="text-gray-400" title="لا يمكن حذف المواد المحددة مسبقًا">
                                <Trash2 size={18} />
                            </span>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};


export default function FeedCalculator() {
  const [currentPage, setCurrentPage] = useState('calculator'); // 'calculator' or 'materials'
  const [selectedLivestock, setSelectedLivestock] = useState("broiler_starter");
  const [selectedFormulaOption, setSelectedFormulaOption] = useState("custom"); // 'custom', 'low', 'suitable', 'perfect'
  const [selectedCustomFormula, setSelectedCustomFormula] = useState({});
  const [numBags, setNumBags] = useState(1);
  const bagWeightKg = 50; // Fixed at 50kg per bag

  const [calculationResult, setCalculationResult] = useState(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);

  const [firebaseDb, setFirebaseDb] = useState(null);
  const [firebaseAuth, setFirebaseAuth] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [customMaterials, setCustomMaterials] = useState([]);

  // Initialize Firebase and set up auth listener
  useEffect(() => {
    try {
      firebaseApp = initializeApp(firebaseConfig);
      db = getFirestore(firebaseApp);
      auth = getAuth(firebaseApp);
      setFirebaseDb(db);
      setFirebaseAuth(auth);

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUserId(user.uid);
        } else {
          // Sign in anonymously if no user is logged in
          try {
            if (initialAuthToken) {
                await signInWithCustomToken(auth, initialAuthToken);
            } else {
                await signInAnonymously(auth);
            }
          } catch (anonError) {
            console.error("Error signing in anonymously:", anonError);
          }
        }
        setIsAuthReady(true); // Auth is ready after initial check/sign-in
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase initialization error:", error);
      setIsAuthReady(true); // Mark as ready even on error to avoid infinite loading
    }
  }, []); // Run once on component mount

  // Fetch custom materials from Firestore
  useEffect(() => {
    if (!firebaseDb || !currentUserId || !isAuthReady) return;

    const materialsCollectionRef = collection(firebaseDb, `artifacts/${appId}/users/${currentUserId}/custom_materials`);
    const q = query(materialsCollectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const materials = snapshot.docs.map(doc => ({
        docId: doc.id, // Store Firestore document ID for deletion
        ...doc.data()
      }));
      setCustomMaterials(materials);
    }, (error) => {
      console.error("Error fetching custom materials:", error);
    });

    return () => unsubscribe();
  }, [firebaseDb, currentUserId, isAuthReady]); // Re-run when db, userId, or auth status changes


  // Combine predefined and custom materials
  const allMaterials = useMemo(() => {
    return [...predefinedMaterialsData, ...customMaterials];
  }, [customMaterials]);


  // Effect to handle changes in selectedFormulaOption or selectedLivestock
  useEffect(() => {
    // When formula option changes, clear calculation results and custom formula quantities
    setCalculationResult(null);
    setSelectedCustomFormula({});

    // If switching to an optimized formula type, we don't need to set predefined quantities here.
    // The calculation will be triggered by the "حساب تركيبة العلف" button.
    // If switching to 'custom', ensure custom formula is cleared.
  }, [selectedFormulaOption, selectedLivestock]); // Depend on allMaterials too

  return (
    <div dir="rtl" className="w-full bg-brand-sand-50 p-4 md:p-8 font-arabic text-brand-900 mt-20">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-6 md:p-10 border border-brand-200">
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setCurrentPage('calculator')}
            className={`py-2 px-6 rounded-full font-bold transition duration-300 ${
              currentPage === 'calculator'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            حاسبة العلف
          </button>
          <button
            onClick={() => setCurrentPage('materials')}
            className={`py-2 px-6 rounded-full font-bold transition duration-300 ${
              currentPage === 'materials'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            إدارة المواد
          </button>
        </div>

        {/* Render pages based on currentPage state */}
        {currentPage === 'calculator' ? (
          <CalculatorPage
            selectedLivestock={selectedLivestock}
            setSelectedLivestock={setSelectedLivestock}
            selectedFormulaOption={selectedFormulaOption}
            setSelectedFormulaOption={setSelectedFormulaOption}
            selectedCustomFormula={selectedCustomFormula}
            setSelectedCustomFormula={setSelectedCustomFormula}
            numBags={numBags}
            setNumBags={setNumBags}
            bagWeightKg={bagWeightKg}
            calculationResult={calculationResult}
            setCalculationResult={setCalculationResult}
            selectedSuggestions={selectedSuggestions}
            setSelectedSuggestions={setSelectedSuggestions}
            allMaterials={allMaterials}
          />
        ) : (
          <MaterialManagerPage
            userId={currentUserId}
            db={firebaseDb}
            allMaterials={allMaterials}
            setCustomMaterials={setCustomMaterials} // Pass setter for potential local updates (though Firestore handles it)
          />
        )}
      </div>
    </div>
  );
}



