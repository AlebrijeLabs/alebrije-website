# Branch Protection Rules

## Main Branch Protection

The following rules are applied to the `main` branch:

1. **Require pull request reviews before merging**
   - Require at least 1 approval
   - Dismiss stale pull request approvals when new commits are pushed
   - Require review from Code Owners

2. **Require status checks to pass before merging**
   - Require branches to be up to date before merging
   - Required status checks:
     - Build and Test workflow
     - Linting
     - TypeScript compilation

3. **Require signed commits**
   - All commits must be signed with a verified GPG key

4. **Include administrators**
   - These rules apply to administrators as well

## Develop Branch Protection

The following rules are applied to the `develop` branch:

1. **Require pull request reviews before merging**
   - Require at least 1 approval
   - Dismiss stale pull request approvals when new commits are pushed

2. **Require status checks to pass before merging**
   - Required status checks:
     - Build and Test workflow
     - Linting

## Branch Naming Convention

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Hotfixes: `hotfix/description`
- Releases: `release/version`

## Code Review Guidelines

1. All pull requests must:
   - Have a clear description
   - Reference related issues
   - Include tests for new features
   - Pass all automated checks

2. Code reviewers should check for:
   - Code quality
   - Test coverage
   - Documentation updates
   - Security considerations 