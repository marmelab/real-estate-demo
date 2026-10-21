default: help

E2E_COMPOSE = docker compose -p remix-v3-demo-e2e -f docker-compose.e2e.yml
E2E_URL = ADMIN_URL=http://localhost:4000/admin FRONTEND_URL=http://localhost:4000
E2E_UP = trap '$(E2E_COMPOSE) down -v' EXIT; \
	$(E2E_COMPOSE) up -d --build --wait --wait-timeout 300

help:									## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install:								## Install dependencies
	@pnpm install
	@pnpm exec playwright install

lint:
	@pnpm lint:apply
	@pnpm fmt:apply

STAGED = git --no-pager diff --cached --name-only --diff-filter=ACMR

lint-staged:
	@($(STAGED) | grep -E '\.(ts|tsx)$$' | xargs -r pnpm oxlint --fix)
	@($(STAGED) | grep -E '\.(js|json|ts|tsx|md)$$' | xargs -r pnpm oxfmt)

test:
	@pnpm test

test-watch:
	@pnpm test:watch

generate: 	## Recompile the route trees
	@pnpm -r --parallel run generate-routes
