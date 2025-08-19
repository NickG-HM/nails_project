#!/usr/bin/env python3
"""
STICKLS Image Generator
Creates placeholder images with brand-appropriate styling
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Brand colors
COLORS = {
    'cream': '#FAF7F0',
    'blush': '#F5E6E8', 
    'rose_gold': '#E8B4B8',
    'champagne': '#F7E7CE',
    'deep_burgundy': '#8B2635',
    'forest_green': '#2D5016',
    'warm_gray': '#8B7B7A',
    'white': '#FFFFFF'
}

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_gradient_image(width, height, color1, color2, filename):
    """Create a gradient background image"""
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)
    
    color1_rgb = hex_to_rgb(color1)
    color2_rgb = hex_to_rgb(color2)
    
    for y in range(height):
        ratio = y / height
        r = int(color1_rgb[0] * (1 - ratio) + color2_rgb[0] * ratio)
        g = int(color1_rgb[1] * (1 - ratio) + color2_rgb[1] * ratio)
        b = int(color1_rgb[2] * (1 - ratio) + color2_rgb[2] * ratio)
        
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    image.save(f'assets/{filename}')
    print(f"Created: assets/{filename}")

def create_nail_product_image(width, height, nail_color, filename, text="STICKLS"):
    """Create a product image showing nails"""
    image = Image.new('RGB', (width, height), hex_to_rgb(COLORS['cream']))
    draw = ImageDraw.Draw(image)
    
    # Draw hand silhouette
    center_x, center_y = width // 2, height // 2
    
    # Draw 5 nails
    nail_positions = [
        (center_x - 80, center_y - 20),  # thumb
        (center_x - 40, center_y - 40),  # index
        (center_x, center_y - 45),       # middle
        (center_x + 40, center_y - 35),  # ring
        (center_x + 70, center_y - 15)   # pinky
    ]
    
    nail_color_rgb = hex_to_rgb(nail_color)
    
    for x, y in nail_positions:
        # Draw oval nails
        draw.ellipse([x-8, y-15, x+8, y+15], fill=nail_color_rgb, outline=hex_to_rgb(COLORS['deep_burgundy']))
    
    # Add brand text
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_x = (width - text_width) // 2
    text_y = height - 50
    
    draw.text((text_x, text_y), text, fill=hex_to_rgb(COLORS['deep_burgundy']), font=font)
    
    image.save(f'assets/{filename}')
    print(f"Created: assets/{filename}")

def create_lifestyle_image(width, height, bg_color, filename, text=""):
    """Create lifestyle/collection images"""
    image = Image.new('RGB', (width, height), hex_to_rgb(bg_color))
    draw = ImageDraw.Draw(image)
    
    # Add subtle pattern
    for i in range(0, width, 50):
        for j in range(0, height, 50):
            if (i + j) % 100 == 0:
                draw.ellipse([i, j, i+10, j+10], fill=hex_to_rgb(COLORS['white']), outline=None)
    
    # Add text if provided
    if text:
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 36)
        except:
            font = ImageFont.load_default()
        
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_x = (width - text_width) // 2
        text_y = height // 2
        
        # Add semi-transparent background for text
        draw.rectangle([text_x-20, text_y-20, text_x+text_width+20, text_y+60], 
                      fill=(*hex_to_rgb(COLORS['white']), 200))
        draw.text((text_x, text_y), text, fill=hex_to_rgb(COLORS['deep_burgundy']), font=font)
    
    image.save(f'assets/{filename}')
    print(f"Created: assets/{filename}")

def create_customer_image(width, height, filename):
    """Create customer review images"""
    image = Image.new('RGB', (width, height), hex_to_rgb(COLORS['blush']))
    draw = ImageDraw.Draw(image)
    
    # Draw simple hand with nails
    center_x, center_y = width // 2, height // 2
    
    # Hand shape
    draw.ellipse([center_x-40, center_y-20, center_x+40, center_y+60], 
                fill=hex_to_rgb(COLORS['champagne']))
    
    # Fingers with nails
    for i, (x_offset, y_offset) in enumerate([(-25, -15), (-8, -25), (8, -25), (25, -15)]):
        x, y = center_x + x_offset, center_y + y_offset
        # Finger
        draw.ellipse([x-6, y-20, x+6, y+10], fill=hex_to_rgb(COLORS['champagne']))
        # Nail
        draw.ellipse([x-4, y-18, x+4, y-8], fill=hex_to_rgb(COLORS['rose_gold']))
    
    image.save(f'assets/{filename}')
    print(f"Created: assets/{filename}")

def create_shape_guide_image(width, height, filename, shape_name):
    """Create nail shape guide images"""
    image = Image.new('RGB', (width, height), hex_to_rgb(COLORS['white']))
    draw = ImageDraw.Draw(image)
    
    center_x, center_y = width // 2, height // 2
    
    # Draw different nail shapes
    if shape_name == "square":
        draw.rectangle([center_x-20, center_y-30, center_x+20, center_y+30], 
                      fill=hex_to_rgb(COLORS['rose_gold']))
    elif shape_name == "oval":
        draw.ellipse([center_x-20, center_y-30, center_x+20, center_y+30], 
                    fill=hex_to_rgb(COLORS['rose_gold']))
    elif shape_name == "almond":
        # Almond shape (pointed oval)
        points = [(center_x, center_y-30), (center_x+15, center_y-15), 
                 (center_x+20, center_y+15), (center_x, center_y+30),
                 (center_x-20, center_y+15), (center_x-15, center_y-15)]
        draw.polygon(points, fill=hex_to_rgb(COLORS['rose_gold']))
    elif shape_name == "coffin":
        # Coffin shape
        points = [(center_x, center_y-30), (center_x+12, center_y-15), 
                 (center_x+12, center_y+15), (center_x+8, center_y+30),
                 (center_x-8, center_y+30), (center_x-12, center_y+15),
                 (center_x-12, center_y-15)]
        draw.polygon(points, fill=hex_to_rgb(COLORS['rose_gold']))
    
    # Add shape name
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 18)
    except:
        font = ImageFont.load_default()
    
    text_bbox = draw.textbbox((0, 0), shape_name.title(), font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_x = (width - text_width) // 2
    
    draw.text((text_x, height-30), shape_name.title(), 
             fill=hex_to_rgb(COLORS['deep_burgundy']), font=font)
    
    image.save(f'assets/{filename}')
    print(f"Created: assets/{filename}")

def main():
    """Generate all placeholder images"""
    
    print("🎨 Creating STICKLS placeholder images...")
    
    # Ensure assets directory exists
    os.makedirs('assets', exist_ok=True)
    
    # Hero images
    create_gradient_image(1200, 800, COLORS['cream'], COLORS['blush'], 'hero-desktop.jpg')
    create_gradient_image(800, 600, COLORS['cream'], COLORS['blush'], 'hero-mobile.jpg')
    
    # Menu preview
    create_nail_product_image(300, 200, COLORS['rose_gold'], 'menu-preview.jpg', "New Collection")
    
    # Collection images
    create_lifestyle_image(400, 500, COLORS['champagne'], 'collection-classic.jpg', 'Classic')
    create_lifestyle_image(400, 500, COLORS['rose_gold'], 'collection-trend.jpg', 'Trending')
    create_lifestyle_image(400, 500, COLORS['deep_burgundy'], 'collection-occasion.jpg', 'Occasion')
    create_lifestyle_image(400, 500, COLORS['forest_green'], 'collection-seasonal.jpg', 'Seasonal')
    
    # Tutorial/demo images
    create_nail_product_image(600, 400, COLORS['rose_gold'], 'tutorial-preview.jpg', 'Tutorial')
    
    # Sustainability image
    create_lifestyle_image(500, 400, COLORS['forest_green'], 'sustainability-visual.jpg', 'ECO')
    
    # Customer gallery images
    for i in range(1, 7):
        create_customer_image(250, 250, f'customer-{i}.jpg')
    
    # Instagram feed images
    for i in range(1, 7):
        create_customer_image(200, 200, f'insta-{i}.jpg')
    
    # Reviewer avatars
    for i in range(1, 4):
        create_customer_image(80, 80, f'reviewer-{i}.jpg')
    
    # Shape guide images
    shapes = ['square', 'oval', 'almond', 'coffin']
    for shape in shapes:
        create_shape_guide_image(200, 250, f'shape-{shape}.jpg', shape)
    
    # Nail measurement guide
    create_lifestyle_image(400, 300, COLORS['cream'], 'nail-measurement-guide.jpg', 'Size Guide')
    
    # Product images for Rose Gold Elegance
    create_nail_product_image(600, 600, COLORS['rose_gold'], 'product-rose-gold-main.jpg')
    create_nail_product_image(600, 600, COLORS['rose_gold'], 'product-rose-gold-hand.jpg', 'On Hand')
    create_nail_product_image(600, 600, COLORS['rose_gold'], 'product-rose-gold-close.jpg', 'Close Up')
    create_nail_product_image(400, 300, COLORS['champagne'], 'product-rose-gold-packaging.jpg', 'Packaging')
    create_lifestyle_image(600, 400, COLORS['cream'], 'product-rose-gold-lifestyle.jpg', 'Lifestyle')
    
    # Skin tone variations
    skin_tones = {
        'light': '#F4D1B0',
        'medium': '#D4A574', 
        'olive': '#C19B5A',
        'deep': '#8B5A42',
        'dark': '#5D3A29'
    }
    
    for tone, color in skin_tones.items():
        create_nail_product_image(600, 600, color, f'product-rose-gold-{tone}.jpg', f'{tone.title()} Skin')
    
    # What's included images
    items = ['nails', 'tabs', 'glue', 'file', 'prep', 'instructions']
    for item in items:
        create_lifestyle_image(100, 100, COLORS['cream'], f'included-{item}.jpg', item.title())
    
    # Tutorial video thumbnail
    create_lifestyle_image(400, 225, COLORS['blush'], 'tutorial-video-thumbnail.jpg', '▶ Tutorial')
    
    # Related product images
    products = [
        ('champagne', 'Champagne Dreams'),
        ('deep_burgundy', 'Burgundy Passion'), 
        ('champagne', 'Nude Perfection'),
        ('deep_burgundy', 'Midnight Glam')
    ]
    
    for color_key, name in products:
        color = COLORS[color_key]
        filename = name.lower().replace(' ', '-')
        create_nail_product_image(300, 300, color, f'product-{filename}.jpg', name)
    
    print(f"\n✅ Successfully created all placeholder images!")
    print(f"📁 Images saved to: assets/")
    print(f"🌐 Your STICKLS website is now visually complete!")

if __name__ == "__main__":
    main() 