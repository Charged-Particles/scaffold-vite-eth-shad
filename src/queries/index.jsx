
import { QueryClient } from 'react-query';


// Singleton for accessing the QueryClient instance
class ReactQueryClient {
  static __instance = null;
  static instance() {
    if (!this.__instance) {
      this.__instance = new QueryClient({
        defaultOptions: {
          queries: {
            // globally default to 20 seconds
            staleTime: 1000 * 20,
          },
        },
      });
    }
    return this.__instance;
  }
}

const setQueryDefaults = (query, options) => {
  ReactQueryClient.instance().setQueryDefaults(query, options);
};

const invalidateQueries = (queryIds) => {
  const rq = ReactQueryClient.instance();
  const ids = (!_.isArray(queryIds)) ? [ queryIds ] : queryIds;
  _.forEach(ids, (queryId) => {
    if (_.indexOf(queryId, ':') > -1) {
      const parts = queryId.split(':');
      const queryIdentifier = parts.shift();
      invalidateQueries({
        predicate: (query) => {
          let isQuery = query.queryKey[0] === queryIdentifier;
          if (isQuery) {
            for (let i = 0; i < parts.length; i++) {
              isQuery = (query.queryKey[i+1] === parts[i]);
              if (!isQuery) { break; }
            }
          }
          return isQuery;
        },
      });
    } else {
      rq.invalidateQueries(queryId);
    }
  });
};

const getState = (newState = {}) => {
  const defaultState = { isIdle: false, isLoading: false, isError: false, isSuccess: false, data: {} };
  return { ...defaultState, ...newState };
};

export default ReactQueryClient;
export {
  setQueryDefaults,
  invalidateQueries,
  getState,
};
