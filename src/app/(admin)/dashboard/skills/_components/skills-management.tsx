"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import DataTable from "@/components/common/data-tables";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SKILL_TABLE_HEADER } from "@/constants/skill-constant";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { PortfolioSkillRow } from "@/types/skill";
import DialogCreateSkill from "./dialog-create-skill";
import DialogDeleteSkill from "./dialog-delete-skill";
import DialogUpdateSkill from "./dialog-update-skill";

export default function SkillsManagement() {
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
    data: skills,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["portfolio-skills", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("portfolio_skills")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (currentSearch) {
        query.or(
          `name.ilike.%${currentSearch}%,category.ilike.%${currentSearch}%,description.ilike.%${currentSearch}%`,
        );
      }

      const result = await query;

      if (result.error) {
        toast.error("Get skills failed", {
          description: result.error.message,
        });
      }

      return result;
    },
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: PortfolioSkillRow;
    type: "create" | "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) {
      setSelectedAction(null);
    }
  };

  const openAction = (
    data: PortfolioSkillRow,
    type: "update" | "delete",
  ) => {
    window.setTimeout(() => {
      setSelectedAction({ data, type });
    }, 0);
  };

  const filteredData = useMemo(() => {
    return ((skills?.data || []) as PortfolioSkillRow[]).map((skill, index) => [
      currentLimit * (currentPage - 1) + index + 1,
      <div key="skill" className="min-w-56">
        <h4 className="font-medium">{skill.name}</h4>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {skill.description || "-"}
        </p>
        {skill.icon ? (
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            icon: {skill.icon}
          </p>
        ) : null}
      </div>,
      <span key="category" className="rounded-full border bg-muted px-2 py-0.5 text-xs">
        {skill.category}
      </span>,
      <span
        key="status"
        className={cn("rounded-full px-2 py-0.5 text-xs text-white", {
          "bg-emerald-600": skill.is_active,
          "bg-slate-500": !skill.is_active,
        })}
      >
        {skill.is_active ? "Active" : "Inactive"}
      </span>,
      skill.sort_order,
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
            action: () => openAction(skill, "update"),
          },
          {
            label: (
              <span className="flex items-center gap-2">
                <Trash2 />
                Delete
              </span>
            ),
            variant: "destructive",
            action: () => openAction(skill, "delete"),
          },
        ]}
      />,
    ]);
  }, [currentLimit, currentPage, skills?.data]);

  const totalPages = useMemo(() => {
    return skills && skills.count !== null
      ? Math.ceil(skills.count / currentLimit)
      : 0;
  }, [currentLimit, skills]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Skills Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage technology stack items for the landing page.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search by name, category, or description"
            onChange={(event) => handleChangeSearch(event.target.value)}
          />
          <Dialog
            open={selectedAction !== null && selectedAction.type === "create"}
            onOpenChange={(open) => {
              if (open) {
                setSelectedAction({
                  data: {} as PortfolioSkillRow,
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
            <DialogCreateSkill
              refetch={refetch}
              handleChangeAction={handleChangeAction}
            />
          </Dialog>
        </div>
      </div>
      <DataTable
        header={SKILL_TABLE_HEADER}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
      <DialogUpdateSkill
        refetch={refetch}
        open={selectedAction !== null && selectedAction.type === "update"}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogDeleteSkill
        refetch={refetch}
        open={selectedAction !== null && selectedAction.type === "delete"}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
