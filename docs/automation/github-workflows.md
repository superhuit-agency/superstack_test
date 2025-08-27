# Github Workflows and Actions

## Existing workflows

This project contains 6 workflows used to automate github deployments:

1. **validate-pull-request.yml**: Runs on pull request creation/update to validate changes by:

    - Building the WordPress environment
    - Starting WordPress and Next.js servers
    - Running automated tests including end-to-end tests with video recording
    - Ensuring code quality and functionality before merging

2. **run-tests-development.yml**: Executes the test suite in the development environment:

    - Runs unit tests and integration tests
    - Generates test coverage reports
    - Can be configured to record test execution videos

3. **run-tests-production.yml**: Similar to development tests but runs against production:

    - Validates functionality in production environment
    - Ensures deployed code works as expected
    - Generates test reports for production verification

4. **deploy-development.yml**: Handles deployment to development environment:

    - Builds and deploys WordPress theme
    - Updates Next.js frontend
    - Runs post-deployment checks

5. **deploy-staging.yml**: Manages staging environment deployments:

    - Similar to development deployment
    - Additional verification steps for pre-production
    - Staging-specific configuration

6. **deploy-production.yml**: Controls production deployments:
    - Strict validation checks
    - Production build process
    - Zero-downtime deployment
    - Post-deployment health checks

## Testing the workflows

If you need to test some workflows locally, you can istall the `act`command (see documentation [here](https://nektosact.com/usage)) and run the following (for example the build_run_test action):

```bash
act -j build_run_test --container-architecture linux/amd64 --secret-file .env.github.secrets.example --var-file .env.github.variables.example
```
