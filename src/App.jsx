import React, { useMemo, useState, useRef, useCallback } from "react";

const h = React.createElement;
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const CAL_START = 6 * 60;
const PX_PER_MIN = 1.05;
const CAL_HEIGHT = 17 * 60 * PX_PER_MIN;
let nextId = 3;

const BLOCK_SCHEDULES = {
  "16-week": [
    { category: "18 hour classes", pattern: "1 weekly hour", hours: "18 hours", ch: "1 CH", break: "No break", times: ["8:00 - 8:50", "9:30 - 10:20", "11:00 - 11:50", "12:30 - 1:20", "2:00 - 2:50", "3:30 - 4:20", "5:00 - 5:50", "6:00 - 6:50", "7:00 - 7:50"] },
    { category: "36 hour classes", pattern: "2 weekly hours", hours: "36 hours", ch: "2.1 CH", break: "20 min. break", times: ["8:00 - 10:05", "10:15 - 12:20", "12:30 - 2:35", "2:45 - 4:50", "5:00 - 7:15", "7:15 - 9:20"] },
    { category: "54 hour classes", pattern: "MW or TR", hours: "54.4 hours", ch: "1.6 CH", break: "No break", times: ["6:30 - 7:50", "8:00 - 9:20", "9:30 - 10:50", "11:00 - 12:20", "12:30 - 1:50", "2:00 - 3:20", "3:30 - 4:50", "5:00 - 6:20", "8:00 - 9:20"] },
    { category: "54 hour classes", pattern: "Single session or Lab", hours: "54.4 hours", ch: "3.2 CH", break: "25 min. break", times: ["7:45 - 10:50", "9:30 - 12:35", "11:00 - 2:05", "12:30 - 3:35", "2:00 - 5:05", "5:00 - 8:05", "6:30 - 9:35", "7:15 - 10:20"] },
    { category: "72 hour classes", pattern: "MW or TR", hours: "71.4 hours", ch: "2.1 CH", break: "20 min. break", times: ["8:00 - 10:05", "10:15 - 12:20", "12:30 - 2:35", "2:45 - 4:50", "5:00 - 7:05", "7:15 - 9:20"] },
    { category: "72 hour classes", pattern: "MWF/TRF", hours: "71.4 hours", ch: "1.4 CH", break: "No break", times: ["8:00 - 9:10", "9:30 - 10:40", "11:00 - 12:10", "12:30 - 1:40", "2:00 - 3:10", "3:30 - 4:40", "5:00 - 6:10", "6:30 - 7:40", "8:00 - 9:10"] },
    { category: "72 hour classes", pattern: "Single session or Lab", hours: "71.4 hours", ch: "4.2 CH", break: "35 min. break", times: ["8:00 - 12:05", "12:30 - 4:35", "6:00 - 10:05"] },
    { category: "90 hour classes", pattern: "MW or TR", hours: "88.4 hours", ch: "2.8 CH", break: "20 min. break", times: ["8:00 - 10:30", "11:00 - 1:30", "2:00 - 4:30", "5:00 - 7:30", "7:45 - 10:15"] },
    { category: "90 hour classes", pattern: "MTWR", hours: "88.4 hours", ch: "1.3 CH", break: "No break", times: ["6:45 - 7:50", "8:00 - 9:05", "9:30 - 10:35", "11:00 - 12:05", "12:30 - 1:35", "2:00 - 3:05", "3:30 - 4:35", "5:00 - 6:05", "6:30 - 7:35", "8:00 - 9:05"] },
    { category: "90 hour classes", pattern: "Single session or Lab", hours: "88.4 hours", ch: "5.2 CH", break: "45 min. break", times: ["7:45 - 12:50", "1:00 - 6:05", "5:00 - 10:05"] },
    { category: "108 hour classes", pattern: "MW or TR", hours: "108.8 hours", ch: "3.2 CH", break: "25 min. break", times: ["7:45 - 10:50", "9:30 - 12:35", "11:00 - 2:05", "12:30 - 3:35", "2:00 - 5:05", "5:00 - 8:05", "6:30 - 9:35", "7:15 - 10:20"] },
    { category: "108 hour classes", pattern: "MTWR", hours: "108.8 hours", ch: "1.6 CH", break: "No break", times: ["6:30 - 7:50", "8:00 - 9:20", "9:30 - 10:50", "11:00 - 12:20", "12:30 - 1:50", "2:00 - 3:20", "3:30 - 4:50", "5:00 - 6:20", "6:30 - 7:20", "7:30 - 8:50"] }
  ],
  "12-week": [
    { category: "18 hour classes", pattern: "1 weekly hour", hours: "17.6 hours", ch: "1.6 CH", break: "No break", times: ["8:00 - 9:20", "9:30 - 10:50", "11:00 - 12:20", "1:00 - 2:20", "2:30 - 3:50", "4:00 - 5:20", "5:30 - 6:50", "6:00 - 7:20", "7:30 - 8:50"] },
    { category: "36 hour classes", pattern: "MW or TR", hours: "36.8 hours", ch: "1.6 CH", break: "20 min. break", times: ["6:30 - 7:50", "8:00 - 9:20", "9:30 - 10:50", "11:00 - 12:20", "12:30 - 1:50", "2:00 - 3:20", "3:30 - 4:50", "5:00 - 6:20", "6:30 - 7:20", "7:30 - 8:50"] },
    { category: "54 hour classes", pattern: "MW or TR", hours: "52.9 hours", ch: "2.3 CH", break: "10 min. break", times: ["8:00 - 10:05", "10:15 - 12:20", "12:30 - 2:35", "2:45 - 4:50", "5:00 - 7:05", "7:15 - 9:20"] },
    { category: "72 hour classes", pattern: "MW or TR", hours: "71.3 hours", ch: "3.1 CH", break: "30 min. break", times: ["7:45 - 10:50", "9:30 - 12:35", "11:00 - 2:05", "12:30 - 3:35", "2:00 - 5:05", "5:00 - 8:05", "6:30 - 9:35", "7:15 - 10:20"] },
    { category: "90 hour classes", pattern: "MW or TR", hours: "89.7 hours", ch: "3.9 CH", break: "20 min. break", times: ["8:00 - 11:35", "12:30 - 4:05", "5:00 - 8:35", "6:30 - 10:05"] },
    { category: "108 hour classes", pattern: "MW or TR", hours: "108.1 hours", ch: "4.7 CH", break: "30 min. break", times: ["7:45 - 12:10", "12:30 - 4:55", "5:30 - 9:55", "6:00 - 10:25"] }
  ],
  "8-week": [
    { category: "18 hour classes", pattern: "MW or TR", hours: "17.6 hours", ch: "1.1 CH", break: "10 min. break", times: ["8:00 - 9:05", "9:30 - 10:35", "11:00 - 12:05", "1:00 - 2:05", "2:30 - 3:35", "4:00 - 5:05", "6:00 - 7:05"] },
    { category: "36 hour classes", pattern: "MW or TR", hours: "34.5 hours", ch: "2.3 CH", break: "10 min. break", times: ["8:00 - 10:05", "9:30 - 11:35", "10:15 - 12:20", "1:00 - 3:05", "3:15 - 5:20", "6:00 - 8:05"] },
    { category: "54 hour classes", pattern: "MTWR", hours: "51.2 hours", ch: "1.6 CH", break: "No break", times: ["6:30 - 7:50", "8:00 - 9:20", "9:30 - 10:50", "11:00 - 12:20", "12:30 - 1:50", "2:00 - 3:20", "3:30 - 4:50", "5:00 - 6:20", "6:30 - 7:20", "7:30 - 8:50"] },
    { category: "54 hour classes", pattern: "Lab 2/wk", hours: "52.5 hours", ch: "3.5 CH", break: "20 min. break", times: ["7:45 - 11:00", "9:30 - 12:45", "11:00 - 2:15", "12:30 - 3:45", "2:00 - 5:15", "5:00 - 8:15", "6:30 - 9:45", "7:15 - 10:30"] },
    { category: "72 hour classes", pattern: "MTWR", hours: "70.4 hours", ch: "2.2 CH", break: "15 min. break", times: ["8:00 - 10:05", "10:15 - 12:20", "12:30 - 2:35", "2:45 - 4:50", "5:00 - 7:05", "7:15 - 9:20"] },
    { category: "90 hour classes", pattern: "MTWR", hours: "86.4 hours", ch: "2.7 CH", break: "10 min. break", times: ["8:00 - 10:25", "11:00 - 1:25", "2:00 - 4:25", "5:00 - 7:25", "7:45 - 10:10"] },
    { category: "108 hour classes", pattern: "MTWR", hours: "105.6 hours", ch: "6.6 CH", break: "20 min. break", times: ["7:45 - 10:50", "11:00 - 2:05", "2:30 - 5:35", "6:00 - 9:05"] }
  ],
  "6-week": [
    { category: "18 hour classes", pattern: "MW or TR", hours: "17.6 hours", ch: "1.6 CH", break: "No break", times: ["6:30 - 7:50", "8:00 - 9:20", "9:30 - 10:50", "11:00 - 12:20", "12:30 - 1:50", "2:00 - 3:20", "3:30 - 4:50", "5:00 - 6:20", "6:30 - 7:20", "7:30 - 8:50"] },
    { category: "36 hour classes", pattern: "MTWR", hours: "36.8 hours", ch: "1.6 CH", break: "No break", times: ["6:30 - 7:50", "8:00 - 9:20", "9:30 - 10:50", "11:00 - 12:20", "12:30 - 1:50", "2:00 - 3:20", "3:30 - 4:50", "5:00 - 6:20", "6:30 - 7:20", "7:30 - 8:50"] },
    { category: "54 hour classes", pattern: "MTWR", hours: "52.9 hours", ch: "2.3 CH", break: "10 min. break", times: ["8:00 - 10:05", "10:15 - 12:20", "12:30 - 2:35", "2:45 - 4:50", "5:00 - 7:05", "7:15 - 9:20"] },
    { category: "72 hour classes", pattern: "MTWR", hours: "71.3 hours", ch: "3.1 CH", break: "30 min. break", times: ["7:45 - 10:50", "9:30 - 12:35", "11:00 - 2:05", "12:30 - 3:35", "2:00 - 5:05", "5:00 - 8:05", "6:30 - 9:35", "7:15 - 10:20"] },
    { category: "90 hour classes", pattern: "MTWR", hours: "89.7 hours", ch: "3.9 CH", break: "20 min. break", times: ["8:00 - 11:35", "12:30 - 4:05", "5:30 - 9:05", "6:30 - 10:05"] },
    { category: "108 hour classes", pattern: "MTWR", hours: "108.1 hours", ch: "4.7 CH", break: "30 min. break", times: ["7:45 - 12:10", "12:30 - 4:55", "5:30 - 9:55", "6:00 - 10:25"] }
  ]
};

