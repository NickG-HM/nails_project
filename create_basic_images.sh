#!/bin/bash

# STICKLS Basic Image Generator
echo "🎨 Creating basic placeholder images for STICKLS..."

# Create assets directory
mkdir -p assets

# Brand colors
CREAM="FAF7F0"
BLUSH="F5E6E8"
ROSE_GOLD="E8B4B8"
BURGUNDY="8B2635"
GREEN="2D5016"

# Function to create a placeholder using curl (online service)
create_placeholder() {
    local width=$1
    local height=$2
    local bg_color=$3
    local text_color=$4
    local text=$5
    local filename=$6
    
    # Use placeholder.com service
    local url="https://via.placeholder.com/${width}x${height}/${bg_color}/${text_color}?text=${text}"
    
    echo "Creating: ${filename}"
    curl -s "$url" -o "assets/${filename}" || echo "Failed to create ${filename}"
}

# Hero images
create_placeholder 1200 600 "$CREAM" "$BURGUNDY" "STICKLS+Hero" "hero-desktop.jpg"
create_placeholder 800 400 "$CREAM" "$BURGUNDY" "STICKLS+Mobile" "hero-mobile.jpg"

# Menu preview
create_placeholder 300 200 "$ROSE_GOLD" "$BURGUNDY" "New+Collection" "menu-preview.jpg"

# Collection images
create_placeholder 400 500 "$CREAM" "$BURGUNDY" "Classic" "collection-classic.jpg"
create_placeholder 400 500 "$ROSE_GOLD" "FFFFFF" "Trending" "collection-trend.jpg"
create_placeholder 400 500 "$BURGUNDY" "FFFFFF" "Special+Occasion" "collection-occasion.jpg"
create_placeholder 400 500 "$GREEN" "FFFFFF" "Seasonal" "collection-seasonal.jpg"

# Tutorial and sustainability
create_placeholder 600 400 "$BLUSH" "$BURGUNDY" "Tutorial" "tutorial-preview.jpg"
create_placeholder 500 400 "$GREEN" "FFFFFF" "Eco+Friendly" "sustainability-visual.jpg"

# Customer gallery (6 images)
for i in {1..6}; do
    create_placeholder 250 250 "$BLUSH" "$BURGUNDY" "Customer+${i}" "customer-${i}.jpg"
done

# Instagram feed (6 images)
for i in {1..6}; do
    create_placeholder 200 200 "$ROSE_GOLD" "FFFFFF" "Insta+${i}" "insta-${i}.jpg"
done

# Reviewer avatars (3 images)
for i in {1..3}; do
    create_placeholder 80 80 "$CREAM" "$BURGUNDY" "User+${i}" "reviewer-${i}.jpg"
done

# Shape guide images
create_placeholder 200 250 "FFFFFF" "$BURGUNDY" "Square" "shape-square.jpg"
create_placeholder 200 250 "FFFFFF" "$BURGUNDY" "Oval" "shape-oval.jpg"
create_placeholder 200 250 "FFFFFF" "$BURGUNDY" "Almond" "shape-almond.jpg"
create_placeholder 200 250 "FFFFFF" "$BURGUNDY" "Coffin" "shape-coffin.jpg"

# Nail measurement guide
create_placeholder 400 300 "$CREAM" "$BURGUNDY" "Size+Guide" "nail-measurement-guide.jpg"

# Product images - Rose Gold Elegance
create_placeholder 600 600 "$CREAM" "$BURGUNDY" "Rose+Gold+Main" "product-rose-gold-main.jpg"
create_placeholder 600 600 "$BLUSH" "$BURGUNDY" "On+Hand" "product-rose-gold-hand.jpg"
create_placeholder 600 600 "$ROSE_GOLD" "FFFFFF" "Close+Up" "product-rose-gold-close.jpg"
create_placeholder 400 300 "$CREAM" "$BURGUNDY" "Packaging" "product-rose-gold-packaging.jpg"
create_placeholder 600 400 "$BLUSH" "$BURGUNDY" "Lifestyle" "product-rose-gold-lifestyle.jpg"

# Skin tone variations
create_placeholder 600 600 "F4D1B0" "$BURGUNDY" "Light+Skin" "product-rose-gold-light.jpg"
create_placeholder 600 600 "D4A574" "$BURGUNDY" "Medium+Skin" "product-rose-gold-medium.jpg"
create_placeholder 600 600 "C19B5A" "$BURGUNDY" "Olive+Skin" "product-rose-gold-olive.jpg"
create_placeholder 600 600 "8B5A42" "FFFFFF" "Deep+Skin" "product-rose-gold-deep.jpg"
create_placeholder 600 600 "5D3A29" "FFFFFF" "Dark+Skin" "product-rose-gold-dark.jpg"

# What's included images
items=("nails" "tabs" "glue" "file" "prep" "instructions")
for item in "${items[@]}"; do
    create_placeholder 100 100 "$CREAM" "$BURGUNDY" "${item^}" "included-${item}.jpg"
done

# Tutorial video thumbnail
create_placeholder 400 225 "$BLUSH" "$BURGUNDY" "Tutorial+Video" "tutorial-video-thumbnail.jpg"

# Related product images
create_placeholder 300 300 "$CREAM" "$BURGUNDY" "Champagne+Dreams" "product-champagne-dreams.jpg"
create_placeholder 300 300 "$BURGUNDY" "FFFFFF" "Burgundy+Passion" "product-burgundy-passion.jpg"
create_placeholder 300 300 "$BLUSH" "$BURGUNDY" "Nude+Perfection" "product-nude-perfection.jpg"
create_placeholder 300 300 "000000" "FFFFFF" "Midnight+Glam" "product-midnight-glam.jpg"

echo ""
echo "✅ Basic placeholder images created!"
echo "📁 Check the assets/ folder"
echo "🌐 Your website should now display without 404 errors"

# List created files
echo ""
echo "📋 Created files:"
ls -la assets/ | grep -E '\.(jpg|png|svg)$' | wc -l | xargs echo "Total images:" 