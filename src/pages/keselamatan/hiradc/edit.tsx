import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Card,
  Typography,
  Row,
  Col,
  Alert,
  Tag,
  Checkbox,
  Divider,
  Tabs,
  Space,
  Popconfirm,
  Spin,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
  OrderedListOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import dayjs, { Dayjs } from "dayjs";
import {
  calculateNfrRiskLevel,
  calculateRiskLevel,
  getNfrTagColor,
  ActivityType,
  HazardClassification,
  ControlStatus,
  HazardCategoryType,
  ControlHierarchyType,
  IHazardDetailItem,
  IHazardDetailRow,
  IHiradcSubActivity,
  IHiradc,
} from "../../../types/hiradc";
import { RiskMatrixModal } from "../../../components/common/RiskMatrixModal";
import "../../../components/common/form-theme.css";

const { Title, Text, Paragraph } = Typography;

export const HAZARD_TYPE_CONFIG: {
  value: HazardCategoryType;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  desc: string;
}[] = [
  {
    value: "Fisika",
    label: "Bahaya Fisika",
    shortLabel: "Fisika",
    icon: "⚡",
    color: "#1d4ed8",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
    desc: "Bising, Getaran, Ketinggian, Suhu, Radiasi, Pencahayaan",
  },
  {
    value: "Kimia",
    label: "Bahaya Kimia",
    shortLabel: "Kimia",
    icon: "🧪",
    color: "#7c3aed",
    bgColor: "#f5f3ff",
    borderColor: "#ddd6fe",
    desc: "Debu partikel, Gas, Uap, Bahan Kimia, Pelarut, Fumigan",
  },
  {
    value: "Biologi",
    label: "Bahaya Biologi",
    shortLabel: "Biologi",
    icon: "🦠",
    color: "#059669",
    bgColor: "#ecfdf5",
    borderColor: "#a7f3d0",
    desc: "Bakteri, Virus, Spora Jamur, Serangga Kutu Buku, Parasit",
  },
  {
    value: "Ergonomi",
    label: "Bahaya Ergonomi",
    shortLabel: "Ergonomi",
    icon: "🏋️",
    color: "#d97706",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
    desc: "Manual handling, Postur canggung, Angkat beban berat, Repetitif",
  },
  {
    value: "Psikososial",
    label: "Bahaya Psikososial",
    shortLabel: "Psikososial",
    icon: "🧠",
    color: "#db2777",
    bgColor: "#fdf2f8",
    borderColor: "#fbcfe8",
    desc: "Stres kerja, Beban target scan, Kerja lembur/shift, Kelelahan",
  },
];

export const CONTROL_HIERARCHY_CONFIG: {
  value: ControlHierarchyType;
  label: string;
  tagColor: string;
  badgeNum: number;
  desc: string;
  placeholder: string;
}[] = [
  {
    value: "Eliminasi",
    label: "Eliminasi",
    tagColor: "green",
    badgeNum: 1,
    desc: "Menghilangkan sumber bahaya secara total",
    placeholder: "Contoh: Menghilangkan proses kerja berisiko tinggi / meniadakan bahan kimia berbahaya",
  },
  {
    value: "Subtitusi",
    label: "Subtitusi",
    tagColor: "cyan",
    badgeNum: 2,
    desc: "Mengganti bahan, alat atau metode dengan alternatif yang lebih aman",
    placeholder: "Contoh: Mengganti pelarut kimia beracun dengan bahan berbahan dasar air yang aman",
  },
  {
    value: "Engineering Control",
    label: "Engineering Control",
    tagColor: "blue",
    badgeNum: 3,
    desc: "Modifikasi fisik, pengaman mesin, ventilasi exhaust, platform tangga beroda",
    placeholder: "Contoh: Tangga platform safety beroda dengan rem pengunci & handrail keliling",
  },
  {
    value: "Administrasi",
    label: "Administrasi",
    tagColor: "orange",
    badgeNum: 4,
    desc: "SOP kerja aman, rotasi shift, pembatasan beban angkat, pelatihan K3",
    placeholder: "Contoh: SOP bekerja di ketinggian depo arsip, pembatasan beban angkat maks 10kg",
  },
  {
    value: "APD",
    label: "APD (Alat Pelindung Diri)",
    tagColor: "purple",
    badgeNum: 5,
    desc: "Masker respirator N95, sarung tangan nitril/grip, safety helmet, sepatu anti-slip",
    placeholder: "Contoh: Safety helmet ringan, safety shoes anti-slip, sarung tangan nitril grip, masker N95",
  },
];

interface SubActivityFormState {
  id: string;
  activity: string;
  location: string;
  activityType: ActivityType;
  hazardClassification: HazardClassification[];

  // Pilihan Jenis Bahaya (Centang-centang, bisa lebih dari 1)
  selectedHazardTypes: HazardCategoryType[];

  // Rincian Deskripsi Bahaya per Jenis Bahaya
  hazardDetails: {
    [key in HazardCategoryType]?: IHazardDetailItem[];
  };

  // Pengendalian: Pilihan hirarki (Centang-centang, bisa lebih dari 1)
  selectedControls: ControlHierarchyType[];
  controlDescriptions: string[];
  controlDescription: string;
  currentElimination: string;
  currentSubstitution: string;
  currentEngineering: string;
  currentAdministrative: string;
  currentApd: string;

  // Analisis Risiko Awal
  currentLikelihood: number;
  currentSeverity: number;

  // Residual / Pengendalian Lanjutan (Opsional)
  includeResidual: boolean;
  residualSelectedControls: ControlHierarchyType[];
  residualElimination: string;
  residualSubstitution: string;
  residualEngineering: string;
  residualAdministrative: string;
  residualApd: string;
  residualLikelihood: number;
  residualSeverity: number;

  // Tindak Lanjut
  controlDuration: string;
  controlStatus: ControlStatus;
  responsiblePerson: string;
  targetDate: Dayjs;
}

