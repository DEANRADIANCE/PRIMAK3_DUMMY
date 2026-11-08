import React, { useState } from "react";
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
  Tooltip,
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
  CheckSquareOutlined,
  BranchesOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
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
} from "../../../types/hiradc";
import { IUser } from "../../../types/user";
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
  // Setiap jenis bahaya bisa menambah deskripsi bahaya > 1,
  // dan setiap deskripsi bahaya bisa isi risiko > 1 dan dampak > 1
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

const createDefaultSubActivity = (index: number): SubActivityFormState => ({
  id: `step-${Date.now()}-${index}`,
  activity: index === 0 ? "Mengambil arsip dari brankas & rak tinggi" : "",
  location: "Depo Arsip Lt. 2 & Ruang Brankas",
  activityType: "Rutin (R)",
  hazardClassification: ["Safety (S)", "Health (H)"],

  selectedHazardTypes: ["Fisika"],

  hazardDetails:
    index === 0
      ? {
          Fisika: [
            {
              id: `h-fisika-1`,
              deskripsi:
                "Ketinggian rak brankas (>2 meter), tangga lipat aluminium licin & tidak stabil saat menjangkau boks arsip berat",
              risikoList: [
                "Terpeleset dan jatuh dari tangga kerja pada ketinggian > 2 meter",
                "Kehilangan keseimbangan saat menarik kardus arsip berat",
              ],
              dampakList: [
                "Fraktur / patah tulang ekstremitas (tangan/kaki)",
                "Trauma cedera benturan kepala dan memar jaringan lunak",
              ],
              pengendalianList: [
                "Penyediaan unit tangga keselamatan tipe platform beroda dengan rem pengunci otomatis dan handrail keliling ganda",
              ],
            },
          ],
        }
      : {
          Fisika: [createDefaultHazardItem("")],
        },

  selectedControls: ["Engineering Control"],
  controlDescriptions:
    index === 0
      ? [
          "Penyediaan unit tangga keselamatan tipe platform beroda dengan rem pengunci otomatis dan handrail keliling ganda",
        ]
      : [""],
  controlDescription:
    index === 0
      ? "Penyediaan unit tangga keselamatan tipe platform beroda dengan rem pengunci otomatis dan handrail keliling ganda"
      : "",
  currentElimination: "-",
  currentSubstitution: "-",
  currentEngineering: "Tangga safety platform beroda dengan rem pengunci keselamatan & handrail keliling ganda",
  currentAdministrative: "-",
  currentApd: "-",
  currentLikelihood: 3,
  currentSeverity: 3,

  includeResidual: true,
  residualSelectedControls: ["Engineering Control"],
  residualElimination: "-",
  residualSubstitution: "-",
  residualEngineering: "Tangga safety platform beroda berstandar industri dengan sensor rem anti-slip dan sangkar pelindung keliling",
  residualAdministrative: "-",
  residualApd: "-",
  residualLikelihood: 1,
  residualSeverity: 2,

  controlDuration: "14 Hari",
  controlStatus: "Open",
  responsiblePerson: "Koordinator Depo Arsip",
  targetDate: dayjs().add(1, "month"),
});

