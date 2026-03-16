#!/usr/bin/env python3
import os
import sys
import argparse
from pathlib import Path

try:
    from PIL import Image, ImageOps # type: ignore
except ImportError:
    print("Pillow library is missing. Please install it using: pip install Pillow")
    sys.exit(1)

# Default configuration defaults
SUPPORTED_FORMATS = {'.jpg', '.jpeg', '.png'}
DEFAULT_QUALITY = 80
DEFAULT_MAX_WIDTH = 1920

# Optional responsive sizes (width)
RESPONSIVE_SIZES = [480, 768, 1200]

def optimize_image(input_path, output_base, base_input_dir, max_width, quality, responsive):
    """
    Optimizes a single image: resizes, converts to WebP, and optionally generates responsive sizes.
    """
    try:
        # Calculate relative path to maintain directory structure
        rel_path = os.path.relpath(input_path, base_input_dir)
        
        # Create output directory
        out_dir = os.path.join(output_base, os.path.dirname(rel_path))
        os.makedirs(out_dir, exist_ok=True)
        
        # Base filename without extension
        filename = Path(input_path).stem
        
        # Open Image
        with Image.open(input_path) as img:
            # Auto-rotate image according to EXIF data before processing
            img = ImageOps.exif_transpose(img)
            # Preserve transparency for PNGs. Convert other formats appropriately.
            if img.mode in ("RGBA", "P", "LA"):
                img = img.convert("RGBA")
            else:
                img = img.convert("RGB")
            
            # Original dimensions
            orig_width, orig_height = img.size
            
            # Process main optimized image
            main_img = img.copy()
            if orig_width > max_width:
                ratio = max_width / orig_width
                new_height = int(orig_height * ratio)
                main_img = main_img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save main image as WebP
            main_output_path = os.path.join(out_dir, f"{filename}.webp")
            main_img.save(main_output_path, 'WEBP', quality=quality, method=6)
            print(f"✅ Optimized: {rel_path} -> {os.path.basename(main_output_path)}")
            
            # Generate responsive sizes if requested
            if responsive:
                for size in RESPONSIVE_SIZES:
                    if orig_width > size:
                        ratio = size / orig_width
                        new_height = int(orig_height * ratio)
                        res_img = img.resize((size, new_height), Image.Resampling.LANCZOS)
                        res_output_path = os.path.join(out_dir, f"{filename}-{size}w.webp")
                        res_img.save(res_output_path, 'WEBP', quality=quality, method=6)
                        print(f"   ↳ Responsive size generated: {size}w")

    except Exception as e:
        print(f"❌ Error processing {input_path}: {e}")

def main():
    parser = argparse.ArgumentParser(description="Optimize images for the web (Convert to WebP, Resize, Compress).")
    parser.add_argument("input_dir", help="Directory containing original images")
    parser.add_argument("output_dir", help="Directory to save optimized images")
    parser.add_argument("--max-width", type=int, default=DEFAULT_MAX_WIDTH, help=f"Max width for the base image (default: {DEFAULT_MAX_WIDTH})")
    parser.add_argument("--quality", type=int, default=DEFAULT_QUALITY, help=f"Compression quality (0-100, default: {DEFAULT_QUALITY})")
    parser.add_argument("--responsive", action="store_true", help="Generate multiple responsive image sizes (480w, 768w, 1200w)")
    
    args = parser.parse_args()
    
    input_dir: str = str(os.path.abspath(str(args.input_dir)))
    output_dir: str = str(os.path.abspath(str(args.output_dir)))
    
    if not os.path.isdir(input_dir):
        print(f"Error: Input directory '{input_dir}' does not exist.")
        return
        
    print(f"Scanning '{input_dir}' for images...")
    print("-" * 40)
    
    image_count: int = 0
    # Traverse directory
    for root, _, files in os.walk(str(input_dir)):
        for file in files:
            ext = str(os.path.splitext(file)[1]).lower()
            if ext in SUPPORTED_FORMATS:
                input_path = os.path.join(str(root), str(file))
                optimize_image(input_path, output_dir, input_dir, args.max_width, args.quality, args.responsive)
                image_count += 1 # type: ignore
                
    print("-" * 40)
    print(f"Processing complete! {image_count} images optimized.")
    print(f"Optimized images are saved in: {output_dir}")

if __name__ == "__main__":
    main()
