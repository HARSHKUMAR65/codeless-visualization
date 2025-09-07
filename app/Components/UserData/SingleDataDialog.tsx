"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGetSinlgleData } from "@/app/hooks/useFile";
import { Loader2 } from "lucide-react";

type RecordLike = Record<string, unknown>;

function toTitle(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCell(key: string, val: unknown) {
  if (val == null) return "—";

  // Pretty-print ISO dates
  if (
    typeof val === "string" &&
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val)
  ) {
    try {
      return new Date(val).toLocaleString();
    } catch {
      /* ignore */
    }
  }

  // Badge for status
  if (key.toLowerCase() === "status" && typeof val === "string") {
    const isActive = val.toLowerCase() === "active";
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {val}
      </Badge>
    );
  }

  return String(val);
}

export default function SingleData({ id }: { id: number }) {
  const { data, isLoading, isError } = useGetSinlgleData(id);

  // Your sample response structure is: [{ data: [...] }]
  const rows: RecordLike[] =
    (Array.isArray(data) ? data[0]?.data : data?.data) ?? [];

  const columns: string[] = React.useMemo(() => {
    if (!rows || rows.length === 0) return [];
    // Merge keys from all rows to truly be dynamic
    const set = new Set<string>();
    rows.forEach((r) => Object.keys(r || {}).forEach((k) => set.add(k)));
    return Array.from(set);
  }, [rows]);

  // simple client-side filter
  const [q, setQ] = React.useState("");
  const filtered = React.useMemo(() => {
    if (!q.trim()) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r) =>
      columns.some((c) => String(r?.[c] ?? "").toLowerCase().includes(needle))
    );
  }, [q, rows, columns]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Preview</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
          <DialogDescription>
            Dynamic table preview of the selected dataset.
          </DialogDescription>
        </DialogHeader>

        {/* Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading…"
              : `${filtered.length} row${filtered.length === 1 ? "" : "s"}`}
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-[220px]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="relative max-h-[60vh] overflow-auto rounded-md border">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
            </div>
          ) : isError ? (
            <div className="p-6 text-sm text-red-600">
              Failed to load data.
            </div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No data found.
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col} className="whitespace-nowrap">
                      {toTitle(col)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row, idx) => (
                  <TableRow key={row.id ?? idx} className="hover:bg-muted/40">
                    {columns.map((col) => (
                      <TableCell key={`${row.id ?? idx}-${col}`} className="align-top">
                        {formatCell(col, row?.[col])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => {
              // example: export filtered to CSV (optional hook-up)
              console.log("Selected rows:", filtered);
            }}
          >
            Use This Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
