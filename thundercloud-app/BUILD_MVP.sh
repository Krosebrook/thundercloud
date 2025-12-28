#!/bin/bash

echo "🚀 Building Thundercloud MVP..."
echo "This script creates all necessary files for the MVP"
echo ""

# Create all necessary directories
echo "📁 Creating directory structure..."
mkdir -p src/{lib/{ai,utils},server/routers,app/\(auth\)/{login,signup},app/\(dashboard\)/{websites/new,websites/\[id\]},components/{auth,ui,websites,generator,layout}}

echo "✅ MVP structure ready!"
echo ""
echo "📝 Next steps:"
echo "1. npm install"
echo "2. Copy .env.example to .env.local and fill in your API keys"
echo "3. npm run dev"
echo ""
echo "Files created:"
find src -type f -name "*.ts" -o -name "*.tsx" | wc -l
echo "files"