export const HiradcCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<IUser>();
  const [form] = Form.useForm();
  const { mutate: createHiradc, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const [matrixModalOpen, setMatrixModalOpen] = useState(false);

  // Sub-aktivitas state
  const [subActivities, setSubActivities] = useState<SubActivityFormState[]>([
    createDefaultSubActivity(0),
  ]);
  const [activeKey, setActiveKey] = useState<string>(subActivities[0].id);

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
    const newStep = createDefaultSubActivity(subActivities.length);
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
      controlDescriptions: [...(source.controlDescriptions || [source.controlDescription || ""])],
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

  // --- OPERASI PILIHAN JENIS BAHAYA & DESKRIPSI BAHAYA (SESUAI SPREADSHEET) ---

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

  // Hapus Deskripsi Bahaya pada Jenis Bahaya tertentu
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

  // Tambah Risiko pada Deskripsi Bahaya
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

  // Tambah Dampak pada Deskripsi Bahaya
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

  // --- OPERASI PENGENDALIAN (HIRARKI KONTROL: ELIMINASI, SUBTITUSI, ENGINEERING, ADMINISTRASI, APD) ---

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
      status: "reviewed",
    };

    createHiradc(
      {
        resource: "hiradc",
        values: formattedPayload,
      },
      {
        onSuccess: () => {
          navigate("/keselamatan/hiradc");
        },
      }
    );
  };

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
                <SafetyCertificateOutlined /> FORMULIR HIRADC RESMI
              </Tag>
              <span style={{ fontSize: 13, color: "#e0f2fe" }}>Standar K3 ANRI (ISO 45001 &amp; PP 50/2012)</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Form Penilaian Risiko HIRADC
            </Title>
            <Paragraph style={{ color: "#e0f2fe", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Identifikasi 5 faktor bahaya kerja, pilihan jenis bahaya &amp; pengendalian (centang-centang), penambahan deskripsi bahaya, risiko &amp; dampak terhubung, serta evaluasi matriks NFR (L × S).
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
          initialValues={{
            parentActivity: "Menata Arsip",
            unit: user?.unit || "Direktorat Preservasi dan Pengolahan Arsip",
            assessmentDate: dayjs(),
            assessor: user?.name || "Tim K3 ANRI",
            location: "Depo Arsip Lt. 2 & Ruang Brankas Khusus",
          }}
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

            <Space wrap>
              <Tag color={getNfrTagColor(highestRiskLevel)} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, fontWeight: 700 }}>
                NFR Tertinggi: {highestCurrentNfr} [{highestRiskLevel.toUpperCase()}]
              </Tag>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddSubActivity}
                style={{ background: "#0284c7", borderColor: "#0284c7", borderRadius: 8, fontWeight: 600 }}
              >
                Tambah Proses Kerja
              </Button>
            </Space>
          </div>

          {/* TABS PROSES KERJA */}
          <Tabs
            type="card"
            activeKey={activeKey}
            onChange={(key) => setActiveKey(key)}
            items={subActivities.map((sub, idx) => {
              const nfr = sub.currentLikelihood * sub.currentSeverity;
              const level = calculateNfrRiskLevel(nfr);
              return {
                key: sub.id,
                label: (
                  <Space size={6}>
                    <OrderedListOutlined />
                    <span>{`Proses #${idx + 1}: ${sub.activity ? sub.activity.slice(0, 24) + (sub.activity.length > 24 ? "..." : "") : "Proses Kerja Baru"}`}</span>
                    <Tag
                      color={getNfrTagColor(level)}
                      style={{ margin: 0, fontSize: 10, borderRadius: 4, lineHeight: "16px", fontWeight: 700 }}
                    >
                      {nfr} • {level}
                    </Tag>
                  </Space>
                ),
              };
            })}
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
                  Formulir HIRADC Terperinci Sesuai Standar ISO 45001 &amp; SMK3 (Formulir Google Spreadsheet)
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

            {/* Alert banner risiko proses aktif */}
            <Alert
              type={activeCurrentRiskLevel === "Sangat Tinggi" ? "error" : activeCurrentRiskLevel === "Tinggi" ? "warning" : activeCurrentRiskLevel === "Sedang" ? "info" : "success"}
              showIcon
              message={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <span>
                    <strong>Analisis Risiko Proses Ini:</strong> NFR {activeCurrentNfr} [{activeCurrentRiskLevel.toUpperCase()}] (Kemungkinan: {activeSub.currentLikelihood} × Keparahan: {activeSub.currentSeverity})
                  </span>
                  <Tag color={getNfrTagColor(activeCurrentRiskLevel)} style={{ fontWeight: 800, fontSize: 12 }}>
                    NFR: {activeCurrentNfr} ({activeCurrentRiskLevel})
                  </Tag>
                </div>
              }
              style={{ marginBottom: 20, borderRadius: 8 }}
            />

            {/* A. NAMA PROSES KERJA, LOKASI & SIFAT */}
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={<span style={{ fontWeight: 700, color: "#0f172a" }}>Aktivitas / Proses Kerja #{activeIndex + 1}</span>}
                  required
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
                <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Lokasi Spesifik</span>}>
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
                <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Sifat Aktivitas: Rutin / Non-Rutin</span>}>
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

            {/* B. PILIHAN JENIS BAHAYA (CENTANG-CENTANG BISA LEBIH DARI 1) */}
            <div
              style={{
                marginTop: 10,
                marginBottom: 20,
                background: "#f8fafc",
                padding: "16px 18px",
                borderRadius: 10,
                border: "1px solid #cbd5e1",
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <Text strong style={{ color: "#0f172a", fontSize: 13.5 }}>
                  <ThunderboltOutlined style={{ color: "#ef4444", marginRight: 8, fontSize: 16 }} />
                  Pilihan Jenis Bahaya (Centang jenis bahaya yang ada, bisa centang lebih dari 1):
                </Text>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  Setiap jenis bahaya yang dicentang akan memunculkan bagian untuk menambah <strong>Deskripsi Bahaya</strong> (bisa lebih dari 1), serta <strong>Risiko</strong> &amp; <strong>Dampak</strong> terhubung.
                </div>
              </div>

              {/* Checkboxes 5 Jenis Bahaya */}
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
                          gap: 8,
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
                        <span style={{ fontSize: 18 }}>{cfg.icon}</span>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: isChecked ? 800 : 600, color: isChecked ? cfg.color : "#1e293b" }}>
                            {cfg.shortLabel}
                          </div>
                          <div style={{ fontSize: 10.5, color: isChecked ? cfg.color : "#64748b" }}>
                            {isChecked ? `${count} Deskripsi Bahaya` : "Klik utk centang"}
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>

              {/* AREA RINCIAN DESKRIPSI BAHAYA, RISIKO & DAMPAK PER JENIS BAHAYA YANG DICENTANG */}
              {(activeSub.selectedHazardTypes || []).map((type) => {
                const cfg = HAZARD_TYPE_CONFIG.find((c) => c.value === type) || HAZARD_TYPE_CONFIG[0];
                const items = activeSub.hazardDetails?.[type] || [];

                return (
                  <div
                    key={type}
                    style={{
                      marginBottom: 16,
                      background: cfg.bgColor,
                      border: `1.5px solid ${cfg.borderColor}`,
                      borderRadius: 10,
                      padding: "16px",
                    }}
                  >
                    {/* Header Jenis Bahaya */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 20 }}>{cfg.icon}</span>
                        <div>
                          <span style={{ fontSize: 14, fontWeight: 800, color: cfg.color }}>
                            {cfg.label}
                          </span>
                          <span style={{ fontSize: 11.5, color: "#64748b", marginLeft: 8 }}>
                            ({cfg.desc})
                          </span>
                        </div>
                        <Tag color="blue" style={{ borderRadius: 10, fontWeight: 700, fontSize: 11, marginLeft: 4 }}>
                          {items.length} Deskripsi Bahaya
                        </Tag>
                      </div>

                      <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddDeskripsi(type)}
                        style={{ background: cfg.color, borderColor: cfg.color, borderRadius: 6, fontWeight: 700 }}
                      >
                        + Tambah Deskripsi Bahaya {type}
                      </Button>
                    </div>

                    {/* Daftar Item Deskripsi Bahaya, Risiko & Dampak */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {items.map((item, itemIdx) => (
                        <div
                          key={item.id || itemIdx}
                          style={{
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            padding: "14px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <span style={{ fontWeight: 700, fontSize: 12.5, color: "#0f172a" }}>
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
                                  Hapus Deskripsi
                                </Button>
                              </Popconfirm>
                            )}
                          </div>

                          <Input.TextArea
                            rows={2}
                            placeholder={`Tuliskan deskripsi bahaya ${type.toLowerCase()} secara spesifik pada proses kerja ini...`}
                            value={item.deskripsi}
                            onChange={(e) => handleUpdateDeskripsiText(type, itemIdx, e.target.value)}
                            style={{ borderRadius: 6, marginBottom: 12, fontSize: 12.5 }}
                          />

                          {/* Risiko, Dampak & Pengendalian Terhubung (3 Kolom per Deskripsi Bahaya) */}
                          <Row gutter={12}>
                            {/* Kolom 1: Risiko */}
                            <Col xs={24} lg={8} md={12}>
                              <div
                                style={{
                                  background: "#fff5f5",
                                  border: "1px solid #fecaca",
                                  borderRadius: 6,
                                  padding: "10px 12px",
                                  marginBottom: 8,
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                  <span style={{ fontWeight: 700, fontSize: 12, color: "#991b1b" }}>
                                    ⚠️ Risiko Terkait ({(item.risikoList || []).length})
                                  </span>
                                  <Button
                                    type="link"
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleAddRisiko(type, itemIdx)}
                                    style={{ padding: 0, height: "auto", fontSize: 11.5, fontWeight: 700, color: "#dc2626" }}
                                  >
                                    + Tambah Risiko
                                  </Button>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                  {(item.risikoList || [""]).map((risiko, rIdx) => (
                                    <div key={rIdx} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                      <Input
                                        size="small"
                                        placeholder={`Risiko #${rIdx + 1} (contoh: Terpeleset & jatuh dari tangga)`}
                                        value={risiko}
                                        onChange={(e) => handleUpdateRisikoText(type, itemIdx, rIdx, e.target.value)}
                                        style={{ borderRadius: 4, fontSize: 12 }}
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

                            {/* Kolom 2: Dampak */}
                            <Col xs={24} lg={8} md={12}>
                              <div
                                style={{
                                  background: "#fffaf0",
                                  border: "1px solid #fed7aa",
                                  borderRadius: 6,
                                  padding: "10px 12px",
                                  marginBottom: 8,
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                  <span style={{ fontWeight: 700, fontSize: 12, color: "#9a3412" }}>
                                    💥 Dampak / Akibat ({(item.dampakList || []).length})
                                  </span>
                                  <Button
                                    type="link"
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleAddDampak(type, itemIdx)}
                                    style={{ padding: 0, height: "auto", fontSize: 11.5, fontWeight: 700, color: "#ea580c" }}
                                  >
                                    + Tambah Dampak
                                  </Button>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                  {(item.dampakList || [""]).map((dampak, dIdx) => (
                                    <div key={dIdx} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                      <Input
                                        size="small"
                                        placeholder={`Dampak #${dIdx + 1} (contoh: Fraktur tulang ekstremitas)`}
                                        value={dampak}
                                        onChange={(e) => handleUpdateDampakText(type, itemIdx, dIdx, e.target.value)}
                                        style={{ borderRadius: 4, fontSize: 12 }}
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

                            {/* Kolom 3: Deskripsi Pengendalian (Bisa > 1 per Deskripsi Bahaya) */}
                            <Col xs={24} lg={8} md={24}>
                              <div
                                style={{
                                  background: "#f0fdf4",
                                  border: "1px solid #bbf7d0",
                                  borderRadius: 6,
                                  padding: "10px 12px",
                                  marginBottom: 8,
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                  <span style={{ fontWeight: 700, fontSize: 12, color: "#166534" }}>
                                    🛡️ Deskripsi Pengendalian ({(item.pengendalianList || []).length})
                                  </span>
                                  <Button
                                    type="link"
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleAddPengendalian(type, itemIdx)}
                                    style={{ padding: 0, height: "auto", fontSize: 11.5, fontWeight: 700, color: "#15803d" }}
                                  >
                                    + Tambah Pengendalian
                                  </Button>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                  {(item.pengendalianList || [""]).map((pengendalian, pIdx) => (
                                    <div key={pIdx} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                      <Input
                                        size="small"
                                        placeholder={`Pengendalian #${pIdx + 1} (contoh: Platform tangga beroda)`}
                                        value={pengendalian}
                                        onChange={(e) => handleUpdatePengendalianText(type, itemIdx, pIdx, e.target.value)}
                                        style={{ borderRadius: 4, fontSize: 12 }}
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
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* C. PENGENDALIAN (ELIMINASI, SUBTITUSI, ENGINEERING CONTROL, ADMINISTRASI, APD) */}
            <div
              style={{
                marginTop: 14,
                marginBottom: 16,
                padding: "16px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <span style={{ fontWeight: 800, color: "#166534", fontSize: 14 }}>
                    🛡️ Pengendalian Risiko &amp; Hirarki Kontrol K3 (Kolom M - U Spreadsheet)
                  </span>
                  <div style={{ fontSize: 12, color: "#15803d" }}>
                    Centang hirarki pengendalian yang diterapkan (bisa centang lebih dari 1) dan masukkan uraian spesifiknya.
                  </div>
                </div>
                <Tag color={getNfrTagColor(activeCurrentRiskLevel)} style={{ fontWeight: 800, fontSize: 13, padding: "4px 10px" }}>
                  NFR: {activeCurrentNfr} ({activeCurrentRiskLevel})
                </Tag>
              </div>

              {/* Deskripsi Pengendalian (Bisa Lebih Dari 1 Deskripsi Pengendalian) */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #86efac",
                  borderRadius: 8,
                  padding: "14px 16px",
                  marginBottom: 16,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#166534", display: "flex", alignItems: "center", gap: 6 }}>
                      <span>📝 Deskripsi Pengendalian (Uraian Upaya Kontrol)</span>
                      <Tag color="green" style={{ borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
                        {(activeSub.controlDescriptions || (activeSub.controlDescription ? [activeSub.controlDescription] : [""])).length} Deskripsi
                      </Tag>
                    </span>
                    <div style={{ fontSize: 11.5, color: "#15803d", marginTop: 2 }}>
                      Tuliskan rincian tindakan pengendalian saat ini pada proses kerja (dapat menambahkan lebih dari 1 deskripsi pengendalian).
                    </div>
                  </div>
                  <Button
                    type="dashed"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={handleAddControlDescription}
                    style={{
                      borderColor: "#16a34a",
                      color: "#15803d",
                      fontWeight: 700,
                      borderRadius: 6,
                    }}
                  >
                    + Tambah Deskripsi Pengendalian
                  </Button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(activeSub.controlDescriptions || (activeSub.controlDescription ? [activeSub.controlDescription] : [""])).map((desc, dIdx, arr) => (
                    <div
                      key={dIdx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#f8fafc",
                        padding: "8px 10px",
                        borderRadius: 6,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Tag
                        color="green"
                        style={{
                          margin: 0,
                          fontWeight: 700,
                          fontSize: 11.5,
                          borderRadius: 4,
                          minWidth: 28,
                          textAlign: "center",
                        }}
                      >
                        #{dIdx + 1}
                      </Tag>
                      <Input
                        placeholder={`Deskripsi Pengendalian #${dIdx + 1} (contoh: Penyediaan tangga lipat berstandar keselamatan / SOP kehati-hatian)`}
                        value={desc}
                        onChange={(e) => handleUpdateControlDescriptionText(dIdx, e.target.value)}
                        style={{ borderRadius: 6, fontSize: 12.5 }}
                      />
                      {arr.length > 1 && (
                        <Popconfirm
                          title="Hapus deskripsi pengendalian ini?"
                          onConfirm={() => handleRemoveControlDescription(dIdx)}
                          okText="Hapus"
                          cancelText="Batal"
                        >
                          <Button
                            size="small"
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            style={{ padding: "0 6px" }}
                            title="Hapus deskripsi pengendalian"
                          />
                        </Popconfirm>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 5 Hirarki Kontrol: Ceklis Aja Tanpa Keterangan */}
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 12.5, color: "#166534", display: "block", marginBottom: 8 }}>
                  Hirarki Pengendalian yang Diterapkan (Ceklis jenis kontrol yang digunakan, bisa lebih dari 1):
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
                            border: isChecked ? `2px solid #059669` : "1px solid #cbd5e1",
                            background: isChecked ? "#ffffff" : "#f8fafc",
                            boxShadow: isChecked ? "0 2px 8px rgba(5, 150, 105, 0.18)" : "none",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleToggleControl(ctrl.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div>
                            <Tag color={ctrl.tagColor} style={{ fontWeight: 800, margin: 0, fontSize: 11.5 }}>
                              {ctrl.badgeNum}. {ctrl.label}
                            </Tag>
                            <div style={{ fontSize: 10.5, color: isChecked ? "#059669" : "#64748b", marginTop: 2, fontWeight: isChecked ? 700 : 400 }}>
                              {isChecked ? "✓ Diterapkan" : "Klik utk ceklis"}
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>

              {/* Matriks Analisis Risiko */}
              <Row
                gutter={16}
                align="middle"
                style={{
                  marginTop: 10,
                  background: "#ffffff",
                  padding: "12px 16px",
                  borderRadius: 6,
                  border: "1px solid #dcfce7",
                }}
              >
                <Col xs={24} sm={8}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Text strong style={{ fontSize: 12.5 }}>Kemungkinan (L):</Text>
                    <Select
                      size="middle"
                      value={activeSub.currentLikelihood}
                      onChange={(val) => updateActiveSub({ currentLikelihood: val })}
                      style={{ width: 145 }}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <Select.Option key={num} value={num}>
                          {num} - {num === 1 ? "Sangat Jarang" : num === 2 ? "Jarang" : num === 3 ? "Sedang" : num === 4 ? "Sering" : "Pasti Terjadi"}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>

                <Col xs={24} sm={8}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Text strong style={{ fontSize: 12.5 }}>Keparahan (S):</Text>
                    <Select
                      size="middle"
                      value={activeSub.currentSeverity}
                      onChange={(val) => updateActiveSub({ currentSeverity: val })}
                      style={{ width: 145 }}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <Select.Option key={num} value={num}>
                          {num} - {num === 1 ? "Ringan Sekali" : num === 2 ? "Ringan" : num === 3 ? "Sedang" : num === 4 ? "Berat" : "Fatal"}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>

                <Col xs={24} sm={8} style={{ textAlign: "right" }}>
                  <Text style={{ fontSize: 12.5, marginRight: 8, color: "#334155" }}>
                    Nilai Faktor Risiko (NFR = L × S):
                  </Text>
                  <Tag color={getNfrTagColor(activeCurrentRiskLevel)} style={{ fontSize: 14, fontWeight: 900, padding: "3px 12px" }}>
                    {activeCurrentNfr} [{activeCurrentRiskLevel.toUpperCase()}]
                  </Tag>
                </Col>
              </Row>
            </div>

            {/* D. PENGENDALIAN LANJUTAN (RESIDUAL CONTROL - OPSIONAL) */}
            <div
              style={{
                marginTop: 14,
                marginBottom: 16,
                padding: "16px",
                background: "#f0fdfa",
                border: "1px solid #ccfbf1",
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Checkbox
                    checked={activeSub.includeResidual}
                    onChange={(e) => updateActiveSub({ includeResidual: e.target.checked })}
                  />
                  <span style={{ fontWeight: 800, color: "#0f766e", fontSize: 13.5 }}>
                    Sertakan Rencana Pengendalian Lanjutan (Determining / Residual Control)
                  </span>
                </div>
                {activeSub.includeResidual && (
                  <Tag color={getNfrTagColor(activeResidualRiskLevel)} style={{ fontWeight: 800, fontSize: 13, padding: "3px 10px" }}>
                    NFR Target: {activeResidualNfr} ({activeResidualRiskLevel})
                  </Tag>
                )}
              </div>

              {activeSub.includeResidual && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ marginBottom: 12 }}>
                    <Text strong style={{ fontSize: 12, color: "#0f766e", display: "block", marginBottom: 6 }}>
                      Hirarki Pengendalian Lanjutan (Ceklis jenis kontrol lanjutan, bisa lebih dari 1):
                    </Text>
                    <Row gutter={[10, 10]}>
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
                                border: isChecked ? `2px solid #0d9488` : "1px solid #cbd5e1",
                                background: isChecked ? "#ffffff" : "#f0fdfa",
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
                                  {isChecked ? "✓ Diterapkan" : "Klik utk ceklis"}
                                </div>
                              </div>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>

                  <Row gutter={16} align="middle" style={{ background: "#ffffff", padding: "10px 14px", borderRadius: 6, border: "1px solid #ccfbf1" }}>
                    <Col xs={24} sm={8}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Text strong style={{ fontSize: 12 }}>Kemungkinan Sisa (L):</Text>
                        <Select
                          size="small"
                          value={activeSub.residualLikelihood}
                          onChange={(val) => updateActiveSub({ residualLikelihood: val })}
                          style={{ width: 130 }}
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <Select.Option key={num} value={num}>{num}</Select.Option>
                          ))}
                        </Select>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Text strong style={{ fontSize: 12 }}>Keparahan Sisa (S):</Text>
                        <Select
                          size="small"
                          value={activeSub.residualSeverity}
                          onChange={(val) => updateActiveSub({ residualSeverity: val })}
                          style={{ width: 130 }}
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <Select.Option key={num} value={num}>{num}</Select.Option>
                          ))}
                        </Select>
                      </div>
                    </Col>
                    <Col xs={24} sm={8} style={{ textAlign: "right" }}>
                      <Text style={{ fontSize: 12, marginRight: 8, color: "#0f766e" }}>NFR Target Sisa:</Text>
                      <Tag color={getNfrTagColor(activeResidualRiskLevel)} style={{ fontWeight: 800 }}>
                        {activeResidualNfr} [{activeResidualRiskLevel.toUpperCase()}]
                      </Tag>
                    </Col>
                  </Row>
                </div>
              )}
            </div>

            {/* E. TINDAK LANJUT & STATUS */}
            <div
              style={{
                marginTop: 14,
                marginBottom: 10,
                padding: "16px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 13.5 }}>
                  <CalendarOutlined style={{ marginRight: 6, color: "#0284c7" }} />
                  Tindak Lanjut &amp; Status Pengendalian (Kolom V &amp; W Spreadsheet)
                </span>
              </div>

              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Tenggat Upaya Tindak Lanjut</span>}>
                    <DatePicker
                      style={{ width: "100%", borderRadius: 6 }}
                      format="DD/MM/YYYY"
                      value={activeSub.targetDate}
                      onChange={(date) => updateActiveSub({ targetDate: date || dayjs() })}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Status Tindak Lanjut</span>}>
                    <Select
                      value={activeSub.controlStatus}
                      onChange={(val) => updateActiveSub({ controlStatus: val })}
                      style={{ width: "100%" }}
                    >
                      <Select.Option value="Open">
                        <Tag color="orange" style={{ margin: 0, fontWeight: 700 }}>Open</Tag> (Dalam Proses)
                      </Select.Option>
                      <Select.Option value="Close">
                        <Tag color="green" style={{ margin: 0, fontWeight: 700 }}>Close</Tag> (Sudah Selesai Dikerjakan)
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item label={<span style={{ fontSize: 12, fontWeight: 600 }}>Durasi Pengendalian</span>}>
                    <Select
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
                loading={isLoading}
                size="large"
                style={{
                  background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                  borderColor: "#0284c7",
                  borderRadius: 8,
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)",
                }}
              >
                Simpan Formulir HIRADC
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
