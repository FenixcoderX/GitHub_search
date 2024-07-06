import { gql, ApolloQueryResult } from '@apollo/client';
import client from './ApolloClientSetup';
import { createEffect } from 'effector';
import {
  Repository,
  FetchParams,
  SearchRepositoriesResponse,
} from '../types/index';

/**
 * Retrieves the current user's username from the GitHub API
 * @returns {Promise<string>} The current user's username
 */
const getCurrentUserName = async (): Promise<string> => {
  try {
  const query = gql`
    query {
      viewer {
        login
      }
    }
  `;
  const res = await client.query({ query });
  return res.data.viewer.login;
} catch (error) {
  console.error('Ошибка при получении имени текущего пользователя:', error);
  throw new Error('Не удалось получить имя текущего пользователя.');
}
};

const SEARCH_REPOSITORIES = gql`
  query searchRepositories($query: String!, $first: Int!, $after: String) {
    search(query: $query, type: REPOSITORY, first: $first, after: $after) {
      repositoryCount
      edges {
        node {
          ... on Repository {
            name
            id
            url
            stargazerCount
            updatedAt
          }
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
`;

/**
 * Fetches repositories based on the provided search query, current page
 * 
 * @param {string} searchQuery - The search query to search for repositories
 * @param {number} currentPage - The current page number for pagination
 * @param {number} queryId - An identifier for the query to manage response relevance
 * 
 * @returns {Repository[]} repositories - An array of Repository objects
 * @returns {number} totalRepositories - The total number of repositories matching the query
 * @returns {number} queryId - The passed queryId to check if the response is outdated
 */
export const fetchRepositoriesFx = createEffect(
  async ({
    searchQuery,
    currentPage,
    queryId,
  }: FetchParams): Promise<{
    repositories: Repository[];
    totalRepositories: number;
    queryId: number;
  }> => {
    // If the search query is empty we will search for the current user's repositories
    // else we will search for the query in the repository name
    try {
    let query = searchQuery.trim();
    if (!query) {
      const currentUserName = await getCurrentUserName();
      query = `user:${currentUserName}`;
    } else {
      query = `${query} in:name`;
    }

    // Pagination logic to get the needed repositories

    // Define the number of items per page and the initial endCursor
    const reposPerPage = 10;
    let firstRequestEndCursor = null;

    // Make the first request to get the endCursor if page is greater than 1 and endCursor is not available
    const needInitialFetch = currentPage > 1 && !firstRequestEndCursor;
    if (needInitialFetch) {
      const initialFetchResult: ApolloQueryResult<SearchRepositoriesResponse> =
        await client.query({
          query: SEARCH_REPOSITORIES,
          variables: {
            query: query,
            first: (currentPage - 1) * reposPerPage,
            after: '',
          },
        });
      firstRequestEndCursor = initialFetchResult.data.search.pageInfo.endCursor;
    }

    // Make the final request to get needed repositories
    const finalFetchResult: ApolloQueryResult<SearchRepositoriesResponse> =
      await client.query({
        query: SEARCH_REPOSITORIES,
        variables: {
          query: query,
          first: reposPerPage,
          after: firstRequestEndCursor,
        },
      });

    return {
      repositories: finalFetchResult.data.search.edges.map((edge) => edge.node),
      totalRepositories: finalFetchResult.data.search.repositoryCount,
      queryId, // queryId to check if the response is outdated
    };
  } catch (error) {
    console.error('Ошибка при загрузки репозиториев:', error);
    throw new Error('Не удалось загрузить репозитории.');
  }
  }
);

/**
 * Fetches information about a repository
 * @param {string} repositoryId - The ID of the repository
 * @returns {Promise<RepositoryInfo>} The repository information
 * @throws {Error} An error if the repository information could not be fetched
 */
export const fetchRepositoryInfo = async (repositoryId: string) => {
  const REPOSITORY_INFO_QUERY = gql`
    query GetRepositoryInfo($id: ID!) {
      node(id: $id) {
        ... on Repository {
          name
          stargazerCount
          updatedAt
          owner {
            login
            avatarUrl
          }
          languages(first: 5) {
            edges {
              node {
                name
              }
            }
          }
          description
        }
      }
    }
  `;

  try {
    const result = await client.query({
      query: REPOSITORY_INFO_QUERY,
      variables: { id: repositoryId },
    });

    const repoData = result.data.node;
    return {
      name: repoData.name,
      stargazerCount: repoData.stargazerCount,
      updatedAt: repoData.updatedAt,
      ownerPhoto: repoData.owner.avatarUrl,
      ownerUrl: `https://github.com/${repoData.owner.login}`,
      ownerNickname: repoData.owner.login,
      languages: repoData.languages.edges.map(
        (edge: { node: { name: string } }) => edge.node.name
      ),
      description: repoData.description,
    };
  } catch (error) {
    console.error('Ошибка при получении информации о репозитории:', error);
    throw new Error('Не удалось получить информацию о репозитории."');
  }
};