const COURSE_ROWS = {
  Welding: [["75900","WELD","110"],["73812","WELD","110"],["71329","WELD","110"],["75118","WELD","110"],["72987","WELD","120"],["71331","WELD","120"],["74261","WELD","120"],["71335","WELD","130"],["74262","WELD","130"],["75902","WELD","130"],["79255","WELD","135"],["79597","WELD","135"],["79258","WELD","137"],["79595","WELD","138"],["79259","WELD","200"],["77681","WELD","212"],["77682","WELD","212"],["75965","WELD","230"],["78843","WELD","240"],["79257","WELD","260"],["79256","WELD","265"]],
  IMTA: [["77427","IMTA","210"],["77428","IMTA","212"]],
  Electrical: [["72726","ELEC","110"],["79254","ELEC","110"],["79803","ELEC","110"],["75796","ELEC","115"],["77194","ELEC","120"],["79040","ELEC","120"],["72972","ELEC","150"],["74251","ELEC","160"],["74252","ELEC","160"],["79253","ELEC","220"]],
  Automotive: [["79249","AUTO","100"],["77287","AUTO","100"],["78852","AUTO","100"],["79250","AUTO","160"],["77472","AUTO","160"],["78790","AUTO","211"],["79593","AUTO","220"],["79594","AUTO","240"],["77553","AUTO","250"],["78789","AUTO","270"],["79252","AUTO","280"]],
  "Auto Body": [["70153","ABDY","112"],["70154","ABDY","113"],["70155","ABDY","115"],["77671","ABDY","122"],["77672","ABDY","123"],["70158","ABDY","212"],["70159","ABDY","213"],["70160","ABDY","215"],["77673","ABDY","222"],["72541","ABDY","223"]],
  ACRV: [["72961","ACRV","112"],["78781","ACRV","113"],["79589","ACRV","123"],["79590","ACRV","213"],["78755","ACRV","222"]]
};

const COURSE_CATALOG = Object.fromEntries(Object.entries(COURSE_ROWS).map(([department, rows]) => [department, rows.map(([crn, sub, number]) => ({ key: `${department}-${crn}`, label: `${sub.charAt(0)}${sub.slice(1).toLowerCase()} ${number} - ${crn}`, crn, sub, number }))]));
const EXPORT_HEADERS = ["ID","faculty","CRN","sub","#","sec","days","s time","e time","ses #","X","bldg","rm","s date","e date","hrs/d","hrs/wk","hrs/ttl","LHE","max","wait","ma","mt","comments","ZTC/LTC?","Initiative"];
const EXPORT_SHEETS = ["ABDY","ACRV","AUTO","ELEC","IMTA","WELD"];
const DEPARTMENT_TO_SHEET = { "Auto Body":"ABDY", ACRV:"ACRV", Automotive:"AUTO", Electrical:"ELEC", IMTA:"IMTA", Welding:"WELD" };
const STANDARD_STYLE = { bg:"#ffffff", border:"#cbd5e1", text:"#1e293b" };
const OVERRIDE_STYLE = { bg:"#fff1f2", border:"#f87171", text:"#dc2626" };

