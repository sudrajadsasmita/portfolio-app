"use client";

import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LIMIT_LISTS } from "@/constants/data-table-constant";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DataTableProps = {
  header: string[];
  data: (string | number | ReactNode)[][];
  isLoading?: boolean;
  totalPages: number;
  currentPage: number;
  currentLimit: number;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
};

export default function DataTable({
  header,
  data,
  isLoading,
  totalPages,
  currentPage,
  currentLimit,
  onChangePage,
  onChangeLimit,
}: DataTableProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <Card className="p-0">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              {header.map((column) => (
                <TableHead key={column} className="px-4 py-3">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {row.map((column, columnIndex) => (
                  <TableCell
                    className="max-w-[22rem] px-4 py-3 align-top"
                    key={`cell-${rowIndex}-${columnIndex}`}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {data.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={header.length} className="h-24 text-center">
                  No result data.
                </TableCell>
              </TableRow>
            ) : null}
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={header.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Limit
          <select
            value={currentLimit}
            onChange={(event) => onChangeLimit(Number(event.target.value))}
            className="h-8 rounded-lg border border-input bg-background px-2 text-foreground"
          >
            {LIMIT_LISTS.map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </label>
        {totalPages > 1 ? (
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onChangePage(currentPage > 1 ? currentPage - 1 : totalPages)}
            >
              <ChevronLeft />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onChangePage(currentPage < totalPages ? currentPage + 1 : 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
