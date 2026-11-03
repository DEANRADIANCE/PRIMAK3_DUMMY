import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Input,
  Select,
  Button,
  Pagination,
  Skeleton,
  Empty,
  Alert,
  Popover,
  Radio,
  Space,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useList, useDelete, useUpdate } from "@refinedev/core";
import { useSearchParams } from "react-router";
import { IArticle } from "../../../../types/article";
import { initialArticleCategories } from "../../../../mocks/articles";
import { StatusFilterChips, StatusFilterOption } from "../components/StatusFilterChips";
import { EdukasiCard } from "../components/EdukasiCard";
import { EdukasiFormModal } from "../components/EdukasiFormModal";
import "../../media.css";

const PAGE_SIZE = 8;

export const EdukasiTab: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL params for Edukasi
  const urlStatus = searchParams.get("status") || "Semua";
  const urlSearch = searchParams.get("q") || "";
  const urlCategory = searchParams.get("cat") || "Semua";
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const urlSort = searchParams.get("sort") || "newest";

  // Debounced search state
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [sortOption, setSortOption] = useState<string>(urlSort);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modal form states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);

  // Keep searchInput in sync if urlSearch changes externally (e.g. back button / reset)
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  // Handle typing search with debounce without triggering on pagination
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (val.trim()) {
            next.set("q", val.trim());
          } else {
            next.delete("q");
          }
          next.set("page", "1");
          return next;
        },
        { replace: true }
      );
    }, 400);
  };

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

  // 1. Fetch ALL articles to calculate dynamic counts
  const { query: allArticlesQuery, result: allArticlesResult } = useList<IArticle>({
    resource: "articles",
    pagination: { mode: "off" },
  });

  const allArticles = (allArticlesResult?.data as IArticle[]) || [];
  const refetchAll = allArticlesQuery.refetch;

  // Calculate status counts
  const statusOptions: StatusFilterOption[] = useMemo(() => {
    const totalCount = allArticles.length;
    const terbitCount = allArticles.filter(
      (a) => (a.status || (a.isPublished ? "Terbit" : "Draf")) === "Terbit"
    ).length;
    const drafCount = allArticles.filter(
      (a) => (a.status || (a.isPublished ? "Terbit" : "Draf")) === "Draf"
    ).length;
    const jadwalCount = allArticles.filter((a) => a.status === "Dijadwalkan").length;

    return [
      { label: "Semua", value: "Semua", count: totalCount },
      { label: "Terbit", value: "Terbit", count: terbitCount },
      { label: "Draf", value: "Draf", count: drafCount },
      { label: "Dijadwalkan", value: "Dijadwalkan", count: jadwalCount },
    ];
  }, [allArticles]);

  // 2. Fetch Paginated & Filtered Articles
  const filters: any[] = [];
  if (urlSearch.trim()) {
    filters.push({ field: "q", operator: "contains", value: urlSearch.trim() });
  }
  if (urlStatus && urlStatus !== "Semua") {
    filters.push({ field: "status", operator: "eq", value: urlStatus });
  }
  if (urlCategory && urlCategory !== "Semua") {
    filters.push({ field: "category", operator: "eq", value: urlCategory });
  }

  const sorters: any[] = [
    {
      field: "createdAt",
      order: sortOption === "oldest" ? "asc" : "desc",
    },
  ];

  const {
    query: articlesQuery,
    result: articlesResult,
  } = useList<IArticle>({
    resource: "articles",
    pagination: {
      currentPage: urlPage,
      pageSize: PAGE_SIZE,
    },
    filters,
    sorters,
  });

  const articles = (articlesResult?.data as IArticle[]) || [];
  const totalArticles = articlesResult?.total || 0;
  const isLoading = articlesQuery.isLoading;
  const isError = articlesQuery.isError;
  const error = articlesQuery.error;
  const refetch = articlesQuery.refetch;

  // Actions
  const { mutate: deleteArticle } = useDelete();
  const { mutate: updateArticle } = useUpdate();

  const handleEdit = (article: IArticle) => {
    setSelectedArticle(article);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedArticle(null);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteArticle(
      {
        resource: "articles",
        id,
        successNotification: {
          message: "Artikel Berhasil Dihapus",
          description: "Artikel telah dihapus dari daftar edukasi.",
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

  const handleStatusChange = (article: IArticle, newStatus: string) => {
    updateArticle(
      {
        resource: "articles",
        id: article.id,
        values: {
          status: newStatus,
          isPublished: newStatus === "Terbit",
        },
        successNotification: {
          message: "Status Artikel Berhasil Diperbarui",
          description: `Artikel "${article.title}" sekarang berstatus ${newStatus}.`,
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

  const filterPopoverContent = (
    <div style={{ padding: 8, width: 220 }}>
      <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13, color: "#0f172a" }}>
        Urutkan Data Artikel
      </div>
      <Radio.Group
        value={sortOption}
        onChange={(e) => {
          setSortOption(e.target.value);
          updateParam("sort", e.target.value === "newest" ? null : e.target.value);
        }}
      >
        <Space direction="vertical">
          <Radio value="newest">Terbaru</Radio>
          <Radio value="oldest">Terlama</Radio>
        </Space>
      </Radio.Group>
    </div>
  );

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
      {/* 1. Status Filter Chips with Counts */}
      <div style={{ marginBottom: 20 }}>
        <StatusFilterChips
          options={statusOptions}
          activeValue={urlStatus}
          onChange={(val) => updateParam("status", val)}
        />
      </div>

      {/* 2. Toolbar: Search Input + Category Select + Advanced Filter + Add Button */}
      <Row gutter={[12, 12]} align="middle" justify="space-between" style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={10} lg={8}>
          <Input
            prefix={<SearchOutlined style={{ color: "#0d9488" }} />}
            placeholder="Cari artikel edukasi..."
            allowClear
            value={searchInput}
            onChange={handleSearchChange}
            style={{ borderRadius: 10, height: 42, borderColor: "#cbd5e1" }}
          />
        </Col>

        <Col xs={24} sm={12} md={14} lg={16}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <Select
              value={urlCategory}
              onChange={(val) => updateParam("cat", val)}
              style={{ width: 180, height: 42 }}
              placeholder="Semua Kategori"
            >
              <Select.Option value="Semua">Semua Kategori</Select.Option>
              {initialArticleCategories.map((c) => (
                <Select.Option key={c.id} value={c.name}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>

            <Popover content={filterPopoverContent} title="Filter Lanjutan" trigger="click">
              <Button
                icon={<FilterOutlined style={{ color: "#0d9488" }} />}
                style={{ height: 42, borderRadius: 10, borderColor: "#cbd5e1", fontWeight: 500 }}
                title="Filter Lanjutan"
              >
                Filter
              </Button>
            </Popover>

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
        </Col>
      </Row>

      {/* 3. Content Grid / Loading / Error / Empty */}
      {isError ? (
        <Alert
          type="error"
          message="Gagal memuat artikel edukasi"
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
                  padding: 16,
                  height: 330,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Skeleton.Image style={{ width: "100%", height: 150, marginBottom: 12 }} active />
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            </Col>
          ))}
        </Row>
      ) : articles.length === 0 ? (
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
                Tidak ada artikel edukasi yang sesuai dengan filter atau kata kunci.
              </span>
            }
          >
            <Button
              type="primary"
              ghost
              style={{ borderColor: "#0d9488", color: "#0d9488", borderRadius: 8 }}
              onClick={() => {
                if (searchTimerRef.current) {
                  clearTimeout(searchTimerRef.current);
                }
                setSearchInput("");
                setSearchParams({ tab: "edukasi" });
              }}
            >
              Reset Filter
            </Button>
          </Empty>
        </div>
      ) : (
        <Row gutter={[18, 18]}>
          {articles.map((item, index) => (
            <Col key={item.id} xs={24} sm={12} md={12} lg={6}>
              <EdukasiCard
                article={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onSchedule={handleEdit}
                animationDelayIndex={(index % 4) + 1}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* 4. Footer Panel: "Menampilkan X dari Y Artikel" + Pagination */}
      {!isLoading && totalArticles > 0 && (
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
            Menampilkan <strong style={{ color: "#0f172a" }}>{articles.length}</strong> dari{" "}
            <strong style={{ color: "#0f172a" }}>{totalArticles}</strong> Artikel
          </span>

          <Pagination
            current={urlPage}
            pageSize={PAGE_SIZE}
            total={totalArticles}
            onChange={(newPage) => updateParam("page", String(newPage))}
            showSizeChanger={false}
          />
        </div>
      )}

      {/* Form Modal */}
      <EdukasiFormModal
        open={modalOpen}
        record={selectedArticle}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccessForm}
      />
    </div>
  );
};
