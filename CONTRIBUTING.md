# Contributing to Joy

Thank you for your interest in contributing to Joy. This document explains how to contribute and what is expected when working with this repository.

## Contribution Process

1. Fork the repository or create a new branch from the main branch.
2. Make your changes in a feature branch.
3. Test your changes locally.
4. Open a pull request with a clear description of the work and the testing performed.

## Issues and Pull Requests

- Create an issue for bugs, enhancements, or documentation improvements.
- Reference the issue number in your pull request description.
- Keep pull requests focused on a single change whenever possible.

## Development

- Use `docker-compose up --build` to run the frontend and backend together.
- Changes to the backend should be validated by restarting the Docker containers.
- Changes to the frontend should be checked in the browser at `http://localhost:3000`.

## Code Style

- Keep code clear and maintainable.
- Follow existing project conventions for JavaScript, React, and Docker.
- Avoid using emojis or informal styling in documentation updates.

## Environment Variables

- Use `.env.example` as a template for required configuration.
- Do not commit secret keys or credentials.

## License

This project is licensed under the MIT License. By contributing, you agree that your contributions will be licensed under the same terms.