function getClassStyle(item) { return item.isOverride ? OVERRIDE_STYLE : STANDARD_STYLE; }
function normalizeSubject(value) { return String(value||"").trim().toUpperCase(); }
function buildCustomCourseLabel(subject,number,crn) { const s=normalizeSubject(subject)||"CUSTOM"; return `${s.charAt(0)}${s.slice(1).toLowerCase()} ${String(number||"000").trim()||"000"} - ${String(crn||"OVERRIDE").trim()||"OVERRIDE"}`; }
function getAvailableCourses(department,classes,editingId) { const used=new Set(classes.filter((item)=>item.id!==editingId).map((item)=>item.courseKey).filter(Boolean)); return (COURSE_CATALOG[department]||[]).filter((course)=>!used.has(course.key)); }
function getDayCode(dayName) { return {Sunday:"U",Monday:"M",Tuesday:"T",Wednesday:"W",Thursday:"R",Friday:"F",Saturday:"S"}[dayName]||""; }
function getExportDays(meetingDays) { return (meetingDays||[]).map(getDayCode).join(""); }
function getMeetingDaysFromPattern(pattern,selectedDay) { if(pattern.includes("MTWR")) return ["Monday","Tuesday","Wednesday","Thursday"]; if(pattern.includes("MWF/TRF")) return ["Tuesday","Thursday"].includes(selectedDay)?["Tuesday","Thursday","Friday"]:["Monday","Wednesday","Friday"]; if(pattern.includes("MW or TR")||pattern.includes("Lab 2/wk")) return ["Tuesday","Thursday"].includes(selectedDay)?["Tuesday","Thursday"]:["Monday","Wednesday"]; return [selectedDay]; }
function inferPeriods(start,end) { const sh=parseInt(String(start).split(":")[0],10); const eh=parseInt(String(end).split(":")[0],10); const safeStart=Number.isFinite(sh)?sh:8; const safeEnd=Number.isFinite(eh)?eh:safeStart; const startPeriod=safeStart>=7&&safeStart<12?"AM":"PM"; const endPeriod=startPeriod==="AM"&&safeEnd<safeStart?"PM":startPeriod; return {startPeriod,endPeriod}; }
function normalizeTime(value,fallback="AM") { if(!value) return ""; const cleaned=String(value).trim().toUpperCase().replace(/\s+/g," "); return cleaned.includes("AM")||cleaned.includes("PM")?cleaned:`${cleaned} ${fallback}`; }
function getMeetingTimeParts(time) { const [rawStart="",rawEnd=""]=String(time||"").split(" or ")[0].split(" - "); const periods=inferPeriods(rawStart,rawEnd); return {start:normalizeTime(rawStart,periods.startPeriod),end:rawEnd?normalizeTime(rawEnd,periods.endPeriod):""}; }
function formatMeetingTime(time) { const parts=getMeetingTimeParts(time); return parts.end?`${parts.start} – ${parts.end}`:parts.start; }
function timeToMinutes(value) { const [timePart="8:00",period="AM"]=normalizeTime(value||"8:00","AM").split(" "); const [rawHour,rawMinute="0"]=timePart.split(":"); let hour=Number(rawHour); const minute=Number(rawMinute); if(period==="PM"&&hour!==12) hour+=12; if(period==="AM"&&hour===12) hour=0; return hour*60+minute; }
function getClassTimeRange(time) { const parts=getMeetingTimeParts(time); const startMinutes=timeToMinutes(parts.start); let endMinutes=parts.end?timeToMinutes(parts.end):startMinutes+60; if(endMinutes<=startMinutes) endMinutes+=720; return {...parts,startMinutes,endMinutes,durationMinutes:Math.max(30,endMinutes-startMinutes)}; }
function makeCustomTime(start,end) { const periods=inferPeriods(start,end); return `${normalizeTime(start,periods.startPeriod)} - ${normalizeTime(end,periods.endPeriod)}`; }
function canMoveClassToSlot(classItem,nextTime) { return !classItem.isOverride&&BLOCK_SCHEDULES[classItem.block][classItem.optionIndex].times.includes(nextTime); }
function getClassPosition(item,dayClasses) { const range=getClassTimeRange(item.time); const overlapping=dayClasses.filter((c)=>{const r=getClassTimeRange(c.time); return r.startMinutes<range.endMinutes&&r.endMinutes>range.startMinutes;}); const sorted=[...overlapping].sort((a,b)=>getClassTimeRange(a.time).startMinutes-getClassTimeRange(b.time).startMinutes||a.id-b.id); const index=Math.max(0,sorted.findIndex((c)=>c.id===item.id)); const width=100/Math.max(1,overlapping.length); return {top:Math.max(0,(range.startMinutes-CAL_START)*PX_PER_MIN),height:Math.max(56,range.durationMinutes*PX_PER_MIN),left:`${index*width}%`,width:`calc(${width}% - 6px)`}; }
function downloadBlob(blob,filename) { const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

const initialClasses = [
  { id:1, department:"Welding", courseKey:"Welding-75900", crn:"75900", sub:"WELD", courseNumber:"110", course:"Weld 110 - 75900", instructor:"Staff", room:"A101", day:"Monday", meetingDays:["Monday"], block:"16-week", optionIndex:0, time:"8:00 - 8:50", isOverride:false },
  { id:2, department:"Electrical", courseKey:"Electrical-72726", crn:"72726", sub:"ELEC", courseNumber:"110", course:"Elec 110 - 72726", instructor:"Staff", room:"B204", day:"Monday", meetingDays:["Monday","Tuesday","Wednesday","Thursday"], block:"8-week", optionIndex:4, time:"10:15 - 12:20", isOverride:false }
];

const ui = {
  page: { minHeight:"100vh", background:"#f8fafc", color:"#1e293b", fontFamily:"system-ui, sans-serif" }, // base - fullscreen applied dynamically
  topbar: { minHeight:68, background:"#1e293b", color:"white", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 24px", boxSizing:"border-box" },
  layout: { height:"calc(100vh - 68px)", display:"flex", minHeight:600 },
  sidebar: { width:340, flexShrink:0, background:"white", borderRight:"1px solid #e2e8f0", overflowY:"auto" },
  panel: { padding:16, display:"grid", gap:12 },
  input: { width:"100%", border:"1px solid #cbd5e1", borderRadius:12, padding:"10px 12px", fontSize:14, boxSizing:"border-box", outline:"none" },
  label: { display:"grid", gap:4, fontSize:11, fontWeight:700, color:"#64748b" },
  grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 },
  primary: { borderRadius:12, padding:"10px 12px", fontWeight:700, border:0, background:"#2563eb", color:"white", cursor:"pointer", width:"100%" },
  secondary: { borderRadius:12, padding:"10px 12px", fontWeight:700, border:"1px solid #cbd5e1", background:"white", cursor:"pointer", width:"100%" },
  calendarGrid: { display:"grid", gridTemplateColumns:"56px repeat(7, minmax(150px, 1fr))", minWidth:1100 }
};

function OptionList({ values }) { return values.map((value) => h("option", { key:value, value }, value)); }

const pendingImportRef = { current: null };

function SchedulingAppInner({ startClasses, _setResetKey, _pendingImport }) {
  const [classes, setClasses] = useState(startClasses);
  const [department, setDepartment] = useState("Welding");
  const [selectedCourseKey, setSelectedCourseKey] = useState("");
  const [day, setDay] = useState("Monday");
  const [block, setBlock] = useState("16-week");
  const [optionIndex, setOptionIndex] = useState(0);
  const [time, setTime] = useState(BLOCK_SCHEDULES["16-week"][0].times[0]);
  const [draft, setDraft] = useState({ instructor:"", room:"" });
  const [query, setQuery] = useState("");
  const [filterBlock, setFilterBlock] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [movingId, setMovingId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [overrideCode, setOverrideCode] = useState("");
  const [overrideUnlocked, setOverrideUnlocked] = useState(false);
  const [useOverride, setUseOverride] = useState(false);
  const [useCustomClass, setUseCustomClass] = useState(false);
  const [customCourse, setCustomCourse] = useState({ department:"Welding", subject:"", number:"", crn:"", title:"" });
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [overrideError, setOverrideError] = useState("");
  const [activeTab, setActiveTab] = useState("form");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const setResetKey = _setResetKey;
  const pendingImport = _pendingImport;
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");

  function toggleFullscreen() {
    setIsFullscreen(fs => !fs);
  }

  // Allow Escape key to exit fake fullscreen
  React.useEffect(() => {
    function onKey(e) { if(e.key === "Escape") setIsFullscreen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function importCSV(file) {
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Strip BOM, normalize line endings
        const text = e.target.result.replace(/^\uFEFF/, "").replace(/\r/g, "");
        const lines = text.split("\n").filter(l => l.trim());
        if(lines.length < 2) { setImportError("CSV appears empty."); return; }

        // CSV columns (0-indexed):
        // 0=ID, 1=faculty, 2=CRN, 3=sub, 4=#, 5=sec, 6=days, 7=s time, 8=e time,
        // 9=ses#, 10=X, 11=bldg, 12=rm, 13=s date, 14=e date, 15=hrs/d,
        // 16=hrs/wk, 17=hrs/ttl, ...

        const imported = [];
        let idCounter = 1;

        for(let i = 1; i < lines.length; i++) {
          const cols = parseCSVLine(lines[i]);
          if(!cols || cols.length < 9) continue;

          const instructor = cols[1]?.trim() || "TBD";
          const crn        = cols[2]?.trim() || "";
          const sub        = cols[3]?.trim() || "";
          const courseNum  = cols[4]?.trim() || "";
          const daysCode   = cols[6]?.trim() || "";
          const sTimeFull  = cols[7]?.trim() || "";  // e.g. "10:15 AM"
          const eTimeFull  = cols[8]?.trim() || "";  // e.g. "12:20 PM"
          const xFlag      = cols[10]?.trim() || "";
          const room       = cols[12]?.trim() || "TBD";

          if(!sub || !courseNum || !sTimeFull) continue;

          const isOverride = xFlag.toUpperCase().includes("OVERRIDE");
          const isCustom   = xFlag.toUpperCase().includes("CUSTOM");

          // Strip AM/PM to get bare time like "10:15"
          const sBare = sTimeFull.replace(/ *(AM|PM)/i, "").trim();
          const eBare = eTimeFull.replace(/ *(AM|PM)/i, "").trim();

          // Rebuild meeting days from day codes
          const dayCodeMap = {U:"Sunday",M:"Monday",T:"Tuesday",W:"Wednesday",R:"Thursday",F:"Friday",S:"Saturday"};
          const meetingDays = daysCode.split("").map(c => dayCodeMap[c]).filter(Boolean);
          const anchorDay = meetingDays[0] || "Monday";

          // Match block/option by comparing bare start time against slot start times
          let matchedBlock = "16-week", matchedOptionIndex = 0;
          outer: for(const [blockName, blockOptions] of Object.entries(BLOCK_SCHEDULES)) {
            for(let oi = 0; oi < blockOptions.length; oi++) {
              for(const slot of blockOptions[oi].times) {
                // slot format: "10:15 - 12:20"
                const slotStart = slot.split(" - ")[0].trim();
                const slotEnd   = slot.split(" - ")[1]?.trim() || "";
                if(slotStart === sBare || (eBare && slotEnd === eBare)) {
                  matchedBlock = blockName;
                  matchedOptionIndex = oi;
                  break outer;
                }
              }
            }
          }

          // Map sub code to department
          const subUpper = sub.toUpperCase();
          const sheetToDept = {ABDY:"Auto Body",ACRV:"ACRV",AUTO:"Automotive",ELEC:"Electrical",IMTA:"IMTA",WELD:"Welding"};
          const dept = sheetToDept[subUpper] || "Welding";

          // Find catalog match by CRN
          const catalogMatch = (COURSE_CATALOG[dept]||[]).find(c => c.crn === crn);
          const courseKey   = catalogMatch ? catalogMatch.key : (crn ? dept+"-"+crn : "custom-"+idCounter);
          const courseLabel = catalogMatch
            ? catalogMatch.label
            : sub.charAt(0)+sub.slice(1).toLowerCase()+" "+courseNum+(crn?" - "+crn:"");

          // Internal time format matches slot format: "10:15 - 12:20"
          const timeStr = sBare && eBare ? sBare+" - "+eBare : sBare;

          imported.push({
            id: idCounter++,
            department: dept,
            courseKey,
            crn,
            sub: subUpper,
            courseNumber: courseNum,
            course: courseLabel,
            isCustomClass: isCustom,
            instructor,
            room,
            day: anchorDay,
            meetingDays: meetingDays.length ? meetingDays : [anchorDay],
            block: matchedBlock,
            optionIndex: matchedOptionIndex,
            time: timeStr,
            isOverride,
          });
        }

        if(!imported.length) { setImportError("No valid rows found. Make sure you upload a CSV exported from this app."); return; }
        nextId = imported.length + 1;
        pendingImport.current = imported;
        setResetKey(k => k + 1);
        setImportError("");  setImportSuccess("\u2705 Loaded "+imported.length+" class"+(imported.length!==1?"es":"")+" from CSV.");
        setTimeout(() => setImportSuccess(""), 4000);
      } catch(err) {
        setImportError("Parse error: " + err.message);
      }
    };
    reader.readAsText(file);
  }
  function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;
    for(let i = 0; i < line.length; i++) {
      const ch = line[i];
      if(ch === '"') {
        if(inQuotes && line[i+1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if(ch === "," && !inQuotes) {
        result.push(current); current = "";
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  }

  const options = BLOCK_SCHEDULES[block];
  const selectedOption = options[optionIndex];
  const availableCourses = getAvailableCourses(department, classes, editingId);
  const selectedCourse = (COURSE_CATALOG[department]||[]).find((course) => course.key === selectedCourseKey) || null;
  const customClassReady = useCustomClass && customCourse.subject.trim() && customCourse.number.trim();
  const customTimeReady = !useOverride || (customStart.trim() && customEnd.trim());
  const canSaveClass = (useCustomClass ? Boolean(customClassReady) : Boolean(selectedCourse)) && customTimeReady;
  const selectedMeetingDays = getMeetingDaysFromPattern(selectedOption.pattern, day);
  const activeMoveId = draggingId || movingId;
  const movingClass = classes.find((item) => item.id === activeMoveId);
  const movingClassOption = movingClass ? BLOCK_SCHEDULES[movingClass.block][movingClass.optionIndex] : null;
  const totalSlots = Object.values(BLOCK_SCHEDULES).flat().reduce((sum, option) => sum + option.times.length, 0);

  const visibleClasses = useMemo(() => classes.filter((item) => filterBlock==="All"||item.block===filterBlock).filter((item) => `${item.department||""} ${item.course} ${item.instructor} ${item.room} ${(item.meetingDays||[]).join(" ")}`.toLowerCase().includes(query.toLowerCase())), [classes,filterBlock,query]);

  const visibleOccurrences = useMemo(() => visibleClasses.flatMap((item) => {
    const opt = BLOCK_SCHEDULES[item.block][item.optionIndex];
    const meetingDays = item.meetingDays || getMeetingDaysFromPattern(opt.pattern, item.day);
    return meetingDays.map((meetingDay) => ({ ...item, occurrenceDay:meetingDay, linkedDays:meetingDays }));
  }), [visibleClasses]);

  const classesByDay = useMemo(() => DAYS.reduce((acc, dayName) => {
    acc[dayName] = visibleOccurrences.filter((item) => item.occurrenceDay === dayName);
    return acc;
  }, {}), [visibleOccurrences]);

  const hourTicks = useMemo(() => Array.from({ length:18 }, (_,index) => {
    const hour24 = index + 6;
    const label = hour24<12?`${hour24} AM`:hour24===12?"12 PM":`${hour24-12} PM`;
    return { label, top:(hour24*60-CAL_START)*PX_PER_MIN };
  }), []);

  function changeBlock(nextBlock) { const firstOption=BLOCK_SCHEDULES[nextBlock][0]; setBlock(nextBlock); setOptionIndex(0); setTime(firstOption.times[0]); }
  function changeOption(nextIndex) { const ni=Number(nextIndex); setOptionIndex(ni); setTime(BLOCK_SCHEDULES[block][ni].times[0]); }
  function resetForm() { setEditingId(null); setDepartment("Welding"); setSelectedCourseKey(""); setDay("Monday"); setBlock("16-week"); setOptionIndex(0); setTime(BLOCK_SCHEDULES["16-week"][0].times[0]); setDraft({instructor:"",room:""}); setOverrideCode(""); setOverrideUnlocked(false); setUseOverride(false); setUseCustomClass(false); setCustomCourse({department:"Welding",subject:"",number:"",crn:"",title:""}); setCustomStart(""); setCustomEnd(""); setOverrideError(""); }
  function unlockOverride() { if(overrideCode==="7018") { const parts=getMeetingTimeParts(time); setOverrideUnlocked(true); setCustomStart(customStart||parts.start); setCustomEnd(customEnd||parts.end); setOverrideError(""); } else setOverrideError("Invalid override access code."); }

  function saveClass() {
    if(!useCustomClass&&!selectedCourse) { setOverrideError("Select a class from the department list."); return; }
    if(useCustomClass&&!customClassReady) { setOverrideError("Enter subject and course number for the custom class."); return; }
    if(useOverride&&(!customStart.trim()||!customEnd.trim())) { setOverrideError("Enter both a start and end time for the custom time override."); return; }
    const customSubject = normalizeSubject(customCourse.subject);
    const payload = { id:editingId||nextId++, department:useCustomClass?customCourse.department:department, courseKey:useCustomClass?`custom-${Date.now()}`:selectedCourse.key, crn:useCustomClass?customCourse.crn.trim():selectedCourse.crn, sub:useCustomClass?customSubject:selectedCourse.sub, courseNumber:useCustomClass?customCourse.number.trim():selectedCourse.number, course:useCustomClass?(customCourse.title.trim()||buildCustomCourseLabel(customSubject,customCourse.number,customCourse.crn)):selectedCourse.label, isCustomClass:useCustomClass, instructor:draft.instructor.trim()||"TBD", room:draft.room.trim()||"TBD", day, meetingDays:selectedMeetingDays, block, optionIndex, time:useOverride?makeCustomTime(customStart,customEnd):time, isOverride:useOverride };
    setClasses((current) => editingId?current.map((item)=>item.id===editingId?payload:item):[...current,payload]);
    resetForm();
  }

  function editClass(item) {
    const optionTimes = BLOCK_SCHEDULES[item.block][item.optionIndex].times;
    const parts = getMeetingTimeParts(item.time);
    setEditingId(item.id); setDraft({instructor:item.instructor,room:item.room}); setDepartment(item.department||"Welding"); setSelectedCourseKey(item.isCustomClass?"":item.courseKey||""); setUseCustomClass(Boolean(item.isCustomClass)); setCustomCourse(item.isCustomClass?{department:item.department||"Welding",subject:item.sub||"",number:item.courseNumber||"",crn:item.crn||"",title:item.course||""}:{department:"Welding",subject:"",number:"",crn:"",title:""}); setDay(item.day); setBlock(item.block); setOptionIndex(item.optionIndex); setTime(optionTimes.includes(item.time)?item.time:optionTimes[0]); setUseOverride(Boolean(item.isOverride)); setOverrideUnlocked(Boolean(item.isOverride)); setOverrideCode(item.isOverride?"7018":""); setCustomStart(item.isOverride?parts.start:""); setCustomEnd(item.isOverride?parts.end:""); setOverrideError(""); setActiveTab("form");
  }

  function removeClass(id) { setClasses((current)=>current.filter((item)=>item.id!==id)); if(editingId===id) resetForm(); if(movingId===id) setMovingId(null); if(draggingId===id) setDraggingId(null); }
  function moveClassToSlot(classId,nextDay,nextTime) { const id=Number(classId); const classToMove=classes.find((item)=>item.id===id); if(!classToMove||!canMoveClassToSlot(classToMove,nextTime)) return; const option=BLOCK_SCHEDULES[classToMove.block][classToMove.optionIndex]; const nextMeetingDays=getMeetingDaysFromPattern(option.pattern,nextDay); setClasses((current)=>current.map((item)=>item.id===id?{...item,day:nextDay,meetingDays:nextMeetingDays,time:nextTime}:item)); setMovingId(null); setDraggingId(null); }
  function startDraggingClass(event,classId) { const classToDrag=classes.find((item)=>item.id===classId); if(!classToDrag||classToDrag.isOverride) return; event.dataTransfer.setData("text/plain",String(classId)); event.dataTransfer.effectAllowed="move"; setDraggingId(classId); setMovingId(classId); }
  function allowClassDrop(event) { event.preventDefault(); event.dataTransfer.dropEffect="move"; }
  function dropClassIntoSlot(event,nextDay,nextTime) { event.preventDefault(); const transferredId=event.dataTransfer.getData("text/plain"); const classId=transferredId||activeMoveId; if(classId) moveClassToSlot(classId,nextDay,nextTime); }

  function exportCalendarToCSV() {
    const rows = [EXPORT_HEADERS];
    const sorted = [...classes].sort((a,b) => {
      const sa = DEPARTMENT_TO_SHEET[a.department]||a.sub||"";
      const sb = DEPARTMENT_TO_SHEET[b.department]||b.sub||"";
      return sa.localeCompare(sb);
    });
    sorted.forEach((item) => {
      const option = BLOCK_SCHEDULES[item.block]?.[item.optionIndex];
      const parts = getMeetingTimeParts(item.time);
      rows.push([
        "",
        item.instructor||"STAFF",
        item.crn||"",
        item.sub||"",
        item.courseNumber||"",
        "",
        getExportDays(item.meetingDays),
        parts.start,
        parts.end,
        1,
        item.isOverride?(item.isCustomClass?"CUSTOM OVERRIDE":"OVERRIDE"):"",
        "",
        item.room||"",
        "","",
        "",
        option?.ch||"",
        option?.hours||"",
        "","","","","",
        item.isCustomClass?"Custom class created by override":item.isOverride?"Custom override time used":"",
        "",""
      ]);
    });
    const csv = rows.map((row) => row.map((cell) => {
      const val = String(cell==null?"":cell);
      return val.includes(",") || val.includes('"') || val.includes("\n") ? `"${val.replace(/"/g,'""')}"` : val;
    }).join(",")).join("\n");
    downloadBlob(new Blob(["﻿"+csv],{type:"text/csv;charset=utf-8;"}),"completed-schedule-build.csv");
  }

  const formPanel = h("section", { style:ui.panel },
    h("label", { style:ui.label }, "Department",
      h("select", { style:ui.input, value:department, disabled:useCustomClass, onChange:(e)=>{setDepartment(e.target.value); setSelectedCourseKey("");} },
        h(OptionList, { values:Object.keys(COURSE_CATALOG) }))),
    !useCustomClass && h("label", { style:ui.label }, "Class",
      h("select", { style:ui.input, value:selectedCourseKey, onChange:(e)=>setSelectedCourseKey(e.target.value) },
        h("option", { value:"" }, "Select a class"),
        availableCourses.map((course) => h("option", { key:course.key, value:course.key }, course.label)))),
    useCustomClass && h("div", { style:{border:"1px solid #bae6fd",background:"#f0f9ff",borderRadius:12,padding:12,fontSize:12} }, "Custom class mode is enabled by override."),
    useCustomClass && h("div", { style:ui.grid2 },
      h("label", { style:ui.label }, "Custom department",
        h("select", { style:ui.input, value:customCourse.department, onChange:(e)=>setCustomCourse({...customCourse,department:e.target.value}) },
          h(OptionList, { values:Object.keys(COURSE_CATALOG) }))),
      h("label", { style:ui.label }, "CRN (optional)",
        h("input", { style:ui.input, value:customCourse.crn, onChange:(e)=>setCustomCourse({...customCourse,crn:e.target.value}) }))),
    useCustomClass && h("div", { style:ui.grid2 },
      h("label", { style:ui.label }, "Subject",
        h("input", { style:ui.input, value:customCourse.subject, onChange:(e)=>setCustomCourse({...customCourse,subject:e.target.value}) })),
      h("label", { style:ui.label }, "Course #",
        h("input", { style:ui.input, value:customCourse.number, onChange:(e)=>setCustomCourse({...customCourse,number:e.target.value}) }))),
    useCustomClass && h("label", { style:ui.label }, "Display name (optional)",
      h("input", { style:ui.input, value:customCourse.title, onChange:(e)=>setCustomCourse({...customCourse,title:e.target.value}) })),
    h("div", { style:ui.grid2 },
      h("input", { style:ui.input, placeholder:"Instructor", value:draft.instructor, onChange:(e)=>setDraft({...draft,instructor:e.target.value}) }),
      h("input", { style:ui.input, placeholder:"Room", value:draft.room, onChange:(e)=>setDraft({...draft,room:e.target.value}) })),
    h("div", { style:ui.grid2 },
      h("label", { style:ui.label }, "Anchor day",
        h("select", { style:ui.input, value:day, onChange:(e)=>setDay(e.target.value) }, h(OptionList, { values:DAYS }))),
      h("label", { style:ui.label }, "Block",
        h("select", { style:ui.input, value:block, onChange:(e)=>changeBlock(e.target.value) }, h(OptionList, { values:Object.keys(BLOCK_SCHEDULES) })))),
    h("label", { style:ui.label }, "Class type + meeting pattern",
      h("select", { style:ui.input, value:optionIndex, onChange:(e)=>changeOption(e.target.value) },
        options.map((option,index) => h("option", { key:`${option.category}-${option.pattern}-${index}`, value:index }, `${option.category} · ${option.pattern}`)))),
    h("label", { style:ui.label }, "Allowed time slot",
      h("select", { style:ui.input, value:time, disabled:useOverride, onChange:(e)=>setTime(e.target.value) },
        selectedOption.times.map((slot) => h("option", { key:slot, value:slot }, formatMeetingTime(slot))))),
    h("div", { style:{border:"1px solid #bae6fd",background:"#f0f9ff",borderRadius:12,padding:12,fontSize:12} },
      h("strong", null, "Linked days: "), selectedMeetingDays.join(", "),
      h("br"),
      `${selectedOption.hours} · ${selectedOption.ch} · ${selectedOption.break}`),
    h("div", { style:{border:"1px solid #fca5a5",background:useOverride?"#fff1f2":"#fafafa",borderRadius:12,padding:12,display:"grid",gap:10} },
      h("strong", null, "Override options"),
      !overrideUnlocked
        ? h("div", { style:{display:"flex",gap:8} },
            h("input", { style:{...ui.input,flex:1}, type:"password", placeholder:"Access code", value:overrideCode, onChange:(e)=>setOverrideCode(e.target.value), onKeyDown:(e)=>e.key==="Enter"&&unlockOverride() }),
            h("button", { style:{...ui.secondary,width:"auto",padding:"10px 16px"}, onClick:unlockOverride }, "Unlock"))
        : h("div", { style:{display:"grid",gap:8} },
            h("label", null, h("input", { type:"checkbox", checked:useOverride, onChange:(e)=>setUseOverride(e.target.checked) }), " Use custom time"),
            h("label", null, h("input", { type:"checkbox", checked:useCustomClass, onChange:(e)=>{setUseCustomClass(e.target.checked); if(e.target.checked) setSelectedCourseKey("");} }), " Create a new class not listed"),
            useOverride && h("div", { style:ui.grid2 },
              h("input", { style:ui.input, placeholder:"8:15 AM", value:customStart, onChange:(e)=>setCustomStart(e.target.value) }),
              h("input", { style:ui.input, placeholder:"9:45 AM", value:customEnd, onChange:(e)=>setCustomEnd(e.target.value) }))),
      overrideError && h("div", { style:{color:"#dc2626",fontSize:12} }, overrideError)),
    h("div", { style:ui.grid2 },
      h("button", { style:{...ui.primary,opacity:canSaveClass?1:0.45}, onClick:saveClass, disabled:!canSaveClass }, editingId?"Save":"Add class"),
      editingId && h("button", { style:ui.secondary, onClick:resetForm }, "Cancel"))
  );

  const listPanel = h("section", { style:ui.panel },
    h("input", { style:ui.input, placeholder:"Search classes", value:query, onChange:(e)=>setQuery(e.target.value) }),
    visibleClasses.length === 0 && h("div", { style:{textAlign:"center",color:"#94a3b8",padding:32} }, "No classes yet"),
    visibleClasses.map((item) => {
      const style = getClassStyle(item);
      return h("div", { key:item.id, style:{border:`1px solid ${style.border}`,background:style.bg,borderRadius:12,padding:12,display:"flex",justifyContent:"space-between",gap:8} },
        h("div", null,
          h("strong", { style:{color:style.text} }, item.course),
          h("div", { style:{fontSize:12,color:"#64748b"} }, `${item.department} · ${item.instructor} · ${item.room}`),
          h("div", { style:{fontSize:12,color:"#64748b"} }, `${formatMeetingTime(item.time)} · ${item.meetingDays?.join(", ")}`),
          item.isOverride && h("div", { style:{fontSize:11,color:"#dc2626",fontWeight:800} }, "Override")),
        h("div", { style:{display:"flex",gap:4,flexShrink:0} },
          h("button", { onClick:()=>editClass(item) }, "✏️"),
          h("button", { onClick:()=>removeClass(item.id) }, "✕")));
    }));

  function classCard(item, dayClasses) {
    const pos = getClassPosition(item, dayClasses);
    const style = getClassStyle(item);
    const isMoving = activeMoveId === item.id;
    return h("div", { key:`${item.id}-${item.occurrenceDay}`, draggable:!item.isOverride, onDragStart:(e)=>startDraggingClass(e,item.id), onDragEnd:()=>setDraggingId(null), style:{position:"absolute",top:pos.top,height:pos.height,left:pos.left,width:pos.width,background:style.bg,border:`1.5px solid ${style.border}`,borderRadius:10,padding:"5px 6px",overflow:"hidden",boxSizing:"border-box",cursor:item.isOverride?"default":"grab",opacity:isMoving?0.72:1,boxShadow:isMoving?"0 0 0 3px #cbd5e1":"0 1px 3px rgba(15,23,42,.08)",zIndex:isMoving?5:1} },
      h("div", { style:{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:2,marginBottom:2} },
        !item.isOverride && h("button", { onClick:(e)=>{e.stopPropagation();setMovingId(isMoving?null:item.id);}, style:{background:"none",border:"none",cursor:"pointer",padding:"1px 3px",fontSize:10,lineHeight:1,color:"#64748b"} }, "✥"),
        h("button", { onClick:(e)=>{e.stopPropagation();editClass(item);}, style:{background:"none",border:"none",cursor:"pointer",padding:"1px 3px",fontSize:10,lineHeight:1,color:"#64748b"} }, "✏️"),
        h("button", { onClick:(e)=>{e.stopPropagation();removeClass(item.id);}, style:{background:"none",border:"none",cursor:"pointer",padding:"1px 3px",fontSize:10,lineHeight:1,color:"#64748b"} }, "✕")),
      h("div", { style:{fontWeight:800,fontSize:12,color:style.text,lineHeight:1.3} }, item.course),
      pos.height > 55 && h("div", { style:{fontSize:10,color:"#64748b"} }, item.room),
      pos.height > 70 && h("div", { style:{fontSize:10,color:"#64748b"} }, formatMeetingTime(item.time)),
      item.isOverride && h("div", { style:{fontSize:10,color:"#dc2626",fontWeight:800} }, "Override"));
  }

  function moveOverlay(dayName) {
    if(!movingClass||!movingClassOption||movingClass.isOverride) return null;
    return h("div", { style:{position:"absolute",inset:0,zIndex:10,background:"rgba(239,246,255,.94)",padding:8,overflow:"auto"} },
      h("strong", { style:{color:"#1d4ed8",fontSize:12} }, `Move to ${dayName}`),
      h("div", { style:{color:"#64748b",fontSize:11,margin:"6px 0"} }, `Linked days: ${getMeetingDaysFromPattern(movingClassOption.pattern,dayName).join(", ")}`),
      movingClassOption.times.map((slot) => {
        const parts = getMeetingTimeParts(slot);
        return h("button", { key:slot, onClick:()=>moveClassToSlot(movingClass.id,dayName,slot), onDragOver:allowClassDrop, onDrop:(e)=>dropClassIntoSlot(e,dayName,slot), style:{width:"100%",display:"block",marginBottom:4,border:"1px solid #93c5fd",background:"white",color:"#1d4ed8",borderRadius:8,padding:"6px 8px",fontSize:11,fontWeight:700,textAlign:"left",cursor:"pointer"} },
          `${parts.start}${parts.end?` – ${parts.end}`:""}`);
      }));
  }

  const pageStyle = isFullscreen
    ? { ...ui.page, position:"fixed", inset:0, zIndex:9999, overflow:"auto" }
    : ui.page;

  return h("div", { style:pageStyle },
    h("header", { style:ui.topbar },
      h("div", { style:{display:"flex",alignItems:"center",gap:12} },
        h("div", { style:{width:36,height:36,borderRadius:10,background:"#3b82f6",display:"grid",placeItems:"center"} }, "📅"),
        h("div", null,
          h("div", { style:{fontWeight:800} }, "Block Scheduler"),
          h("div", { style:{fontSize:12,color:"#94a3b8"} }, "Approved block scheduling only"))),
      h("div", { style:{display:"flex",gap:22,textAlign:"center",fontSize:12,color:"#94a3b8"} },
        h("div", null, h("strong", { style:{display:"block",color:"white",fontSize:20} }, "4"), "blocks"),
        h("div", null, h("strong", { style:{display:"block",color:"white",fontSize:20} }, totalSlots), "slots"),
        h("div", null, h("strong", { style:{display:"block",color:"white",fontSize:20} }, classes.length), "classes"))),
    h("div", { style:ui.layout },
      h("aside", { style:ui.sidebar },
        h("div", { style:{display:"flex",borderBottom:"1px solid #e2e8f0"} },
          h("button", { style:{flex:1,padding:12,fontWeight:800,border:0,cursor:"pointer",background:activeTab==="form"?"white":"#f8fafc",borderBottom:activeTab==="form"?"2px solid #2563eb":"2px solid transparent"}, onClick:()=>setActiveTab("form") }, editingId?"✏️ Edit":"➕ Add"),
          h("button", { style:{flex:1,padding:12,fontWeight:800,border:0,cursor:"pointer",background:activeTab==="list"?"white":"#f8fafc",borderBottom:activeTab==="list"?"2px solid #2563eb":"2px solid transparent"}, onClick:()=>setActiveTab("list") }, `📋 Classes (${classes.length})`)),
        activeTab==="form" ? formPanel : listPanel),
      h("main", { style:{flex:1,overflow:"auto"} },
        h("div", { style:{minHeight:42,position:"sticky",top:0,zIndex:20,background:"white",display:"flex",alignItems:"center",gap:12,padding:"6px 16px",borderBottom:"1px solid #e2e8f0",flexWrap:"wrap"} },
          h("strong", null, "View:"),
          h("button", { style:{...ui.secondary,width:"auto",padding:"6px 14px",fontSize:13}, onClick:exportCalendarToCSV }, "⬇️ Export CSV"),
          h("label", { style:{...ui.secondary,width:"auto",padding:"6px 14px",fontSize:13,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4,borderRadius:12,border:"1px solid #cbd5e1",background:"white",fontWeight:700} },
            "⬆️ Import CSV",
            h("input", { type:"file", accept:".csv", style:{display:"none"}, onChange:(e)=>{ importCSV(e.target.files[0]); e.target.value=""; } })),
          h("button", { style:{...ui.secondary,width:"auto",padding:"6px 14px",fontSize:13}, onClick:toggleFullscreen }, isFullscreen?"⛶ Exit Fullscreen":"⛶ Fullscreen"),
          importError && h("span", { style:{color:"#dc2626",fontSize:12,fontWeight:600} }, importError),
          importSuccess && h("span", { style:{color:"#16a34a",fontSize:12,fontWeight:600} }, importSuccess),
          h("select", { style:{border:"1px solid #e2e8f0",borderRadius:8,padding:"5px 8px",fontSize:13,background:"white",outline:"none"}, value:filterBlock, onChange:(e)=>setFilterBlock(e.target.value) },
            h("option", null, "All"),
            h(OptionList, { values:Object.keys(BLOCK_SCHEDULES) })),
          h("input", { style:{border:"1px solid #e2e8f0",borderRadius:8,padding:"5px 10px",fontSize:13,outline:"none",width:180}, placeholder:"🔍 Search...", value:query, onChange:(e)=>setQuery(e.target.value) }),
          movingClass && h("div", { style:{marginLeft:"auto",background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe",borderRadius:10,padding:"4px 10px",fontWeight:700,fontSize:13} },
            `Moving: ${movingClass.course} — click a slot `,
            h("button", { style:{background:"none",border:"none",cursor:"pointer",color:"#64748b",fontSize:14}, onClick:()=>{setMovingId(null);setDraggingId(null);} }, "✕"))),
        h("div", { style:{...ui.calendarGrid,position:"sticky",top:42,zIndex:19,background:"white",borderBottom:"1px solid #e2e8f0"} },
          h("div"),
          DAYS.map((d) => h("div", { key:d, style:{padding:10,textAlign:"center",fontWeight:800,borderRight:"1px solid #e2e8f0",fontSize:13} }, d))),
        h("div", { style:ui.calendarGrid },
          h("div", { style:{position:"relative",height:CAL_HEIGHT} },
            hourTicks.map((tick) => h("div", { key:tick.label, style:{position:"absolute",top:tick.top-7,right:6,fontSize:10,color:"#94a3b8",fontWeight:700,whiteSpace:"nowrap"} }, tick.label))),
          DAYS.map((dayName) => {
            const dayClasses = classesByDay[dayName] || [];
            return h("div", { key:dayName, onDragOver:allowClassDrop, style:{position:"relative",height:CAL_HEIGHT,background:"white",borderRight:"1px solid #e2e8f0"} },
              hourTicks.map((tick) => h("div", { key:tick.label, style:{position:"absolute",top:tick.top,left:0,right:0,borderTop:"1px solid #f1f5f9",pointerEvents:"none"} })),
              moveOverlay(dayName),
              dayClasses.map((item) => classCard(item, dayClasses)),
              dayClasses.length===0 && !movingClass && h("div", { style:{position:"absolute",top:"40%",left:0,right:0,textAlign:"center",color:"#cbd5e1",fontSize:13} }, "—"));
          })))));
}

export default function SchedulingApp() {
  const [resetKey, setResetKey] = React.useState(0);
  const pendingImport = React.useRef(null);
  return React.createElement(SchedulingAppInner, {
    key: resetKey,
    startClasses: pendingImport.current || initialClasses,
    _resetKey: resetKey,
    _setResetKey: setResetKey,
    _pendingImport: pendingImport,
  });
}
