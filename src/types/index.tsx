export interface Repository {
  name: string;
  id: string;
  url: string;
  stargazerCount: number;
  updatedAt: string;
}

export interface FetchParams {
  searchQuery: string;
  currentPage: number;
  queryId: number;
}

export interface SearchRepositoriesResponse {
  search: {
    repositoryCount: number;
    edges: Array<{
      node: Repository;
    }>;
    pageInfo: {
      endCursor: string;
    };
  };
}

export type RepositoryInfo = {
  name: string;
  stargazerCount: number;
  updatedAt: string;
  ownerPhoto: string;
  ownerUrl: string;
  ownerNickname: string;
  languages: string[];
  description: string;
};
