import { Octokit } from '@octokit/rest';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'stars:>1000';

  if (!process.env.GITHUB_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'GitHub token is not configured' },
      { status: 500 }
    );
  }

  try {
    const octokit = new Octokit({
      auth: `${process.env.GITHUB_ACCESS_TOKEN}`,
    });

    const response = await octokit.rest.search.repos({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: 10,
    });

    const repositories = response.data.items.map((repo: any) => ({
      id: repo.id,
      name: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      url: repo.html_url,
      language: repo.language
    }));

    return NextResponse.json({ repositories });

  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
