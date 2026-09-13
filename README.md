# World Fine Bio Chemicals (WFBC) — Web Application

> **Awwwards-level, next-generation web portal for World Fine Bio Chemicals, Ahmedabad.**  
> Formulated and manufactured for agriculture, industrial chemistry, laboratory benches, and food processing.

---

## 🌟 Overview & Key Features

This repository contains the complete web application for **World Fine Bio Chemicals (WFBC)**. Built with high-end editorial typography, smooth kinetic motion, and responsive luxury aesthetics.

### Key Highlights
- **Stunning Aesthetics**: Harmonious light and dark theme design matching 2026 digital standards.
- **Dynamic Product Catalog (`products.html`)**: Filter products by category (*Agro Chemicals*, *PGR*, *Fertilizers*, *Industrial*, *Lab*, *Food Grade*), search, sort, and view real-time counts.
- **Interactive Product Detail Template (`product-detail.html`)**: Dynamic rendering for individual product lines with technical specs, application icons, COA details, and enquiry drawer.
- **Field & Farmers Interactive Gallery (`index.html`)**: Real-world documentary photo showcase highlighting on-ground agronomist consultations, high-yield farmer partnerships, laboratory quality control, and factory dispatch.
- **Dedicated Contact & Commercial Desk (`contact.html`)**: Rapid quotation request form, direct line to **Abhishek Bhanderi**, and updated factory & registered office location.
- **Factory Address**: `1st Floor, Inca Complex, Above Sawan Hotel, Sanand Chokdi, Sarkhej, Ahmedabad`.

---

## 🛠️ Technology Stack

- **Markup & Styling**: HTML5, Vanilla CSS3 (Custom Tokens, CSS Grid, Flexbox, Glassmorphic overlays)
- **Logic & Interactivity**: ES6+ JavaScript
- **Animations & Smooth Motion**:
  - [Lenis](https://github.com/darkroomoffilms/lenis) for smooth inertia scrolling
  - [GSAP](https://greensock.com/gsap/) & [ScrollTrigger](https://greensock.com/scrolltrigger/) for scroll-driven reveals
  - [Three.js](https://threejs.org/) for WebGL ambient background particles

---

## 📁 Project Structure

```
├── index.html              # Main Landing Page & Field/Farmers Showcase
├── products.html           # Full Product Catalog Page with Filters & Search
├── product-detail.html     # Dynamic Product Specifications & Detail Template
├── contact.html            # Commercial Contact Desk & Factory Location
├── assets/
│   ├── css/
│   │   ├── style.css       # Core Design Tokens, Typography, Nav & Footer
│   │   ├── products.css    # Catalog Grid & Filter Rail Styles
│   │   ├── product-detail.css # Product Detail Template & Drawer Styles
│   │   └── contact.css     # Contact Page & Map Card Styles
│   ├── js/
│   │   ├── script.js       # Main Page Logic, Three.js & Gallery Slideshow
│   │   ├── products-data.js# Centralized Chemical Product Catalog Database
│   │   ├── products.js     # Catalog Filtering, Sorting & Search Engine
│   │   ├── product-detail.js# Dynamic Template Engine & Spec Renderer
│   │   └── contact.js      # Contact Form Validation & Location Card Logic
│   └── images/             # High-Resolution Photographs, Logo & Assets
├── .gitignore              # Git Ignore Configuration
└── README.md               # Project Documentation
```

---

## 🚀 How to Run Locally

Since this project uses pure vanilla web technologies, no heavy build steps (`npm build`) are required!

### Option 1: Direct File Opening
Double-click `index.html` to open it in Google Chrome, Microsoft Edge, Safari, or Firefox.

### Option 2: Local HTTP Server (Recommended)
Running a local server ensures smooth loading of local assets:

- **Using Python 3**:
  ```bash
  python -m http.server 8000
  ```
  Then open `http://localhost:8000` in your browser.

- **Using Node.js (`npx serve`)**:
  ```bash
  npx serve .
  ```

- **Using VS Code Live Server**:
  Right-click `index.html` in VS Code and click **Open with Live Server**.

---

## 🌐 How to Rebuild & Host on GitHub Pages

You can publish this website live on the web for free using **GitHub Pages**:

1. **Push Changes to GitHub**:
   Ensure all files are committed and pushed to your GitHub repository:
   ```bash
   git add .
   git commit -m "Update WFBC website"
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub: `https://github.com/Frenil0393/World-fine`
   - Click on the **Settings** tab.
   - On the left sidebar, click **Pages** (under Code and automation).
   - Under **Build and deployment** &rarr; **Source**, choose **Deploy from a branch**.
   - Select Branch: `main`, Folder: `/ (root)`.
   - Click **Save**.

3. **View Your Live Website**:
   GitHub will build and deploy your site automatically in ~1-2 minutes at:
   `https://frenil0393.github.io/World-fine/`

---

## 📞 Commercial Contact

**World Fine Bio Chemicals**  
- **Founder & Commercial Lead**: Abhishek Bhanderi  
- **Direct Phone**: [+91 79 2287 4567](tel:+917922874567)  
- **Factory & Registered Office**: 1st Floor, Inca Complex, Above Sawan Hotel, Sanand Chokdi, Sarkhej, Ahmedabad, Gujarat, India  
- **Email**: `info@worldfinebiochem.com`
