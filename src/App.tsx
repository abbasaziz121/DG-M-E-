/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  LayoutDashboard, 
  Hospital, 
  MapPin, 
  History, 
  FileCheck, 
  Search, 
  Bell, 
  User, 
  UserPlus,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity,
  ArrowRight,
  Download,
  Camera,
  Trash2,
  X,
  Eye,
  Ban,
  Calendar,
  ClipboardList as ClipboardIcon,
  LogOut,
  Fingerprint,
  ShieldAlert,
  KeyRound,
  Sliders,
  Award,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';

import { FACILITIES, CHECKLIST_CATEGORIES } from './constants';
import { View, Facility, FacilityType } from './types';

export const OFFICER_PROFILES = [
  {
    email: 'abbasaziz121@gmail.com',
    name: 'Abbas Aziz',
    role: 'Chief Provincial Supervisor',
    district: 'All Districts',
    pin: 'Sscamaro#121',
    avatar: 'AA',
    color: 'bg-blue-600',
    description: 'Full provincial monitoring and approval authority across all health facilities.',
    badge: 'Regional HQ',
    isAdmin: true,
    isActive: true
  },
  {
    email: 'maria.khan@health.gov.pk',
    name: 'Dr. Maria Khan',
    role: 'Swat Divisional Director',
    district: 'Swat',
    pin: '5678',
    avatar: 'MK',
    color: 'bg-emerald-600',
    description: 'Oversight focused on Swat region clinics, BHUs and emergency centers.',
    badge: 'Swat Focus',
    isActive: true
  },
  {
    email: 'kamran.nowshera@health.gov.pk',
    name: 'Kamran Khan',
    role: 'District Monitor',
    district: 'Nowshera',
    pin: '9012',
    avatar: 'KK',
    color: 'bg-violet-600',
    description: 'Field officer managing Pabbi, Nowshera & Mardan rural auditing checklists.',
    badge: 'Nowshera Field',
    isActive: true
  },
  {
    email: 'sajid.kohat@health.gov.pk',
    name: 'Sajid Shah',
    role: 'Regional Quality Inspector',
    district: 'Kohat',
    pin: '3456',
    avatar: 'SS',
    color: 'bg-amber-600',
    description: 'Focused inspections of water, sanitation, and cold chain utilities in Kohat division.',
    badge: 'Kohat Field',
    isActive: true
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<View | 'login'>('login');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('registered_ids');
    let users = saved ? JSON.parse(saved) : OFFICER_PROFILES;
    
    // Safety check: ensure abbasaziz121@gmail.com is always present and active
    const adminIndex = users.findIndex((u: any) => u.email === 'abbasaziz121@gmail.com');
    if (adminIndex === -1) {
      users = [OFFICER_PROFILES[0], ...users];
    } else {
      // Force active status for the main admin email
      users[adminIndex].isActive = true;
      users[adminIndex].isAdmin = true;
    }
    return users;
  });

  useEffect(() => {
    localStorage.setItem('registered_ids', JSON.stringify(registeredUsers));
  }, [registeredUsers]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [user, setUser] = useState<{ 
    name: string; 
    role: string; 
    email: string; 
    district: string; 
    avatar?: string; 
    color?: string; 
    isAdmin?: boolean;
  } | null>(null);

  // States for multi-id logins
  const [selectedProfile, setSelectedProfile] = useState<any>(OFFICER_PROFILES[0]);
  const [typedEmail, setTypedEmail] = useState('');
  const [typedPassword, setTypedPassword] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    role: 'District Monitor',
    district: 'Peshawar',
    pin: '',
    isBiometricEnabled: false
  });
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('District Coordinator');
  const [customDistrict, setCustomDistrict] = useState('Peshawar');

  // Profile-based filtering state
  const [filterMyDistrictOnly, setFilterMyDistrictOnly] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [checklistScores, setChecklistScores] = useState<Record<string, number>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [selectedVisitReport, setSelectedVisitReport] = useState<any | null>(null);
  const [visits, setVisits] = useState<any[]>([
    { 
      id: 'V-2024-001', 
      facilityName: 'BHU Mathra', 
      date: '2024-04-10', 
      score: 65, 
      status: 'Processed', 
      rating: 'Poor',
      catchment: '15,000',
      opdAvg: '120',
      inspector: 'Abbas Aziz',
      recommendations: 'Female Medical Officer was absent. Biometric attendance terminal was dusty and barely functional. Essential antibiotics are stocked out.',
      scores: { 'hr1': 4, 'hr2': 1, 'hr3': 3, 'hr4': -1, 'hr5': 2, 'i1': 2, 'i2': 4, 'i3': 3, 'i4': 4, 'e1': 2, 'e2': 4, 'e3': 1, 'e4': -1, 'u1': 4, 'u2': 3, 'u3': 1, 'u4': -1, 'h1': 3, 'h2': 2, 'h3': -1, 'm1': 1, 'm2': 4, 'm3': 2, 'c1': 4, 'c2': 2, 'c3': 4, 'd1': -1, 'd2': -1, 'd3': -1, 'w1': 3, 'w2': 2, 'w3': 1, 'dh1': 4, 'dh2': 2, 'dh3': -1, 's1': 4, 's2': -1, 's3': 3, 's4': -1 }
    },
    { 
      id: 'V-2024-002', 
      facilityName: 'RHC Khushal Garh', 
      date: '2024-04-15', 
      score: 72, 
      status: 'Processed', 
      rating: 'Satisfactory',
      catchment: '35,000',
      opdAvg: '250',
      inspector: 'Sajid Shah',
      recommendations: 'Staff discipline is acceptable. Water availability is excellent. Solar backup system works perfectly. Laboratory rate list is not displayed and requires immediate action.',
      scores: { 'hr1': 4, 'hr2': 4, 'hr3': 4, 'hr4': 3, 'hr5': 4, 'i1': 3, 'i2': 3, 'i3': -1, 'i4': 4, 'e1': 4, 'e2': 4, 'e3': 4, 'e4': 4, 'u1': 5, 'u2': 4, 'u3': 5, 'u4': 4, 'h1': 4, 'h2': 3, 'h3': 3, 'm1': 4, 'm2': 5, 'm3': 4, 'c1': 5, 'c2': 5, 'c3': 5, 'd1': 3, 'd2': 1, 'd3': 3, 'w1': 4, 'w2': 4, 'w3': -1, 'dh1': 4, 'dh2': 4, 'dh3': 4, 's1': 4, 's2': -1, 's3': 4, 's4': 4 }
    },
    { 
      id: 'V-2024-003', 
      facilityName: 'THQ Hospital Takht-i-Bahi', 
      date: '2024-05-01', 
      score: 91, 
      status: 'Processed', 
      rating: 'Good',
      catchment: '120,000',
      opdAvg: '850',
      inspector: 'Dr. Maria Khan',
      recommendations: 'Cleanliness and hygiene standards are exemplary. Fully functional labour room and diagnostic laboratory. Duty rosters are updated and clearly visible. Highly recommended for regional benchmark status.',
      scores: { 'hr1': 5, 'hr2': 5, 'hr3': 5, 'hr4': 5, 'hr5': 5, 'i1': 4, 'i2': 5, 'i3': 5, 'i4': 5, 'e1': 5, 'e2': 5, 'e3': 5, 'e4': 5, 'u1': 5, 'u2': 4, 'u3': 5, 'u4': 4, 'h1': 5, 'h2': 5, 'h3': -1, 'm1': 5, 'm2': 5, 'm3': 5, 'c1': 5, 'c2': 5, 'c3': 5, 'd1': 5, 'd2': 5, 'd3': 5, 'w1': 5, 'w2': 5, 'w3': 5, 'dh1': 5, 'dh2': 5, 'dh3': 5, 's1': 5, 's2': 5, 's3': 5, 's4': 5 }
    },
  ]);
  const [extraInfo, setExtraInfo] = useState({
    catchment: '',
    opdAvg: '',
    recommendations: '',
    rating: 'Satisfactory'
  });

  const [isBiometricVerifying, setIsBiometricVerifying] = useState(false);

  const handleBiometricLogin = () => {
    setIsBiometricVerifying(true);
    // Simulate biometric scan
    setTimeout(() => {
      // Find the first registered user with biometric enabled
      const p = registeredUsers.find(u => u.isBiometricEnabled);
      
      if (p) {
        if (!p.isActive) {
          setAuthError('Biometric Access Denied: Account is inactive.');
          setIsBiometricVerifying(false);
          return;
        }
        setUser({
          name: p.name,
          role: p.role,
          email: p.email,
          district: p.district,
          avatar: p.avatar,
          color: p.color,
          isAdmin: p.email === 'abbasaziz121@gmail.com'
        });
        setFilterMyDistrictOnly(true);
        setCurrentView('dashboard');
        setAuthError(null);
      } else {
        setAuthError('No biometric identity found. Please login with PIN and enable fingerprint in profile.');
      }
      setIsBiometricVerifying(false);
    }, 2000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      const nameVal = regData.name || 'New Officer';
      const initials = nameVal.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      
      const newUser = {
        name: nameVal,
        role: regData.role,
        email: regData.email,
        district: regData.district,
        pin: regData.pin,
        isBiometricEnabled: regData.isBiometricEnabled,
        avatar: initials || 'OF',
        color: 'bg-indigo-600',
        isAdmin: regData.email === 'abbasaziz121@gmail.com',
        isActive: true
      };

      setRegisteredUsers(prev => [...prev, newUser]);
      setUser(newUser);
      setAuthError(null);
      
      setFilterMyDistrictOnly(true);
      setCurrentView('dashboard');
    } else {
      // Login mode - strictly check registeredUsers
      const p = registeredUsers.find(x => x.email === typedEmail);
      
      if (!p) {
        setAuthError('Access Denied: Account not found. Please register first.');
        return;
      }

      if (p.pin !== typedPassword) {
        setAuthError('Invalid Access PIN. Access Denied.');
        return;
      }

      if (!p.isActive) {
        setAuthError('Access Denied: Your account has been deactivated. Please contact administrator.');
        return;
      }

      setAuthError(null);
      setUser({
        name: p.name,
        role: p.role,
        email: p.email,
        district: p.district,
        avatar: p.avatar,
        color: p.color,
        isAdmin: p.email === 'abbasaziz121@gmail.com'
      });
      
      setFilterMyDistrictOnly(true);
      setCurrentView('dashboard');
    }
  };

  const handleQuickConnect = (profile: any) => {
    setUser({
      name: profile.name,
      role: profile.role,
      email: profile.email,
      district: profile.district,
      avatar: profile.avatar,
      color: profile.color,
      isAdmin: profile.email === 'abbasaziz121@gmail.com'
    });
    setFilterMyDistrictOnly(true);
    setCurrentView('dashboard');
  };
  
  const toggleUserStatus = (email: string) => {
    setRegisteredUsers(prev => prev.map(u => 
      u.email === email ? { ...u, isActive: !u.isActive } : u
    ));
  };

  const totalChecklistItems = useMemo<number>(() => 
    CHECKLIST_CATEGORIES.reduce((acc: number, cat) => acc + cat.questions.length, 0),
  []);

  const handleSubmitVisit = () => {
    if (!selectedFacility) return;
    
    const scoreEntries = Object.entries(checklistScores);
    const validScores = scoreEntries.filter(([_, val]) => val !== -1);
    const totalPoints = validScores.reduce((acc: number, [_, val]: [string, number]) => acc + val, 0);
    const totalPossiblePoints = validScores.length * 5;
    const totalScore = totalPossiblePoints > 0 ? Math.round((totalPoints / totalPossiblePoints) * 100) : 0;
    
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentYear = now.getFullYear();
    const newVisitNum = visits.length + 1;
    const newVisit = {
      id: `V-${currentYear}-${newVisitNum.toString().padStart(3, '0')}`,
      facilityName: selectedFacility.name,
      date: formattedDate,
      score: totalScore,
      status: 'Processed',
      rating: extraInfo.rating,
      catchment: extraInfo.catchment || 'N/A',
      opdAvg: extraInfo.opdAvg || 'N/A',
      recommendations: extraInfo.recommendations || 'None provided.',
      scores: { ...checklistScores },
      photos: [...capturedPhotos]
    };

    setVisits([newVisit, ...visits]);
    setCapturedPhotos([]);
    setChecklistScores({});
    setExtraInfo({ catchment: '', opdAvg: '', recommendations: '', rating: 'Satisfactory' });
    setSelectedFacility(null);
    setCurrentView('dashboard');
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCapturedPhotos(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setCapturedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const exportAuditHistory = () => {
    const dataToExport = visits.map(v => ({
      'Visit ID': v.id,
      'Facility Name': v.facilityName,
      'Date': v.date,
      'Performance Score (%)': v.score,
      'Rating': v.rating,
      'Status': v.status
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Audit History");
    XLSX.writeFile(workbook, `Health_Audit_History_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const downloadSingleExcel = (v: any) => {
    const dataToExport = [{
      'Visit ID': v.id,
      'Facility Name': v.facilityName,
      'Date': v.date,
      'Performance Score (%)': v.score,
      'Rating': v.rating,
      'Status': v.status,
      'Recommendations': v.recommendations || 'No recommendations provided',
      'Auditor': v.inspector || 'DG Health Official'
    }];
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Report");
    XLSX.writeFile(workbook, `Audit_Report_${v.facilityName.replace(/\s+/g, '_')}_${v.date.replace(/[:\s]/g, '_')}.xlsx`);
  };

  const downloadSingleWord = async (v: any) => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "DG HEALTH M&E PORTAL",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "OFFICIAL AUDIT REPORT",
                bold: true,
                size: 28,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Visit ID", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: `#${v.id}` })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Facility Name", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: v.facilityName })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Audit Date", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: v.date })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Score", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: `${v.score}% (${v.rating})` })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: v.status })] }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "Findings & Notes:", bold: true, underline: {} }),
            ],
          }),
          new Paragraph({
            text: v.recommendations || "No additional recommendations provided during this audit.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({ text: "This is a computer-generated report from the DG Health M&E Provincial Portal.", italics: true, size: 16 }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Audit_Report_${v.facilityName.replace(/\s+/g, '_')}_${v.date.replace(/[:\s]/g, '_')}.docx`);
  };

  const exportAuditHistoryToWord = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "DG HEALTH M&E PORTAL",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "Comprehensive Audit History Log",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "ID", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Facility", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Date", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Score", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true })] })] }),
                ],
              }),
              ...visits.map(v => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: v.id })] }),
                  new TableCell({ children: [new Paragraph({ text: v.facilityName })] }),
                  new TableCell({ children: [new Paragraph({ text: v.date })] }),
                  new TableCell({ children: [new Paragraph({ text: `${v.score}%` })] }),
                  new TableCell({ children: [new Paragraph({ text: v.status })] }),
                ],
              })),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Health_Audit_History_${new Date().toISOString().split('T')[0]}.docx`);
  };

  const filteredFacilities = useMemo(() => {
    return FACILITIES.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.district.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[480px] relative z-10"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
            {/* Header Section */}
            <div className="bg-slate-50/50 p-8 pt-10 text-center border-b border-slate-100">
              <div className="mb-6 flex flex-col items-center gap-4">
                <div className="p-5 bg-blue-600 rounded-[2rem] text-white shadow-2xl shadow-blue-200 flex items-center justify-center">
                  <Activity size={48} />
                </div>
                <div className="h-0.5 w-12 bg-blue-600 rounded-full opacity-20"></div>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                DG HEALTH M&E PORTAL
              </h1>
              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest px-4">
                {authMode === 'login' 
                  ? 'MONITORING & EVALUATION SYSTEM' 
                  : 'Join the Provincial Supervisory Network'}
              </p>
            </div>

            <div className="p-8 sm:p-10">
              {/* Tab Selector */}
              <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
                <button 
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    authMode === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    authMode === 'register' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {authMode === 'register' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Officer Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          placeholder="e.g. Dr. Ahmed Khan"
                          required
                          value={regData.name}
                          onChange={(e) => setRegData({...regData, name: e.target.value})}
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Role</label>
                        <select 
                          value={regData.role}
                          onChange={(e) => setRegData({...regData, role: e.target.value})}
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none text-sm font-medium"
                        >
                          <option>District Monitor</option>
                          <option>Provincial Monitor</option>
                          <option>Quality Inspector</option>
                          <option>Divisional Director</option>
                          <option>Field Officer</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">District</label>
                        <select 
                          value={regData.district}
                          onChange={(e) => setRegData({...regData, district: e.target.value})}
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white outline-none text-sm font-medium"
                        >
                          <option>Peshawar</option>
                          <option>Mardan</option>
                          <option>Swat</option>
                          <option>Kohat</option>
                          <option>Nowshera</option>
                        </select>
                      </div>
                    </div>

                  <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <div className="flex items-center h-5">
                      <input
                        id="biometric-toggle"
                        type="checkbox"
                        checked={regData.isBiometricEnabled}
                        onChange={(e) => setRegData({...regData, isBiometricEnabled: e.target.checked})}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <label htmlFor="biometric-toggle" className="flex flex-col cursor-pointer">
                      <span className="text-xs font-bold text-slate-700">Enable Biometric Login</span>
                      <span className="text-[10px] text-slate-500 font-medium">Use your fingerprint for faster secure access</span>
                    </label>
                  </div>
                </>
              )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Official Email</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      placeholder="officer@health.gov.pk"
                      required
                      value={authMode === 'login' ? typedEmail : regData.email}
                      onChange={(e) => {
                        setAuthError(null);
                        if(authMode === 'login') {
                          setIsManualMode(true);
                          setTypedEmail(e.target.value);
                        } else {
                          setRegData({...regData, email: e.target.value});
                        }
                      }}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Access PIN</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      required
                      value={authMode === 'login' ? typedPassword : regData.pin}
                      onChange={(e) => {
                        setAuthError(null);
                        if(authMode === 'login') {
                          setIsManualMode(true);
                          setTypedPassword(e.target.value);
                        } else {
                          setRegData({...regData, pin: e.target.value});
                        }
                      }}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm tracking-[0.3em] font-bold"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {authError && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-3"
                    >
                      <ShieldAlert className="text-rose-500 shrink-0" size={18} />
                      <p className="text-xs font-bold text-rose-600 leading-snug uppercase tracking-tight italic">
                        {authError}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  type="submit" 
                  className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <span>{authMode === 'login' ? 'Verify & Access' : 'Register Official Account'}</span>
                  <ChevronRight size={20} />
                </button>
              </form>

              {authMode === 'login' && (
                <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4 w-full">
                    <div className="h-px bg-slate-100 flex-1" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Biometric Unlock</span>
                    <div className="h-px bg-slate-100 flex-1" />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBiometricLogin}
                    disabled={isBiometricVerifying}
                    className={`relative w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all ${
                      isBiometricVerifying 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' 
                        : 'bg-white border-2 border-slate-100 text-slate-300 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50'
                    }`}
                  >
                    <Fingerprint size={32} />
                    {isBiometricVerifying && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: [0.5, 1, 0.5],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 border-2 border-white rounded-[2rem]"
                      />
                    )}
                  </motion.button>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {isBiometricVerifying ? 'Scanning Identity...' : 'Touch to Authenticate'}
                  </p>
                </div>
              )}

              {/* Security Footer */}
              <div className="mt-10 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    AES-256 Encrypted
                  </span>
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-blue-500" />
                    Verified ID
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        if (view !== 'new-visit') setSelectedFacility(null);
      }}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
        currentView === view 
          ? 'bg-blue-50 text-blue-700 font-semibold' 
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${currentView === view ? 'bg-blue-600' : 'bg-transparent'}`} />
      <span>{label}</span>
    </button>
  );

  const chartData = FACILITIES.slice(0, 10).map(f => ({ name: f.name.split(' ')[0], score: f.averageScore }));

  const dashboardStats = [
    { label: 'Facilities Total', value: FACILITIES.length.toString(), icon: Hospital, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Visits Conducted', value: (visits.length + 15).toString(), icon: ClipboardList, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'Avg Health Score', value: `${Math.round(FACILITIES.reduce((acc, f) => acc + (f.averageScore || 0), 0) / FACILITIES.length)}%`, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-100' },
    { label: 'Action Required', value: FACILITIES.filter(f => (f.averageScore || 0) < 65).length.toString(), icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-100' },
  ];

  const activeRegions = Array.from(new Set(FACILITIES.map(f => f.district))).slice(0, 8);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 italic-selection">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-slate-100 mb-2 flex flex-col items-center">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 mb-4">
            <Activity size={24} />
          </div>
          <div className="text-center">
            <h1 className="text-[10px] font-black uppercase tracking-widest text-slate-400">DG Health M&E</h1>
            <p className="mt-0.5 text-[10px] font-black uppercase tracking-tight text-blue-600">Provincial Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <div className="sidebar-label mt-4">System Governance</div>
          <NavItem view="dashboard" icon={LayoutDashboard} label="Mission Control" />
          <NavItem view="facilities" icon={MapPin} label="Regional Facilities" />
          <NavItem view="reports" icon={History} label="Audit Archives" />
          {user?.isAdmin && (
            <NavItem view="users" icon={User} label="Manage Users" />
          )}

          <div className="sidebar-label mt-8">Provincial Coverage</div>
          {activeRegions.map(district => (
            <button key={district} className="w-full flex items-center px-3 py-2 text-slate-500 hover:bg-slate-50 rounded-lg text-sm transition-colors group">
              <div className="w-2 h-2 rounded-full mr-3 bg-blue-600"></div>
              <span>{district} District</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-50/50">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
               {user?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold truncate">{user?.name}</p>
                {user?.isAdmin && (
                  <ShieldCheck size={12} className="text-blue-600" />
                )}
              </div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                {user?.isAdmin ? 'System Administrator' : 'Section Officer'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              setUser(null);
              setCurrentView('login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md">
              <Activity size={20} />
            </div>
            <h1 className="font-black text-[10px] text-blue-600 tracking-tighter uppercase">DG Health M&E</h1>
          </div>
          
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="search" 
                placeholder="Find facility identity..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-lg text-sm transition-all outline-none placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {currentView === 'new-visit' && selectedFacility && (
              <div className="flex items-center space-x-4 pr-6 border-r border-slate-100 hidden sm:flex">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Current Progress</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500" 
                        style={{ width: `${(Object.keys(checklistScores).length / totalChecklistItems) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold">{Math.round((Object.keys(checklistScores).length / totalChecklistItems) * 100)}%</span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3 pr-6 border-r border-slate-100 hidden md:flex">
               <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">System Status</p>
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-600">Operational</span>
                  </div>
               </div>
            </div>
            {currentView === 'new-visit' ? (
              <button 
                className="btn-primary" 
                onClick={handleSubmitVisit}
                disabled={Object.keys(checklistScores).length < totalChecklistItems}
              >
                <CheckCircle2 size={16} />
                <span>Submit Audit</span>
              </button>
            ) : (
              <button className="btn-primary" onClick={() => setCurrentView('facilities')}>
                <Plus size={16} />
                <span>Record Audit</span>
              </button>
            )}
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-200">
                      <Activity size={40} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight text-slate-900">Health Monitoring Overview</h2>
                      <p className="text-slate-500 mt-1">Real-time performance metrics across the province.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200">
                    <TrendingUp size={16} className="text-green-500" />
                    <span>8% higher than last month</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {dashboardStats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="dashboard-card group relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-2 relative z-10">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                         <stat.icon size={14} className={`${stat.color} opacity-40`} />
                      </div>
                      <h3 className="text-3xl font-bold text-slate-900 tracking-tighter relative z-10">{stat.value}</h3>
                      <div className="mt-4 flex items-center gap-1.5 z-10 relative">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Active tracking</p>
                      </div>
                      <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 transition-transform group-hover:scale-110 duration-500">
                        <stat.icon size={80} strokeWidth={1} />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 dashboard-card">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-bold text-lg">Facility Performance Score</h3>
                      <select className="bg-slate-50 border-none text-xs font-bold py-1 px-3 rounded-lg outline-none">
                        <option>Most Recent</option>
                        <option>District Average</option>
                      </select>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                          />
                          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#3b82f6' : entry.score > 70 ? '#fbbf24' : '#ef4444'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <h3 className="font-bold text-lg mb-6">Recent Alerts</h3>
                    <div className="space-y-4">
                      {[
                        { title: 'Medicine Stockout', facility: 'Southern Rural Hospital', time: '2h ago', level: 'danger' },
                        { title: 'Staff Attendance Issue', facility: 'Nawasa Community Clinic', time: '1d ago', level: 'warning' },
                        { title: 'Water Supply Restored', facility: 'West Health Center', time: '2d ago', level: 'success' },
                      ].map((alert, i) => (
                        <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                          <div className={`mt-1 p-1.5 rounded-full ${
                             alert.level === 'danger' ? 'bg-rose-100 text-rose-600' : 
                             alert.level === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                          }`}>
                            {alert.level === 'danger' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{alert.title}</p>
                            <p className="text-xs text-slate-500">{alert.facility}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{alert.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-2 group">
                      View All Alerts
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Upcoming Inspections</h3>
                    <button className="text-xs font-bold text-blue-600">View Calendar</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="pb-4 font-bold text-xs uppercase tracking-wider text-slate-400">Facility</th>
                          <th className="pb-4 font-bold text-xs uppercase tracking-wider text-slate-400">District</th>
                          <th className="pb-4 font-bold text-xs uppercase tracking-wider text-slate-400">Scheduled Date</th>
                          <th className="pb-4 font-bold text-xs uppercase tracking-wider text-slate-400">Type</th>
                          <th className="pb-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {FACILITIES.slice(0, 3).map((f) => (
                          <tr key={f.id} className="group">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                  <Hospital size={18} />
                                </div>
                                <span className="text-sm font-bold">{f.name}</span>
                              </div>
                            </td>
                            <td className="py-4 text-sm text-slate-500 font-medium">{f.district}</td>
                            <td className="py-4 text-sm font-mono font-bold text-slate-600 tracking-tighter italic opacity-80">May 15, 2024</td>
                            <td className="py-4">
                              <span className={`status-badge ${
                                f.type === FacilityType.BHU ? 'bg-blue-100 text-blue-700' : 
                                f.type === FacilityType.RHC ? 'bg-purple-100 text-purple-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {f.type}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <button 
                                onClick={() => {
                                  setSelectedFacility(f);
                                  setCurrentView('new-visit');
                                }}
                                className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                              >
                                <ChevronRight size={20} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'facilities' && (
              <motion.div 
                key="facilities"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Health Facilities</h2>
                  <p className="text-slate-500">Select a facility to review performance or start a new visit.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFacilities.map((f) => (
                    <motion.div
                      layoutId={f.id}
                      key={f.id}
                      onClick={() => {
                        setSelectedFacility(f);
                        setCurrentView('new-visit');
                      }}
                      className="dashboard-card cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-100 text-slate-600 rounded-xl group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <Hospital size={24} />
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            f.averageScore! > 80 ? 'text-green-600' : f.averageScore! > 70 ? 'text-amber-600' : 'text-rose-600'
                          }`}>{f.averageScore}%</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Score</div>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 mb-1">{f.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                         <MapPin size={14} />
                         <span>{f.district} District</span>
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          Last Visit: <span className="text-slate-900">{f.lastVisit}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentView === 'new-visit' && selectedFacility && (
              <motion.div 
                key="new-visit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                   <button 
                    onClick={() => setCurrentView('facilities')}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                   >
                     <LayoutDashboard size={20} />
                   </button>
                   <div>
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        {selectedFacility.name}
                        <span className={`status-badge ${
                          selectedFacility.type === FacilityType.BHU ? 'bg-blue-100 text-blue-700' : 
                          selectedFacility.type === FacilityType.RHC ? 'bg-purple-100 text-purple-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {selectedFacility.type}
                        </span>
                      </h2>
                     <p className="text-sm text-slate-500">Supervisory Checklist - Part of {selectedFacility.district} District Oversight</p>
                   </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <History size={18} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-bold text-slate-900">Past Audit History</h3>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Records for this facility</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {visits.filter(v => v.facilityName === selectedFacility.name).length} records
                      </span>
                      {showHistory ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {showHistory && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100 overflow-hidden"
                      >
                        <div className="p-6 pt-0">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left">
                              <thead>
                                <tr className="border-b border-slate-100">
                                  <th className="py-3 font-bold text-[10px] uppercase tracking-wider text-slate-400">Date</th>
                                  <th className="py-3 font-bold text-[10px] uppercase tracking-wider text-slate-400">Score</th>
                                  <th className="py-3 font-bold text-[10px] uppercase tracking-wider text-slate-400">Rating</th>
                                  <th className="py-3"></th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {visits.filter(v => v.facilityName === selectedFacility.name).length > 0 ? (
                                  visits.filter(v => v.facilityName === selectedFacility.name).map((v) => (
                                    <tr key={v.id} className="group">
                                      <td className="py-3 text-sm font-medium text-slate-600">{v.date}</td>
                                      <td className="py-3">
                                        <div className="flex items-center gap-2">
                                           <span className={`text-sm font-bold ${v.score > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{v.score}%</span>
                                        </div>
                                      </td>
                                      <td className="py-3">
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                          v.rating === 'Good' ? 'bg-emerald-100 text-emerald-700' : 
                                          v.rating === 'Poor' ? 'bg-rose-100 text-rose-700' : 
                                          v.rating === 'N/A' ? 'bg-slate-100 text-slate-700' :
                                          'bg-amber-100 text-amber-700'
                                        }`}>
                                          {v.rating}
                                        </span>
                                      </td>
                                      <td className="py-3 text-right">
                                        <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-tighter">View Report</button>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={4} className="py-8 text-center text-slate-400 text-xs italic">
                                      No past visits recorded for this facility
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Catchment Population</label>
                      <button 
                        type="button"
                        onClick={() => setExtraInfo(prev => ({ ...prev, catchment: prev.catchment === 'N/A' ? '' : 'N/A' }))}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all border ${
                          extraInfo.catchment === 'N/A' 
                            ? 'bg-slate-800 border-slate-800 text-white shadow-sm' 
                            : 'bg-white border-slate-200 text-slate-450 hover:border-slate-300'
                        }`}
                      >
                        N/A
                      </button>
                    </div>
                    <input 
                      type="text" 
                      placeholder={extraInfo.catchment === 'N/A' ? 'Not Applicable' : 'Enter population...'}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
                      value={extraInfo.catchment}
                      disabled={extraInfo.catchment === 'N/A'}
                      onChange={(e) => setExtraInfo(prev => ({ ...prev, catchment: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg OPD Per Day</label>
                      <button 
                        type="button"
                        onClick={() => setExtraInfo(prev => ({ ...prev, opdAvg: prev.opdAvg === 'N/A' ? '' : 'N/A' }))}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all border ${
                          extraInfo.opdAvg === 'N/A' 
                            ? 'bg-slate-800 border-slate-800 text-white shadow-sm' 
                            : 'bg-white border-slate-200 text-slate-450 hover:border-slate-300'
                        }`}
                      >
                        N/A
                      </button>
                    </div>
                    <input 
                      type="text" 
                      placeholder={extraInfo.opdAvg === 'N/A' ? 'Not Applicable' : 'Daily average...'}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
                      value={extraInfo.opdAvg}
                      disabled={extraInfo.opdAvg === 'N/A'}
                      onChange={(e) => setExtraInfo(prev => ({ ...prev, opdAvg: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-12 pb-12">
                  {CHECKLIST_CATEGORIES.map((cat) => (
                    <section key={cat.id}>
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex justify-between border-b border-slate-100 pb-2">
                        <span>{cat.title}</span>
                        <span className="text-blue-600 font-black">
                          {cat.questions.filter(q => checklistScores[q.id]).length}/{cat.questions.length} completed
                        </span>
                      </h3>
                      <div className="space-y-3">
                        {cat.questions.map((q) => (
                          <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-200 transition-colors shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <p className="text-slate-700 font-medium text-sm flex-1">{q.question}</p>
                              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                <button
                                  onClick={() => setChecklistScores(prev => ({ ...prev, [q.id]: -1 }))}
                                  className={`px-3 h-9 rounded-lg font-black text-[10px] uppercase tracking-tighter transition-all pointer-events-auto border ${
                                    checklistScores[q.id] === -1 
                                      ? 'bg-slate-800 border-slate-800 text-white shadow-lg' 
                                      : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                                  }`}
                                >
                                  N/A
                                </button>
                                {[1, 2, 3, 4, 5].map((val) => (
                                  <button
                                    key={val}
                                    onClick={() => setChecklistScores(prev => ({ ...prev, [q.id]: val }))}
                                    className={`w-9 h-9 rounded-lg font-bold text-xs transition-all pointer-events-auto border ${
                                      checklistScores[q.id] === val 
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 active:scale-110' 
                                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                                    }`}
                                  >
                                    {val}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}

                  <section className="space-y-6">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Camera size={14} className="text-blue-500" />
                       Photographic Evidence
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {capturedPhotos.map((photo, idx) => (
                          <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200">
                            <img src={photo} alt="Evidence" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button 
                              onClick={() => removePhoto(idx)}
                              className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group text-slate-400 hover:text-blue-600">
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Camera size={20} />
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-tight">Capture Image</p>
                          <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            capture="environment"
                            className="hidden" 
                            onChange={handlePhotoCapture}
                          />
                        </label>
                      </div>
                      {capturedPhotos.length === 0 && (
                        <p className="text-[10px] text-slate-400 mt-4 text-center font-medium italic">No photographic evidence attached to this visit report.</p>
                      )}
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <TrendingUp size={14} className="text-blue-500" />
                       Final Review & Action Points
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">Overall Facility Rating</label>
                        <div className="flex flex-wrap gap-2">
                          {['Good', 'Satisfactory', 'Poor'].map((r) => (
                            <button
                              key={r}
                              onClick={() => setExtraInfo(prev => ({ ...prev, rating: r }))}
                              className={`px-6 py-2 rounded-lg text-xs font-bold border transition-all ${
                                extraInfo.rating === r
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                                  : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">Key Recommendations & Action Points</label>
                        <textarea 
                          placeholder="Immediate, Medium-term, and Long-term improvements..."
                          className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all resize-none shadow-inner"
                          value={extraInfo.recommendations}
                          onChange={(e) => setExtraInfo(prev => ({ ...prev, recommendations: e.target.value }))}
                        />
                      </div>
                    </div>
                  </section>
                </div>

                <div className="fixed bottom-8 left-0 right-0 lg:left-64 flex justify-center px-8 z-50 pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-md px-10 py-5 rounded-3xl border border-slate-200 shadow-2xl flex items-center justify-between gap-12 pointer-events-auto max-w-4xl w-full">
                    <div className="flex-1">
                      <div className="flex justify-between items-end mb-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Audit Progress</p>
                        <p className="text-[10px] font-black text-blue-600 uppercase">
                          {Math.round((Object.keys(checklistScores).length / totalChecklistItems) * 100)}%
                        </p>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-500" 
                          style={{ width: `${(Object.keys(checklistScores).length / totalChecklistItems) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <button 
                      className="btn-primary py-3.5 px-10 shadow-xl shadow-blue-100 disabled:opacity-50"
                      disabled={Object.keys(checklistScores).length < totalChecklistItems}
                      onClick={handleSubmitVisit}
                    >
                      <CheckCircle2 size={18} />
                      <span>Submit Official Audit Report</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'users' && user?.isAdmin && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
                    <p className="text-slate-500">Manage registered health monitoring personnel and their access status.</p>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-slate-400">Officer Profile</th>
                          <th className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-slate-400">Designation & Region</th>
                          <th className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">Status</th>
                          <th className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-slate-400 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {registeredUsers.map((u) => (
                          <tr key={u.email} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl ${u.color || 'bg-slate-200'} flex items-center justify-center text-sm font-black text-white shadow-xl shadow-slate-200/50`}>
                                  {u.avatar || u.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-black text-slate-900 tracking-tight">{u.name}</p>
                                  <p className="text-xs font-bold text-slate-400 italic lowercase">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-700">{u.role}</p>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{u.district}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex flex-col items-center gap-2">
                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                  u.isActive 
                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                                    : 'bg-rose-50 border-rose-100 text-rose-600'
                                }`}>
                                  {u.isActive ? 'Active Personnel' : 'Deactivated'}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              {u.email !== user.email ? (
                                <button 
                                  onClick={() => toggleUserStatus(u.email)}
                                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    u.isActive 
                                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100' 
                                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
                                  }`}
                                >
                                  {u.isActive ? 'Deactivate Access' : 'Restore Access'}
                                </button>
                              ) : (
                                <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest px-6">Current Admin</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'reports' && (
              <motion.div 
                key="reports"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Audit History</h2>
                    <p className="text-slate-500">Comprehensive log of past facility inspections and scores.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={exportAuditHistory}
                      className="btn-secondary"
                    >
                      <FileSpreadsheet size={16} />
                      <span>Bulk Excel</span>
                    </button>
                    <button 
                      onClick={exportAuditHistoryToWord}
                      className="btn-secondary"
                    >
                      <FileText size={16} />
                      <span>Bulk Word</span>
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">ID</th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Facility</th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Date</th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Score</th>
                        <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Status</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {visits.map((visit) => (
                        <tr key={visit.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-xs font-mono font-bold text-slate-400 tracking-tighter italic opacity-80 uppercase">#{visit.id}</td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-slate-800">{visit.facilityName}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 font-medium">{visit.date}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                                 <div className={`h-full ${visit.score > 80 ? 'bg-emerald-500' : visit.score > 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${visit.score}%` }}></div>
                               </div>
                               <span className="text-xs font-bold">{visit.score}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="status-badge bg-emerald-100 text-emerald-700">{visit.status}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => downloadSingleExcel(visit)}
                                className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                                title="Download Excel"
                              >
                                <FileSpreadsheet size={16} />
                              </button>
                              <button 
                                onClick={() => downloadSingleWord(visit)}
                                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                title="Download Word"
                              >
                                <FileText size={16} />
                              </button>
                              <button 
                                onClick={() => setSelectedVisitReport(visit)}
                                className="text-sm font-bold text-blue-600 hover:underline px-2"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Visit Report Detail Modal */}
          <AnimatePresence>
            {selectedVisitReport && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedVisitReport(null)}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col border border-slate-200"
                >
                  {/* Modal Header */}
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200">
                        <FileCheck size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold text-slate-900">{selectedVisitReport.facilityName}</h2>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            selectedVisitReport.score > 80 ? 'bg-emerald-100 text-emerald-700' : 
                            selectedVisitReport.score > 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {selectedVisitReport.rating}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">
                          Audit ID: #{selectedVisitReport.id} • Conducted on {selectedVisitReport.date}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedVisitReport(null)}
                      className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Performance</p>
                        <p className="text-3xl font-black text-slate-900">{selectedVisitReport.score}%</p>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">OPD Frequency</p>
                        <p className="text-3xl font-black text-slate-900">{selectedVisitReport.opdAvg || '120'}</p>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Staffing</p>
                        <p className="text-3xl font-black text-blue-600">Active</p>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Inspector</p>
                        <p className="text-sm font-black text-slate-700 mt-2">{selectedVisitReport.inspector || 'Abbas Aziz'}</p>
                      </div>
                    </div>

                    {/* Recommendations Section */}
                    <section className="space-y-4">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={16} className="text-blue-500" />
                        Official Recommendations
                      </h3>
                      <div className="bg-white border-2 border-blue-50 rounded-3xl p-8 shadow-sm">
                        <p className="text-base text-slate-600 leading-relaxed italic font-medium">
                          "{selectedVisitReport.recommendations || 'No specific recommendations were recorded for this monitoring visit.'}"
                        </p>
                      </div>
                    </section>

                    {/* Section for Scores Breakdown - Mini Visualization */}
                    <section className="space-y-4">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <Sliders size={16} className="text-indigo-500" />
                        Infrastructure & Services Audit
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { label: 'Human Resources', key: 'hr' },
                          { label: 'Infrastructure', key: 'i' },
                          { label: 'Equipment', key: 'e' },
                          { label: 'Pharmacy/Supplies', key: 'm' },
                          { label: 'Cleanliness/WASH', key: 'w' },
                        ].map(section => {
                          // Simple mock logic to show section scores if they exist
                          return (
                            <div key={section.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <span className="text-sm font-bold text-slate-700">{section.label}</span>
                              <div className="flex items-center gap-3">
                                <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500" style={{ width: '75%' }}></div>
                                </div>
                                <span className="text-xs font-black text-slate-500 uppercase italic">Optimum</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    {/* Attached Evidence */}
                    {selectedVisitReport.photos && selectedVisitReport.photos.length > 0 && (
                      <section className="space-y-4">
                         <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <Camera size={16} className="text-emerald-500" />
                          Photographic Evidence
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {selectedVisitReport.photos.map((photo: string, idx: number) => (
                            <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-md border border-slate-100 group">
                              <img 
                                src={photo} 
                                alt={`Evidence ${idx + 1}`} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Modal Footer (Action Buttons) */}
                  <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                       <button 
                        onClick={() => downloadSingleExcel(selectedVisitReport)}
                        className="btn-secondary px-8"
                      >
                        <FileSpreadsheet size={18} className="text-emerald-600" />
                        <span>Export Excel</span>
                      </button>
                      <button 
                        onClick={() => downloadSingleWord(selectedVisitReport)}
                        className="btn-secondary px-8"
                      >
                        <FileText size={18} className="text-blue-600" />
                        <span>Download Word</span>
                      </button>
                    </div>
                    <button 
                      onClick={() => setSelectedVisitReport(null)}
                      className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                    >
                      Close Report
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}
