#!/usr/bin/env python3
import os

# Create simple 1x1 pixel images as base64 encoded data
def create_minimal_image(filename, width=400, height=300, color="#F5E6E8"):
    """Create a minimal SVG placeholder image"""
    svg_content = f'''<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="{color}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#8B2635" text-anchor="middle" dominant-baseline="middle">
    STICKLS
  </text>
</svg>'''
    
    with open(f'assets/{filename}', 'w') as f:
        f.write(svg_content)
    print(f"Created: assets/{filename}")

# Create all essential images
images_to_create = [
    ("hero-desktop.jpg", 1200, 600, "#FAF7F0"),
    ("hero-mobile.jpg", 800, 400, "#FAF7F0"),
    ("menu-preview.jpg", 300, 200, "#E8B4B8"),
    ("collection-classic.jpg", 400, 500, "#F7E7CE"),
    ("collection-trend.jpg", 400, 500, "#E8B4B8"),
    ("collection-occasion.jpg", 400, 500, "#8B2635"),
    ("collection-seasonal.jpg", 400, 500, "#2D5016"),
    ("tutorial-preview.jpg", 600, 400, "#F5E6E8"),
    ("sustainability-visual.jpg", 500, 400, "#2D5016"),
    ("product-rose-gold-main.jpg", 600, 600, "#E8B4B8"),
    ("product-rose-gold-hand.jpg", 600, 600, "#F5E6E8"),
    ("product-rose-gold-close.jpg", 600, 600, "#E8B4B8"),
    ("product-rose-gold-packaging.jpg", 400, 300, "#FAF7F0"),
    ("product-rose-gold-lifestyle.jpg", 600, 400, "#F5E6E8"),
    ("nail-measurement-guide.jpg", 400, 300, "#FAF7F0"),
    ("tutorial-video-thumbnail.jpg", 400, 225, "#F5E6E8"),
]

# Create customer and reviewer images
for i in range(1, 7):
    images_to_create.append((f"customer-{i}.jpg", 250, 250, "#F5E6E8"))
    
for i in range(1, 7):
    images_to_create.append((f"insta-{i}.jpg", 200, 200, "#E8B4B8"))

for i in range(1, 4):
    images_to_create.append((f"reviewer-{i}.jpg", 80, 80, "#F7E7CE"))

# Shape guide images
shapes = ["square", "oval", "almond", "coffin"]
for shape in shapes:
    images_to_create.append((f"shape-{shape}.jpg", 200, 250, "#FFFFFF"))

# Skin tone variations
skin_tones = ["light", "medium", "olive", "deep", "dark"]
for tone in skin_tones:
    images_to_create.append((f"product-rose-gold-{tone}.jpg", 600, 600, "#E8B4B8"))

# What's included items
items = ["nails", "tabs", "glue", "file", "prep", "instructions"]
for item in items:
    images_to_create.append((f"included-{item}.jpg", 100, 100, "#FAF7F0"))

# Related products
products = ["champagne-dreams", "burgundy-passion", "nude-perfection", "midnight-glam"]
for product in products:
    images_to_create.append((f"product-{product}.jpg", 300, 300, "#E8B4B8"))

print("🎨 Creating STICKLS placeholder images...")

# Create all images
for filename, width, height, color in images_to_create:
    create_minimal_image(filename, width, height, color)

print(f"\n✅ Created {len(images_to_create)} placeholder images!")
print("🌐 Your STICKLS website should now load without 404 errors!") 