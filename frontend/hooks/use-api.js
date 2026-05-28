// frontend/hooks/use-api.js
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useApi - Hook fetch data tự động khi component mount
 *
 * @param {Function} apiFunc   - Hàm gọi API, ví dụ: dashboardService.getStats
 * @param {Array}    params    - Mảng tham số truyền vào apiFunc
 * @param {Object}   options   - Tùy chọn
 *   @param {boolean} immediate    - Tự động gọi khi mount (default: true)
 *   @param {*}       defaultData  - Giá trị mặc định cho data
 *   @param {Function} onSuccess   - Callback khi thành công
 *   @param {Function} onError     - Callback khi thất bại
 */
export function useApi(apiFunc, params, options) {
  var resolvedParams = params || [];
  var resolvedOptions = options || {};
  var immediate = resolvedOptions.immediate !== undefined ? resolvedOptions.immediate : true;
  var defaultData = resolvedOptions.defaultData !== undefined ? resolvedOptions.defaultData : null;
  var onSuccess = resolvedOptions.onSuccess || null;
  var onError = resolvedOptions.onError || null;

  var [data, setData] = useState(defaultData);
  var [loading, setLoading] = useState(immediate);
  var [error, setError] = useState(null);

  // Dùng ref để tránh memory leak khi component unmount
  var mountedRef = useRef(true);

  useEffect(function () {
    mountedRef.current = true;
    return function () {
      mountedRef.current = false;
    };
  }, []);

  // Hàm thực thi API call
  var execute = useCallback(
    async function () {
      var args = Array.prototype.slice.call(arguments);
      var callParams = args.length > 0 ? args : resolvedParams;

      setLoading(true);
      setError(null);

      try {
        var result = await apiFunc.apply(null, callParams);

        if (mountedRef.current) {
          var responseData = result && result.data !== undefined ? result.data : result;
          setData(responseData);
          if (onSuccess) onSuccess(responseData);
        }

        return result;
      } catch (err) {
        if (mountedRef.current) {
          var errorMsg = err && err.message ? err.message : 'Đã xảy ra lỗi';
          setError(errorMsg);
          if (onError) onError(err);
        }
        throw err;
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiFunc]
  );

  // Gọi tự động khi mount nếu immediate = true
  useEffect(
    function () {
      if (immediate) {
        execute.apply(null, resolvedParams);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Refetch với params hiện tại
  var refetch = useCallback(
    function () {
      return execute.apply(null, resolvedParams);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [execute]
  );

  return { data, loading, error, execute, refetch };
}

/**
 * usePaginatedApi - Hook fetch data có phân trang
 *
 * @param {Function} apiFunc        - Hàm gọi API nhận object params
 * @param {Object}   initialParams  - Params khởi tạo
 */
export function usePaginatedApi(apiFunc, initialParams) {
  var baseParams = Object.assign({ page: 1, limit: 10 }, initialParams || {});

  var [data, setData] = useState([]);
  var [pagination, setPagination] = useState(null);
  var [loading, setLoading] = useState(true);
  var [error, setError] = useState(null);
  var [params, setParams] = useState(baseParams);

  var mountedRef = useRef(true);

  useEffect(function () {
    mountedRef.current = true;
    return function () {
      mountedRef.current = false;
    };
  }, []);

  var fetchData = useCallback(
    async function (fetchParams) {
      setLoading(true);
      setError(null);

      try {
        var result = await apiFunc(fetchParams);

        if (mountedRef.current) {
          setData(result.data || []);
          setPagination(result.pagination || null);
        }

        return result;
      } catch (err) {
        if (mountedRef.current) {
          setError(err && err.message ? err.message : 'Đã xảy ra lỗi');
        }
        throw err;
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [apiFunc]
  );

  // Gọi API mỗi khi params thay đổi
  useEffect(
    function () {
      fetchData(params);
    },
    [params, fetchData]
  );

  // Cập nhật filter/search, reset về trang 1
  var updateParams = useCallback(function (newParams) {
    setParams(function (prev) {
      return Object.assign({}, prev, newParams, { page: 1 });
    });
  }, []);

  // Chuyển trang
  var goToPage = useCallback(function (page) {
    setParams(function (prev) {
      return Object.assign({}, prev, { page: page });
    });
  }, []);

  // Refetch với params hiện tại
  var refetch = useCallback(
    function () {
      return fetchData(params);
    },
    [fetchData, params]
  );

  return {
    data,
    pagination,
    loading,
    error,
    params,
    updateParams,
    goToPage,
    refetch,
  };
}

/**
 * useMutation - Hook cho các thao tác thay đổi dữ liệu (POST/PUT/DELETE)
 *
 * @param {Function} mutationFunc  - Hàm gọi API
 * @param {Object}   options
 *   @param {Function} onSuccess  - Callback khi thành công, nhận (data, ...args)
 *   @param {Function} onError    - Callback khi thất bại, nhận (error, ...args)
 */
export function useMutation(mutationFunc, options) {
  var resolvedOptions = options || {};
  var onSuccess = resolvedOptions.onSuccess || null;
  var onError = resolvedOptions.onError || null;

  var [loading, setLoading] = useState(false);
  var [error, setError] = useState(null);
  var [data, setData] = useState(null);

  var mountedRef = useRef(true);

  useEffect(function () {
    mountedRef.current = true;
    return function () {
      mountedRef.current = false;
    };
  }, []);

  var mutate = useCallback(
    async function () {
      var args = Array.prototype.slice.call(arguments);

      setLoading(true);
      setError(null);

      try {
        var result = await mutationFunc.apply(null, args);

        if (mountedRef.current) {
          var responseData = result && result.data !== undefined ? result.data : result;
          setData(responseData);
          if (onSuccess) onSuccess(responseData, args);
        }

        return result;
      } catch (err) {
        if (mountedRef.current) {
          var errorMsg = err && err.message ? err.message : 'Đã xảy ra lỗi';
          setError(errorMsg);
          if (onError) onError(err, args);
        }
        throw err;
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [mutationFunc, onSuccess, onError]
  );

  // Reset state
  var reset = useCallback(function () {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { mutate, loading, error, data, reset };
}
