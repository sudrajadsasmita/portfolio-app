"use client";

import { useCallback, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import DataTable from "@/components/common/data-tables";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ABOUT_ITEM_TABLE_HEADER } from "@/constants/about-item-constant";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { PortfolioAboutItemRow } from "@/types/about-item";
import DialogCreateAboutItem from "./dialog-create-about-item";
import DialogDeleteAboutItem from "./dialog-delete-about-item";
import DialogUpdateAboutItem from "./dialog-update-about-item";

export default function AboutItemsManagement() {
  const supabase = createClient();
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();

  const {
    data: aboutItems,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["portfolio-about-items", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("portfolio_about_items")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (currentSearch) {
        query.or(
          `title.ilike.%${currentSearch}%,description.ilike.%${currentSearch}%,icon.ilike.%${currentSearch}%`,
        );
      }

      const result = await query;

      if (result.error) {
        toast.error("Get about items failed", {
          description: result.error.message,
        });
      }

      return result;
    },
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: PortfolioAboutItemRow;
    type: "create" | "update" | "delete";
  } | null>(null);

  const handleChangeAction = useCallback((open: boolean) => {
    if (!open) {
      setSelectedAction(null);
    }
  }, []);

  const openAction = useCallback((
    data: PortfolioAboutItemRow,
    type: "update" | "delete",
  ) => {
    window.setTimeout(() => {
      setSelectedAction({ data, type });
    }, 0);
  }, []);

  const filteredData = useMemo(() => {
    return ((aboutItems?.data || []) as PortfolioAboutItemRow[]).map(
      (item, index) => [
        currentLimit * (currentPage - 1) + index + 1,
        <div key="item" className="min-w-72">
          <h4 className="font-medium">{item.title}</h4>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {item.description}
          </p>
        </div>,
        <span key="icon" className="font-mono text-xs text-muted-foreground">
          {item.icon || "-"}
        </span>,
        <span
          key="status"
          className={cn("rounded-full px-2 py-0.5 text-xs text-white", {
            "bg-emerald-600": item.is_active,
            "bg-slate-500": !item.is_active,
          })}
        >
          {item.is_active ? "Active" : "Inactive"}
        </span>,
        item.sort_order,
        <DropdownAction
          key="action"
          menu={[
            {
              label: (
                <span className="flex items-center gap-2">
                  <Pencil />
                  Edit
                </span>
              ),
              action: () => openAction(item, "update"),
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Trash2 />
                  Delete
                </span>
              ),
              variant: "destructive",
              action: () => openAction(item, "delete"),
            },
          ]}
        />,
      ],
    );
  }, [aboutItems?.data, currentLimit, currentPage, openAction]);

  const totalPages = useMemo(() => {
    return aboutItems && aboutItems.count !== null
      ? Math.ceil(aboutItems.count / currentLimit)
      : 0;
  }, [aboutItems, currentLimit]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">About Items Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage capability cards for the landing about section.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search by title, description, or icon"
            onChange={(event) => handleChangeSearch(event.target.value)}
          />
          <Dialog
            open={selectedAction !== null && selectedAction.type === "create"}
            onOpenChange={(open) => {
              if (open) {
                setSelectedAction({
                  data: {} as PortfolioAboutItemRow,
                  type: "create",
                });
              } else {
                setSelectedAction(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus />
                Create
              </Button>
            </DialogTrigger>
            <DialogCreateAboutItem
              refetch={refetch}
              handleChangeAction={handleChangeAction}
            />
          </Dialog>
        </div>
      </div>
      <DataTable
        header={ABOUT_ITEM_TABLE_HEADER}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
      <DialogUpdateAboutItem
        refetch={refetch}
        open={selectedAction !== null && selectedAction.type === "update"}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogDeleteAboutItem
        refetch={refetch}
        open={selectedAction !== null && selectedAction.type === "delete"}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
