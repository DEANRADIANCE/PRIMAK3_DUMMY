import React from "react";
import { Space, Tag } from "antd";

const { CheckableTag } = Tag;

interface CategoryChipsProps {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
  style?: React.CSSProperties;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onChange,
  style,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
        ...style,
      }}
    >
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <CheckableTag
            key={cat}
            checked={isSelected}
            onChange={() => onChange(cat)}
            style={{
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: isSelected ? 600 : 500,
              borderRadius: 20,
              border: isSelected ? "1px solid #0f766e" : "1px solid #e2e8f0",
              backgroundColor: isSelected ? "#0f766e" : "#ffffff",
              color: isSelected ? "#ffffff" : "#475569",
              cursor: "pointer",
              transition: "all 0.2s ease",
              marginInlineEnd: 0,
            }}
          >
            {cat}
          </CheckableTag>
        );
      })}
    </div>
  );
};
