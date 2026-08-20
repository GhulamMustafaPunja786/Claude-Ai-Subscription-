SHELL := /bin/bash

# Add LITE=1 to any target to use the 1 GB / SQLite stack.
# e.g. make LITE=1 up
COMPOSE_FILE := docker-compose.yml
ifdef LITE
COMPOSE_FILE := docker-compose.sqlite.yml
endif
COMPOSE := docker compose -f $(COMPOSE_FILE)

.DEFAULT_GOAL := help
.PHONY: help env up up-caddy up-tunnel down restart logs ps shell import export \
        activate backup restore update health smoke validate stats clean

help: ## Show this help
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[1m%-12s\033[0m %s\n", $$1, $$2}'
	@echo
	@echo "  Append LITE=1 to use the SQLite stack for 1 GB machines."

env: ## Create .env with freshly generated secrets
	@./scripts/gen-env.sh

up: env ## Start n8n (editor on 127.0.0.1:5678)
	$(COMPOSE) up -d
	@echo "n8n is starting. Run 'make health' in a minute."

up-caddy: env ## Start n8n behind Caddy with automatic HTTPS
	@./scripts/preflight.sh caddy
	$(COMPOSE) --profile caddy up -d

up-tunnel: env ## Start n8n behind a Cloudflare Tunnel
	@./scripts/preflight.sh tunnel
	$(COMPOSE) --profile tunnel up -d

down: ## Stop everything (data volumes are kept)
	$(COMPOSE) --profile caddy --profile tunnel down

restart: ## Restart the n8n container
	$(COMPOSE) restart n8n

logs: ## Follow n8n logs
	$(COMPOSE) logs -f --tail=100 n8n

ps: ## Show container status
	$(COMPOSE) ps

shell: ## Open a shell inside the n8n container
	$(COMPOSE) exec n8n sh

import: ## Import every workflow from ./workflows (inactive)
	@./scripts/import-workflows.sh

export: ## Export workflows and credentials into ./backups
	@./scripts/export-workflows.sh

activate: ## Activate a workflow by id: make activate ID=abc123
	@./scripts/activate-workflow.sh $(ID)

backup: ## Back up database + workflows into ./backups
	@./scripts/backup.sh

restore: ## Restore from a backup: make restore DIR=backups/2026-08-20T12-00-00
	@./scripts/restore.sh $(DIR)

update: ## Back up, pull the pinned image, recreate containers
	@./scripts/update.sh

health: ## Check that n8n answers /healthz and report resource use
	@./scripts/health-check.sh

smoke: ## End-to-end test: boot, import, fire a webhook, assert the response
	@./scripts/smoke-test.sh

validate: ## Lint compose files and workflow JSON without starting anything
	@./scripts/validate.sh

stats: ## Live CPU/memory use per container
	docker stats --no-stream $$($(COMPOSE) ps -q)

clean: ## Stop and DELETE all data volumes (irreversible)
	@read -p "This deletes all workflows, credentials and history. Type DELETE to confirm: " c; \
	[ "$$c" = "DELETE" ] || { echo "Aborted."; exit 1; }
	$(COMPOSE) --profile caddy --profile tunnel down -v
