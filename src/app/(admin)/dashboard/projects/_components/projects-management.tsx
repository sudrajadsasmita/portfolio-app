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
import { PROJECT_TABLE_HEADER } from "@/constants/project-constant";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { PortfolioProjectRow } from "@/types/project";
import DialogCreateProject from "./dialog-create-project";
import DialogDeleteProject from "./dialog-delete-project";
import DialogUpdateProject from "./dialog-update-project";

export default function ProjectsManagement() {
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
    data: projects,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["portfolio-projects", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("portfolio_projects")
        .select(
          `
            *,
            portfolio_project_stacks(id, name, sort_order),
            portfolio_project_highlights(id, highlight, sort_order)
          `,
          { count: "exact" },
        )
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (currentSearch) {
        query.or(
          `title.ilike.%${currentSearch}%,slug.ilike.%${currentSearch}%,description.ilike.%${currentSearch}%`,
        );
      }

      const result = await query;

      if (result.error) {
        toast.error("Get projects failed", {
          description: result.error.message,
        });
      }

      return result;
    },
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: PortfolioProjectRow;
    type: "create" | "update" | "delete";
  } | null>(null);

  const handleChangeAction = useCallback((open: boolean) => {
    if (!open) {
      setSelectedAction(null);
    }
  }, []);

  const openAction = useCallback((
    data: PortfolioProjectRow,
    type: "update" | "delete",
  ) => {
    window.setTimeout(() => {
      setSelectedAction({ data, type });
    }, 0);
  }, []);

  const filteredData = useMemo(() => {
    return ((projects?.data || []) as PortfolioProjectRow[]).map((project, index) => {
      const stacks =
        project.portfolio_project_stacks
          ?.sort((a, b) => a.sort_order - b.sort_order)
          .map((item) => item.name) ?? [];

      return [
        currentLimit * (currentPage - 1) + index + 1,
        <div key="project" className="min-w-72">
          <h4 className="font-medium">{project.title}</h4>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {project.description}
          </p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            /{project.slug}
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
        <div key="status" className="flex flex-col gap-1">
          <span
            className={cn("w-fit rounded-full px-2 py-0.5 text-xs text-white", {
              "bg-emerald-600": project.is_published,
              "bg-slate-500": !project.is_published,
            })}
          >
            {project.is_published ? "Published" : "Draft"}
          </span>
          {project.is_featured ? (
            <span className="w-fit rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
              Featured
            </span>
          ) : null}
        </div>,
        project.sort_order,
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
              action: () => openAction(project, "update"),
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Trash2 />
                  Delete
                </span>
              ),
              variant: "destructive",
              action: () => openAction(project, "delete"),
            },
          ]}
        />,
      ];
    });
  }, [currentLimit, currentPage, openAction, projects?.data]);

  const totalPages = useMemo(() => {
    return projects && projects.count !== null
      ? Math.ceil(projects.count / currentLimit)
      : 0;
  }, [currentLimit, projects]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage portfolio projects, stacks, highlights, and project links.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search by title, slug, or description"
            onChange={(event) => handleChangeSearch(event.target.value)}
          />
          <Dialog
            open={selectedAction !== null && selectedAction.type === "create"}
            onOpenChange={(open) => {
              if (open) {
                setSelectedAction({
                  data: {} as PortfolioProjectRow,
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
            <DialogCreateProject
              refetch={refetch}
              handleChangeAction={handleChangeAction}
            />
          </Dialog>
        </div>
      </div>
      <DataTable
        header={PROJECT_TABLE_HEADER}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
      <DialogUpdateProject
        refetch={refetch}
        open={selectedAction !== null && selectedAction.type === "update"}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogDeleteProject
        refetch={refetch}
        open={selectedAction !== null && selectedAction.type === "delete"}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
