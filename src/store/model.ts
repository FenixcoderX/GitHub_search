import { createStore, Store, createEvent } from 'effector';
import { Repository } from '../types/index'; 
import { fetchRepositoriesFx } from '../api/githubApi';

// Create an events
export const setCurrentPage = createEvent<number>();
export const updateLastQueryId = createEvent<number>();

// Create a store
export const $repositories: Store<Repository[]> = createStore([]);
export const $currentPage = createStore<number>(1).on(
  setCurrentPage,
  (_, page) => page
);
export const $lastQueryId = createStore<number>(0).on(
  updateLastQueryId,
  (_, newId) => newId
);
export const $totalRepositories: Store<number> = createStore(0);

// Bind the effect to the store and update the store with the data

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
$repositories.on(fetchRepositoriesFx.doneData, (state, result) => {
  const lastQueryId = $lastQueryId.getState();
  // Check if the result is from the last query and update the store or return the current state
  if (result.queryId === lastQueryId) {
    return result.repositories;
  }
  return state;
});
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
$totalRepositories.on(fetchRepositoriesFx.doneData,(_, result) => result.totalRepositories);
