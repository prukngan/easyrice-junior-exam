import { useEffect, useState, useCallback } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { format } from "date-fns"
import { Search, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/date-picker"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { getHistory, deleteHistory } from "@/services/history.service"
import type { HistoryItem } from "@/types/history"

import { EasyriceNavbar } from "@/components/navbar"

const PAGE_SIZE = 10

export default function HistoryPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Data state
  const [data, setData] = useState<HistoryItem[]>([])
  const [totalHistory, setTotalHistory] = useState(0)
  const [loading, setLoading] = useState(false)

  // Filter state
  const [searchId, setSearchId] = useState("")
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)

  // Active filter state (used for actual fetch)
  const [activeFilters, setActiveFilters] = useState<{
    inspectionID: string
    fromDate?: Date
    toDate?: Date
  }>({
    inspectionID: "",
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(() => Number(searchParams.get("page")) || 1)

  // Initialization: read params on mount
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const inspectionID = searchParams.get("inspectionID") || "";
    const startCreateDate = searchParams.get("startCreateDate");
    const endCreateDate = searchParams.get("endCreateDate");

    setCurrentPage(page);
    setSearchId(inspectionID);
    
    if (startCreateDate) setFromDate(new Date(startCreateDate));
    if (endCreateDate) setToDate(new Date(endCreateDate));

    setActiveFilters({
      inspectionID: inspectionID,
      fromDate: startCreateDate ? new Date(startCreateDate) : undefined,
      toDate: endCreateDate ? new Date(endCreateDate) : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only on mount

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const totalPages = Math.ceil(totalHistory / PAGE_SIZE)

  const fetchData = useCallback(
    async (page: number = 1) => {
      setLoading(true)
      try {
        const result = await getHistory({
          inspectionID: activeFilters.inspectionID || undefined,
          startCreateDate: activeFilters.fromDate ? activeFilters.fromDate.toISOString() : undefined,
          endCreateDate: activeFilters.toDate ? activeFilters.toDate.toISOString() : undefined,
          page,
          limit: PAGE_SIZE,
        })
        setData(result.data)
        setTotalHistory(result.totalHistory)
      } catch (err) {
        console.error("Failed to fetch history:", err)
      } finally {
        setLoading(false)
      }
    },
    [activeFilters],
  )

  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage, fetchData])

  const handleSearch = () => {
    setCurrentPage(1)
    setActiveFilters({
      inspectionID: searchId,
      fromDate: fromDate,
      toDate: toDate,
    })
    setSelectedIds(new Set())

    // Update URL
    const params = new URLSearchParams()
    if (searchId) params.set("inspectionID", searchId)
    if (fromDate) params.set("startCreateDate", fromDate.toISOString())
    if (toDate) params.set("endCreateDate", toDate.toISOString())
    params.set("page", "1")
    setSearchParams(params)
  }

  const handleClearFilter = () => {
    setSearchId("")
    setFromDate(undefined)
    setToDate(undefined)
    setActiveFilters({
      inspectionID: "",
      fromDate: undefined,
      toDate: undefined,
    })
    setCurrentPage(1)
    setSelectedIds(new Set())
    setSearchParams({})
  }

  const handleDelete = async () => {
    if (selectedIds.size === 0) return
    try {
      await deleteHistory(Array.from(selectedIds))
      setSelectedIds(new Set())
      fetchData(currentPage)
    } catch (err) {
      console.error("Failed to delete:", err)
    }
  }

  const handleRowClick = (inspectionID: string) => {
    const params = new URLSearchParams()
    if (activeFilters.inspectionID) params.set("inspectionID", activeFilters.inspectionID)
    if (activeFilters.fromDate) params.set("startCreateDate", activeFilters.fromDate.toISOString())
    if (activeFilters.toDate) params.set("endCreateDate", activeFilters.toDate.toISOString())
    params.set("page", String(currentPage))
    params.set("limit", String(PAGE_SIZE))

    navigate(`/history/${inspectionID}?${params.toString()}`)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const startIdx = (currentPage - 1) * PAGE_SIZE + 1
  const endIdx = Math.min(currentPage * PAGE_SIZE, totalHistory)

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy HH:mm:ss")
    } catch {
      return dateStr
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <EasyriceNavbar />

      {/* Main Content */}
      <main className="max-w-[1602px] mx-auto px-4 sm:px-6 lg:px-[90px] pb-6 pt-0">
        {/* Create Button */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => navigate("/history/create")}
            className="bg-easyrice hover:bg-easyrice-dark text-white gap-2 rounded-sm"
          >
            <Plus className="h-4 w-4" />
            Create Inspection
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[8px] p-[10px] md:p-6 mb-6 w-full min-h-[194px] shadow-[0px_8px_108px_0px_rgba(0,0,0,0.06)] flex flex-col justify-center gap-[10px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* ID Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                ID
              </label>
              <Input
                placeholder="Search with ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch()
                }}
                className="h-10"
              />
            </div>

            {/* From Date */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                From Date
              </label>
              <DatePicker
                date={fromDate}
                onSelect={setFromDate}
                placeholder="Please select From Date"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                To Date
              </label>
              <DatePicker
                date={toDate}
                onSelect={setToDate}
                placeholder="Please select To Date"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleClearFilter}
              className="text-sm text-red-500 hover:text-red-700 font-medium underline underline-offset-4 transition-colors cursor-pointer"
            >
              Clear Filter
            </button>
            <Button
              onClick={handleSearch}
              className="bg-easyrice hover:bg-easyrice-dark text-white gap-2 rounded-sm"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        {/* Delete Action Bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-easyrice border-easyrice hover:bg-easyrice/10 gap-2 rounded"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <span className="text-sm text-muted-foreground">
              Select items: {selectedIds.size} item{selectedIds.size !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded border border-border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-easyrice hover:bg-easyrice">
                <TableHead className="text-white font-semibold w-12"></TableHead>
                <TableHead className="text-white font-semibold">
                  Create Date - Time
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Inspection ID
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Name
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Standard
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Note
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-easyrice border-t-transparent" />
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No inspection records found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow
                    key={item.inspectionID}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleRowClick(item.inspectionID)}
                  >
                    <TableCell
                      className="w-12"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selectedIds.has(item.inspectionID)}
                        onCheckedChange={() => toggleSelect(item.inspectionID)}
                        className="data-[state=checked]:bg-easyrice data-[state=checked]:border-easyrice"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatDate(item.createdDate)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {item.inspectionID}
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.standardName || "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.note || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalHistory > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-white">
              <span className="text-sm text-muted-foreground">
                {startIdx}-{endIdx} of {totalHistory}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={currentPage <= 1}
                  onClick={() => {
                    const newPage = Math.max(1, currentPage - 1);
                    setCurrentPage(newPage);
                    const params = new URLSearchParams(searchParams);
                    params.set("page", String(newPage));
                    setSearchParams(params);
                  }}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    const newPage = Math.min(totalPages, currentPage + 1);
                    setCurrentPage(newPage);
                    const params = new URLSearchParams(searchParams);
                    params.set("page", String(newPage));
                    setSearchParams(params);
                  }}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
