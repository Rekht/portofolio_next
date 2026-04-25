-- =============================================
-- Portfolio Supabase Migration
-- Run this entire script in Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS about (
  id int PRIMARY KEY DEFAULT 1,
  description text NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id int PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  "detailedDescription" text,
  image text,
  image_thumb text,
  url text,
  tags jsonb DEFAULT '[]'::jsonb,
  features jsonb DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS certifications (
  id int PRIMARY KEY,
  title text NOT NULL,
  title_en text,
  issuer text NOT NULL,
  date text,
  created_at text,
  image text,
  url text,
  "isEnglish" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS achievements (
  id int PRIMARY KEY,
  title text NOT NULL,
  organization text,
  year text,
  description text,
  certificate text,
  "hasImage" boolean DEFAULT false,
  "certificateImage" text,
  "documentationImage" text
);

CREATE TABLE IF NOT EXISTS education (
  id int PRIMARY KEY,
  degree text NOT NULL,
  institution text,
  period text,
  description text,
  gpa text
);

CREATE TABLE IF NOT EXISTS experience (
  id int PRIMARY KEY,
  company text NOT NULL,
  position text,
  duration text,
  location text,
  description jsonb DEFAULT '[]'::jsonb,
  technologies jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS organizations (
  id int PRIMARY KEY,
  title text NOT NULL,
  position text,
  period text,
  description jsonb DEFAULT '[]'::jsonb,
  image jsonb DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS skills (
  id text PRIMARY KEY,
  title text NOT NULL,
  color text,
  technologies jsonb DEFAULT '[]'::jsonb
);

-- =============================================
-- INSERT DATA
-- =============================================

INSERT INTO about (id, description) VALUES (1, 'Hello, My name''s Restu, I hold a bachelor’s degree in Mathematics with a solid foundation in data analysis, machine learning, and AI implementation. I have experience managing projects involving data preprocessing, model development, hyperparameter tuning, performance evaluation, and requirement analysis. Skilled in statistical methods and programming, with a strong interest in applying data-driven approaches to solving problems.') ON CONFLICT (id) DO UPDATE SET description = EXCLUDED.description;

INSERT INTO projects (id, title, description, "detailedDescription", image, image_thumb, url, tags, features)
VALUES (1, 'Tea Leaf Disease Detection System', 'A tea leaf disease detection system using a deep learning approach with transfer learning on the EfficientNetV2-S architecture.', 'This project is part of my undergraduate thesis. 

This project implements an advanced machine learning system to detect and classify diseases in tea plants using a deep learning approach. The system employs transfer learning on the EfficientNetV2-S architecture, combined with a convolutional neural network (CNN), to identify various types of tea leaf diseases with a testing accuracy of 98.33% and a training accuracy of 98.59%.

The image preprocessing process aims to improve the quality of the tea leaf images for optimal feature extraction, adapt to various lighting conditions, and normalize the input data before training. I also applied data augmentation techniques to enhance the model''s generalization to image variations. The CNN architecture used has undergone experimental evaluations with various configurations to achieve a balanced model in terms of accuracy and inference speed, making it effective for field conditions.

I also used Grad-CAM to visualize the important areas in the image that the model focuses on during decision-making. In addition, inference time testing was conducted using a Ryzen 5 5600 CPU and an RTX 3070 GPU to compare the efficiency of this model with other CNN architectures.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/tea-leaf-project-thumb.png', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/tea-leaf-project.png', 'https://github.com/Rekht/tea_leaf_disease', '["Python","CNN","Transfer Learning","Hyperparameter Tunning","EfficientNetV2","TensorFlow","Grad-CAM"]'::jsonb, '["Achieved a testing accuracy of 98.33% and training accuracy of 98.59%","Capable of identifying partial leaf images under various lighting conditions","Classifies 6 common types of tea plant diseases","Uses transfer learning with the EfficientNetV2-S architecture","Data augmentation applied to improve model generalization","Grad-CAM used for model interpretability","Inference time evaluation performed on Ryzen 5 5600 CPU and RTX 3070 GPU compared to other CNN models"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "detailedDescription"=EXCLUDED."detailedDescription", image=EXCLUDED.image, image_thumb=EXCLUDED.image_thumb, url=EXCLUDED.url, tags=EXCLUDED.tags, features=EXCLUDED.features;
INSERT INTO projects (id, title, description, "detailedDescription", image, image_thumb, url, tags, features)
VALUES (2, 'Land Use Land Cover Classification Website', 'Using Google Earth Engine and 1D CNN for accurate and simplified land cover classification.', 'This project is my internship report.

This web-based platform performs one-dimensional land use and land cover (LULC) classification using satellite imagery from Sentinel-2 and a 1D convolutional neural network (CNN). It is designed as a lightweight application focused on classification tasks rather than interactive exploration.

The classification model was trained on thousands of labeled samples to recognize spectral patterns across four major land cover classes: Built-up, Water, Plantation forest, and Herbaceous. By leveraging Sentinel-2’s multi-spectral data, the model achieved a classification accuracy of 90%.

The website features a minimal interface for displaying classification outputs. It does not include region selection, algorithm switching, or time-series analysis components, making it suitable for evaluating classification performance with a simple deployment.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/lulc-project.png', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/lulc-project-thumb.png', 'https://github.com/Rekht/LULC-using-GEE-and-CNN', '["GEE","Python","JavaScript","React","CNN","TensorFlow","Remote Sensing","Sentinel-2"]'::jsonb, '["Uses Sentinel-2 satellite imagery","1D CNN-based land cover classification","Achieved 90% classification accuracy","Four classes: Built-up, Water, Plantation forest, Herbaceous","Simple web interface for output display"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "detailedDescription"=EXCLUDED."detailedDescription", image=EXCLUDED.image, image_thumb=EXCLUDED.image_thumb, url=EXCLUDED.url, tags=EXCLUDED.tags, features=EXCLUDED.features;
INSERT INTO projects (id, title, description, "detailedDescription", image, image_thumb, url, tags, features)
VALUES (3, 'Unsupervised Bank Transaction Fraud Detection System', 'This project is an independent project.

Unsupervised machine learning solution identifying fraudulent transactions with 2.35% anomaly rate using behavioral pattern analysis and geospatial verification', 'This project implements an unsupervised fraud detection system for banking transactions with the following key findings:

**Critical Insights**:
1. Impossible Travel Detection
- Identified 25 transactions with physically impossible velocities (>800km/h)
- Geographic anomalies represented 42.4% of high-confidence fraud cases

2. Transaction Pattern Analysis
- Anomalous transactions averaged $623.37 (115% higher than normal transactions)
- 68% of high-value anomalies (>$1000) involved multiple devices

3. Temporal Behavior Patterns
- Highest anomaly concentration at 18:00 (3.45% anomaly rate)
- Tuesday anomalies occurred 2.93% more frequently than weekly average

**Technical Implementation**:
- Processed 2,512 real-world transactions with 31 engineered features
- Ensemble of 7 unsupervised models (Isolation Forest, OCSVM, LOF, Mahalanobis, HBOS, GMM, k-NN)
- Domain validation showed 74.58% of detected anomalies matched actual fraud criteria
- Key feature contributions:
  • Account Transaction Velocity (10.03% impact)
  • Location Velocity (7.76% impact)
  • Amount-to-Average Ratio (6.02% impact)', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/anomaly-thumb.png', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/anomaly.png', 'https://github.com/Rekht/Unsupervised-Anomaly-Transaction', '["Unsupervised Learning","Anomaly Detection","Financial Fraud","Machine Learning","Python","Scikit-learn"]'::jsonb, '["Label-free detection (requires no pre-classified fraud data)","Velocity-based fraud identification (impossible travel scenarios)","Behavioral fingerprinting of accounts","Temporal pattern analysis","Multi-device usage detection","Interactive geospatial visualization","Dynamic statistical thresholding (96th percentile)","Consensus-based ensemble approach (7 algorithms)","Risk scoring system (0-100 scale)","Transaction channel monitoring (Branch/ATM/Online variants)"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "detailedDescription"=EXCLUDED."detailedDescription", image=EXCLUDED.image, image_thumb=EXCLUDED.image_thumb, url=EXCLUDED.url, tags=EXCLUDED.tags, features=EXCLUDED.features;
INSERT INTO projects (id, title, description, "detailedDescription", image, image_thumb, url, tags, features)
VALUES (9, 'Portfolio Website', 'Responsive portfolio website with modern design.', 'This portfolio website showcases my personal profile including educational background, certifications, projects, and contact information. Built using modern web development technologies, it features a responsive design that adapts to various screen sizes without compromising visual appeal or functionality.

Development focused on user experience and clean architecture, applying techniques like code splitting and lazy loading to improve performance. The architecture follows a component-based design for maintainability and scalability. State is managed efficiently using React hooks, while styling is handled with Tailwind CSS for consistency and development speed.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/portofolio-project.jpg', NULL, 'https://github.com/Rekht/portofolio', '["React","Tailwind CSS","JavaScript"]'::jsonb, '["Responsive design for all screen sizes","Optimized with code splitting and lazy loading","Showcases education, projects, certifications, and contact info","Built using React and Tailwind CSS"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "detailedDescription"=EXCLUDED."detailedDescription", image=EXCLUDED.image, image_thumb=EXCLUDED.image_thumb, url=EXCLUDED.url, tags=EXCLUDED.tags, features=EXCLUDED.features;
INSERT INTO projects (id, title, description, "detailedDescription", image, image_thumb, url, tags, features)
VALUES (4, 'Mobile Stocks App', 'Real-time stocks tracking app with watchlists, recommendations, and visual analysis tools.', 'This project is the final assignment for the Mobile Development course in the sixth semester.

This comprehensive stock market tracking application provides a streamlined mobile platform for monitoring market movements and portfolio insights. Built with Flutter for cross-platform compatibility, the app ensures a seamless experience across both iOS and Android devices.

The app retrieves financial data via APIs to display real-time stock prices, historical charts across multiple timeframes, and essential financial indicators. Users can create custom watchlists to follow selected stocks and explore automatic stock recommendations highlighting strong-performing assets at a given moment.

Additional features include technical analysis tools with common indicators such as moving averages and relative strength index, portfolio performance visualization, and a curated financial news feed tailored to user interests.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/stocks-project.png', NULL, 'https://github.com/Rekht/Multiplatform-Stocks-with-Flutter', '["Flutter","Dart","Firebase","RESTful APIs"]'::jsonb, '["Built with Flutter for cross-platform support","Real-time stock price updates","Customizable watchlists and portfolios","Stock recommendations based on current trends","Technical analysis charts with indicators","Latest stock-related news updates"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "detailedDescription"=EXCLUDED."detailedDescription", image=EXCLUDED.image, image_thumb=EXCLUDED.image_thumb, url=EXCLUDED.url, tags=EXCLUDED.tags, features=EXCLUDED.features;
INSERT INTO projects (id, title, description, "detailedDescription", image, image_thumb, url, tags, features)
VALUES (5, 'Mobile Weather Application', 'Simple weather application with forecast, location tracking, and beautiful UI.', 'This project is the midterm assignment for the Mobile Development course in the sixth semester.

This elegant weather application combines beautiful design with practical functionality to deliver accurate weather information in a visually engaging format. The app utilizes geolocation services to automatically detect the user''s location and provide localized weather data, while also allowing manual location searches.

The interface presents current conditions along with hourly and 7-day forecasts, displaying temperature, precipitation probability, wind speed, humidity, and UV index. Weather data visualization includes animated icons that represent different weather conditions and intuitive charts for temperature and precipitation trends.

Developed with Flutter, the application maintains consistent performance across platforms while adapting to device-specific design guidelines.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/weather-project.png', NULL, 'https://github.com/Rekht/Simple-Weather-App-using-Flutter', '["Flutter","RESTful APIs"]'::jsonb, '["Location-based weather forecasts","Hourly and 7-day predictions","Animated weather condition icons","Background themes matching weather conditions"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "detailedDescription"=EXCLUDED."detailedDescription", image=EXCLUDED.image, image_thumb=EXCLUDED.image_thumb, url=EXCLUDED.url, tags=EXCLUDED.tags, features=EXCLUDED.features;
INSERT INTO projects (id, title, description, "detailedDescription", image, image_thumb, url, tags, features)
VALUES (6, 'Mental Health Sentiment Analysis using LSTM', 'Developed a sentiment analysis system specializing in depression detection from tweets with 98% accuracy', 'This project is an independent project.

This project implements advanced sentiment analysis techniques with specialized focus on mental health indicators. The system processes Twitter data through a customized NLP pipeline including emoji decoding, slang translation (100+ terms), and mental-health-specific text normalization.

The core LSTM architecture employs two recurrent layers with dropout regularization (0.5), achieving exceptional performance in identifying depression-related language patterns. Evaluation results demonstrate 98% classification accuracy with 0.97 precision for positive depression indicators.

Beyond binary classification, the system generates interpretable analytics including sentiment evolution timelines and keyword correlation matrices, providing actionable insights for mental health monitoring applications.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/sentiment-project.jpg', NULL, 'https://github.com/Rekht/Sentiment-Analysis-on-Twitter-Data', '["Python","LSTM","Sentiment Analysis","NLP","TensorFlow"]'::jsonb, '["Specialized sentiment analysis for mental health context","Dual-layer LSTM architecture with 98% detection accuracy","Mental-health-focused text preprocessing pipeline","Slang and emoji processing for social media text","Sentiment trend visualization and pattern analysis","Production-ready model serving via Flask API","Comprehensive model interpretability features"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "detailedDescription"=EXCLUDED."detailedDescription", image=EXCLUDED.image, image_thumb=EXCLUDED.image_thumb, url=EXCLUDED.url, tags=EXCLUDED.tags, features=EXCLUDED.features;
INSERT INTO projects (id, title, description, "detailedDescription", image, image_thumb, url, tags, features)
VALUES (7, 'DJP Play Store Review Sentiment Analysis', 'Advanced sentiment analysis system for Indonesian tax app reviews with 96.92% accuracy using optimized SVM', 'This project is an independent project.

This project analyzes user sentiment from the Indonesian Tax Office (DJP) mobile app reviews on Google Play Store. The system processes 5,000 Indonesian-language reviews through a comprehensive NLP pipeline including slang normalization, Sastrawi stemming, and lexicon-based sentiment scoring.

The analysis employs multiple machine learning models (SVM, Random Forest, CatBoost, etc.) with SVM achieving 96.92% accuracy after hyperparameter tuning. The system features automated data scraping, advanced text preprocessing for Indonesian language, and interactive visualizations including sentiment distribution charts and word clouds for both positive and negative reviews.

Technical implementation includes SMOTE for class balancing, TF-IDF vectorization with n-grams, and rigorous model evaluation metrics. The project delivers actionable insights for app improvement and user satisfaction tracking.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/djp-sentiment.jpg', NULL, 'https://github.com/Rekht/scrapping-djp-playstore', '["Python","Machine Learning","NLP","Text Classification","Sentiment Analysis","Scrapping"]'::jsonb, '["Automated review scraping from Google Play Store (5,000+ reviews)","Specialized Indonesian text preprocessing with Sastrawi","Lexicon-based sentiment scoring with custom slang dictionary","Multiple model comparison (SVM, Random Forest, CatBoost etc.)","Optimized SVM model achieving 96.92% accuracy","Interactive visualizations (word clouds, sentiment distribution)","Class balancing with SMOTE technique"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "detailedDescription"=EXCLUDED."detailedDescription", image=EXCLUDED.image, image_thumb=EXCLUDED.image_thumb, url=EXCLUDED.url, tags=EXCLUDED.tags, features=EXCLUDED.features;
INSERT INTO projects (id, title, description, "detailedDescription", image, image_thumb, url, tags, features)
VALUES (8, 'Library Management System with Multi-Role Authentication', 'A comprehensive library management system with admin/member roles, book tracking, and automated penalty calculations using MySQL', 'This project is the final assignment for the Database course in the fifth semester.

This project implements a full-featured library management system with:

1. **User Management**
- Dual-role authentication (Admin/Member)
- Secure credential storage in MySQL
- Profile management for all users

2. **Book Inventory System**
- Complete CRUD operations for 500+ book entries
- Real-time availability tracking across 5 genres
- Advanced search functionality

3. **Loan Management**
- Automated due date calculations
- Dynamic penalty system (Rp 2000/day overdue)
- Complete transaction history

The system uses Python with Tkinter for the responsive GUI and MySQL for robust data storage, handling 50+ concurrent operations with optimized database queries.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/library-system.jpg', NULL, 'https://github.com/Rekht/Library-Management-System', '["Python","SQL","GUI","Tkinter"]'::jsonb, '["Role-based access control (Admin/Member permissions)","Automated penalty calculations with date tracking","Interactive GUI with customized widgets","MySQL database with 4 normalized tables (admin_logindata, member_logindata, list_books, loan_book)","Input validation and error handling for all operations","Book availability tracking across multiple copies","Genre classification system (Fantasy, Sci-Fi, Mystery, Romance, Pendidikan)"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "detailedDescription"=EXCLUDED."detailedDescription", image=EXCLUDED.image, image_thumb=EXCLUDED.image_thumb, url=EXCLUDED.url, tags=EXCLUDED.tags, features=EXCLUDED.features;
INSERT INTO projects (id, title, description, "detailedDescription", image, image_thumb, url, tags, features)
VALUES (10, 'Book API Service', 'Sebuah API RESTful untuk mengelola koleksi buku, dibangun dengan Node.js dan Hapi.js, serta diuji menggunakan Postman.', 'This project is the final project of the Dicoding course ''Beginner Back-End Development with JavaScript''.

Proyek ini adalah layanan backend sederhana yang menyediakan API RESTful untuk pengelolaan data buku. Dibangun menggunakan Node.js dan framework Hapi.js, API ini mendukung operasi CRUD (Create, Read, Update, Delete) dengan validasi input yang ketat dan penanganan kesalahan yang tepat. Setiap buku memiliki ID unik yang dibuat menggunakan paket `nanoid`. Data disimpan dalam array di memori, cocok untuk kebutuhan prototipe atau pembelajaran awal.

Proyek ini belum dideploy ke AWS, namun telah diuji secara lokal menggunakan Postman untuk memastikan semua endpoint berjalan dengan benar. Server mendukung pengaturan mode produksi dan pengembangan secara otomatis, serta sudah mengaktifkan CORS untuk permintaan lintas domain. Semua pengembangan dan pengujian dilakukan dengan pengelolaan versi melalui Git.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/bookself-api.jpg', NULL, 'https://github.com/Rekht/bookself-dicoding', '["Node.js","Hapi.js","REST API","Backend","JavaScript","Postman","Git"]'::jsonb, '["Operasi CRUD untuk buku (tambah, ambil, perbarui, hapus)","Validasi input untuk nama dan logika halaman buku","Pemfilteran berdasarkan nama, status membaca, dan selesai dibaca","Pembuatan ID unik untuk buku dengan nanoid","Penyimpanan data dalam array (in-memory)","Konfigurasi environment untuk mode produksi dan pengembangan","Dukungan CORS untuk akses lintas domain","Pengujian endpoint menggunakan Postman","Versi kode dikelola dengan Git"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "detailedDescription"=EXCLUDED."detailedDescription", image=EXCLUDED.image, image_thumb=EXCLUDED.image_thumb, url=EXCLUDED.url, tags=EXCLUDED.tags, features=EXCLUDED.features;
INSERT INTO projects (id, title, description, "detailedDescription", image, image_thumb, url, tags, features)
VALUES (11, 'Notes Backend API', 'A REST API for managing notes using Node.js and Hapi.js. This project was built during a Dicoding course, tested using Postman, and deployed to AWS.', 'This project was developed during the learning process of the Dicoding course ''Beginner Back-End Development with JavaScript''.

The Notes Backend API is a simple server-side application that allows users to perform CRUD (Create, Read, Update, Delete) operations on notes. It is built using Node.js and the Hapi.js framework, following modular design principles. The application uses in-memory data storage, meaning all data is stored temporarily in the server''s memory. Each note is assigned a unique ID generated using the nanoid package, and input validation is handled within the handler functions.

The server is configured with environment-based settings to distinguish between development and production modes, including CORS support for cross-origin access. The project also includes development tools such as nodemon for live reloading and ESLint for code linting using the Dicoding Academy''s config. All API endpoints were thoroughly tested using Postman to ensure functionality and correctness. The routes are cleanly organized, and the application has been deployed to AWS to make it publicly accessible. Version control is managed using Git.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/notes-backend.jpg', NULL, 'https://github.com/Rekht/notes-app-back-end', '["Node.js","Hapi.js","REST API","Backend","JavaScript","AWS","Git","Postman"]'::jsonb, '["CRUD operations for notes (create, read, update, delete)","Modular routing with Hapi.js","Input validation and in-memory data management","Server configuration with environment detection (localhost vs production)","CORS support for cross-origin API access","Development scripts using nodemon and linting with ESLint","Tested using Postman to verify API functionality","Deployed to AWS and version controlled with Git"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "detailedDescription"=EXCLUDED."detailedDescription", image=EXCLUDED.image, image_thumb=EXCLUDED.image_thumb, url=EXCLUDED.url, tags=EXCLUDED.tags, features=EXCLUDED.features;
INSERT INTO projects (id, title, description, "detailedDescription", image, image_thumb, url, tags, features)
VALUES (12, 'Ritel Transaction Dashboard', 'An interactive dashboard to monitor retail transactions by payment method, product category, customer, and sales trends. This project is an independent project.', 'This project was developed as part of the learning process at MySkill.

This dashboard provides a comprehensive view of retail sales data, including quantity sold, revenue, profit, customer count, and discounts. It features visualizations based on payment methods, product categories, transaction values, and performance summaries for both products and customers. This is an independent project developed as part of the MySkill learning program.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/ritel-transaction.jpg', NULL, 'https://lookerstudio.google.com/reporting/fc87b23a-7571-4c07-8a37-f95f324153d5', '["Google Looker Studio","Dashboard","Transaction Analysis","Data Visualization","Retail"]'::jsonb, '["Performance summary: quantity, revenue, profit, and discount","Sales trend over time","Transaction and value distribution by payment method","Product category analysis by transaction count and value","Treemap of discount by category and product","Product and customer tables with key metrics"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "detailedDescription"=EXCLUDED."detailedDescription", image=EXCLUDED.image, image_thumb=EXCLUDED.image_thumb, url=EXCLUDED.url, tags=EXCLUDED.tags, features=EXCLUDED.features;
INSERT INTO projects (id, title, description, "detailedDescription", image, image_thumb, url, tags, features)
VALUES (13, 'Credit Card Dashboard', 'An interactive dashboard to analyze credit card customer profiles based on demographics, revenue, and risk. This is an independent project developed as part of the learning process at MySkill.', 'This project was developed as part of the learning process at MySkill.

This dashboard provides a comprehensive analysis of credit card customers segmented by state, occupation, marital status, education level, and spending categories. It includes visualizations of revenue profiles, card utilization, annual fees, and risk profiles. This independent project was built to support data-driven insights during the MySkill learning process.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/credit-card-dashboard.jpg', NULL, 'https://lookerstudio.google.com/reporting/5c2c09fb-513a-4aed-8a09-aa562b012f77', '["Google Looker Studio","Dashboard","Data Analysis","Data Visualization","Credit Card"]'::jsonb, '["Customer demographic analysis by map and charts","Revenue and transaction volume by occupation","Delinquent accounts segmented by state and profile","Utilization ratio and annual fees by occupation","Segmentation by education level and expenses","Heatmaps for revenue and risk profile comparison"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "detailedDescription"=EXCLUDED."detailedDescription", image=EXCLUDED.image, image_thumb=EXCLUDED.image_thumb, url=EXCLUDED.url, tags=EXCLUDED.tags, features=EXCLUDED.features;
INSERT INTO projects (id, title, description, "detailedDescription", image, image_thumb, url, tags, features)
VALUES (14, 'Bicycle Rental Dashboard', 'An interactive dashboard to analyze bike rental performance by time, rider type, season, and key business metrics. This project is an independent project.', 'This Power BI dashboard is an independent project that provides data visualizations for a bike rental business, including hourly and daily profit analysis, KPIs such as total revenue and profit, rider type distribution (registered vs casual), and seasonal performance. The dashboard supports data-driven decision-making.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/projects/powerbi-bicycle.jpg', NULL, 'https://github.com/Rekht/notes-app-back-end', '["Power BI","Dashboard","Data Visualization","Business Analysis","Interactive Data"]'::jsonb, '["Profit visualization by hour and weekday","KPI over time: revenue, profit, and rider count","Interactive filters by month, quarter, and year","Rider type breakdown: casual vs registered","Revenue analysis by season","Insights into peak hours and days"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, "detailedDescription"=EXCLUDED."detailedDescription", image=EXCLUDED.image, image_thumb=EXCLUDED.image_thumb, url=EXCLUDED.url, tags=EXCLUDED.tags, features=EXCLUDED.features;

INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (1, 'Belajar Fundamental Deep Learning', 'Learning Fundamental Deep Learning', 'Dicoding', '2026-2029', '23 Februari 2026', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/Belajar Fundamental Deep Learning - Dicoding.jpg', 'https://www.dicoding.com/certificates/0LZ0Y3KKNX65', NULL)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";
INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (2, 'Belajar Machine Learning untuk Pemula', 'Learning Machine Learning for Beginners', 'Dicoding', '2025 - 2028', '05 November 2025', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/Belajar Machine Learning untuk Pemula - Dicoding.jpg', 'https://www.dicoding.com/certificates/4EXG31RDDZRL', NULL)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";
INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (3, 'Belajar Back-End Pemula dengan JavaScript', 'Learning Back-End for Beginners with JavaScript', 'Dicoding', '2025 - 2028', '23 Juni 2025', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/Belajar Back-End Pemula dengan JavaScript - Dicoding.jpg', 'https://www.dicoding.com/certificates/4EXGVW2RQXRL', NULL)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";
INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (4, 'Belajar Dasar Cloud dan Gen AI di AWS', 'Learn Cloud Basics and Gen AI on AWS', 'Dicoding', '2025 - 2028', '21 Juni 2025', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/Belajar Dasar Cloud dan Gen AI di AWS - Dicoding.jpg', 'https://www.dicoding.com/certificates/72ZD54D5LZYW', NULL)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";
INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (5, 'Belajar Dasar Google Cloud', 'Learning Google Cloud Basics', 'Dicoding', '2025 - 2028', '02 Maret 2025', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/Belajar Dasar Google Cloud - Dicoding.jpg', 'https://www.dicoding.com/certificates/KEXL7QJGRXG2', NULL)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";
INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (6, 'Memulai Pemrograman dengan Python', 'Getting Started with Python Programming', 'Dicoding', '2025 - 2028', '03 November 2025', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/Memulai Pemrograman dengan Python - Dicoding.jpg', 'https://www.dicoding.com/certificates/MRZM6WRNRPYQ', NULL)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";
INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (7, 'Belajar Dasar Structured Query Language (SQL)', 'Learning Basic Structured Query Language (SQL)', 'Dicoding', '2024 - 2027', '28 Agustus 2024', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/Belajar Dasar Structured Query Language (SQL) - Dicoding.jpg', 'https://www.dicoding.com/certificates/1OP8W86E1XQK', NULL)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";
INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (8, 'Belajar Dasar Visualisasi Data', 'Learning Basic Data Visualization', 'Dicoding', '2024 - 2027', '26 Agustus 2024', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/Belajar Dasar Visualisasi Data - Dicoding.jpg', 'https://www.dicoding.com/certificates/6RPN153W5X2M', NULL)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";
INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (9, 'Belajar Dasar AI', 'Learning Basic AI', 'Dicoding', '2025 - 2028', '20 Oktober 2025', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/Belajar Dasar AI - Dicoding.jpg', 'https://www.dicoding.com/certificates/QLZ963OQMZ5D', NULL)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";
INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (10, 'Belajar Membuat Front-End Web untuk Pemula', 'Learning to Create Front-End Web for Beginners', 'Dicoding', '2024 - 2027', '18 Maret 2024', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/Belajar Membuat Front-End Web untuk Pemula - Dicoding.jpg', 'https://www.dicoding.com/certificates/1OP8N933QXQK', NULL)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";
INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (11, 'Belajar Dasar Pemrograman JavaScript', 'Learning Basic JavaScript Programming', 'Dicoding', '2025 - 2028', '21 Juni 2025', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/Belajar Dasar Pemrograman JavaScript - Dicoding.jpg', 'https://www.dicoding.com/certificates/JMZVEY0KRPN9', NULL)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";
INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (12, 'Belajar Dasar Pemrograman Web', 'Learning Basic Web Programming', 'Dicoding', '2024 - 2027', '06 Februari 2024', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/Belajar Dasar Pemrograman Web - Dicoding.jpg', 'https://www.dicoding.com/certificates/53XEYKO2KPRN', NULL)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";
INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (13, 'Data Analysis with Python', 'Data Analysis with Python', 'IBM (Coursera)', '2025', '23 April 2025', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/data-analysis-with-python-coursera.jpg', 'https://www.coursera.org/account/accomplishments/verify/6Z5C8TCA892X', NULL)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";
INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (14, 'AWS re/Start program', 'AWS re/Start Program', 'Orbit Future Academy', 'Oktober 2025', '17 Oktober 2025', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/IDJAK126_Restu_Anggoro_Kasih.jpg', 'https://drive.google.com/file/d/1fjvxQRm1Fx78C2fRMkQ0BH3DIEnZqXWE/view', NULL)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";
INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (15, 'TOEFL Score', 'TOEFL Score', 'Lembaga Kajian dan Pengajaran Bahasa', 'April 2025', '20 April 2025', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/toefl.jpg', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/toefl.pdf', true)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";
INSERT INTO certifications (id, title, title_en, issuer, date, created_at, image, url, "isEnglish")
VALUES (16, 'Junior Mobile Programmer', 'Junior Mobile Programmer', 'Inixindo', 'November 2022', '05 November 2022', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/junior-mobile-inixindo.jpg', 'https://drive.google.com/file/d/1AtZg09PGcRny7n8o5uroq4A2GgOgC6WV/view?usp=sharing', NULL)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, title_en=EXCLUDED.title_en, issuer=EXCLUDED.issuer, date=EXCLUDED.date, created_at=EXCLUDED.created_at, image=EXCLUDED.image, url=EXCLUDED.url, "isEnglish"=EXCLUDED."isEnglish";

INSERT INTO achievements (id, title, organization, year, description, certificate, "hasImage", "certificateImage", "documentationImage")
VALUES (1, '3rd Place LIKMI', 'Universitas Negeri Yogyakarta', '2023', 'Juara 3 pada LIKMI dalam bidang Applied Technology Business. Project: ''FO-Shion (Find Your Shade Cushion)'', solusi berbasis Spark AR Studio untuk memilih shade cushion sesuai warna kulit.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/competition/file/Sertifikat_LIKMI.pdf', true, 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/competition/image/Sertifikat_LIKMI.jpg', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/competition/documentation/LIKMI_doc.png')
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, organization=EXCLUDED.organization, year=EXCLUDED.year, description=EXCLUDED.description, certificate=EXCLUDED.certificate, "hasImage"=EXCLUDED."hasImage", "certificateImage"=EXCLUDED."certificateImage", "documentationImage"=EXCLUDED."documentationImage";
INSERT INTO achievements (id, title, organization, year, description, certificate, "hasImage", "certificateImage", "documentationImage")
VALUES (2, 'Finalist TrackAML Hackathon', 'PPATK', '2023', 'Finalis dalam TrackAML Hackathon yang diselenggarakan oleh PPATK. Project: ''Combined Fraud Detection and Ensemble Learning System'' untuk analisis anomali terkait indikasi pencucian uang dan pendanaan terorisme.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/competition/file/Sertifikat_PPATK.pdf', true, 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/competition/image/Sertifikat_PPATK.jpg', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/competition/documentation/PPATK_doc.jpeg')
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, organization=EXCLUDED.organization, year=EXCLUDED.year, description=EXCLUDED.description, certificate=EXCLUDED.certificate, "hasImage"=EXCLUDED."hasImage", "certificateImage"=EXCLUDED."certificateImage", "documentationImage"=EXCLUDED."documentationImage";
INSERT INTO achievements (id, title, organization, year, description, certificate, "hasImage", "certificateImage", "documentationImage")
VALUES (3, 'Abdidaya Ormawa', 'Ministry of Education, Culture, Research, and Technology', '2023', 'Finalis Abdidaya Ormawa (PPK Ormawa). Project: Pengabdian masyarakat untuk membangun desa tangguh iklim melalui agroforestry, biogas, biopori, serta pemberdayaan UMKM dengan produk ekoprint.', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/competition/file/Sertifikat_PPKO.pdf', true, 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/competition/image/Sertifikat_PPKO.jpg', 'https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/certificates/competition/documentation/PPKO_doc.jpg')
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, organization=EXCLUDED.organization, year=EXCLUDED.year, description=EXCLUDED.description, certificate=EXCLUDED.certificate, "hasImage"=EXCLUDED."hasImage", "certificateImage"=EXCLUDED."certificateImage", "documentationImage"=EXCLUDED."documentationImage";

INSERT INTO education (id, degree, institution, period, description, gpa)
VALUES (1, 'Bachelor of Mathematics', 'Universitas Negeri Yogyakarta', '2021 - 2025', 'Focused on data analysis and computational mathematics. Completed coursework in statistical methods, mathematical modeling, numerical analysis, and data mining.', '3.64/4.0')
ON CONFLICT (id) DO UPDATE SET degree=EXCLUDED.degree, institution=EXCLUDED.institution, period=EXCLUDED.period, description=EXCLUDED.description, gpa=EXCLUDED.gpa;

INSERT INTO experience (id, company, position, duration, location, description, technologies, images)
VALUES (1, 'PT Rakamin Kolektif Madani', 'Data Analyst (MagangHub Internship)', 'Nov 2025 - Present', 'Remote', '["Implemented LLM-based job description matching to map job descriptions against Mercer Job Architecture data for standardized role classification and benchmarking","Developed custom Google Apps Script automations for clients to streamline data processing and significantly improve workflow efficiency in Google Sheets","Built an AI-driven HR analytics dashboard using Streamlit and Supabase, integrating talent-matching logic and AI-generated job profiles","Created dashboards using Redash for data querying and connected to Google Sheets via API","Developed interactive data visualization dashboards with Looker Studio"]'::jsonb, '["Python","LLM","Streamlit","Supabase","Google Apps Script","Redash","Looker Studio","SQL","Machine Learning"]'::jsonb, '["https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/experience/rakamin1.png","https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/experience/rakamin2.png","https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/experience/rakamin3.png"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET company=EXCLUDED.company, position=EXCLUDED.position, duration=EXCLUDED.duration, location=EXCLUDED.location, description=EXCLUDED.description, technologies=EXCLUDED.technologies, images=EXCLUDED.images;
INSERT INTO experience (id, company, position, duration, location, description, technologies, images)
VALUES (2, 'Independence/Various Platforms', 'Freelance', 'Jul 2025 - Present', 'Remote', '["Completed over 10 freelance projects independently and through various digital platforms","Responsible for building Machine Learning/Deep Learning models, performing data entry, data annotation, data management and scraping, developing websites, creating Roblox games, and academic projects.","Communicated effectively with clients to ensure deliverables met client expectations"]'::jsonb, '["Excel","PDF Processing","Roblox Studio","Lua","Statistical Analysis","Data Validation"]'::jsonb, '["https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/experience/freelance1.png"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET company=EXCLUDED.company, position=EXCLUDED.position, duration=EXCLUDED.duration, location=EXCLUDED.location, description=EXCLUDED.description, technologies=EXCLUDED.technologies, images=EXCLUDED.images;
INSERT INTO experience (id, company, position, duration, location, description, technologies, images)
VALUES (3, 'Department of Mathematics Education, Yogyakarta State University', 'Research Assistant (Project Based)', 'May 2024 - Jul 2024', 'Yogyakarta', '["Entered research data into Word documents totaling over 3,000 pages","Ensured format consistency and corrected errors according to guidelines on over 1,000 pages","Maintained high accuracy standards in data entry and document formatting","Collaborated with research team to meet project deadlines and quality requirements"]'::jsonb, '["Microsoft Word","Data Entry","Document Formatting","Quality Control"]'::jsonb, '["https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/experience/tracer1.png"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET company=EXCLUDED.company, position=EXCLUDED.position, duration=EXCLUDED.duration, location=EXCLUDED.location, description=EXCLUDED.description, technologies=EXCLUDED.technologies, images=EXCLUDED.images;
INSERT INTO experience (id, company, position, duration, location, description, technologies, images)
VALUES (4, 'Grogol Village, Paliyan District, Gunung Kidul Regency', 'Media Staff (Internship via PPK Ormawa)', 'Jul 2023 - Aug 2023', 'Gunung Kidul Regency, Yogyakarta', '["Conversion activity within the Student Organization Capacity Building Program (PPK Ormawa)","Drafted 4 official reports of village activities and documented more than 3 events","Managed and adjusted the content of the village website on WordPress to match the new template and design","Collaborated with village administration to improve digital presence and documentation"]'::jsonb, '["WordPress","Content Management","Report Writing","Digital Documentation","Web Design"]'::jsonb, '["https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/experience/ppko1.png","https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/experience/ppko2.png"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET company=EXCLUDED.company, position=EXCLUDED.position, duration=EXCLUDED.duration, location=EXCLUDED.location, description=EXCLUDED.description, technologies=EXCLUDED.technologies, images=EXCLUDED.images;

INSERT INTO organizations (id, title, position, period, description, image)
VALUES (1, 'Mathematics Student Association', 'Staff of IT Division', '2022 - 2023', '["Performed maintenance and repairs on hardware inventory, including one computer, one router, and two printers, on a four-day rotation system to ensure optimal performance.","Managed over 30 software installations and ensured the smooth operation of IT systems for all members.","Researched, designed, and distributed 11 media publications in the form of videos and images related to the latest technological developments or interesting tech facts, coordinating with the communication and publication team."]'::jsonb, '["https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/organization/himatika1.jpg","https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/organization/himatika2.jpg"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, position=EXCLUDED.position, period=EXCLUDED.period, description=EXCLUDED.description, image=EXCLUDED.image;
INSERT INTO organizations (id, title, position, period, description, image)
VALUES (2, 'Engineering and Technology Club (INFINITE)', 'Staf of Competition Division', '2023 - 2024', '["Conducted research and monitoring of more than 15 IT-related competitions, gathering and distributing relevant information to members.","Managed an archive of over 25 competition-related documents, including proposals and other documentation."]'::jsonb, '["https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/organization/infinite1.jpg"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, position=EXCLUDED.position, period=EXCLUDED.period, description=EXCLUDED.description, image=EXCLUDED.image;
INSERT INTO organizations (id, title, position, period, description, image)
VALUES (3, 'Student Executive Board', 'Staff of Research, Data, and Digital Products Division', '2023 - 2024', '["Analyzed and visualized more than 10 survey datasets using Excel or Python to support strategic decision making.","Designed and produced over 10 informative infographics based on data analysis results, collaborated with the communication and publication team to ensure consistency and effectiveness in media content."]'::jsonb, '["https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/organization/bem1.jpg"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, position=EXCLUDED.position, period=EXCLUDED.period, description=EXCLUDED.description, image=EXCLUDED.image;

INSERT INTO skills (id, title, color, technologies)
VALUES ('frontend', 'Frontend', 'blue', '["React","Next.js","TypeScript","Tailwind CSS","JavaScript"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, color=EXCLUDED.color, technologies=EXCLUDED.technologies;
INSERT INTO skills (id, title, color, technologies)
VALUES ('ai_ml', 'AI & Machine Learning', 'red', '["scikit-learn","TensorFlow","PyTorch","Keras","Hugging Face","pandas","NumPy"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, color=EXCLUDED.color, technologies=EXCLUDED.technologies;
INSERT INTO skills (id, title, color, technologies)
VALUES ('bi_analytics', 'BI & Analytics', 'yellow', '["Power BI","Google Looker"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, color=EXCLUDED.color, technologies=EXCLUDED.technologies;
INSERT INTO skills (id, title, color, technologies)
VALUES ('backend', 'Backend', 'green', '["Node.js","Flask API","MySQL"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, color=EXCLUDED.color, technologies=EXCLUDED.technologies;
INSERT INTO skills (id, title, color, technologies)
VALUES ('tools_devops', 'Tools & DevOps', 'purple', '["Git","Docker","AWS"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, color=EXCLUDED.color, technologies=EXCLUDED.technologies;
INSERT INTO skills (id, title, color, technologies)
VALUES ('3d_gamedev', '3D & Game Dev', 'indigo', '["Blender","Roblox Studio"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, color=EXCLUDED.color, technologies=EXCLUDED.technologies;
INSERT INTO skills (id, title, color, technologies)
VALUES ('geospatial', 'Geospatial', 'emerald', '["Google Earth Engine","QGIS"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, color=EXCLUDED.color, technologies=EXCLUDED.technologies;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE about ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read about" ON about FOR SELECT USING (true);
CREATE POLICY "Auth insert about" ON about FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update about" ON about FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete about" ON about FOR DELETE TO authenticated USING (true);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Auth insert projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update projects" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete projects" ON projects FOR DELETE TO authenticated USING (true);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read certifications" ON certifications FOR SELECT USING (true);
CREATE POLICY "Auth insert certifications" ON certifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update certifications" ON certifications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete certifications" ON certifications FOR DELETE TO authenticated USING (true);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Auth insert achievements" ON achievements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update achievements" ON achievements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete achievements" ON achievements FOR DELETE TO authenticated USING (true);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read education" ON education FOR SELECT USING (true);
CREATE POLICY "Auth insert education" ON education FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update education" ON education FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete education" ON education FOR DELETE TO authenticated USING (true);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Auth insert experience" ON experience FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update experience" ON experience FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete experience" ON experience FOR DELETE TO authenticated USING (true);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read organizations" ON organizations FOR SELECT USING (true);
CREATE POLICY "Auth insert organizations" ON organizations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update organizations" ON organizations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete organizations" ON organizations FOR DELETE TO authenticated USING (true);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Auth insert skills" ON skills FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update skills" ON skills FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete skills" ON skills FOR DELETE TO authenticated USING (true);
