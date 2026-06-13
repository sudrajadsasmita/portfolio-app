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
import { EXPERIENCE_TABLE_HEADER } from "@/constants/experience-constant";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { PortfolioExperienceRow } from "@/types/experience";
import DialogCreateExperience from "./dialog-create-experience";
import DialogDeleteExperience from "./dialog-delete-experience";
import DialogUpdateExperience from "./dialog-update-experience";

export default function ExperienceManagement() {
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
    data: experiences,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["portfolio-experiences", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("portfolio_experiences")
        .select(
          `
            *,
            portfolio_experience_stacks(id, name, sort_order),
            portfolio_experience_highlights(id, highlight, sort_order)
          `,
          { count: "exact" },
        )
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (currentSearch) {
        query.or(
          `year_label.ilike.%${currentSearch}%,title.ilike.%${currentSearch}%,description.ilike.%${currentSearch}%`,
        );
      }

      const result = await query;

      if (result.error) {
        toast.error("Get experiences failed", {
          description: result.error.message,
        });
      }

      return result;
    },
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: PortfolioExperienceRow;
    type: "create" | "update" | "delete";
  } | null>(null);

  const handleChangeAction = useCallback((open: boolean) => {
    if (!open) {
      setSelectedAction(null);
    }
  }, []);

  const openAction = useCallback((
    data: PortfolioExperienceRow,
    type: "update" | "delete",
  ) => {
    window.setTimeout(() => {
      setSelectedAction({ data, type });
    }, 0);
  }, []);

  const filteredData = useMemo(() => {
    return ((experiences?.data || []) as PortfolioExperienceRow[]).map(
      (experience, index) => {
        const stacks =
          experience.portfolio_experience_stacks
            ?.sort((a, b) => a.sort_order - b.sort_order)
            .map((item) => item.name) ?? [];

        return [
          currentLimit * (currentPage - 1) + index + 1,
          <div key="experience" className="min-w-72">
            <p className="font-mono text-xs text-primary">
              {experience.year_label}
            </p>
            <h4 className="mt-1 font-medium">{experience.title}</h4>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {experience.description}
            </p>
          </div>,
          <div key="stack" className="flex max-w-72 flex-wrap gap-1.5">
            {stacks.slice(0, 4).map((stack) => (
              <span
                key={stack}
                className="rounded-full border bg-muted px-2 py-0.5 text-xs"
              >
                {stack}
              </span>
            ))}
            {stacks.length > 4 ? (
              <span className="text-xs text-muted-foreground">
                +{stacks.length - 4}
              </span>
            ) : null}
          </div>,
          <span
            key="status"
            className={cn("rounded-full px-2 py-0.5 text-xs text-white", {
              "bg-emerald-600": experience.is_active,
              "bg-slate-500": !experience.is_active,
            })}
          >
            {experience.is_active ? "Active" : "Inactive"}
          </span>,
          experience.sort_order,
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
                action: () => openAction(experience, "update"),
              },
              {
                label: (
                  <span className="flex items-center gap-2">
                    <Trash2 />
                    Delete
                  </span>
                ),
                variant: "destructive",
                action: () => openAction(experience, "delete"),
              },
            ]}
          />,
        ];
      },
    );
  }, [currentLimit, currentPage, experiences?.data, openAction]);

  const totalPages = useMemo(() => {
    return experiences && experiences.count !== null
      ? Math.ceil(experiences.count / currentLimit)
      : 0;
  }, [currentLimit, experiences]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Experience Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage timeline entries for the landing page journey section.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search by year, title, or description"
            onChange={(event) => handleChangeSearch(event.target.value)}
          />
          <Dialog
            open={selectedAction !== null && selectedAction.type === "create"}
            onOpenChange={(open) => {
              if (open) {
                setSelectedAction({
                  data: {} as PortfolioExperienceRow,
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
            <DialogCreateExperience
              refetch={refetch}
              handleChangeAction={handleChangeAction}
            />
          </Dialog>
        </div>
      </div>
      <DataTable
        header={EXPERIENCE_TABLE_HEADER}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
      <DialogUpdateExperience
        refetch={refetch}
        open={selectedAction !== null && selectedAction.type === "update"}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogDeleteExperience
        refetch={refetch}
        open={selectedAction !== null && selectedAction.type === "delete"}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
