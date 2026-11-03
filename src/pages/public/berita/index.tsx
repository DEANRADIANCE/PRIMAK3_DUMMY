import React, { useEffect } from "react";
import { Row, Col, Typography, Pagination, Empty, Skeleton, Alert, Button } from "antd";
import { useSearchParams } from "react-router";
import { useList } from "@refinedev/core";
import { Article } from "../../../types/public";
import {
  ArticleCard,
  CategoryChips,
  SearchToolbar,
} from "../../../components/public";
import { useScrollReveal } from "../useScrollReveal";

const { Title, Paragraph, Text } = Typography;

const CATEGORIES = ["Semua", "Ergonomi", "Kesehatan Mental", "Tanggap Darurat"];
const PAGE_SIZE = 9;

export const BeritaListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Ambil state dari query params
  const q = searchParams.get("q") || "";
  const kategori = searchParams.get("kategori") || "Semua";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sort = (searchParams.get("sort") as "desc" | "asc") || "desc";

  // SEO Title
  useEffect(() => {
    document.title = "Edukasi K3 - PRIMA K3 ANRI";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Update query params helper
  const updateQuery = (updates: { q?: string; kategori?: string; page?: number; sort?: "desc" | "asc" }) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (updates.q !== undefined) {
          if (updates.q.trim()) next.set("q", updates.q.trim());
          else next.delete("q");
          next.set("page", "1"); // Reset ke page 1 saat pencarian berubah
        }
        if (updates.kategori !== undefined) {
          if (updates.kategori && updates.kategori !== "Semua") next.set("kategori", updates.kategori);
          else next.delete("kategori");
          next.set("page", "1"); // Reset ke page 1 saat kategori berubah
        }
        if (updates.sort !== undefined) {
          next.set("sort", updates.sort);
        }
        if (updates.page !== undefined) {
          next.set("page", String(updates.page));
        }
        return next;
      },
      { replace: true }
    );
  };

  // Filter & Fetch data dengan Refine useList
  const filters: any[] = [];
  if (q.trim()) {
    filters.push({ field: "q", operator: "contains", value: q.trim() });
  }
  if (kategori && kategori !== "Semua") {
    filters.push({ field: "category", operator: "eq", value: kategori });
  }

  const { result, query } = useList<Article>({
    resource: "edukasi",
    pagination: {
      currentPage: page,
      pageSize: PAGE_SIZE,
    },
    filters,
    sorters: [
      {
        field: "published_at",
        order: sort,
      },
    ],
  });

  const articles: Article[] = (result?.data as Article[]) || [];
  const total = result?.total || 0;
  const isLoading = query.isLoading;
  const isError = query.isError;
  const refetch = query.refetch;

  // Aktifkan animasi scroll untuk daftar artikel dan elemen interaktif
  useScrollReveal([articles, isLoading, page, kategori, q, sort]);

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div style={{ width: "100%", paddingBottom: 80 }}>
      {/* Header Section (Latar Abu) */}
      <section
        style={{
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          padding: "48px 20px 44px 20px",
          textAlign: "center",
        }}
      >
        <div className="pub-reveal" style={{ maxWidth: 800, margin: "0 auto" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              color: "#0f766e",
              background: "#f0fdfa",
              padding: "4px 12px",
              borderRadius: 999,
              border: "1px solid #ccfbf1",
              marginBottom: 10,
            }}
          >
            MEDIA & INFORMASI
          </span>
          <Title
            level={1}
            style={{
              fontSize: "clamp(26px, 3.5vw, 36px)",
              fontWeight: 800,
              color: "#1e293b",
              marginBottom: 10,
            }}
          >
            Edukasi K3
          </Title>
          <Paragraph
            style={{
              fontSize: 16,
              color: "#64748b",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Artikel edukasi tentang keselamatan dan kesehatan kerja untuk pegawai ANRI.
          </Paragraph>
        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 20px 0 20px" }}>
        {/* Toolbar: Search input + Popover Filter + Sort Toggle */}
        <div className="pub-reveal pub-delay-1">
          <SearchToolbar
            placeholder="Cari artikel edukasi K3..."
            searchValue={q}
            onSearchChange={(val) => updateQuery({ q: val })}
            sortOrder={sort}
            onSortChange={(order) => updateQuery({ sort: order })}
            categories={CATEGORIES}
            selectedCategory={kategori}
            onCategoryChange={(cat) => updateQuery({ kategori: cat })}
            onResetFilters={handleResetFilters}
            style={{ marginBottom: 20 }}
          />
        </div>

        {/* Chip Kategori */}
        <div className="pub-reveal pub-delay-2" style={{ marginBottom: 32 }}>
          <CategoryChips
            categories={CATEGORIES}
            selectedCategory={kategori}
            onChange={(cat) => updateQuery({ kategori: cat })}
          />
        </div>

        {/* State Error */}
        {isError && (
          <div style={{ marginBottom: 32 }}>
            <Alert
              type="error"
              showIcon
              message="Gagal memuat artikel edukasi K3"
              description="Terjadi kendala saat mengambil data artikel. Silakan coba kembali beberapa saat lagi."
              action={
                <Button size="small" type="primary" onClick={() => refetch()}>
                  Coba Lagi
                </Button>
              }
            />
          </div>
        )}

        {/* State Loading (Skeleton Cards) */}
        {isLoading && (
          <Row gutter={[24, 24]}>
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <Col xs={24} md={12} lg={8} key={idx} className={`pub-reveal pub-delay-${(idx % 6) + 1}`}>
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    padding: 16,
                  }}
                >
                  <Skeleton.Image style={{ width: "100%", height: 180, marginBottom: 16 }} active />
                  <Skeleton active paragraph={{ rows: 3 }} />
                </div>
              </Col>
            ))}
          </Row>
        )}

        {/* State Empty */}
        {!isLoading && !isError && articles.length === 0 && (
          <div
            className="pub-reveal"
            style={{
              padding: "60px 20px",
              textAlign: "center",
              backgroundColor: "#f8fafc",
              borderRadius: 12,
              border: "1px dashed #cbd5e1",
            }}
          >
            <Empty
              description={
                <span style={{ color: "#64748b", fontSize: 15 }}>
                  Artikel tidak ditemukan untuk kata kunci atau kategori yang dipilih.
                </span>
              }
            >
              <Button type="primary" onClick={handleResetFilters} style={{ backgroundColor: "#0f766e" }}>
                Reset Filter Pencarian
              </Button>
            </Empty>
          </div>
        )}

        {/* State Data: Grid ArticleCard 3 Kolom */}
        {!isLoading && !isError && articles.length > 0 && (
          <>
            <Row gutter={[24, 24]}>
              {articles.map((article, idx) => (
                <Col xs={24} md={12} lg={8} key={article.id} className={`pub-reveal pub-delay-${(idx % 6) + 1}`}>
                  <ArticleCard article={article} />
                </Col>
              ))}
            </Row>

            {/* Bawah Grid: Teks Dinamis & Pagination Ant Design */}
            <div
              className="pub-reveal"
              style={{
                marginTop: 48,
                paddingTop: 24,
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <Text style={{ fontSize: 14, color: "#64748b" }}>
                Menampilkan <strong style={{ color: "#0f172a" }}>{articles.length}</strong> dari{" "}
                <strong style={{ color: "#0f172a" }}>{total}</strong> artikel edukasi
              </Text>

              <Pagination
                current={page}
                pageSize={PAGE_SIZE}
                total={total}
                onChange={(p) => updateQuery({ page: p })}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
