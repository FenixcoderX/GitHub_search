import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRepositoryInfo } from '../api/githubApi';
import { RepositoryInfo } from '../types/index'; // Импорт типа RepositoryInfo

const RepositoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [repository, setRepository] = useState<RepositoryInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch the repository information when the component is mounted
  useEffect(() => {
    const fetchInfo = async () => {
      if (id) {
        try {
          const repoInfo = await fetchRepositoryInfo(id);
          setRepository(repoInfo);
        } catch (error) {
          console.error('Не удалось получить информацию о репозитории:', error);
          setError('Не удалось получить информацию о репозитории.');
        }
      }
    };
    fetchInfo();
  }, [id]);

  if (error) return <div>Ошибка загрузки: {error}</div>;
  if (!repository) return <div>Загрузка...</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center max-w-[600px] mx-4 sm:mx-auto">
      <h1 className="font-bold text-lg">
        {repository.name} - {repository.stargazerCount} ⭐ -{' '}
        {new Date(repository.updatedAt).toLocaleDateString()}
      </h1>
      {repository.ownerPhoto && (
        <img
          src={repository.ownerPhoto}
          alt="Owner"
          className="w-20 h-20 rounded-full mt-4"
        />
      )}
      <a
        href={repository.ownerUrl}
        className="text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out mt-2"
      >
        {repository.ownerNickname}
      </a>
      <ul className="list-disc pl-5 mt-2">
        {repository.languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <p className="mt-2">{repository.description}</p>
    </div>
  );
};

export default RepositoryDetail;
