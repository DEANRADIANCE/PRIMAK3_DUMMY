import {
  DataProvider,
  BaseRecord,
  CrudFilters,
  CrudSorting,
  Pagination,
} from "@refinedev/core";
import { mockDb, initialDashboardSummary } from "../mocks";

// Helper filtering
const applyFilters = (data: any[], filters?: CrudFilters) => {
  if (!filters || filters.length === 0) return data;

  return data.filter((item) => {
    return filters.every((filter) => {
      if ("field" in filter) {
        const { field, operator, value } = filter;

        if (value === undefined || value === null || value === "" || value === "Semua" || value === "all") {
          return true;
        }

        // Search global via field "q"
        if (field === "q") {
          const searchStr = String(value).toLowerCase().trim();
          if (!searchStr) return true;
          return (
            String(item.title || "").toLowerCase().includes(searchStr) ||
            String(item.excerpt || item.summary || "").toLowerCase().includes(searchStr) ||
            String(item.description || "").toLowerCase().includes(searchStr) ||
            String(item.content || "").toLowerCase().includes(searchStr) ||
            String(typeof item.category === "object" ? item.category?.name : item.category || "").toLowerCase().includes(searchStr)
          );
        }

        const rawItemValue = item[field];
        const itemValue = typeof rawItemValue === "object" && rawItemValue !== null
          ? (rawItemValue.name || rawItemValue.slug || "")
          : rawItemValue;

        switch (operator) {
          case "eq":
            return String(itemValue || "").toLowerCase() === String(value).toLowerCase();
          case "ne":
            return String(itemValue || "").toLowerCase() !== String(value).toLowerCase();
          case "contains":
            return String(itemValue || "")
              .toLowerCase()
              .includes(String(value).toLowerCase());
          case "startswith":
            return String(itemValue || "")
              .toLowerCase()
              .startsWith(String(value).toLowerCase());
          case "in":
            return Array.isArray(value) && value.map((v) => String(v).toLowerCase()).includes(String(itemValue || "").toLowerCase());
          case "nin":
            return Array.isArray(value) && !value.map((v) => String(v).toLowerCase()).includes(String(itemValue || "").toLowerCase());
          case "null":
            return itemValue === null || itemValue === undefined;
          case "nnull":
            return itemValue !== null && itemValue !== undefined;
          default:
            return true;
        }
      }
      return true;
    });
  });
};

// Helper sorting
const applySorting = (data: any[], sorters?: CrudSorting) => {
  if (!sorters || sorters.length === 0) return data;

  const sorted = [...data];
  sorted.sort((a, b) => {
    for (const sorter of sorters) {
      const aVal = a[sorter.field];
      const bVal = b[sorter.field];

      if (aVal === bVal) continue;

      if (sorter.order === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    }
    return 0;
  });

  return sorted;
};

// Helper pagination
const applyPagination = (data: any[], pagination?: Pagination) => {
  if (!pagination) return { data, total: data.length };

  const p = pagination as any;
  const current = p.current || p.currentPage || 1;
  const pageSize = p.pageSize || 10;
  if (p.mode === "off") return { data, total: data.length };

  const start = (current - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: data.slice(start, end),
    total: data.length,
  };
};

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({ resource, pagination, filters, sorters }: any) => {
    const list = mockDb[resource] || [];

    // Filter
    let filtered = applyFilters(list, filters);

    // Sort
    filtered = applySorting(filtered, sorters);

    // Paginate
    const { data, total } = applyPagination(filtered, pagination);

    return {
      data: data as unknown as TData[],
      total,
    };
  },

  getOne: async <TData extends BaseRecord = BaseRecord>({ resource, id }: any) => {
    const list = mockDb[resource] || [];
    const item = list.find((it) => String(it.id) === String(id) || (it.slug && it.slug === id));

    if (!item) {
      throw new Error(`Record with id ${id} not found in ${resource}`);
    }

    return {
      data: item as unknown as TData,
    };
  },

  create: async <TData extends BaseRecord = BaseRecord>({ resource, variables }: any) => {
    if (!mockDb[resource]) {
      mockDb[resource] = [];
    }

    const list = mockDb[resource];
    const newId = list.length > 0 ? Math.max(...list.map((it) => Number(it.id) || 0)) + 1 : 1;

    const newRecord: any = {
      ...(variables as object),
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Auto generate report number if needed
    if (resource === "hazard-reports" && !newRecord.reportNumber) {
      newRecord.reportNumber = `HAZ-2026-${String(newId).padStart(3, "0")}`;
    }
    if (resource === "hiradc" && !newRecord.reportNumber) {
      newRecord.reportNumber = `HIR-2026-${String(newId).padStart(3, "0")}`;
    }
    if (resource === "accident-reports" && !newRecord.reportNumber) {
      newRecord.reportNumber = `ACC-2026-${String(newId).padStart(3, "0")}`;
    }

    list.unshift(newRecord);

    return {
      data: newRecord as unknown as TData,
    };
  },

  update: async <TData extends BaseRecord = BaseRecord>({ resource, id, variables }: any) => {
    const list = mockDb[resource] || [];
    const index = list.findIndex((it) => String(it.id) === String(id));

    if (index === -1) {
      throw new Error(`Record with id ${id} not found in ${resource}`);
    }

    const existing = list[index];
    const updatedRecord = {
      ...existing,
      ...(variables as object),
      id: existing.id,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedRecord;

    return {
      data: updatedRecord as unknown as TData,
    };
  },

  deleteOne: async <TData extends BaseRecord = BaseRecord>({ resource, id }: any) => {
    const list = mockDb[resource] || [];
    const index = list.findIndex((it) => String(it.id) === String(id));

    if (index === -1) {
      throw new Error(`Record with id ${id} not found in ${resource}`);
    }

    const deleted = list.splice(index, 1)[0];

    return {
      data: deleted as unknown as TData,
    };
  },

  getMany: async <TData extends BaseRecord = BaseRecord>({ resource, ids }: any) => {
    const list = mockDb[resource] || [];
    const data = list.filter((it) => ids.map(String).includes(String(it.id)));

    return {
      data: data as unknown as TData[],
    };
  },

  custom: async <TData extends BaseRecord = BaseRecord>({ url }: any) => {
    // Custom endpoint mock: dashboard summary
    if (url.includes("dashboard/summary") || url.includes("/dashboard/summary")) {
      return {
        data: initialDashboardSummary as unknown as TData,
      };
    }

    // Mock upload
    if (url.includes("uploads") || url.includes("/uploads")) {
      return {
        data: {
          url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
          name: "uploaded_photo.jpg",
          status: "done",
        } as unknown as TData,
      };
    }

    return {
      data: {} as unknown as TData,
    };
  },

  getApiUrl: () => {
    return "";
  },
};
