"use client";

import { useState, useMemo } from "react";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";
import { daysOfWeek, DEFAULT_TIME_SLOTS } from "@/constants";
import { convertDay } from "@/helpers/convert-day";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type AvailabilityRow = {
  dayOfWeek: number;
  dayName: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
};

export function AvailabilityEditor({
  initial,
}: {
  initial: Array<{ dayOfWeek: number; startTime: string; endTime: string }>;
}) {
  const byDay = new Map(
    initial.map((a) => [
      a.dayOfWeek,
      { startTime: a.startTime, endTime: a.endTime },
    ]),
  );

  const [saving, setSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<AvailabilityRow[] | null>(null);
  const [rows, setRows] = useState<AvailabilityRow[]>(() =>
    daysOfWeek.map((dayName) => {
      const dayOfWeek = convertDay(dayName);
      const existing = byDay.get(dayOfWeek);
      return {
        dayOfWeek,
        dayName,
        startTime: existing?.startTime ?? DEFAULT_TIME_SLOTS.start,
        endTime: existing?.endTime ?? DEFAULT_TIME_SLOTS.end,
        enabled: existing != null,
      };
    }),
  );

  const initialRows = useMemo(() => {
    const byDayMap = new Map(
      initial.map((a) => [
        a.dayOfWeek,
        { startTime: a.startTime, endTime: a.endTime },
      ]),
    );
    return daysOfWeek.map((dayName) => {
      const dayOfWeek = convertDay(dayName);
      const existing = byDayMap.get(dayOfWeek);
      return {
        dayOfWeek,
        dayName,
        startTime: existing?.startTime ?? DEFAULT_TIME_SLOTS.start,
        endTime: existing?.endTime ?? DEFAULT_TIME_SLOTS.end,
        enabled: existing != null,
      };
    });
  }, [initial]);

  const baseline = lastSaved ?? initialRows;
  const hasEdits = JSON.stringify(rows) !== JSON.stringify(baseline);

  const toggleDay = (dayOfWeek: number) => {
    setRows((prev) =>
      prev.map((r) =>
        r.dayOfWeek === dayOfWeek ? { ...r, enabled: !r.enabled } : r,
      ),
    );
  };

  const updateTime = (
    dayOfWeek: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setRows((prev) =>
      prev.map((r) =>
        r.dayOfWeek === dayOfWeek ? { ...r, [field]: value } : r,
      ),
    );
  };

  const columns = useMemo<ColumnDef<AvailabilityRow>[]>(
    () => [
      {
        accessorKey: "dayName",
        header: "Day",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.dayName}</span>
        ),
      },
      {
        accessorKey: "startTime",
        header: "Start",
        cell: ({ row }) => {
          const r = row.original;
          return (
            <Input
              type="time"
              value={r.startTime}
              onChange={(e) =>
                updateTime(r.dayOfWeek, "startTime", e.target.value)
              }
              disabled={!r.enabled}
              className="w-32 dark:[&::-webkit-calendar-picker-indicator]:invert"
            />
          );
        },
      },
      {
        accessorKey: "endTime",
        header: "End",
        cell: ({ row }) => {
          const r = row.original;
          return (
            <Input
              type="time"
              value={r.endTime}
              onChange={(e) =>
                updateTime(r.dayOfWeek, "endTime", e.target.value)
              }
              disabled={!r.enabled}
              className="w-32 dark:[&::-webkit-calendar-picker-indicator]:invert"
            />
          );
        },
      },
      {
        id: "working",
        header: "Working",
        cell: ({ row }) => {
          const r = row.original;
          return (
            <Checkbox
              checked={r.enabled}
              onCheckedChange={() => toggleDay(r.dayOfWeek)}
              aria-label={`${r.dayName} working`}
            />
          );
        },
      },
    ],
    [rows],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const save = async () => {
    setSaving(true);
    try {
      const payload = rows
        .filter((r) => r.enabled)
        .map((r) => ({
          dayOfWeek: r.dayOfWeek,
          startTime: r.startTime,
          endTime: r.endTime,
        }));

      const res = await fetch("/api/doctor/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availabilities: payload }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save");
      }
      setLastSaved(rows.map((r) => ({ ...r })));
      toast.success("Timeslots updated.");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to update timeslots.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full flex justify-end items-center mb-8">
        <Button onClick={save} disabled={saving || !hasEdits}>
          {saving ? "Saving..." : "Save timeslots"}
        </Button>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-3 py-3">
                    {header.isPlaceholder
                      ? null
                      : typeof header.column.columnDef.header === "string"
                        ? header.column.columnDef.header
                        : null}
                    {header.id === "working" && "Working"}
                    {header.id !== "working" &&
                      typeof header.column.columnDef.header === "string" &&
                      null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-3 py-3">
                    {cell.column.id === "working" ? (
                      <Checkbox
                        checked={row.original.enabled}
                        onCheckedChange={() =>
                          toggleDay(row.original.dayOfWeek)
                        }
                        aria-label={`${row.original.dayName} working`}
                      />
                    ) : cell.column.id === "dayName" ? (
                      <span className="font-medium">
                        {row.original.dayName}
                      </span>
                    ) : cell.column.id === "startTime" ? (
                      <Input
                        type="time"
                        value={row.original.startTime}
                        onChange={(e) =>
                          updateTime(
                            row.original.dayOfWeek,
                            "startTime",
                            e.target.value,
                          )
                        }
                        disabled={!row.original.enabled}
                        className="w-32 dark:[&::-webkit-calendar-picker-indicator]:invert"
                      />
                    ) : cell.column.id === "endTime" ? (
                      <Input
                        type="time"
                        value={row.original.endTime}
                        onChange={(e) =>
                          updateTime(
                            row.original.dayOfWeek,
                            "endTime",
                            e.target.value,
                          )
                        }
                        disabled={!row.original.enabled}
                        className="w-32 dark:[&::-webkit-calendar-picker-indicator]:invert"
                      />
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
