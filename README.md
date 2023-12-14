# Product Management Application

## Overview

This project is a web application for managing product information, built using Next.js 14. It allows users to create, view, edit, and delete product details. The application features a user-friendly interface for uploading product images, which are stored in AWS S3. MongoDB is used as the database to store product information.

## Key Features

- **Product Creation**: Users can create new products by providing details such as name, code, price, and an image.
- **Image Storage**: Product images are uploaded and stored in AWS S3.
- **Product Listing**: The home page lists all products with options to search by name or code. This page implements debounced search functionality for efficient querying.
- **Product Detail View**: Users can view detailed information about a product and perform actions like editing or deleting.
- **Edit and Delete**: Functionality to edit or delete products directly from the product detail page.

## Technologies Used

- **Next.js 14**: For building the server-side rendered React application.
- **MongoDB**: As the database for storing product information.
- **AWS S3**: For storing product images.
- **React Dropzone**: To handle image uploads.
- **Tailwind CSS**: For styling the application.
- **SWR**: For data fetching, caching, and state management.

## Local Setup

1. **Clone the Repository**

git clone git@github.com:wanttoplayy/UploadProduct.git

2. **Install Dependencies**

npm install

3. **Set up Environment Variables**
   Create a `.env.local` file in the root directory and add the following:
   MONGODB_URI=<your_mongodb_uri>
   AWS_S3_BUCKET_NAME=<your_s3_bucket_name>
   AWS_S3_REGION=<your_s3_region>
   AWS_S3_ACCESS_KEY_ID=<your_s3_access_key_id>
   AWS_S3_SECRET_ACCESS_KEY=<your_s3_secret_access_key>

4. **Run the Application**
   npm run dev
