/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum FacilityType {
  BHU = 'BHU',
  RHC = 'RHC',
  THQ = 'THQ',
  OTHER = 'Other',
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  district: string;
  lastVisit?: string;
  averageScore?: number;
}

export interface ChecklistItem {
  id: string;
  category: string;
  question: string;
  score: number; // 0 to 5 or binary
  notes?: string;
}

export interface MonitoringVisit {
  id: string;
  facilityId: string;
  supervisorId: string;
  date: string;
  scores: Record<string, number>;
  totalScore: number;
}

export type View = 'dashboard' | 'facilities' | 'new-visit' | 'reports' | 'users';
