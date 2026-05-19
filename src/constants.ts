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
  { id: '6', name: 'THQ Hospital Havelian', type: FacilityType.THQ, district: 'Abbottabad', lastVisit: '2024-05-10', averageScore: 88 },
  { id: '7', name: 'BHU Sherwan', type: FacilityType.BHU, district: 'Abbottabad', lastVisit: '2024-01-30', averageScore: 72 },
  { id: '8', name: 'RHC Domel', type: FacilityType.RHC, district: 'Bannu', lastVisit: '2024-05-15', averageScore: 65 },
  { id: '9', name: 'THQ Hospital Daraban', type: FacilityType.THQ, district: 'D.I. Khan', lastVisit: '2024-03-05', averageScore: 79 },
  { id: '10', name: 'BHU Badaber', type: FacilityType.BHU, district: 'Peshawar', lastVisit: '2024-05-18', averageScore: 85 },
  { id: '11', name: 'RHC Tangi', type: FacilityType.RHC, district: 'Charsadda', lastVisit: '2024-04-05', averageScore: 77 },
  { id: '12', name: 'THQ Hospital Lahor', type: FacilityType.THQ, district: 'Swabi', lastVisit: '2024-02-28', averageScore: 83 },
  { id: '13', name: 'BHU Jamrud', type: FacilityType.BHU, district: 'Khyber', lastVisit: '2024-05-12', averageScore: 70 },
  { id: '14', name: 'RHC Ekka Ghund', type: FacilityType.RHC, district: 'Mohmand', lastVisit: '2024-04-20', averageScore: 62 },
  { id: '15', name: 'THQ Hospital Khar', type: FacilityType.THQ, district: 'Bajaur', lastVisit: '2024-05-08', averageScore: 74 },
  { id: '16', name: 'BHU Parachinar', type: FacilityType.BHU, district: 'Kurram', lastVisit: '2024-03-25', averageScore: 81 },
  { id: '17', name: 'RHC Kalaya', type: FacilityType.RHC, district: 'Orakzai', lastVisit: '2024-02-14', averageScore: 58 },
  { id: '18', name: 'THQ Hospital Wana', type: FacilityType.THQ, district: 'South Waziristan', lastVisit: '2024-05-02', averageScore: 69 },
  { id: '19', name: 'BHU Miranshah', type: FacilityType.BHU, district: 'North Waziristan', lastVisit: '2024-04-10', averageScore: 71 },
  { id: '20', name: 'RHC Drosh', type: FacilityType.RHC, district: 'Chitral', lastVisit: '2024-05-14', averageScore: 86 },
  { id: '21', name: 'THQ Hospital Daggar', type: FacilityType.THQ, district: 'Buner', lastVisit: '2024-01-15', averageScore: 80 },
  { id: '22', name: 'BHU Alpuri', type: FacilityType.BHU, district: 'Shangla', lastVisit: '2024-04-30', averageScore: 73 },
  { id: '23', name: 'RHC Balakot', type: FacilityType.RHC, district: 'Mansehra', lastVisit: '2024-05-19', averageScore: 89 },
  { id: '24', name: 'THQ Hospital Oghi', type: FacilityType.THQ, district: 'Mansehra', lastVisit: '2024-03-12', averageScore: 85 },
  { id: '25', name: 'BHU Thakot', type: FacilityType.BHU, district: 'Battagram', lastVisit: '2024-02-20', averageScore: 66 },
  { id: '26', name: 'RHC Judba', type: FacilityType.RHC, district: 'Torghar', lastVisit: '2024-04-18', averageScore: 54 },
  { id: '27', name: 'THQ Hospital Pattan', type: FacilityType.THQ, district: 'Kohistan', lastVisit: '2024-05-05', averageScore: 61 },
  { id: '28', name: 'BHU Naurang', type: FacilityType.BHU, district: 'Lakki Marwat', lastVisit: '2024-03-30', averageScore: 74 },
  { id: '29', name: 'RHC Gomal', type: FacilityType.RHC, district: 'Tank', lastVisit: '2024-04-22', averageScore: 67 },
  { id: '30', name: 'THQ Hospital Doaba', type: FacilityType.THQ, district: 'Hangu', lastVisit: '2024-05-11', averageScore: 78 },
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
