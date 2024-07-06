# GitHub search

A single-page application for searching GitHub repositories and viewing detailed information about repository.

Built with React and TypeScript.


- **State Management:** Effector is used for managing application state.
- **GraphQL API:** Utilizes Apollo Client to interact with GitHub's GraphQL API for fetching repository data.

Features include:

1. **Repository Search:** Users can search for GitHub repositories using a search query.
2. **Repository Details:** View detailed information about a repository, including star count, owner information, and programming languages used.
3. **Pagination:** Browse through search results with a pagination system.

# Installation and Usage

In repo, you will see a `.env-example` file. Rename the file to `.env` and set GitHub API token as `VITE_GITHUB_TOKEN`.

To get started:

```bash
npm install
```
to install all project dependencies.

```bash
npm run dev
```
to start the development server