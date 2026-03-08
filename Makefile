.PHONY: backend frontend

backend:
	composer start & sleep 1 && open http://localhost:8000/panel; wait

frontend:
	cd frontend && /opt/homebrew/bin/node node_modules/.bin/vite dev
