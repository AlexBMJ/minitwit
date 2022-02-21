# Branching

This repository focuses on the use of branching. Direct commits to the main branch is not possible, and has to be done through pull requests. All pull requests must pass all the tests in order to get accepted, and if new code is added, a unit test must come with it. We have applied branch protection to main, which disables direct commites and requires at least one other developer to review the code before the pull request can be merged. This ensures we don't push broken code to releases.

# Responsibility

All group members are responsible for reviewing the code. Each pull request must be reviewed by at least someone else in order for it to be merged into the main branch.

# Git Workflow

Given the project, we've made the decision to use the centralized workflow model. For a description on this, please [click here](https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows).

# How Can I Contribute?

## Reporting Bugs

Before reporting a bug, please make sure that the bug you're reporting hasn't already been reported in the [issues list](https://github.com/AlexBMJ/minitwit/issues).

If it isn't already on there, please fill out a bug report using the template. Be as descriptive as possible - we understand some bugs may seem random, and difficult to replicate - so the more information, the better. Issues that don't fit the template will be closed.

## Contributing code

- We prefer that contributors use VSCode, with Prettifier installed. It's important that the code remain consistent throughout the entirety of the codebase.
- Make sure to write a unit test for what you're implementing. If you're changing something, reflect those changes for the existing unit tests as well. We expect at least a 90% test coverage for each feature.
- Create a fork of this repository, and create a pull request using that. When creating the pull request, please use the templates.

# Most Importantly

Have fun while learning 😁
