import React from "react";
import { useCreate, useGetIdentity } from "@refinedev/core";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { InvestigationWizard } from "./components/InvestigationWizard";
import { IUser } from "../../../types/user";

export const InvestigationCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<IUser>();
  const { mutate: createInvestigation, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const handleSave = async (values: any, isSubmit: boolean) => {
    const formatted = {
      ...values,
      status: isSubmit ? "Menunggu Pengesahan" : "Draf",
      created_by: user?.name || "Pengelola K3",
      insiden: {
        ...values.insiden,
        tanggal_jam: values.insiden?.tanggal_jam
          ? dayjs(values.insiden.tanggal_jam).format("YYYY-MM-DD HH:mm")
          : dayjs().format("YYYY-MM-DD HH:mm"),
      },
      investigasi: {
        ...values.investigasi,
        tanggal_mulai: values.investigasi?.tanggal_mulai
          ? dayjs(values.investigasi.tanggal_mulai).format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD"),
        tanggal_selesai: values.investigasi?.tanggal_selesai
          ? dayjs(values.investigasi.tanggal_selesai).format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD"),
      },
      perbaikan: (values.perbaikan || []).map((p: any) => ({
        ...p,
        target_selesai: p.target_selesai
          ? dayjs(p.target_selesai).format("YYYY-MM-DD")
          : dayjs().add(2, "week").format("YYYY-MM-DD"),
      })),
      timestamps: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        submittedAt: isSubmit ? new Date().toISOString() : undefined,
      },
    };

    createInvestigation(
      {
        resource: "investigations",
        values: formatted,
        successNotification: {
          message: isSubmit
            ? "Investigasi Berhasil Diajukan"
            : "Draf Investigasi Berhasil Disimpan",
          description: isSubmit
            ? "Berkas telah dikirim untuk pemeriksaan dan pengesahan pimpinan."
            : "Data draf tersimpan. Anda dapat melanjutkannya kapan saja.",
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
      mode="create"
      onSave={handleSave}
      isLoading={isLoading}
    />
  );
};
export default InvestigationCreate;
