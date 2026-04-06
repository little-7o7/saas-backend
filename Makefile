.PHONY: up down logs db-shell backend-dev seed backup restore install setup

# ═══════════════════════════════════════════════
#  SETUP (first time)
# ═══════════════════════════════════════════════

install-deps:
	@echo "🍺 Installing PostgreSQL via Homebrew..."
	brew install postgresql@15 redis
	@echo "✅ Done"

up:
	@echo "🚀 Starting PostgreSQL..."
	brew services start postgresql@15
	brew services start redis
	@sleep 2
	@createdb saas_db 2>/dev/null || true
	@createuser saas_user 2>/dev/null || true
	@psql -d saas_db -c "ALTER USER saas_user WITH PASSWORD 'saas_password';" 2>/dev/null || true
	@psql -d saas_db -c "GRANT ALL PRIVILEGES ON DATABASE saas_db TO saas_user;" 2>/dev/null || true
	@echo "✅ PostgreSQL ready at localhost:5432"

down:
	brew services stop postgresql@15
	brew services stop redis
	@echo "⛔ Services stopped"

logs:
	tail -f /usr/local/var/log/postgresql@15.log 2>/dev/null || \
	tail -f /opt/homebrew/var/log/postgresql@15.log 2>/dev/null || \
	echo "Log file not found"

db-shell:
	psql -U saas_user -d saas_db

backend-dev:
	cd backend && npm run start:dev

build:
	cd backend && npm run build

seed:
	cd backend && npm run seed

backup:
	@mkdir -p backups
	pg_dump -U saas_user saas_db > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup saved to backups/"

restore:
	@read -p "Enter backup file path: " FILE; \
	psql -U saas_user -d saas_db < $$FILE
	@echo "✅ Restore complete"

deploy:
	cd backend && npm run build
	pm2 restart saas-backend || pm2 start dist/main.js --name saas-backend
	@echo "🚀 Deployed"

# ═══════════════════════════════════════════════
#  FULL SETUP FROM SCRATCH
# ═══════════════════════════════════════════════
setup:
	@echo "📋 Setting up SaaS project..."
	cp -n .env.example .env 2>/dev/null || true
	cd backend && npm install
	$(MAKE) up
	$(MAKE) seed
	@echo ""
	@echo "🎉 Setup complete!"
	@echo ""
	@echo "  Start backend:  make backend-dev"
	@echo "  DB shell:       make db-shell"
	@echo "  Backup:         make backup"
	@echo ""
