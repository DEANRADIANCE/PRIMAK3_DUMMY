import React, { useState, useMemo } from "react";
import {
  Row,
  Col,
  Button,
  Pagination,
  Skeleton,
  Empty,
  Alert,
} from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useList, useDelete, useUpdate } from "@refinedev/core";
import { useSearchParams } from "react-router";
import { IPoster } from "../../../../types/poster";
import { StatusFilterChips, StatusFilterOption } from "../components/StatusFilterChips";
import { PosterCard } from "../components/PosterCard";
import { PosterFormModal } from "../components/PosterFormModal";
import "../../media.css";

const PAGE_SIZE = 8;

export const PosterTab: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL params for Poster
  const urlStatus = searchParams.get("status") || "Semua";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);

  // Modal form states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<IPoster | null>(null);

  const updateParam = (key: string, value: string | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value && value !== "Semua") {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        if (key !== "page") {
          next.set("page", "1");
        }
        return next;
      },
      { replace: true }
    );
  };

  // 1. Fetch ALL posters to calculate counts
  const { query: allPostersQuery, result: allPostersResult } = useList<IPoster>({
    resource: "posters",
    pagination: { mode: "off" },
  });

  const allPosters = (allPostersResult?.data as IPoster[]) || [];
  const refetchAll = allPostersQuery.refetch;

  const statusOptions: StatusFilterOption[] = useMemo(() => {
    const totalCount = allPosters.length;
    const tayangCount = allPosters.filter((p) => (p.status || "Tayang") === "Tayang").length;
    const drafCount = allPosters.filter((p) => p.status === "Draf").length;
    const arsipCount = allPosters.filter((p) => p.status === "Diarsipkan").length;

    return [
      { label: "Semua", value: "Semua", count: totalCount },
      { label: "Tayang", value: "Tayang", count: tayangCount },
      { label: "Draf", value: "Draf", count: drafCount },
      { label: "Diarsipkan", value: "Diarsipkan", count: arsipCount },
    ];
  }, [allPosters]);

  // 2. Fetch paginated & filtered posters
  const filters: any[] = [];
  if (urlStatus && urlStatus !== "Semua") {
    filters.push({ field: "status", operator: "eq", value: urlStatus });
  }

  const {
    query: postersQuery,
    result: postersResult,
  } = useList<IPoster>({
    resource: "posters",
    pagination: {
      currentPage: urlPage,
      pageSize: PAGE_SIZE,
    },
    filters,
    sorters: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
  });

  const posters = (postersResult?.data as IPoster[]) || [];
  const totalPosters = postersResult?.total || 0;
  const isLoading = postersQuery.isLoading;
  const isError = postersQuery.isError;
  const error = postersQuery.error;
  const refetch = postersQuery.refetch;

  // Actions
  const { mutate: deletePoster } = useDelete();
  const { mutate: updatePoster } = useUpdate();

  const handleEdit = (poster: IPoster) => {
    setSelectedPoster(poster);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedPoster(null);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deletePoster(
      {
        resource: "posters",
        id,
        successNotification: {
          message: "Poster Berhasil Dihapus",
          description: "Materi poster telah dihapus dari galeri.",
          type: "success",
        },
      },
      {
        onSuccess: () => {
          refetch();
          refetchAll();
        },
      }
    );
  };

  const handleToggleStatus = (poster: IPoster) => {
    const currentStatus = poster.status || "Tayang";
    let newStatus = "Tayang";

    if (currentStatus === "Tayang") {
      newStatus = "Draf"; // Jeda -> jadi Draf / dijeda
    } else if (currentStatus === "Draf") {
      newStatus = "Tayang"; // Tayangkan -> jadi Tayang
    } else if (currentStatus === "Diarsipkan") {
      newStatus = "Tayang"; // Pulihkan -> jadi Tayang
    }

    updatePoster(
      {
        resource: "posters",
        id: poster.id,
        values: {
          status: newStatus,
        },
        successNotification: {
          message: "Status Poster Berhasil Diperbarui",
          description: `Status "${poster.title}" diubah menjadi ${newStatus}.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          refetch();
          refetchAll();
        },
      }
    );
  };

  const handleSuccessForm = () => {
    refetch();
    refetchAll();
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: "24px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
      }}
    >
      {/* 1. Status chips on left & "Tambah Data" on right of the same row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatusFilterChips
          options={statusOptions}
          activeValue={urlStatus}
          onChange={(val) => updateParam("status", val)}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          className="btn-media-primary"
          style={{
            height: 42,
            padding: "0 20px",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
        Tambah Data
        </Button>
      </div>

      {/* 2. Content Grid / Loading / Error / Empty */}
      {isError ? (
        <Alert
          type="error"
          message="Gagal memuat daftar poster"
          description={error?.message || "Terjadi kesalahan saat mengambil data."}
          action={
            <Button size="small" danger icon={<ReloadOutlined />} onClick={() => refetch()}>
              Coba Lagi
            </Button>
          }
          style={{ marginBottom: 20 }}
        />
      ) : isLoading ? (
        <Row gutter={[18, 18]}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Col key={i} xs={24} sm={12} md={12} lg={6}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 14,
                  padding: 14,
                  height: 330,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Skeleton.Image style={{ width: "100%", height: 180, marginBottom: 12 }} active />
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            </Col>
          ))}
        </Row>
      ) : posters.length === 0 ? (
        <div
          style={{
            padding: "54px 16px",
            textAlign: "center",
            backgroundColor: "#f8fafc",
            borderRadius: 14,
            border: "1px dashed #cbd5e1",
          }}
        >
          <Empty
            description={
              <span style={{ color: "#64748b", fontSize: 14 }}>
                Tidak ada materi poster yang sesuai dengan filter.
              </span>
            }
          >
            <Button
              type="primary"
              ghost
              style={{ borderColor: "#0284c7", color: "#0284c7", borderRadius: 8 }}
              onClick={() => {
                setSearchParams({ tab: "poster" });
              }}
            >
              Reset Filter
            </Button>
          </Empty>
        </div>
      ) : (
        <Row gutter={[18, 18]}>
          {posters.map((item, index) => (
            <Col key={item.id} xs={24} sm={12} md={12} lg={6}>
              <PosterCard
                poster={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                animationDelayIndex={(index % 4) + 1}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* 3. Footer Panel: "Menampilkan x dari y poster" + Pagination */}
      {!isLoading && totalPosters > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 28,
            paddingTop: 18,
            borderTop: "1px solid #f1f5f9",
            gap: 12,
          }}
        >
          <span style={{ color: "#64748b", fontSize: 13.5, fontWeight: 500 }}>
            Menampilkan <strong style={{ color: "#0f172a" }}>{posters.length}</strong> dari{" "}
            <strong style={{ color: "#0f172a" }}>{totalPosters}</strong> poster
          </span>

          <Pagination
            current={urlPage}
            pageSize={PAGE_SIZE}
            total={totalPosters}
            onChange={(newPage) => updateParam("page", String(newPage))}
            showSizeChanger={false}
          />
        </div>
      )}

      {/* Form Modal */}
      <PosterFormModal
        open={modalOpen}
        record={selectedPoster}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccessForm}
      />
    </div>
  );
};
