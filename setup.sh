#!/bin/bash

# Live Shopping Platform - Setup and Run Script
# This script helps you set up and run the application using Docker Compose

set -e

echo "🛍️  Live Shopping Platform - Setup"
echo "===================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  No backend/.env file found. Creating from .env.example..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
    echo "⚠️  Remember to add your Stripe API keys to backend/.env"
    echo ""
fi

echo "🐳 Starting Docker containers..."
echo ""

# Start services
docker compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "📊 Seeding database with test data..."
docker compose exec -T backend npm run seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo ""
echo "👤 Test accounts (password: password123):"
echo "   Admin:    admin@example.com"
echo "   Seller 1: seller1@example.com"
echo "   Seller 2: seller2@example.com"
echo "   User 1:   user1@example.com"
echo "   User 2:   user2@example.com"
echo ""
echo "📝 Useful commands:"
echo "   View logs:     docker compose logs -f"
echo "   Stop services: docker compose down"
echo "   Restart:       docker compose restart"
echo ""
echo "Happy shopping! 🛒"
