'use client';

import { useState } from 'react';

export default function Home() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const searchRepositories = async (query: string) => {
    if (!query.trim()) {
      setError('検索キーワードを入力してください');
      return;
    }

    setLoading(true);
    setError('');
    setRepos([]);

    try {
      const response = await fetch(`/api/github?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '検索に失敗しました');
      }

      if (data.repositories.length === 0) {
        setError('リポジトリが見つかりませんでした');
      } else {
        setRepos(data.repositories);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">GitHub リポジトリ検索</h1>

      <div className="mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="検索キーワードを入力"
          className="border p-2 rounded mr-2"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              searchRepositories(searchInput);
            }
          }}
        />
        <button
          onClick={() => searchRepositories(searchInput || 'stars:>1000')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? '検索中...' : '検索'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {repos.map((repo: any) => (
          <div key={repo.id} className="border p-4 rounded shadow">
            <h2 className="font-bold text-lg">{repo.name}</h2>
            <p className="text-gray-600 mt-1">{repo.description}</p>
            <div className="mt-2">
              <span className="mr-4">⭐️ {repo.stars.toLocaleString()}</span>
              <span className="text-gray-600">言語: {repo.language || 'N/A'}</span>
            </div>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2 inline-block"
            >
              リポジトリを見る →
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
