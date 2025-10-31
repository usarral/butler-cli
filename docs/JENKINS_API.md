# Jenkins API Guide (for Butler CI CLI)

This document explains the Jenkins REST API endpoints Butler CI CLI uses, how the client interacts with them, and important implementation notes.

## Authentication

Butler CI CLI uses HTTP Basic authentication with username and an API token. Store the token securely and use it in configurations.

### Obtaining an API token

1. Log into Jenkins
2. Click your username (top right)
3. Click "Configure"
4. In the "API Token" section, click "Add new Token"
5. Give it a name and generate the token
6. Copy the token immediately (it won't be shown again)

## Response formats

Jenkins provides JSON at endpoints suffixed with `/api/json`. Many endpoints accept a `tree=` query parameter to limit returned fields (useful for performance).

Example:

```
GET /job/my-job/api/json?tree=name,lastBuild[number,result]
```

## Endpoints commonly used by Butler CI CLI

- `GET /api/json` — server overview and top-level jobs
- `GET /job/{jobName}/api/json` — detailed job information
- `GET /job/{jobName}/{buildNumber}/api/json` — build details
- `GET /job/{jobName}/{buildNumber}/consoleText` — build console text (logs)
- `GET /job/{folder}/api/json?tree=jobs[...]` — list jobs in a folder
- `POST /job/{jobName}/build` — trigger a build with no parameters
- `POST /job/{jobName}/buildWithParameters?PARAM=value` — trigger build with parameters
- `GET /queue/item/{id}/api/json` — queue item status

## Notes about folders and paths

Jenkins encodes each folder level as `/job/{name}` in the URL. For a logical path like `backend/microservices/service`, the corresponding URL is:

```
/job/backend/job/microservices/job/service
```

Butler CLI converts user-friendly paths to Jenkins URLs automatically before making requests.

## Handling parameters

To retrieve parameter definitions for a job, request its properties and inspect `parameterDefinitions`, for example:

```
GET /job/{jobName}/api/json?tree=property[parameterDefinitions[*]]
```

Parameter types commonly encountered:
- StringParameterDefinition
- ChoiceParameterDefinition (with `choices`)
- BooleanParameterDefinition
- PasswordParameterDefinition

## Triggering builds

- For jobs without parameters: `POST /job/{jobName}/build`
- For parameterized jobs: `POST /job/{jobName}/buildWithParameters?PARAM1=value1&PARAM2=value2`

Note: Butler CLI triggers builds via the Jenkins API and then inspects the queue item location header (`Location`) to track the queued build. The client does not automatically poll or wait for build completion unless implemented in a command.

## CSRF crumbs and POST requests

Some Jenkins servers enforce CSRF protection and require a crumb header for POST requests. Butler CLI does not currently implement automatic crumb fetching. If your Jenkins requires crumbs, extend the client to fetch the crumb from `/crumbIssuer/api/json` and include it in subsequent POST requests, e.g. `Jenkins-Crumb: <crumb>`.

## Timeouts and retry behavior

The default HTTP client uses `axios` and thus inherits its timeout and retry behavior (no automatic retries are configured by default). If you need custom timeouts or retry policies, modify `src/utils/jenkinsClient.ts` to pass custom axios options or add an interceptor.

## Error handling

HTTP errors are surfaced by the client and commands should handle common status codes:

- `401` Unauthorized — bad credentials
- `403` Forbidden — permission denied
- `404` Not Found — resource does not exist
- `5xx` — server error

Commands should provide clear user-facing messages and exit non-zero on fatal errors.

## Pagination and large job trees

For very large Jenkins instances, retrieving all jobs recursively can be expensive. Use the `tree=` parameter to limit the fields returned and consider limiting recursion depth.

## Extending the client

Suggested improvements that you may add to `src/utils/jenkinsClient.ts`:

- Crumb support: fetch `/crumbIssuer/api/json` and send crumb headers for POSTs
- Configurable axios options (timeout, proxy, TLS settings)
- Request/response interceptors for structured logging and error normalization
- Optional caching layer for read-only endpoints

## Example requests

### Get top-level jobs

```
GET https://jenkins.example.com/api/json?tree=jobs[name,url,color]
```

### Get job parameters

```
GET https://jenkins.example.com/job/my-job/api/json?tree=property[parameterDefinitions[*]]
```

### Trigger a parameterized build

```
POST https://jenkins.example.com/job/my-job/buildWithParameters?ENV=prod&VERSION=1.2.3
```

### Get console text

```
GET https://jenkins.example.com/job/my-job/42/consoleText
```

## Resources

- Jenkins REST API documentation: https://www.jenkins.io/doc/book/using/remote-access-api/
- Example queries: use `tree=` to reduce payload size and improve performance.