const createDefaultHazardItem = (
  customDeskripsi = "",
  defaultRisiko = [""],
  defaultDampak = [""],
  defaultPengendalian = [""]
): IHazardDetailItem => ({
  id: `hazard-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  deskripsi: customDeskripsi,
  risikoList: defaultRisiko,
  dampakList: defaultDampak,
  pengendalianList: defaultPengendalian,
});

const createEmptySubActivity = (index: number): SubActivityFormState => ({
  id: `step-${Date.now()}-${index}`,
  activity: "",
  location: "",
  activityType: "Rutin (R)",
  hazardClassification: ["Safety (S)"],
  selectedHazardTypes: ["Fisika"],
  hazardDetails: {
    Fisika: [createDefaultHazardItem("")],
  },
  selectedControls: ["Engineering Control", "Administrasi", "APD"],
  controlDescriptions: [""],
  controlDescription: "",
  currentElimination: "-",
  currentSubstitution: "-",
  currentEngineering: "-",
  currentAdministrative: "-",
  currentApd: "-",
  currentLikelihood: 3,
  currentSeverity: 3,

  includeResidual: false,
  residualSelectedControls: ["Engineering Control", "APD"],
  residualElimination: "-",
  residualSubstitution: "-",
  residualEngineering: "-",
  residualAdministrative: "-",
  residualApd: "-",
  residualLikelihood: 2,
  residualSeverity: 2,

  controlDuration: "30 Hari",
  controlStatus: "Open",
  responsiblePerson: "",
  targetDate: dayjs().add(1, "month"),
});

// Helper parser backward-compatibility untuk membaca subActivity yang ada
const parseSubActivityToState = (
  sub: IHiradcSubActivity,
  parentLocation = "",
  index = 0
): SubActivityFormState => {
  const categories: HazardCategoryType[] = ["Fisika", "Kimia", "Biologi", "Ergonomi", "Psikososial"];
  const hazardDetails: { [key in HazardCategoryType]?: IHazardDetailItem[] } = {};
  const selectedHazardTypes: HazardCategoryType[] = [];

  // 1. Cek jika sudah ada hazardDetails
  if (sub.hazardDetails && Object.keys(sub.hazardDetails).length > 0) {
    categories.forEach((cat) => {
      const items = sub.hazardDetails![cat] || [];
      if (items.length > 0) {
        hazardDetails[cat] = items.map((it) => ({
          id: it.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          deskripsi: it.deskripsi || "",
          risikoList: it.risikoList && it.risikoList.length > 0 ? it.risikoList : [""],
          dampakList: it.dampakList && it.dampakList.length > 0 ? it.dampakList : [""],
          pengendalianList: it.pengendalianList && it.pengendalianList.length > 0 ? it.pengendalianList : (sub.controlDescriptions && sub.controlDescriptions.length > 0 ? sub.controlDescriptions : [""]),
        }));
        if (!selectedHazardTypes.includes(cat)) {
          selectedHazardTypes.push(cat);
        }
      }
    });
  }

  // 2. Jika hazardDetails kosong tapi ada hazardRows
  if (selectedHazardTypes.length === 0 && sub.hazardRows && sub.hazardRows.length > 0) {
    sub.hazardRows.forEach((r) => {
      const types: HazardCategoryType[] = r.jenisBahaya && r.jenisBahaya.length > 0 ? (r.jenisBahaya as HazardCategoryType[]) : ["Fisika"];
      types.forEach((type) => {
        if (!hazardDetails[type]) {
          hazardDetails[type] = [];
        }
        hazardDetails[type]!.push({
          id: r.id || `hr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          deskripsi: r.deskripsi || "",
          risikoList: r.risikoList && r.risikoList.length > 0 ? r.risikoList : [""],
          dampakList: r.dampakList && r.dampakList.length > 0 ? r.dampakList : [""],
          pengendalianList: r.pengendalianList && r.pengendalianList.length > 0 ? r.pengendalianList : (sub.controlDescriptions && sub.controlDescriptions.length > 0 ? sub.controlDescriptions : [""]),
        });
        if (!selectedHazardTypes.includes(type)) {
          selectedHazardTypes.push(type);
        }
      });
    });
  }

  // 3. Fallback jika masih kosong: baca string 5 faktor bahaya
  if (selectedHazardTypes.length === 0) {
    const mapping: { key: keyof IHiradcSubActivity; cat: HazardCategoryType }[] = [
      { key: "hazardPhysics", cat: "Fisika" },
      { key: "hazardChemical", cat: "Kimia" },
      { key: "hazardBiology", cat: "Biologi" },
      { key: "hazardErgonomics", cat: "Ergonomi" },
      { key: "hazardPsychosocial", cat: "Psikososial" },
    ];

    mapping.forEach(({ key, cat }) => {
      const val = (sub[key] as string) || "";
      if (val && val !== "-" && val.trim()) {
        const descriptions = val.split(";").map((s) => s.trim()).filter(Boolean);
        hazardDetails[cat] = descriptions.map((desc, dIdx) => ({
          id: `legacy-${cat}-${dIdx}`,
          deskripsi: desc,
          risikoList: sub.riskImpact ? [sub.riskImpact] : [""],
          dampakList: sub.riskImpact ? [sub.riskImpact] : [""],
          pengendalianList: sub.controlDescriptions && sub.controlDescriptions.length > 0 ? sub.controlDescriptions : [""],
        }));
        if (!selectedHazardTypes.includes(cat)) {
          selectedHazardTypes.push(cat);
        }
      }
    });
  }

  // Default jika benar-benar kosong
  if (selectedHazardTypes.length === 0) {
    selectedHazardTypes.push("Fisika");
    hazardDetails["Fisika"] = [createDefaultHazardItem(sub.activity || "")];
  }

  // Parse Hirarki Pengendalian yang dicentang
  const selectedControls: ControlHierarchyType[] =
    sub.selectedControls && sub.selectedControls.length > 0
      ? sub.selectedControls
      : ([
          sub.currentElimination && sub.currentElimination !== "-" ? "Eliminasi" : null,
          sub.currentSubstitution && sub.currentSubstitution !== "-" ? "Subtitusi" : null,
          sub.currentEngineering && sub.currentEngineering !== "-" ? "Engineering Control" : null,
          sub.currentAdministrative && sub.currentAdministrative !== "-" ? "Administrasi" : null,
          sub.currentApd && sub.currentApd !== "-" ? "APD" : null,
        ].filter(Boolean) as ControlHierarchyType[]);

  const residualSelectedControls: ControlHierarchyType[] = [
    sub.residualElimination && sub.residualElimination !== "-" ? "Eliminasi" : null,
    sub.residualSubstitution && sub.residualSubstitution !== "-" ? "Subtitusi" : null,
    sub.residualEngineering && sub.residualEngineering !== "-" ? "Engineering Control" : null,
    sub.residualAdministrative && sub.residualAdministrative !== "-" ? "Administrasi" : null,
    sub.residualApd && sub.residualApd !== "-" ? "APD" : null,
  ].filter(Boolean) as ControlHierarchyType[];

  const hasResidual =
    residualSelectedControls.length > 0 ||
    Boolean(sub.residualNfr && sub.residualNfr > 0) ||
    Boolean(sub.residualLikelihood && sub.residualLikelihood > 0);

  return {
    id: sub.id || `step-${Date.now()}-${index}`,
    activity: sub.activity || "",
    location: sub.location || parentLocation || "",
    activityType: sub.activityType || "Rutin (R)",
    hazardClassification: sub.hazardClassification || ["Safety (S)"],

    selectedHazardTypes,
    hazardDetails,

    selectedControls: selectedControls.length > 0 ? selectedControls : ["Engineering Control", "Administrasi", "APD"],
    controlDescriptions: (sub.controlDescriptions && sub.controlDescriptions.length > 0)
      ? [...sub.controlDescriptions]
      : (sub.controlDescription ? [sub.controlDescription] : [""]),
    controlDescription: sub.controlDescription || "",
    currentElimination: sub.currentElimination || "-",
    currentSubstitution: sub.currentSubstitution || "-",
    currentEngineering: sub.currentEngineering || "-",
    currentAdministrative: sub.currentAdministrative || "-",
    currentApd: sub.currentApd || "-",
    currentLikelihood: sub.currentLikelihood ?? 3,
    currentSeverity: sub.currentSeverity ?? 3,

    includeResidual: hasResidual,
    residualSelectedControls: residualSelectedControls.length > 0 ? residualSelectedControls : ["Engineering Control", "APD"],
    residualElimination: sub.residualElimination || "-",
    residualSubstitution: sub.residualSubstitution || "-",
    residualEngineering: sub.residualEngineering || "-",
    residualAdministrative: sub.residualAdministrative || "-",
    residualApd: sub.residualApd || "-",
    residualLikelihood: sub.residualLikelihood ?? 2,
    residualSeverity: sub.residualSeverity ?? 2,

    controlDuration: sub.controlDuration || "30 Hari",
    controlStatus: sub.controlStatus || "Open",
    responsiblePerson: sub.responsiblePerson || "",
    targetDate: sub.targetDate ? dayjs(sub.targetDate) : dayjs().add(1, "month"),
  };
};

