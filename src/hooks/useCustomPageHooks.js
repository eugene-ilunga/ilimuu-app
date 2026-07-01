import { useState, useEffect } from "react";

/**
 * Hook to fetch all custom pages with pagination
 */
export const useCustomPages = (page = 1, limit = 10) => {
  const [pages, setPages] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/custom-pages/list?page=${page}&limit=${limit}`);
      const data = await res.json();

      if (data.status === 200) {
        setPages(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message || "Failed to fetch pages");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch pages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [page, limit]);

  return { pages, total, totalPages, loading, error, refetch: fetchPages };
};

/**
 * Hook to fetch footer pages (active pages shown in footer)
 */
export const useFooterPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFooterPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/custom-pages/footer-pages");
      const data = await res.json();

      if (data.status === 200) {
        setPages(data.data);
      } else {
        setError(data.message || "Failed to fetch footer pages");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch footer pages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterPages();
  }, []);

  return { pages, loading, error, refetch: fetchFooterPages };
};

/**
 * Hook to fetch a single page by ID or slug
 */
export const useCustomPage = (identifier, type = "slug") => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPage = async () => {
    if (!identifier) return;

    try {
      setLoading(true);
      setError(null);
      const param = type === "slug" ? `slug=${identifier}` : `id=${identifier}`;
      const res = await fetch(`/api/custom-pages/details?${param}`);
      const data = await res.json();

      if (data.status === 200) {
        setPage(data.data);
      } else {
        setError(data.message || "Failed to fetch page");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch page");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [identifier, type]);

  return { page, loading, error, refetch: fetchPage };
};

/**
 * Hook to create a new custom page
 */
export const useCreateCustomPage = () => {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const createPage = async (formData) => {
    try {
      setCreating(true);
      setError(null);

      const res = await fetch("/api/custom-pages/add-new", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.status === 200) {
        return { success: true, data: data.data };
      } else {
        setError(data.message || "Failed to create page");
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError(err.message || "Failed to create page");
      return { success: false, error: err.message };
    } finally {
      setCreating(false);
    }
  };

  return { createPage, creating, error };
};

/**
 * Hook to update a custom page
 */
export const useUpdateCustomPage = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updatePage = async (formData) => {
    try {
      setUpdating(true);
      setError(null);

      const res = await fetch("/api/custom-pages/update", {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();

      if (data.status === 200) {
        return { success: true, data: data.data };
      } else {
        setError(data.message || "Failed to update page");
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError(err.message || "Failed to update page");
      return { success: false, error: err.message };
    } finally {
      setUpdating(false);
    }
  };

  return { updatePage, updating, error };
};

/**
 * Hook to delete a custom page
 */
export const useDeleteCustomPage = () => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deletePage = async (id) => {
    try {
      setDeleting(true);
      setError(null);

      const res = await fetch(`/api/custom-pages/delete?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.status === 200) {
        return { success: true };
      } else {
        setError(data.message || "Failed to delete page");
        return { success: false, error: data.message };
      }
    } catch (err) {
      setError(err.message || "Failed to delete page");
      return { success: false, error: err.message };
    } finally {
      setDeleting(false);
    }
  };

  return { deletePage, deleting, error };
};

