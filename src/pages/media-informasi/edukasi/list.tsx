import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tag,
  List,
  Input,
  Space,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  ReadOutlined,
  SearchOutlined,
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity } from "@refinedev/core";
import { IArticle } from "../../../types/article";
import { IUser } from "../../../types/user";
import { initialArticleCategories } from "../../../mocks/articles";
import "../media.css";

const { Title, Paragraph } = Typography;

export const ArticleList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { tableProps, setFilters } = useTable<IArticle>({
    resource: "articles",
    pagination: { pageSize: 12 },
  });

  const { mutate: deleteArticle } = useDelete();

  const canManage = currentUser?.role === "admin" || currentUser?.role === "tim_k3";
  const rawArticles = (tableProps.dataSource || []) as IArticle[];

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === "all") {
      setFilters([], "replace");
    } else {
      const cat = initialArticleCategories.find((c) => c.slug === slug);
      if (cat) {
        setFilters([{ field: "categoryId", operator: "eq", value: cat.id }], "replace");
      }
    }
  };

  const filteredArticles = rawArticles.filter((art) => {
    if (!searchTerm.trim()) return true;
    return (
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.summary && art.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (art.author && art.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Hero Banner Modern Gradient (Khusus Literasi & Edukasi) */}
      <div className="media-hero-banner media-banner-edukasi">
        <Row align="middle" justify="space-between" gutter={[20, 20]}>
          <Col xs={24} md={18}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Tag
                color="cyan"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 10px",
                }}
              >
                <ReadOutlined /> PUSAT LITERASI & EDUKASI K3
              </Tag>
              <span style={{ fontSize: 13, color: "#d1fae5" }}>Budaya Sehat & Selamat ANRI</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Edukasi & Pedoman Keselamatan Kerja
            </Title>
            <Paragraph style={{ color: "#ecfdf5", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Kumpulan artikel informatif panduan ergonomi, pencegahan penyakit akibat kerja, pertolongan pertama (P3K), dan pedoman evakuasi gedung.
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(6px)",
                padding: "10px 16px",
                borderRadius: 12,
                border: "1px solid rgba(255, 255, 255, 0.25)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, color: "#a7f3d0", fontWeight: 600 }}>TOTAL LITERASI K3</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                {rawArticles.length} <span style={{ fontSize: 12, fontWeight: 400 }}>Artikel</span>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Control Bar Terpisah: Search & Tombol Create Kontras di Luar Gradasi */}
      <div
        style={{
          background: "#ffffff",
          padding: "14px 18px",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, maxWidth: 450 }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#0d9488" }} />}
            placeholder="Cari judul artikel, topik, atau penulis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: 8, height: 38 }}
            allowClear
          />
          <span style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
            {filteredArticles.length} artikel ditemukan
          </span>
        </div>

        {/* Tombol Create Kontras di Luar Banner */}
        {canManage && (
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/media/edukasi/create")}
            style={{
              borderRadius: 8,
              height: 40,
              padding: "0 20px",
              fontWeight: 700,
              fontSize: 13,
              background: "#0d9488",
              borderColor: "#0d9488",
              boxShadow: "0 4px 12px rgba(13, 148, 136, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Tambah Artikel Baru
          </Button>
        )}
      </div>

      {/* 2. Content Layout: Category Nav + Article Cards */}
      <Row gutter={[20, 20]}>
        {/* Sisi Kiri: Kategori List Elegan */}
        <Col xs={24} md={7} lg={6}>
          <Card
            title={
              <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                Kategori Bahasan
              </span>
            }
            size="small"
            bordered={false}
            style={{
              borderRadius: 14,
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          >
            <List
              dataSource={initialArticleCategories}
              renderItem={(cat) => {
                const isActive = selectedCategory === cat.slug;
                return (
                  <List.Item
                    onClick={() => handleCategorySelect(cat.slug)}
                    style={{
                      cursor: "pointer",
                      padding: "10px 14px",
                      borderRadius: 8,
                      marginBottom: 4,
                      background: isActive
                        ? "linear-gradient(135deg, #0d9488 0%, #0284c7 100%)"
                        : "transparent",
                      color: isActive ? "#ffffff" : "#334155",
                      fontWeight: isActive ? 600 : 500,
                      transition: "all 0.2s ease",
                      border: "none",
                    }}
                  >
                    <Space>
                      <BookOutlined style={{ color: isActive ? "#ffffff" : "#0d9488" }} />
                      <span>{cat.name}</span>
                    </Space>
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>

        {/* Sisi Kanan: Grid Kartu Artikel dengan Animasi Scroll Reveal */}
        <Col xs={24} md={17} lg={18}>
          <Row gutter={[16, 16]}>
            {filteredArticles.map((art, index) => {
              const delayClass = `media-delay-${(index % 6) + 1}`;
              return (
                <Col xs={24} sm={12} key={art.id}>
                  <Card
                    hoverable
                    bordered={false}
                    className={`media-content-card media-card-animate ${delayClass}`}
                    style={{ height: "100%", display: "flex", flexDirection: "column" }}
                    cover={
                      art.image ? (
                        <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
                          <img
                            alt={art.title}
                            src={art.image}
                            className="media-card-img"
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 10,
                              left: 10,
                              background: "rgba(13, 148, 136, 0.85)",
                              color: "#ffffff",
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 4,
                              backdropFilter: "blur(4px)",
                            }}
                          >
                            {art.category?.name || "K3 ANRI"}
                          </div>
                        </div>
                      ) : null
                    }
                    actions={[
                      <Button
                        key="view"
                        type="link"
                        onClick={() => navigate(`/media/edukasi/show/${art.id}`)}
                        style={{ color: "#0d9488", fontWeight: 600 }}
                      >
                        Baca Artikel &rarr;
                      </Button>,
                      ...(canManage
                        ? [
                            <Button
                              key="edit"
                              type="link"
                              icon={<EditOutlined />}
                              onClick={() => navigate(`/media/edukasi/edit/${art.id}`)}
                            />,
                            <Popconfirm
                              key="del"
                              title="Hapus artikel ini?"
                              onConfirm={() =>
                                deleteArticle({
                                  resource: "articles",
                                  id: art.id,
                                })
                              }
                            >
                              <Button key="del-btn" type="link" danger icon={<DeleteOutlined />} />
                            </Popconfirm>,
                          ]
                        : []),
                    ]}
                  >
                    <Title
                      level={5}
                      style={{ margin: "0 0 8px 0", lineHeight: 1.4, color: "#0f172a" }}
                      ellipsis={{ rows: 2 }}
                    >
                      {art.title}
                    </Title>

                    <Paragraph
                      type="secondary"
                      ellipsis={{ rows: 3 }}
                      style={{ fontSize: 13, margin: "0 0 14px", lineHeight: 1.6 }}
                    >
                      {art.summary}
                    </Paragraph>

                    <div
                      style={{
                        marginTop: "auto",
                        fontSize: 11,
                        color: "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: 8,
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      <span>
                        <UserOutlined /> {art.author || "Tim K3"}
                      </span>
                      <span>
                        <CalendarOutlined /> {art.createdAt?.substring(0, 10)}
                      </span>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    </div>
  );
};