export const HiradcEdit: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);

  const { query } = useOne<IHiradc>({
    resource: "hiradc",
    id: id || "1",
  });
  const record = query.data?.data;
  const isFetching = query.isLoading;

  const { mutate: updateHiradc, mutation } = useUpdate();
  const isSaving = mutation.isPending;

  const [subActivities, setSubActivities] = useState<SubActivityFormState[]>([
    createEmptySubActivity(0),
  ]);
  const [activeKey, setActiveKey] = useState<string>(subActivities[0].id);

  // Inisialisasi formulir saat data record diterima
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        parentActivity: record.parentActivity || record.activity || "Menata Arsip",
        unit: record.unit || "Direktorat Preservasi dan Pengolahan Arsip",
        location: record.location || "",
        assessor: record.assessor || "Tim K3 ANRI",
        assessmentDate: record.assessmentDate
          ? dayjs(record.assessmentDate)
          : record.createdAt
          ? dayjs(record.createdAt)
          : dayjs(),
      });

      const rawSubs =
        record.subActivities && record.subActivities.length > 0
          ? record.subActivities
          : [
              {
                id: `sub-single-${record.id}`,
                activity: record.activity,
                location: record.location,
                activityType: record.activityType,
                hazardClassification: record.hazardClassification,
                hazardDetails: record.hazardDetails,
                hazardRows: record.hazardRows,
                hazardPhysics: record.hazardPhysics,
                hazardChemical: record.hazardChemical,
                hazardBiology: record.hazardBiology,
                hazardErgonomics: record.hazardErgonomics,
                hazardPsychosocial: record.hazardPsychosocial,
                riskImpact: record.riskImpact || record.risk || "-",
                controlDescription: record.controlDescription,
                selectedControls: record.selectedControls,
                currentElimination: record.currentElimination,
                currentSubstitution: record.currentSubstitution,
                currentEngineering: record.currentEngineering,
                currentAdministrative: record.currentAdministrative,
                currentApd: record.currentApd,
                currentLikelihood: record.currentLikelihood ?? record.likelihood ?? 3,
                currentSeverity: record.currentSeverity ?? record.severity ?? 3,
                currentNfr: record.currentNfr ?? record.riskScore ?? 9,
                currentRiskLevel: record.currentRiskLevel || "Sedang",
                residualElimination: record.residualElimination,
                residualSubstitution: record.residualSubstitution,
                residualEngineering: record.residualEngineering,
                residualAdministrative: record.residualAdministrative,
                residualApd: record.residualApd,
                residualLikelihood: record.residualLikelihood ?? 2,
                residualSeverity: record.residualSeverity ?? 2,
                residualNfr: record.residualNfr ?? 4,
                residualRiskLevel: record.residualRiskLevel || "Sedang",
                controlDuration: record.controlDuration,
                controlStatus: record.controlStatus,
                responsiblePerson: record.responsiblePerson,
                targetDate: record.targetDate,
              } as IHiradcSubActivity,
            ];

      const parsed = rawSubs.map((s, idx) =>
        parseSubActivityToState(s, record.location, idx)
      );

      setSubActivities(parsed);

      // Cek apakah ada query param ?step=
      const stepParam = searchParams.get("step");
      if (stepParam) {
        const found = parsed.find((p) => p.id === stepParam);
        if (found) {
          setActiveKey(found.id);
        } else {
          const num = parseInt(stepParam, 10);
          if (!isNaN(num) && parsed[num]) {
            setActiveKey(parsed[num].id);
          } else {
            setActiveKey(parsed[0].id);
          }
        }
      } else {
        setActiveKey(parsed[0].id);
      }
    }
  }, [record, form, searchParams]);

  const activeIndex = Math.max(
    0,
    subActivities.findIndex((s) => s.id === activeKey)
  );
  const activeSub = subActivities[activeIndex] || subActivities[0];

  const updateActiveSub = (fields: Partial<SubActivityFormState>) => {
    setSubActivities((prev) =>
      prev.map((item, idx) => (idx === activeIndex ? { ...item, ...fields } : item))
    );
  };

  const handleAddSubActivity = () => {
    const newStep = createEmptySubActivity(subActivities.length);
    setSubActivities((prev) => [...prev, newStep]);
    setActiveKey(newStep.id);
  };

  const handleDuplicateSubActivity = (idx: number) => {
    const source = subActivities[idx];
    const cloned: SubActivityFormState = {
      ...source,
      id: `step-${Date.now()}-${subActivities.length}`,
      activity: `${source.activity || "Proses Kerja"} (Salinan)`,
      selectedHazardTypes: [...(source.selectedHazardTypes || [])],
      hazardDetails: JSON.parse(JSON.stringify(source.hazardDetails || {})),
      controlDescriptions: [...(source.controlDescriptions || (source.controlDescription ? [source.controlDescription] : [""]))],
      selectedControls: [...(source.selectedControls || [])],
      residualSelectedControls: [...(source.residualSelectedControls || [])],
    };
    setSubActivities((prev) => [...prev, cloned]);
    setActiveKey(cloned.id);
  };

  const handleRemoveSubActivity = (targetId: string) => {
    if (subActivities.length <= 1) return;
    const remaining = subActivities.filter((s) => s.id !== targetId);
    setSubActivities(remaining);
    if (activeKey === targetId) {
      setActiveKey(remaining[0].id);
    }
  };

  // Toggle Jenis Bahaya (Fisika, Kimia, Biologi, Ergonomi, Psikososial)
  const handleToggleHazardType = (type: HazardCategoryType) => {
    const currentTypes = [...(activeSub.selectedHazardTypes || [])];
    const exists = currentTypes.includes(type);
    let nextTypes: HazardCategoryType[];

    const currentDetails = { ...(activeSub.hazardDetails || {}) };

    if (exists) {
      if (currentTypes.length <= 1) {
        alert("Minimal harus ada 1 jenis bahaya yang dicentang.");
        return;
      }
      nextTypes = currentTypes.filter((t) => t !== type);
    } else {
      nextTypes = [...currentTypes, type];
      if (!currentDetails[type] || currentDetails[type]!.length === 0) {
        currentDetails[type] = [createDefaultHazardItem("")];
      }
    }

    updateActiveSub({
      selectedHazardTypes: nextTypes,
      hazardDetails: currentDetails,
    });
  };

  // Tambah Deskripsi Bahaya baru pada Jenis Bahaya tertentu
  const handleAddDeskripsi = (type: HazardCategoryType) => {
    const currentDetails = { ...(activeSub.hazardDetails || {}) };
    const items = [...(currentDetails[type] || [])];
    items.push(createDefaultHazardItem(""));
    currentDetails[type] = items;
    updateActiveSub({ hazardDetails: currentDetails });
  };

  // Hapus Deskripsi Bahaya
  const handleRemoveDeskripsi = (type: HazardCategoryType, itemIdx: number) => {
    const currentDetails = { ...(activeSub.hazardDetails || {}) };
    const items = [...(currentDetails[type] || [])];
    if (items.length <= 1) {
      items[0] = createDefaultHazardItem("");
    } else {
      items.splice(itemIdx, 1);
    }
    currentDetails[type] = items;
    updateActiveSub({ hazardDetails: currentDetails });
  };

  // Update teks Deskripsi Bahaya
  const handleUpdateDeskripsiText = (type: HazardCategoryType, itemIdx: number, val: string) => {
    const currentDetails = { ...(activeSub.hazardDetails || {}) };
    const items = [...(currentDetails[type] || [])];
    if (!items[itemIdx]) return;
    items[itemIdx] = { ...items[itemIdx], deskripsi: val };
    currentDetails[type] = items;
    updateActiveSub({ hazardDetails: currentDetails });
  };

  // Tambah Risiko
  const handleAddRisiko = (type: HazardCategoryType, itemIdx: number) => {
    const currentDetails = { ...(activeSub.hazardDetails || {}) };
    const items = [...(currentDetails[type] || [])];
    if (!items[itemIdx]) return;
    const item = items[itemIdx];
    item.risikoList = [...(item.risikoList || []), ""];
    currentDetails[type] = items;
    updateActiveSub({ hazardDetails: currentDetails });
  };

  // Hapus Risiko
  const handleRemoveRisiko = (type: HazardCategoryType, itemIdx: number, rIdx: number) => {
    const currentDetails = { ...(activeSub.hazardDetails || {}) };
    const items = [...(currentDetails[type] || [])];
    if (!items[itemIdx]) return;
    const item = items[itemIdx];
    if ((item.risikoList || []).length <= 1) return;
    item.risikoList = item.risikoList.filter((_, idx) => idx !== rIdx);
    currentDetails[type] = items;
    updateActiveSub({ hazardDetails: currentDetails });
  };

  // Update teks Risiko
  const handleUpdateRisikoText = (type: HazardCategoryType, itemIdx: number, rIdx: number, val: string) => {
    const currentDetails = { ...(activeSub.hazardDetails || {}) };
    const items = [...(currentDetails[type] || [])];
    if (!items[itemIdx]) return;
    const item = items[itemIdx];
    const list = [...(item.risikoList || [])];
    list[rIdx] = val;
    item.risikoList = list;
    currentDetails[type] = items;
    updateActiveSub({ hazardDetails: currentDetails });
  };

  // Tambah Dampak
  const handleAddDampak = (type: HazardCategoryType, itemIdx: number) => {
    const currentDetails = { ...(activeSub.hazardDetails || {}) };
    const items = [...(currentDetails[type] || [])];
    if (!items[itemIdx]) return;
    const item = items[itemIdx];
    item.dampakList = [...(item.dampakList || []), ""];
    currentDetails[type] = items;
    updateActiveSub({ hazardDetails: currentDetails });
  };

  // Hapus Dampak
  const handleRemoveDampak = (type: HazardCategoryType, itemIdx: number, dIdx: number) => {
    const currentDetails = { ...(activeSub.hazardDetails || {}) };
    const items = [...(currentDetails[type] || [])];
    if (!items[itemIdx]) return;
    const item = items[itemIdx];
    if ((item.dampakList || []).length <= 1) return;
    item.dampakList = item.dampakList.filter((_, idx) => idx !== dIdx);
    currentDetails[type] = items;
    updateActiveSub({ hazardDetails: currentDetails });
  };

  // Update teks Dampak
  const handleUpdateDampakText = (type: HazardCategoryType, itemIdx: number, dIdx: number, val: string) => {
    const currentDetails = { ...(activeSub.hazardDetails || {}) };
    const items = [...(currentDetails[type] || [])];
    if (!items[itemIdx]) return;
    const item = items[itemIdx];
    const list = [...(item.dampakList || [])];
    list[dIdx] = val;
    item.dampakList = list;
    currentDetails[type] = items;
    updateActiveSub({ hazardDetails: currentDetails });
  };

  // Tambah Pengendalian pada Deskripsi Bahaya
  const handleAddPengendalian = (type: HazardCategoryType, itemIdx: number) => {
    const currentDetails = { ...(activeSub.hazardDetails || {}) };
    const items = [...(currentDetails[type] || [])];
    if (!items[itemIdx]) return;
    const item = items[itemIdx];
    item.pengendalianList = [...(item.pengendalianList || []), ""];
    currentDetails[type] = items;
    updateActiveSub({ hazardDetails: currentDetails });
  };

  // Hapus Pengendalian pada Deskripsi Bahaya
  const handleRemovePengendalian = (type: HazardCategoryType, itemIdx: number, pIdx: number) => {
    const currentDetails = { ...(activeSub.hazardDetails || {}) };
    const items = [...(currentDetails[type] || [])];
    if (!items[itemIdx]) return;
    const item = items[itemIdx];
    if ((item.pengendalianList || []).length <= 1) return;
    item.pengendalianList = (item.pengendalianList || []).filter((_, idx) => idx !== pIdx);
    currentDetails[type] = items;
    updateActiveSub({ hazardDetails: currentDetails });
  };

  // Update teks Pengendalian pada Deskripsi Bahaya
  const handleUpdatePengendalianText = (type: HazardCategoryType, itemIdx: number, pIdx: number, val: string) => {
    const currentDetails = { ...(activeSub.hazardDetails || {}) };
    const items = [...(currentDetails[type] || [])];
    if (!items[itemIdx]) return;
    const item = items[itemIdx];
    const list = [...(item.pengendalianList || [])];
    list[pIdx] = val;
    item.pengendalianList = list;
    currentDetails[type] = items;
    updateActiveSub({ hazardDetails: currentDetails });
  };

  // Tambah Deskripsi Pengendalian (Bisa lebih dari 1)
  const handleAddControlDescription = () => {
    const list = [...(activeSub.controlDescriptions || (activeSub.controlDescription ? [activeSub.controlDescription] : [""]))];
    list.push("");
    updateActiveSub({
      controlDescriptions: list,
      controlDescription: list.filter((d) => d && d.trim()).join("; "),
    });
  };

  // Hapus Deskripsi Pengendalian
  const handleRemoveControlDescription = (index: number) => {
    const list = [...(activeSub.controlDescriptions || (activeSub.controlDescription ? [activeSub.controlDescription] : [""]))];
    if (list.length <= 1) {
      updateActiveSub({
        controlDescriptions: [""],
        controlDescription: "",
      });
      return;
    }
    list.splice(index, 1);
    updateActiveSub({
      controlDescriptions: list,
      controlDescription: list.filter((d) => d && d.trim()).join("; "),
    });
  };

  // Update teks Deskripsi Pengendalian
  const handleUpdateControlDescriptionText = (index: number, val: string) => {
    const list = [...(activeSub.controlDescriptions || (activeSub.controlDescription ? [activeSub.controlDescription] : [""]))];
    list[index] = val;
    updateActiveSub({
      controlDescriptions: list,
      controlDescription: list.filter((d) => d && d.trim()).join("; "),
    });
  };

  // Toggle Pengendalian Dicentang (Existing Control)
  const handleToggleControl = (control: ControlHierarchyType) => {
    const current = [...(activeSub.selectedControls || [])];
    const exists = current.includes(control);
    const next = exists ? current.filter((c) => c !== control) : [...current, control];
    updateActiveSub({ selectedControls: next });
  };

  // Toggle Pengendalian Lanjutan Dicentang (Residual Control)
  const handleToggleResidualControl = (control: ControlHierarchyType) => {
    const current = [...(activeSub.residualSelectedControls || [])];
    const exists = current.includes(control);
    const next = exists ? current.filter((c) => c !== control) : [...current, control];
    updateActiveSub({ residualSelectedControls: next });
  };

  // Nilai aktif saat ini
  const activeCurrentNfr = activeSub.currentLikelihood * activeSub.currentSeverity;
  const activeCurrentRiskLevel = calculateNfrRiskLevel(activeCurrentNfr);

  const activeResidualNfr = activeSub.residualLikelihood * activeSub.residualSeverity;
  const activeResidualRiskLevel = calculateNfrRiskLevel(activeResidualNfr);

  // Nilai tertinggi di antara semua proses kerja
  const highestCurrentNfr = subActivities.reduce((max, s) => {
    const score = s.currentLikelihood * s.currentSeverity;
    return score > max ? score : max;
  }, 0);
  const highestRiskLevel = calculateNfrRiskLevel(highestCurrentNfr);

  const onFinish = (values: any) => {
    for (let i = 0; i < subActivities.length; i++) {
      const step = subActivities[i];
      if (!step.activity || !step.activity.trim()) {
        setActiveKey(step.id);
        alert(`Harap isi nama Aktivitas / Proses Kerja pada Proses #${i + 1}`);
        return;
      }
      if (!step.selectedHazardTypes || step.selectedHazardTypes.length === 0) {
        setActiveKey(step.id);
        alert(`Harap centang minimal 1 Jenis Bahaya pada Proses #${i + 1}`);
        return;
      }
      const hasAnyDeskripsi = step.selectedHazardTypes.some((type) => {
        const items = step.hazardDetails?.[type] || [];
        return items.some((it) => it.deskripsi && it.deskripsi.trim());
      });
      if (!hasAnyDeskripsi) {
        setActiveKey(step.id);
        alert(`Harap isi minimal 1 Deskripsi Bahaya pada Proses #${i + 1}`);
        return;
      }
    }

    // Susun IHiradcSubActivity
    const compiledSubActivities: IHiradcSubActivity[] = subActivities.map((s, idx) => {
      const cNfr = s.currentLikelihood * s.currentSeverity;
      const rNfr = s.residualLikelihood * s.residualSeverity;

      const selectedTypes = s.selectedHazardTypes || [];
      const cleanedHazardDetails: { [key in HazardCategoryType]?: IHazardDetailItem[] } = {};
      const compiledRows: IHazardDetailRow[] = [];

      selectedTypes.forEach((type) => {
        const items = (s.hazardDetails?.[type] || []).filter(
          (it) => it.deskripsi && it.deskripsi.trim()
        );
        if (items.length > 0) {
          cleanedHazardDetails[type] = items;
          items.forEach((it) => {
            compiledRows.push({
              id: it.id,
              deskripsi: it.deskripsi,
              jenisBahaya: [type],
              risikoList: it.risikoList.filter((r) => r && r.trim()),
              dampakList: it.dampakList.filter((d) => d && d.trim()),
              pengendalianList: (it.pengendalianList || []).filter((p) => p && p.trim()),
            });
          });
        }
      });

      const getCategorySummary = (type: HazardCategoryType) => {
        const items = cleanedHazardDetails[type] || [];
        return items.map((it) => it.deskripsi.trim()).filter(Boolean).join("; ") || "-";
      };

      const allRisks: string[] = [];
      const allImpacts: string[] = [];
      Object.values(cleanedHazardDetails).forEach((itemList) => {
        itemList?.forEach((it) => {
          it.risikoList?.filter((r) => r && r.trim()).forEach((r) => allRisks.push(r.trim()));
          it.dampakList?.filter((d) => d && d.trim()).forEach((d) => allImpacts.push(d.trim()));
        });
      });

      const compiledRiskImpact =
        [
          allRisks.length > 0 ? `Risiko: ${allRisks.join(", ")}` : "",
          allImpacts.length > 0 ? `Dampak: ${allImpacts.join(", ")}` : "",
        ]
          .filter(Boolean)
          .join(" | ") || "Risiko teridentifikasi";

      return {
        id: s.id || `sub-${Date.now()}-${idx + 1}`,
        activity: s.activity,
        location: s.location || values.location,
        activityType: s.activityType,
        hazardClassification: s.hazardClassification,

        selectedHazardTypes: selectedTypes,
        hazardDetails: cleanedHazardDetails,
        hazardRows: compiledRows,

        hazardPhysics: getCategorySummary("Fisika"),
        hazardChemical: getCategorySummary("Kimia"),
        hazardBiology: getCategorySummary("Biologi"),
        hazardErgonomics: getCategorySummary("Ergonomi"),
        hazardPsychosocial: getCategorySummary("Psikososial"),
        riskImpact: compiledRiskImpact,

        controlDescriptions: (s.controlDescriptions && s.controlDescriptions.length > 0)
          ? s.controlDescriptions.filter((d) => d && d.trim())
          : (s.controlDescription ? [s.controlDescription] : []),
        controlDescription: (s.controlDescriptions && s.controlDescriptions.length > 0)
          ? s.controlDescriptions.filter((d) => d && d.trim()).join("; ")
          : (s.controlDescription || "-"),
        selectedControls: s.selectedControls || [],
        currentElimination: s.selectedControls?.includes("Eliminasi") ? "✓" : "-",
        currentSubstitution: s.selectedControls?.includes("Subtitusi") ? "✓" : "-",
        currentEngineering: s.selectedControls?.includes("Engineering Control") ? "✓" : "-",
        currentAdministrative: s.selectedControls?.includes("Administrasi") ? "✓" : "-",
        currentApd: s.selectedControls?.includes("APD") ? "✓" : "-",
        currentLikelihood: s.currentLikelihood,
        currentSeverity: s.currentSeverity,
        currentNfr: cNfr,
        currentRiskLevel: calculateNfrRiskLevel(cNfr),

        residualElimination: s.residualSelectedControls?.includes("Eliminasi") ? "✓" : "-",
        residualSubstitution: s.residualSelectedControls?.includes("Subtitusi") ? "✓" : "-",
        residualEngineering: s.residualSelectedControls?.includes("Engineering Control") ? "✓" : "-",
        residualAdministrative: s.residualSelectedControls?.includes("Administrasi") ? "✓" : "-",
        residualApd: s.residualSelectedControls?.includes("APD") ? "✓" : "-",
        residualLikelihood: s.residualLikelihood,
        residualSeverity: s.residualSeverity,
        residualNfr: rNfr,
        residualRiskLevel: calculateNfrRiskLevel(rNfr),

        controlDuration: s.controlDuration || "30 Hari",
        controlStatus: s.controlStatus || "Open",
        responsiblePerson: s.responsiblePerson || values.assessor || "Tim K3",
        targetDate: s.targetDate ? s.targetDate.format("YYYY-MM-DD") : dayjs().add(1, "month").format("YYYY-MM-DD"),
      };
    });

    const worstSub =
      [...compiledSubActivities].sort((a, b) => b.currentNfr - a.currentNfr)[0] ||
      compiledSubActivities[0];

    const parentActivityTitle = values.parentActivity || values.activity || "Kegiatan K3";

    const formattedPayload = {
      parentActivity: parentActivityTitle,
      activity: parentActivityTitle,
      subActivities: compiledSubActivities,

      unit: values.unit,
      location: values.location,
      assessor: values.assessor,
      assessmentDate: values.assessmentDate
        ? values.assessmentDate.format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),

      hazardDetails: worstSub.hazardDetails,
      hazardRows: worstSub.hazardRows,
      selectedHazardTypes: worstSub.selectedHazardTypes,

      activityType: worstSub.activityType,
      hazardClassification: worstSub.hazardClassification,
      hazardPhysics: worstSub.hazardPhysics,
      hazardChemical: worstSub.hazardChemical,
      hazardBiology: worstSub.hazardBiology,
      hazardErgonomics: worstSub.hazardErgonomics,
      hazardPsychosocial: worstSub.hazardPsychosocial,
      riskImpact: worstSub.riskImpact,

      controlDescriptions: worstSub.controlDescriptions,
      controlDescription: worstSub.controlDescription,
      selectedControls: worstSub.selectedControls,
      currentElimination: worstSub.currentElimination,
      currentSubstitution: worstSub.currentSubstitution,
      currentEngineering: worstSub.currentEngineering,
      currentAdministrative: worstSub.currentAdministrative,
      currentApd: worstSub.currentApd,
      currentLikelihood: worstSub.currentLikelihood,
      currentSeverity: worstSub.currentSeverity,
      currentNfr: worstSub.currentNfr,
      currentRiskLevel: worstSub.currentRiskLevel,

      residualElimination: worstSub.residualElimination,
      residualSubstitution: worstSub.residualSubstitution,
      residualEngineering: worstSub.residualEngineering,
      residualAdministrative: worstSub.residualAdministrative,
      residualApd: worstSub.residualApd,
      residualLikelihood: worstSub.residualLikelihood,
      residualSeverity: worstSub.residualSeverity,
      residualNfr: worstSub.residualNfr,
      residualRiskLevel: worstSub.residualRiskLevel,

      controlDuration: worstSub.controlDuration,
      controlStatus: worstSub.controlStatus,
      responsiblePerson: worstSub.responsiblePerson,
      targetDate: worstSub.targetDate,

      hazard: worstSub.hazardPhysics !== "-" ? worstSub.hazardPhysics : "Bahaya kerja teridentifikasi",
      risk: worstSub.riskImpact,
      category: worstSub.hazardClassification?.[0] || "Safety (S)",
      likelihood: worstSub.currentLikelihood,
      severity: worstSub.currentSeverity,
      riskScore: worstSub.currentNfr,
      riskLevel: calculateRiskLevel(worstSub.currentNfr),
      existingControl: worstSub.currentEngineering !== "-" ? worstSub.currentEngineering : worstSub.controlDescription,
      additionalControl: worstSub.residualEngineering !== "-" ? worstSub.residualEngineering : "-",
    };

    updateHiradc(
      {
        resource: "hiradc",
        id: id || "1",
        values: formattedPayload,
      },
      {
        onSuccess: () => {
          navigate("/keselamatan/hiradc");
        },
      }
    );
  };

  if (isFetching) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, color: "#64748b" }}>Memuat formulir penilaian HIRADC...</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Hero Banner */}
      <div className="safety-hero-banner safety-banner-hiradc">
        <Row align="middle" justify="space-between" gutter={[20, 20]}>
          <Col xs={24} md={16}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Tag
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 10px",
                }}
              >
                <SafetyCertificateOutlined /> EDIT FORMULIR HIRADC
              </Tag>
              <span style={{ fontSize: 13, color: "#e0f2fe" }}>Standar K3 ANRI (ISO 45001 &amp; PP 50/2012)</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Ubah Data Penilaian Risiko HIRADC #{id}
            </Title>
            <Paragraph style={{ color: "#e0f2fe", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Sesuaikan data tahapan proses kerja, pilihan jenis bahaya &amp; pengendalian (centang-centang), rincian deskripsi bahaya, risiko &amp; dampak terhubung, serta evaluasi matriks NFR.
            </Paragraph>
          </Col>

          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <Button
                icon={<InfoCircleOutlined />}
                onClick={() => setMatrixModalOpen(true)}
                className="btn-form-guide"
                style={{ background: "rgba(255,255,255,0.2)", color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}
              >
                Panduan Matriks (5×5)
              </Button>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/keselamatan/hiradc")}
                className="btn-form-cancel"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
              >
                Kembali
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Main Form Card */}
      <Card className="form-content-card form-card-animate form-delay-2" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          {/* SECTION 1: HEADER DOKUMEN SESUAI GOOGLE SPREADSHEET */}
          <div className="form-section-title">
            <span className="badge-num">1</span>
            <span>Header Formulir Penilaian Risiko (Informasi Dokumen &amp; Unit Kerja)</span>
          </div>

          <Row gutter={20}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 700, color: "#0f172a", fontSize: 13.5 }}>Judul Kegiatan Utama (Induk Pekerjaan)</span>}
                name="parentActivity"
                rules={[{ required: true, message: "Judul kegiatan utama wajib diisi!" }]}
              >
                <Input
                  placeholder="Contoh: Menata Arsip / Pengolahan Arsip Statis"
                  size="large"
                  style={{ borderRadius: 8, fontWeight: 600, fontSize: 14 }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Unit Kerja</span>}
                name="unit"
                rules={[{ required: true, message: "Unit kerja wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Direktorat Preservasi dan Pengolahan Arsip" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Lokasi Kerja Umum</span>}
                name="location"
                rules={[{ required: true, message: "Lokasi kerja wajib diisi!" }]}
              >
                <Input
                  prefix={<EnvironmentOutlined style={{ color: "#64748b" }} />}
                  placeholder="Contoh: Depo Arsip Lt. 2 & Ruang Brankas"
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Tanggal Penilaian</span>}
                name="assessmentDate"
                rules={[{ required: true, message: "Tanggal penilaian wajib diisi!" }]}
              >
                <DatePicker style={{ width: "100%", borderRadius: 8 }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Pemeriksa / Tim Penilai</span>}
                name="assessor"
                rules={[{ required: true, message: "Nama pemeriksa wajib diisi!" }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#64748b" }} />}
                  placeholder="Contoh: Tim K3 ANRI / Hendra Gunawan"
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: "24px 0" }} />

          {/* SECTION 2: TAHAPAN AKTIVITAS / PROSES KERJA */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <div className="form-section-title" style={{ margin: 0 }}>
              <span className="badge-num">2</span>
              <span>Tahapan Aktivitas / Proses Kerja yang Dinilai ({subActivities.length} Tahapan)</span>
            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddSubActivity}
              style={{ background: "#0284c7", borderColor: "#0284c7", borderRadius: 8, fontWeight: 600 }}
            >
              Tambah Proses Kerja
            </Button>
          </div>

          {/* TABS PROSES KERJA */}
          <Tabs
            type="card"
            activeKey={activeKey}
            onChange={(key) => setActiveKey(key)}
            items={subActivities.map((sub, idx) => ({
              key: sub.id,
              label: (
                <Space size={6}>
                  <OrderedListOutlined />
                  <span>{`Proses #${idx + 1}: ${sub.activity ? (sub.activity.length > 25 ? sub.activity.slice(0, 25) + "..." : sub.activity) : "Proses Baru"}`}</span>
                </Space>
              ),
            }))}
          />

          {/* KARTU FORMULIR PROSES KERJA AKTIF */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "0 8px 8px 8px",
              padding: "24px",
              marginBottom: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
          >
            {/* Header Toolbar Tahapan */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                paddingBottom: 16,
                borderBottom: "1px dashed #cbd5e1",
                marginBottom: 20,
              }}
            >
              <div>
                <Title level={5} style={{ margin: 0, color: "#0f172a" }}>
                  Penilaian Proses Kerja #{activeIndex + 1}
                </Title>
                <Text type="secondary" style={{ fontSize: 12.5 }}>
                  Lengkapi identifikasi bahaya, risiko, dampak, serta rencana pengendalian untuk proses kerja ini.
                </Text>
              </div>

              <Space wrap>
                <Button
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => handleDuplicateSubActivity(activeIndex)}
                  style={{ borderRadius: 6 }}
                >
                  Duplikasi Proses Ini
                </Button>

                {subActivities.length > 1 && (
                  <Popconfirm
                    title="Hapus tahapan proses kerja ini?"
                    onConfirm={() => handleRemoveSubActivity(activeSub.id)}
                    okText="Ya, Hapus"
                    cancelText="Batal"
                    okButtonProps={{ danger: true, size: "small" }}
                    cancelButtonProps={{ size: "small" }}
                  >
                    <Button size="small" danger icon={<DeleteOutlined />} style={{ borderRadius: 6 }}>
                      Hapus Tahap
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            </div>

            {/* 2.1 INFORMASI PROSES KERJA */}
            <div
              style={{
                marginBottom: 20,
                padding: "16px 18px",
                background: "#f8fafc",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    background: "#0284c7",
                    color: "#ffffff",
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  1
                </span>
                <span>Informasi Tahapan Proses Kerja</span>
              </div>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span style={{ fontWeight: 600, color: "#0f172a" }}>Aktivitas / Proses Kerja #{activeIndex + 1}</span>}
                    required
                    style={{ marginBottom: 8 }}
                  >
                    <Input
                      placeholder="Contoh: Mengambil arsip dari brankas & rak tinggi / Melakukan scan digital"
                      size="large"
                      value={activeSub.activity}
                      onChange={(e) => updateActiveSub({ activity: e.target.value })}
                      style={{ borderRadius: 8, fontWeight: 600 }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Lokasi Spesifik</span>} style={{ marginBottom: 8 }}>
                    <Input
                      placeholder="Contoh: Depo Arsip Lt. 2"
                      size="large"
                      value={activeSub.location}
                      onChange={(e) => updateActiveSub({ location: e.target.value })}
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={6}>
                  <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Sifat Aktivitas</span>} style={{ marginBottom: 8 }}>
                    <Select
                      size="large"
                      value={activeSub.activityType}
                      onChange={(val) => updateActiveSub({ activityType: val })}
                      style={{ width: "100%", borderRadius: 8 }}
                    >
                      <Select.Option value="Rutin (R)">Rutin (R)</Select.Option>
                      <Select.Option value="Non Rutin (NR)">Non Rutin (NR)</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* 2.2 IDENTIFIKASI BAHAYA, RISIKO & DAMPAK */}
            <div
              style={{
                marginBottom: 20,
                background: "#ffffff",
                padding: "16px 18px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      background: "#0284c7",
                      color: "#ffffff",
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    2
                  </span>
                  <span>Identifikasi Kategori Bahaya</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, marginLeft: 30 }}>
                  Pilih kategori bahaya yang ada pada tahapan kerja ini (bisa memilih lebih dari 1):
                </div>
              </div>

              {/* Checkboxes 5 Kategori Bahaya */}
              <Row gutter={[10, 10]} style={{ marginBottom: 16 }}>
                {HAZARD_TYPE_CONFIG.map((cfg) => {
                  const isChecked = (activeSub.selectedHazardTypes || []).includes(cfg.value);
                  const count = (activeSub.hazardDetails?.[cfg.value] || []).length;
                  return (
                    <Col xs={24} sm={12} md={8} lg={4.8} key={cfg.value} style={{ flex: "1 0 18%", minWidth: 160 }}>
                      <div
                        onClick={() => handleToggleHazardType(cfg.value)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 12px",
                          borderRadius: 8,
                          cursor: "pointer",
                          border: isChecked ? `2px solid ${cfg.color}` : "1px solid #cbd5e1",
                          background: isChecked ? cfg.bgColor : "#ffffff",
                          boxShadow: isChecked ? `0 2px 8px ${cfg.color}25` : "none",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleToggleHazardType(cfg.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span style={{ fontSize: 20 }}>{cfg.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: isChecked ? 700 : 500, color: isChecked ? cfg.color : "#1e293b" }}>
                            {cfg.shortLabel}
                          </div>
                          <div style={{ fontSize: 11, color: isChecked ? cfg.color : "#64748b" }}>
                            {isChecked ? `${count} Bahaya Terdata` : "Pilih Kategori"}
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>

              {/* DAFTAR RINCIAN BAHAYA PER KATEGORI YANG DIPILIH */}
              {(activeSub.selectedHazardTypes || []).map((type) => {
                const cfg = HAZARD_TYPE_CONFIG.find((c) => c.value === type) || HAZARD_TYPE_CONFIG[0];
                const items = activeSub.hazardDetails?.[type] || [];

                return (
                  <div
                    key={type}
                    style={{
                      marginBottom: 16,
                      background: "#fafafa",
                      border: `1.5px solid ${cfg.borderColor}`,
                      borderRadius: 8,
                      padding: "16px",
                    }}
                  >
                    {/* Header Kategori Bahaya */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 20 }}>{cfg.icon}</span>
                        <div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: cfg.color }}>
                            {cfg.label}
                          </span>
                          <span style={{ fontSize: 12, color: "#64748b", marginLeft: 8 }}>
                            ({cfg.desc})
                          </span>
                        </div>
                      </div>

                      <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddDeskripsi(type)}
                        style={{ background: cfg.color, borderColor: cfg.color, borderRadius: 6, fontWeight: 600 }}
                      >
                        Tambah Deskripsi Bahaya {type}
                      </Button>
                    </div>

                    {/* Daftar Item Deskripsi Bahaya */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {items.map((item, itemIdx) => (
                        <div
                          key={item.id || itemIdx}
                          style={{
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            padding: "14px 16px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <span style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>
                              Deskripsi Bahaya #{itemIdx + 1}
                            </span>
                            {items.length > 1 && (
                              <Popconfirm
                                title="Hapus deskripsi bahaya ini?"
                                onConfirm={() => handleRemoveDeskripsi(type, itemIdx)}
                                okText="Ya, Hapus"
                                cancelButtonProps={{ size: "small" }}
                                okButtonProps={{ danger: true, size: "small" }}
                              >
                                <Button size="small" type="text" danger icon={<DeleteOutlined />}>
                                  Hapus
                                </Button>
                              </Popconfirm>
                            )}
                          </div>

                          <Input.TextArea
                            rows={2}
                            placeholder={`Jelaskan secara spesifik sumber atau kondisi bahaya ${type.toLowerCase()} yang ditemukan...`}
                            value={item.deskripsi}
                            onChange={(e) => handleUpdateDeskripsiText(type, itemIdx, e.target.value)}
                            style={{ borderRadius: 6, marginBottom: 12, fontSize: 13 }}
                          />

                          {/* 2 Kolom Bersih: Risiko & Dampak */}
                          <Row gutter={16}>
                            {/* Kolom Risiko */}
                            <Col xs={24} md={12}>
                              <div
                                style={{
                                  background: "#fef2f2",
                                  border: "1px solid #fecaca",
                                  borderRadius: 6,
                                  padding: "10px 12px",
                                  marginBottom: 8,
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                  <span style={{ fontWeight: 600, fontSize: 12, color: "#991b1b" }}>
                                    ⚠️ Potensi Risiko (Kejadian / Insiden)
                                  </span>
                                  <Button
                                    type="link"
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleAddRisiko(type, itemIdx)}
                                    style={{ padding: 0, height: "auto", fontSize: 11.5, fontWeight: 600, color: "#dc2626" }}
                                  >
                                    Tambah Risiko
                                  </Button>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                  {(item.risikoList || [""]).map((risiko, rIdx) => (
                                    <div key={rIdx} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                      <Input
                                        size="middle"
                                        placeholder={`Risiko #${rIdx + 1} (contoh: Terpeleset & jatuh dari tangga)`}
                                        value={risiko}
                                        onChange={(e) => handleUpdateRisikoText(type, itemIdx, rIdx, e.target.value)}
                                        style={{ borderRadius: 4, fontSize: 12.5 }}
                                      />
                                      {(item.risikoList || []).length > 1 && (
                                        <Button
                                          size="small"
                                          type="text"
                                          danger
                                          icon={<DeleteOutlined />}
                                          onClick={() => handleRemoveRisiko(type, itemIdx, rIdx)}
                                          style={{ padding: "0 2px" }}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </Col>

                            {/* Kolom Dampak */}
                            <Col xs={24} md={12}>
                              <div
                                style={{
                                  background: "#fff7ed",
                                  border: "1px solid #fed7aa",
                                  borderRadius: 6,
                                  padding: "10px 12px",
                                  marginBottom: 8,
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                  <span style={{ fontWeight: 600, fontSize: 12, color: "#9a3412" }}>
                                    💥 Dampak / Akibat (Konsekuensi Cedera)
                                  </span>
                                  <Button
                                    type="link"
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleAddDampak(type, itemIdx)}
                                    style={{ padding: 0, height: "auto", fontSize: 11.5, fontWeight: 600, color: "#ea580c" }}
                                  >
                                    Tambah Dampak
                                  </Button>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                  {(item.dampakList || [""]).map((dampak, dIdx) => (
                                    <div key={dIdx} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                      <Input
                                        size="middle"
                                        placeholder={`Dampak #${dIdx + 1} (contoh: Fraktur tulang ekstremitas)`}
                                        value={dampak}
                                        onChange={(e) => handleUpdateDampakText(type, itemIdx, dIdx, e.target.value)}
                                        style={{ borderRadius: 4, fontSize: 12.5 }}
                                      />
                                      {(item.dampakList || []).length > 1 && (
                                        <Button
                                          size="small"
                                          type="text"
                                          danger
                                          icon={<DeleteOutlined />}
                                          onClick={() => handleRemoveDampak(type, itemIdx, dIdx)}
                                          style={{ padding: "0 2px" }}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </Col>
                          </Row>

                          {/* Upaya Pengendalian Terkait Bahaya Ini */}
                          <div
                            style={{
                              background: "#f0fdf4",
                              border: "1px solid #bbf7d0",
                              borderRadius: 6,
                              padding: "10px 12px",
                              marginTop: 4,
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, fontSize: 12, color: "#166534" }}>
                                🛡️ Upaya Pengendalian Terkait Bahaya Ini
                              </span>
                              <Button
                                type="link"
                                size="small"
                                icon={<PlusOutlined />}
                                onClick={() => handleAddPengendalian(type, itemIdx)}
                                style={{ padding: 0, height: "auto", fontSize: 11.5, fontWeight: 600, color: "#15803d" }}
                              >
                                Tambah Pengendalian
                              </Button>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {(item.pengendalianList || [""]).map((pengendalian, pIdx) => (
                                <div key={pIdx} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                  <Input
                                    size="middle"
                                    placeholder={`Pengendalian #${pIdx + 1} (contoh: Platform tangga beroda dengan rem pengunci)`}
                                    value={pengendalian}
                                    onChange={(e) => handleUpdatePengendalianText(type, itemIdx, pIdx, e.target.value)}
                                    style={{ borderRadius: 4, fontSize: 12.5 }}
                                  />
                                  {(item.pengendalianList || []).length > 1 && (
                                    <Button
                                      size="small"
                                      type="text"
                                      danger
                                      icon={<DeleteOutlined />}
                                      onClick={() => handleRemovePengendalian(type, itemIdx, pIdx)}
                                      style={{ padding: "0 2px" }}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2.3 PENGENDALIAN RISIKO & PENILAIAN RISIKO */}
            <div
              style={{
                marginBottom: 20,
                padding: "16px 18px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
              }}
            >
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      background: "#0284c7",
                      color: "#ffffff",
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    3
                  </span>
                  <span>Pengendalian Risiko Saat Ini &amp; Penilaian Tingkat Risiko</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, marginLeft: 30 }}>
                  Pilih hirarki pengendalian yang diterapkan dan tentukan tingkat kemungkinan serta keparahannya.
                </div>
              </div>

              {/* Hirarki Kontrol */}
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 12.5, color: "#1e293b", display: "block", marginBottom: 8 }}>
                  Hirarki Pengendalian yang Diterapkan:
                </Text>

                <Row gutter={[10, 10]}>
                  {CONTROL_HIERARCHY_CONFIG.map((ctrl) => {
                    const isChecked = (activeSub.selectedControls || []).includes(ctrl.value);
                    return (
                      <Col xs={24} sm={12} md={8} lg={4.8} key={ctrl.value} style={{ flex: "1 0 18%", minWidth: 160 }}>
                        <div
                          onClick={() => handleToggleControl(ctrl.value)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 12px",
                            borderRadius: 8,
                            cursor: "pointer",
                            border: isChecked ? "2px solid #059669" : "1px solid #cbd5e1",
                            background: isChecked ? "#ecfdf5" : "#ffffff",
                            boxShadow: isChecked ? "0 2px 6px rgba(5, 150, 105, 0.15)" : "none",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleToggleControl(ctrl.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div>
                            <Tag color={ctrl.tagColor} style={{ fontWeight: 700, margin: 0, fontSize: 11 }}>
                              {ctrl.badgeNum}. {ctrl.label}
                            </Tag>
                            <div style={{ fontSize: 10.5, color: isChecked ? "#059669" : "#64748b", marginTop: 2 }}>
                              {isChecked ? "Diterapkan" : "Klik utk pilih"}
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>

              {/* Uraian Tindakan Pengendalian */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "12px 14px",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1e293b" }}>
                    Uraian Upaya Pengendalian
                  </span>
                  <Button
                    type="dashed"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={handleAddControlDescription}
                    style={{ borderRadius: 6, fontWeight: 600 }}
                  >
                    Tambah Pengendalian
                  </Button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(activeSub.controlDescriptions || (activeSub.controlDescription ? [activeSub.controlDescription] : [""])).map((desc, dIdx, arr) => (
                    <div key={dIdx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Input
                        placeholder={`Pengendalian #${dIdx + 1} (contoh: Penyediaan tangga lipat safety platform beroda)`}
                        value={desc}
                        onChange={(e) => handleUpdateControlDescriptionText(dIdx, e.target.value)}
                        style={{ borderRadius: 6, fontSize: 12.5 }}
                      />
                      {arr.length > 1 && (
                        <Popconfirm
                          title="Hapus uraian ini?"
                          onConfirm={() => handleRemoveControlDescription(dIdx)}
                          okText="Hapus"
                          cancelText="Batal"
                        >
                          <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Penilaian Risiko Saat Ini (L & S) */}
              <div
                style={{
                  background: "#f8fafc",
                  padding: "14px 16px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Text strong style={{ fontSize: 12.5, color: "#1e293b", display: "block", marginBottom: 10 }}>
                  Penilaian Tingkat Risiko Saat Ini:
                </Text>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Kemungkinan Terjadi (Likelihood)</span>} style={{ marginBottom: 0 }}>
                      <Select
                        size="large"
                        value={activeSub.currentLikelihood}
                        onChange={(val) => updateActiveSub({ currentLikelihood: val })}
                        style={{ width: "100%" }}
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <Select.Option key={num} value={num}>
                            {num} - {num === 1 ? "Sangat Jarang" : num === 2 ? "Jarang" : num === 3 ? "Sedang" : num === 4 ? "Sering" : "Pasti Terjadi"}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Keparahan Dampak (Severity)</span>} style={{ marginBottom: 0 }}>
                      <Select
                        size="large"
                        value={activeSub.currentSeverity}
                        onChange={(val) => updateActiveSub({ currentSeverity: val })}
                        style={{ width: "100%" }}
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <Select.Option key={num} value={num}>
                            {num} - {num === 1 ? "Ringan Sekali" : num === 2 ? "Ringan" : num === 3 ? "Sedang" : num === 4 ? "Berat" : "Fatal"}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>

            {/* 2.4 PENGENDALIAN LANJUTAN (OPSIONAL) */}
            <div
              style={{
                marginBottom: 20,
                padding: "16px 18px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: activeSub.includeResidual ? 14 : 0 }}>
                <Checkbox
                  checked={activeSub.includeResidual}
                  onChange={(e) => updateActiveSub({ includeResidual: e.target.checked })}
                />
                <div>
                  <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 13.5 }}>
                    Sertakan Rencana Pengendalian Lanjutan (Residual Risk)
                  </span>
                  <span style={{ fontSize: 11.5, color: "#64748b", marginLeft: 8 }}>(Opsional)</span>
                </div>
              </div>

              {activeSub.includeResidual && (
                <div style={{ marginTop: 12 }}>
                  <Text strong style={{ fontSize: 12, color: "#1e293b", display: "block", marginBottom: 8 }}>
                    Hirarki Pengendalian Lanjutan:
                  </Text>
                  <Row gutter={[10, 10]} style={{ marginBottom: 14 }}>
                    {CONTROL_HIERARCHY_CONFIG.map((ctrl) => {
                      const isChecked = (activeSub.residualSelectedControls || []).includes(ctrl.value);
                      return (
                        <Col xs={24} sm={12} md={8} lg={4.8} key={`res-${ctrl.value}`} style={{ flex: "1 0 18%", minWidth: 160 }}>
                          <div
                            onClick={() => handleToggleResidualControl(ctrl.value)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "8px 10px",
                              borderRadius: 8,
                              cursor: "pointer",
                              border: isChecked ? "2px solid #0d9488" : "1px solid #cbd5e1",
                              background: isChecked ? "#f0fdfa" : "#ffffff",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <Checkbox
                              checked={isChecked}
                              onChange={() => handleToggleResidualControl(ctrl.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div>
                              <Tag color={ctrl.tagColor} style={{ fontWeight: 700, margin: 0, fontSize: 11 }}>
                                {ctrl.badgeNum}. {ctrl.label}
                              </Tag>
                              <div style={{ fontSize: 10, color: isChecked ? "#0d9488" : "#64748b", marginTop: 1 }}>
                                {isChecked ? "Diterapkan" : "Klik utk pilih"}
                              </div>
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Kemungkinan Sisa (Likelihood)</span>} style={{ marginBottom: 0 }}>
                        <Select
                          size="middle"
                          value={activeSub.residualLikelihood}
                          onChange={(val) => updateActiveSub({ residualLikelihood: val })}
                          style={{ width: "100%" }}
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <Select.Option key={num} value={num}>{num}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Keparahan Sisa (Severity)</span>} style={{ marginBottom: 0 }}>
                        <Select
                          size="middle"
                          value={activeSub.residualSeverity}
                          onChange={(val) => updateActiveSub({ residualSeverity: val })}
                          style={{ width: "100%" }}
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <Select.Option key={num} value={num}>{num}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )}
            </div>

            {/* 2.5 TINDAK LANJUT & PENANGGUNG JAWAB */}
            <div
              style={{
                marginBottom: 10,
                padding: "16px 18px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
              }}
            >
              <div style={{ marginBottom: 12, fontWeight: 700, fontSize: 13.5, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
                <CalendarOutlined style={{ color: "#0284c7" }} />
                <span>Tindak Lanjut &amp; Penanggung Jawab</span>
              </div>

              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Tenggat Waktu</span>}>
                    <DatePicker
                      style={{ width: "100%", borderRadius: 6 }}
                      format="DD/MM/YYYY"
                      size="middle"
                      value={activeSub.targetDate}
                      onChange={(date) => updateActiveSub({ targetDate: date || dayjs() })}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Status</span>}>
                    <Select
                      size="middle"
                      value={activeSub.controlStatus}
                      onChange={(val) => updateActiveSub({ controlStatus: val })}
                      style={{ width: "100%" }}
                    >
                      <Select.Option value="Open">
                        <Tag color="orange" style={{ margin: 0, fontWeight: 700 }}>Open</Tag> (Dalam Proses)
                      </Select.Option>
                      <Select.Option value="Close">
                        <Tag color="green" style={{ margin: 0, fontWeight: 700 }}>Close</Tag> (Selesai)
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Durasi Pengendalian</span>}>
                    <Select
                      size="middle"
                      value={activeSub.controlDuration}
                      onChange={(val) => updateActiveSub({ controlDuration: val })}
                      style={{ width: "100%" }}
                    >
                      <Select.Option value="7 Hari">7 Hari (Maksimal)</Select.Option>
                      <Select.Option value="14 Hari">14 Hari</Select.Option>
                      <Select.Option value="30 Hari">30 Hari (1 Bulan)</Select.Option>
                      <Select.Option value="3 Bulan">3 Bulan</Select.Option>
                      <Select.Option value="12 Bulan">12 Bulan (&lt; 1 Tahun)</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Penanggung Jawab (PIC)</span>}>
                    <Input
                      size="middle"
                      placeholder="Contoh: Koordinator Depo Arsip"
                      value={activeSub.responsiblePerson}
                      onChange={(e) => updateActiveSub({ responsiblePerson: e.target.value })}
                      style={{ borderRadius: 6 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <Divider style={{ margin: "20px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddSubActivity}
              style={{ borderRadius: 8, fontWeight: 600 }}
            >
              Tambah Proses Kerja Lainnya
            </Button>

            <Space>
              <Button onClick={() => navigate("/keselamatan/hiradc")} size="large" style={{ borderRadius: 8 }}>
                Batal
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isSaving}
                size="large"
                style={{
                  background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                  borderColor: "#0284c7",
                  borderRadius: 8,
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)",
                }}
              >
                Simpan Perubahan HIRADC
              </Button>
            </Space>
          </div>
        </Form>
      </Card>

      {/* Modal Matriks Risiko 5x5 */}
      <RiskMatrixModal open={matrixModalOpen} onClose={() => setMatrixModalOpen(false)} />
    </div>
  );
};
