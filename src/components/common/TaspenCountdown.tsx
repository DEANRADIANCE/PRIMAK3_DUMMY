import React from "react";
import { Tag, Alert, Space, Typography } from "antd";
import { ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { EmploymentStatus, TaspenStatus } from "../../types/accident";
import { initialSettings } from "../../mocks/settings";

const { Text } = Typography;

interface TaspenCountdownProps {
  accidentDate: string;
  employmentStatus: EmploymentStatus;
  taspenStatus: TaspenStatus;
  showBanner?: boolean;
}

export const TaspenCountdown: React.FC<TaspenCountdownProps> = ({
  accidentDate,
  employmentStatus,
  taspenStatus,
  showBanner = false,
}) => {
  // Jika klaim sudah diajukan atau selesai, tampilkan status selesai
  if (taspenStatus === "selesai") {
    return (
      <Tag color="success" icon={<ClockCircleOutlined />}>
        Klaim TASPEN Selesai
      </Tag>
    );
  }

  if (taspenStatus === "diajukan") {
    return (
      <Tag color="processing" icon={<ClockCircleOutlined />}>
        Klaim Dalam Proses TASPEN
      </Tag>
    );
  }

  // Batas hari kerja ASN vs PPPK
  const limitDays =
    employmentStatus === "ASN"
      ? initialSettings.taspenDeadlineASN
      : initialSettings.taspenDeadlinePPPK;

  const eventDate = dayjs(accidentDate);
  const deadlineDate = eventDate.add(limitDays, "day");
  const today = dayjs();
  const diffDays = deadlineDate.diff(today, "day");

  let statusColor: "success" | "warning" | "error" = "success";
  let label = `${diffDays} hari tersisa (${employmentStatus} maks ${limitDays} hari)`;
  let bannerType: "info" | "warning" | "error" = "info";

  if (diffDays < 0) {
    statusColor = "error";
    label = `Lewat batas waktu (${Math.abs(diffDays)} hari terlambat)`;
    bannerType = "error";
  } else if (diffDays <= 2) {
    statusColor = "warning";
    label = `Mendekati batas waktu (${diffDays} hari tersisa)`;
    bannerType = "warning";
  }

  return (
    <div>
      <Tag
        color={statusColor === "success" ? "cyan" : statusColor === "warning" ? "gold" : "red"}
        icon={statusColor === "error" ? <ExclamationCircleOutlined /> : <ClockCircleOutlined />}
        style={{ fontWeight: 600, padding: "2px 8px" }}
      >
        TASPEN: {label}
      </Tag>

      {showBanner && (
        <Alert
          type={bannerType}
          showIcon
          style={{ marginTop: 8 }}
          message={
            statusColor === "error"
              ? "Batas Pengajuan Klaim JKK TASPEN Telah Terlampaui!"
              : statusColor === "warning"
              ? "Peringatan Waktu Pengajuan TASPEN Segera Berakhir!"
              : "Informasi Pengajuan Klaim TASPEN"
          }
          description={
            <div>
              Status Kepegawaian: <strong>{employmentStatus}</strong> (Batas waktu regulasi:{" "}
              <strong>{limitDays} hari kalender</strong> sejak insiden). Tanggal kejadian:{" "}
              {eventDate.format("DD/MM/YYYY")}, batas akhir pelaporan:{" "}
              <strong>{deadlineDate.format("DD/MM/YYYY")}</strong>.
              {statusColor !== "success" && (
                <div style={{ marginTop: 4, fontWeight: 500 }}>
                  Segera lengkapi Surat Pengantar Unit Kerja dan Formulir JKK TASPEN agar klaim tidak gugur.
                </div>
              )}
            </div>
          }
        />
      )}
    </div>
  );
};
