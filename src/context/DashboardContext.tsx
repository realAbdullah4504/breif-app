import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { FilterOptions } from "../types/briefTypes";

// Define context type
type DashboardContextType = {
  filters: FilterOptions;
  handleFiltersQuery: (filters: FilterOptions) => void;
};

// Create the context with proper type
const DashboardContext = createContext<DashboardContextType | null>(null);

// Provider props type
type DashboardProviderProps = {
  children: ReactNode;
};

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    review: "all",
    date: "today",
    customRange: "",
  });

  const handleFiltersQuery = (filter: FilterOptions) => {
    setFilters(filter);
  };

  return (
    <DashboardContext.Provider
      value={useMemo(() => {
        return {
          filters,
          handleFiltersQuery,
        };
      }, [filters])}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
};
