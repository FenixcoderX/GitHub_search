import { useUnit } from 'effector-react';
import {
  $currentPage,
  $totalRepositories,
  setCurrentPage,
} from '../store/model';

const Paginator = () => {
  const currentPage = useUnit($currentPage);
  const totalRepositories = useUnit($totalRepositories);
  const maxRepositoriesPerPage = 10;
  const maxPages = 10;
  // Calculate the total number of pages and limit it to maxPages
  let totalPages = Math.ceil(totalRepositories / maxRepositoriesPerPage);
  totalPages = Math.min(totalPages, maxPages);

  // Create and fill an array with page numbers
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-wrap justify-center items-center my-4 mx-4">
      {pages.map((page) => (
        <button
          key={page}
          className={`my-1 mx-1 px-2 min-w-10 py-1 border border-gray-300 rounded-md text-sm font-medium ${
            currentPage === page
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Paginator;
