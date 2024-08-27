import { useState, useEffect, useCallback } from 'react';
import { AxiosResponse } from 'axios';
import { PaginatedResponse } from '../api/types';

interface UsePaginatedDataParams<T> {
  fetchFunction: (params: { page: number; search?: string; ordering?: string }) => Promise<AxiosResponse<PaginatedResponse<T>>>;
  initialPage?: number;
  initialSearch?: string;
  initialOrdering?: string;
}

interface UsePaginatedDataResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  page: number;
  totalPages: number;
  search: string;
  ordering: string;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setOrdering: (ordering: string) => void;
  refetch: () => void;
}

function usePaginatedData<T>({
  fetchFunction,
  initialPage = 1,
  initialSearch = '',
  initialOrdering = '',
}: UsePaginatedDataParams<T>): UsePaginatedDataResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState(initialSearch);
  const [ordering, setOrdering] = useState(initialOrdering);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFunction({ page, search, ordering });
      setData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, page, search, ordering]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    search,
    ordering,
    setPage,
    setSearch,
    setOrdering,
    refetch,
  };
}

export default usePaginatedData;