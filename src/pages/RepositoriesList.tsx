import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import {
  $repositories,
  $currentPage,
  updateLastQueryId,
  setCurrentPage,
} from '../store/model';
import { fetchRepositoriesFx } from '../api/githubApi';
import Paginator from '../components/Paginator';
import { Link } from 'react-router-dom';

const RepositoriesList = () => {
  const initialSearchQuery = sessionStorage.getItem('searchQuery') || '';
  const initialCurrentPage = parseInt(
    sessionStorage.getItem('currentPage') || '1',
    10
  );
  const repositories = useUnit($repositories);
  const currentPage = useUnit($currentPage);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [isLoading, setIsLoading] = useState(false);

  // Reset the search query and the current page when the component is mounted
  useEffect(() => {
    setCurrentPage(initialCurrentPage);
    setSearchQuery(initialSearchQuery);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the repositories list when the search query or the current page changes and
  // store the search query and the current page in the sessionStorage
  useEffect(() => {
    // Generate a unique query id to check if the response is outdated
    const currentQueryId = Date.now();
    updateLastQueryId(currentQueryId);

    setIsLoading(true);
  
    fetchRepositoriesFx({
      searchQuery,
      currentPage,
      queryId: currentQueryId,
    }).finally(() => setIsLoading(false));
    
    sessionStorage.setItem('searchQuery', searchQuery);
    sessionStorage.setItem('currentPage', currentPage.toString());
  }, [searchQuery, currentPage]);


  /**
   * Handles the change event of the search query input
   * Updates the search query state, current page state, and session storage
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event object
   */
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    sessionStorage.setItem('searchQuery', e.target.value);
    sessionStorage.setItem('currentPage', '1');
  };

  return (
    <>
      <p className="text-gray-800 font-bold text-lg mx-4 mt-4">
        Поиск репозиториев на GitHub
      </p>
      <input
        className="border border-solid border-gray-300 	 rounded-md p-2 m-4 w-1/2 lg:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        value={searchQuery}
        onChange={handleSearchQueryChange}
      />
      <div className="flex flex-col items-center mx-6">
        {isLoading ? (
          <p className="text-gray-800 font-medium text-lg mt-4">Загрузка...</p>
        ) : repositories.length === 0 ? (
          <p className="text-gray-800 font-medium text-lg mt-4">
            Ничего не найдено
          </p>
        ) : (
          repositories.map((repo) => (
            <div
              key={repo.id}
              className="bg-white border border-gray-200  rounded-lg p-2 m-1 w-full md:w-3/4 flex flex-col md:flex-row justify-between items-center"
            >
              <span className="font-medium text-sm md:w-64 lg:w-96 break-all">
                <Link to={`/repository/${repo.id}`}>{repo.name}</Link>
              </span>

              <span className="flex text-sm"> {repo.stargazerCount}⭐</span>
              <span className="text-sm">
                {new Date(repo.updatedAt).toLocaleDateString()}
              </span>
              <a
                href={repo.url}
                className="text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out text-sm"
              >
                GitHub
              </a>
            </div>
          ))
        )}
      </div>
      <Paginator />
    </>
  );
};

export default RepositoriesList;
