import React, { useState, useEffect } from "react";
import { Input, Button, Popover, Space, Typography, Tooltip, Radio } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";

const { Text } = Typography;

interface SearchToolbarProps {
  placeholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortOrder: "desc" | "asc";
  onSortChange: (order: "desc" | "asc") => void;
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  onResetFilters?: () => void;
  style?: React.CSSProperties;
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  placeholder = "Cari...",
  searchValue,
  onSearchChange,
  sortOrder,
  onSortChange,
  categories = [],
  selectedCategory = "Semua",
  onCategoryChange,
  onResetFilters,
  style,
}) => {
  const [internalSearch, setInternalSearch] = useState(searchValue);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Sync internal search with prop if changed from outside (e.g. query params)
  useEffect(() => {
    setInternalSearch(searchValue);
  }, [searchValue]);

  // Debounce 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalSearch !== searchValue) {
        onSearchChange(internalSearch);
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [internalSearch, searchValue, onSearchChange]);

  const toggleSort = () => {
    onSortChange(sortOrder === "desc" ? "asc" : "desc");
  };

  const filterContent = (
    <div style={{ width: 220, padding: 8 }}>
      <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
        Filter Kategori
      </Text>
      {categories.length > 0 && onCategoryChange && (
        <Radio.Group
          value={selectedCategory}
          onChange={(e) => {
            onCategoryChange(e.target.value);
            setPopoverOpen(false);
          }}
          style={{ display: "flex", flexDirection: "column", gap: 6 }}
        >
          {categories.map((cat) => (
            <Radio key={cat} value={cat}>
              {cat}
            </Radio>
          ))}
        </Radio.Group>
      )}

      {onResetFilters && (
        <div style={{ marginTop: 12, borderTop: "1px solid #f0f0f0", paddingTop: 8 }}>
          <Button
            type="link"
            size="small"
            style={{ padding: 0 }}
            onClick={() => {
              onResetFilters();
              setPopoverOpen(false);
            }}
          >
            Reset Semua Filter
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
        ...style,
      }}
    >
      <div style={{ flex: 1, minWidth: 260 }}>
        <Input
          prefix={<SearchOutlined style={{ color: "#94a3b8", fontSize: 16 }} />}
          placeholder={placeholder}
          value={internalSearch}
          onChange={(e) => setInternalSearch(e.target.value)}
          allowClear={{
            clearIcon: <CloseCircleFilled style={{ color: "#cbd5e1" }} />,
          }}
          style={{
            height: 42,
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
          aria-label={placeholder}
        />
      </div>

      <Space size={8}>
        {/* Tombol Filter Lanjutan */}
        <Popover
          content={filterContent}
          title={<span style={{ fontWeight: 600 }}>Filter Lanjutan</span>}
          trigger="click"
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          placement="bottomRight"
        >
          <Tooltip title="Filter lanjutan">
            <Button
              aria-label="Buka filter lanjutan"
              icon={<FilterOutlined />}
              style={{
                height: 42,
                borderRadius: 8,
                borderColor: selectedCategory !== "Semua" ? "#0f766e" : "#cbd5e1",
                color: selectedCategory !== "Semua" ? "#0f766e" : "#475569",
                background: selectedCategory !== "Semua" ? "#f0fdfa" : "#ffffff",
              }}
            >
              Filter
            </Button>
          </Tooltip>
        </Popover>

        {/* Tombol Urutkan Terbaru / Terlama */}
        <Tooltip title={`Urutkan: ${sortOrder === "desc" ? "Terbaru" : "Terlama"}`}>
          <Button
            aria-label={`Ubah urutan (saat ini ${sortOrder === "desc" ? "terbaru" : "terlama"})`}
            icon={sortOrder === "desc" ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
            onClick={toggleSort}
            style={{
              height: 42,
              borderRadius: 8,
              borderColor: "#cbd5e1",
              color: "#475569",
            }}
          >
            {sortOrder === "desc" ? "Terbaru" : "Terlama"}
          </Button>
        </Tooltip>
      </Space>
    </div>
  );
};
