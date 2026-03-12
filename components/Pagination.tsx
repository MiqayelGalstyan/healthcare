import { FC } from "react";
import { dataTableConfig } from "@/constants";
import {
  Pagination as ShadCnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Props {
  totalDataCount: number;
  currentPage: number;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  onChangePageSize?: (pageSize: number) => void;
  onPageChange?: (selectedPage: number) => void;
  pageSize: number;
}

const Pagination: FC<Props> = ({
  totalDataCount,
  onPrevPage,
  onNextPage,
  onChangePageSize,
  onPageChange,
  currentPage,
  pageSize,
}) => {
  const totalPages = Math.ceil(totalDataCount / pageSize);

  const generatePages = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = (value: string) => pages.push(value);

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const nearStart = currentPage <= 3;
    const nearEnd = currentPage >= totalPages - 2;

    if (nearStart) {
      pages.push(1, 2, 3, 4);
      showEllipsis("...");
      pages.push(totalPages);
      return pages;
    }

    if (nearEnd) {
      pages.push(1);
      showEllipsis("...");
      pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      return pages;
    }

    pages.push(1);
    showEllipsis("...");
    pages.push(currentPage - 1, currentPage, currentPage + 1);
    showEllipsis("...");
    pages.push(totalPages);

    return pages;
  };

  if (totalDataCount <= dataTableConfig.initialPageSize) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
      <div className="flex items-center min-w-48 gap-2">
        <span className="text-sm">Rows per page:</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onChangePageSize?.(Number(value))}
        >
          <SelectTrigger className="min-w-[60px]" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {dataTableConfig.pageSizeOptions.map((option) => (
                <SelectItem key={option} value={`${option}`}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <ShadCnPagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPrevPage?.();
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {generatePages().map((page, idx) => (
            <PaginationItem key={idx}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange?.(Number(page));
                  }}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNextPage?.();
              }}
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </ShadCnPagination>
    </div>
  );
};

export default Pagination;
