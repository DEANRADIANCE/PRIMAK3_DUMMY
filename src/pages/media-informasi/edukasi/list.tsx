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
  Pagination,
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
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity } from "@refinedev/core";
import { IArticle } from "../../../types/article";
import { initialArticleCategories } from "../../../mocks/articles";

const { Title, Text, Paragraph } = Typography;

export const ArticleList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { tableProps, setFilters } = useTable<IArticle>({
    resource: "articles",
    pagination: { pageSize: 6 },
  });

  const { mutate: deleteArticle } = useDelete();

  const canManage = currentUser?.role === "admin" || currentUser?.role === "tim_k3";
  const articles = (tableProps.dataSource || []) as IArticle[];

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

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            Edukasi & Literasi K3
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Artikel keselamatan kerja, panduan ergonomi, dan kesehatan perkantoran
          </Text>
        </div>

        {canManage && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ background: "#595959", borderColor: "#595959" }}
            onClick={() => navigate("/media/edukasi/create")}
          >
            Tambah Artikel +
          </Button>
        )}
      </div>

      <Row gutter={[24, 24]}>
        {/* Sidebar Kategori */}
        <Col xs={24} md={7} lg={6}>
          <Card
            title="Kategori Artikel"
            size="small"
            bordered={false}
            style={{
              marginBottom: 16,
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <List
              dataSource={initialArticleCategories}
              renderItem={(cat) => (
                <List.Item
                  onClick={() => handleCategorySelect(cat.slug)}
                  style={{
                    cursor: "pointer",
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: selectedCategory === cat.slug ? "#e0e0e0" : "transparent",
                    fontWeight: selectedCategory === cat.slug ? 600 : "normal",
                    transition: "background 0.2s",
                  }}
                >
                  <Space>
                    <BookOutlined style={{ color: selectedCategory === cat.slug ? "#262626" : "#8c8c8c" }} />
                    <span>{cat.name}</span>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Daftar Kartu Artikel */}
        <Col xs={24} md={17} lg={18}>
          <Row gutter={[16, 16]}>
            {articles.map((art) => (
              <Col xs={24} sm={12} key={art.id}>
                <Card
                  hoverable
                  className="article-card"
                  cover={
                    art.image ? (
                      <img
                        alt={art.title}
                        src={art.image}
                        style={{ height: 160, objectFit: "cover" }}
                      />
                    ) : null
                  }
                  actions={[
                    <Button
                      type="link"
                      onClick={() => navigate(`/media/edukasi/show/${art.id}`)}
                    >
                      Selengkapnya &rarr;
                    </Button>,
                    ...(canManage
                      ? [
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/media/edukasi/edit/${art.id}`)}
                          />,
                          <Popconfirm
                            title="Hapus artikel ini?"
                            onConfirm={() =>
                              deleteArticle({
                                resource: "articles",
                                id: art.id,
                              })
                            }
                          >
                            <Button type="link" danger icon={<DeleteOutlined />} />
                          </Popconfirm>,
                        ]
                      : []),
                  ]}
                >
                  <Tag color="cyan" style={{ marginBottom: 6 }}>
                    {art.category?.name || "K3"}
                  </Tag>

                  <Title level={5} style={{ margin: "4px 0 8px", lineHeight: 1.4 }} ellipsis={{ rows: 2 }}>
                    {art.title}
                  </Title>

                  <Paragraph type="secondary" ellipsis={{ rows: 3 }} style={{ fontSize: 13, margin: 0 }}>
                    {art.summary}
                  </Paragraph>

                  <div style={{ marginTop: 12, fontSize: 11, color: "#8c8c8c" }}>
                    Penulis: {art.author} • {art.createdAt?.substring(0, 10)}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};
