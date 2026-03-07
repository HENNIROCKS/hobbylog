.PHONY: backend frontend

backend:
	composer start

frontend:
	cd frontend && /opt/homebrew/bin/node node_modules/.bin/vite dev
