/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Facility, FacilityType } from './types';

export const FACILITIES: Facility[] = [
  { id: '1', name: 'BHU Pabbi', type: FacilityType.BHU, district: 'Nowshera', lastVisit: '2024-04-12', averageScore: 82 },
  { id: '2', name: 'RHC Khushal Garh', type: FacilityType.RHC, district: 'Kohat', lastVisit: '2024-03-20', averageScore: 75 },
  { id: '3', name: 'THQ Hospital Takht-i-Bahi', type: FacilityType.THQ, district: 'Mardan', lastVisit: '2024-05-01', averageScore: 91 },
  { id: '4', name: 'BHU Mathra', type: FacilityType.BHU, district: 'Peshawar', lastVisit: '2024-02-15', averageScore: 68 },
  { id: '5', name: 'RHC Amankot', type: FacilityType.RHC, district: 'Swat', lastVisit: '2024-04-28', averageScore: 84 },
];

export const CHECKLIST_CATEGORIES = [
  {
    id: 'hr',
    title: '1. Attendance of Staff',
    questions: [
      { id: 'hr1', question: 'Medical Officer present/on duty' },
      { id: 'hr2', question: 'Female Medical Officer present/on duty' },
      { id: 'hr3', question: 'LHV / Midwife present/on duty' },
      { id: 'hr4', question: 'Biometric attendance functional' },
      { id: 'hr5', question: 'Duty rosters displayed' },
    ]
  },
  {
    id: 'infra',
    title: '2. Infrastructure & Building',
    questions: [
      { id: 'i1', question: 'Boundary wall present & intact' },
      { id: 'i2', question: 'Separate male/female waiting areas' },
      { id: 'i3', question: 'Labour room functional' },
      { id: 'i4', question: 'Signage visible (OPD, MNCH, EPI, Lab)' },
    ]
  },
  {
    id: 'equip',
    title: '3. Equipment Functionality',
    questions: [
      { id: 'e1', question: 'BP apparatus & Stethoscope functional' },
      { id: 'e2', question: 'Weighing scale (adult/child) available' },
      { id: 'e3', question: 'Oxygen cylinder/concentrator functional' },
      { id: 'e4', question: 'Autoclave / Sterilizer functional' },
    ]
  },
  {
    id: 'utilities',
    title: '4. Utilities (Water & Power)',
    questions: [
      { id: 'u1', question: 'Continuous water availability' },
      { id: 'u2', question: 'Clean drinking water for patients' },
      { id: 'u3', question: 'Generator / Solar backup functional' },
      { id: 'u4', question: 'Fuel available for backup power' },
    ]
  },
  {
    id: 'hygiene',
    title: '5. Cleanliness & IP',
    questions: [
      { id: 'h1', question: 'Facility visibly clean' },
      { id: 'h2', question: 'Toilets functional & clean' },
      { id: 'h3', question: 'PPE available (gloves, masks)' },
    ]
  },
  {
    id: 'meds',
    title: '6. Medicines & Supplies',
    questions: [
      { id: 'm1', question: 'Essential medicines (Antibiotics, Antipyretics) available' },
      { id: 'm2', question: 'No expired medicines in stock' },
      { id: 'm3', question: 'Stock register & Bin Cards maintained' },
    ]
  },
  {
    id: 'coldchain',
    title: '7. Vaccines & Cold Chain',
    questions: [
      { id: 'c1', question: 'All EPI vaccines available' },
      { id: 'c2', question: 'Functional ILR & Temperature log maintained' },
      { id: 'c3', question: 'Ice packs available' },
    ]
  },
  {
    id: 'diagnostics',
    title: '8. Laboratory Services',
    questions: [
      { id: 'd1', question: 'LFB/Malaria/TB diagnostics available' },
      { id: 'd2', question: 'Rate List displayed & registers maintained' },
      { id: 'd3', question: 'Bio-safety practices followed' },
    ]
  },
  {
    id: 'waste',
    title: '9. Waste Management',
    questions: [
      { id: 'w1', question: 'Waste segregation practiced' },
      { id: 'w2', question: 'Color-coded bins & Sharps boxes available' },
      { id: 'w3', question: 'Incinerator / safe disposal mechanism' },
    ]
  },
  {
    id: 'dhis',
    title: '10. DHIS & Reporting',
    questions: [
      { id: 'dh1', question: 'DHIS registers available & updated' },
      { id: 'dh2', question: 'Reports submitted on time' },
      { id: 'dh3', question: 'Staff trained in DHIS' },
    ]
  },
  {
    id: 'indicators',
    title: '11. Service Indicators',
    questions: [
      { id: 's1', question: 'OPD services functional' },
      { id: 's2', question: '24/7 delivery services (where applicable)' },
      { id: 's3', question: 'Referral system functional' },
      { id: 's4', question: 'Sehat Saholat Program active' },
    ]
  }
];
