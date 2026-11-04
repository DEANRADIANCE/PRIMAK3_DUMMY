import React from "react";
import { useParams, useNavigate } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import { Card, Spin } from "antd";
import dayjs from "dayjs";
import { InvestigationWizard } from "./components/InvestigationWizard";
import { Investigation } from "../../../types/investigation";

export const InvestigationEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { query } = useOne<Investigation>({
    resource: "investigations",
    id: id || "1",
  });

  const { mutate: updateInvestigation, mutation } = useUpdate();
  const isLoadingUpdate = mutation.isPending;

  const record = query.data?.data;
  const isLoadingData = query.isLoading;

  if (isLoadingData || !record) {
    return (
      <Card style={{ textAlign: "center", padding: "60px 0", borderRadius: 12 }}>
        <Spin size="large" tip="Memuat data investigasi..." />
      </Card>
    );
  }

  const handleSave = async (values: any, isSubmit: boolean) => {
    const formatted = {
      ...record,
      ...values,
      status: isSubmit ? "Menunggu Pengesahan" : "Draf",
      insiden: {
        ...values.insiden,
        tanggal_jam: values.insiden?.tanggal_jam
          ? dayjs(values.insiden.tanggal_jam).format("YYYY-MM-DD HH:mm")
          : record.insiden?.tanggal_jam,
      },
      investigasi: {
        ...values.investigasi,
        tanggal_mulai: values.investigasi?.tanggal_mulai
          ? dayjs(values.investigasi.tanggal_mulai).format("YYYY-MM-DD")
          : record.investigasi?.tanggal_mulai,
        tanggal_selesai: values.investigasi?.tanggal_selesai
          ? dayjs(values.investigasi.tanggal_selesai).format("YYYY-MM-DD")
          : record.investigasi?.tanggal_selesai,
      },
      perbaikan: (values.perbaikan || []).map((p: any) => ({
        ...p,
        target_selesai: p.target_selesai
          ? dayjs(p.target_selesai).format("YYYY-MM-DD")
          : dayjs().add(2, "week").format("YYYY-MM-DD"),
      })),
      timestamps: {
        ...record.timestamps,
        updatedAt: new Date().toISOString(),
        submittedAt: isSubmit ? new Date().toISOString() : record.timestamps?.submittedAt,
      },
    };

    updateInvestigation(
      {
        resource: "investigations",
        id: record.id,
        values: formatted,
        successNotification: {
          message: isSubmit
            ? "Investigasi Berhasil Diajukan"
            : "Perubahan Draf Berhasil Disimpan",
          description: isSubmit
            ? "Berkas telah diajukan ulang ke pemeriksa untuk pengesahan."
            : "Perubahan investigasi telah disimpan.",
          type: "success",
        },
      },
      {
        onSuccess: () => {
          if (isSubmit) {
            navigate("/keselamatan/investigasi");
          }
        },
      }
    );
  };

  return (
    <InvestigationWizard
      mode="edit"
      initialData={record}
      onSave={handleSave}
      isLoading={isLoadingUpdate}
    />
  );
};
export default InvestigationEdit;
