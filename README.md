# IDX Property Search Application

A full-stack property search application built with React, Node.js/Express, and MySQL. The backend provides property search, filtering, pagination, sorting, property details, and open house information.

## Features

* Property search with filters for city, ZIP code, price, bedrooms, and bathrooms
* Paginated property results
* Property detail pages
* Open house schedules
* Property sorting by price, listing date, square footage, and bedrooms
* Ascending and descending sort options
* Input validation for filters, pagination, and sorting
* Backend testing with Jest and Supertest

## Prerequisites

* Node.js 18+ and npm
* Docker Desktop
* Git

## Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd idx-internship
```

### 2. Start Database

```bash
docker run --name idx-mysql-local -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=rets \
  -d mysql:8.0
```

Import the property data:

```bash
docker exec -i idx-mysql-local mysql -uroot -prootpass rets < rets_property.sql
```

Import the open house data:

```bash
docker exec -i idx-mysql-local mysql -uroot -prootpass rets < rets_openhouse.sql
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file and add your MySQL connection values.

Then start the backend:

```bash
npm run dev
```

## Running Tests

Backend tests:

```bash
cd backend
npm test
```

To run tests with coverage:

```bash
npm test -- --coverage
```

The backend tests cover successful property requests, filtering, validation errors, sorting, property lookup, and open house routes.

## Project Structure

```text
idx-internship/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── mysql.js
│   │   ├── routes/
│   │   │   ├── properties.js
│   │   │   └── properties.test.js
│   │   └── index.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
├── rets_property.sql
├── rets_openhouse.sql
└── README.md
```

## API Endpoints

### GET /api/properties

Returns a paginated list of properties with optional filters and sorting.

Query parameters:

* `limit`: Number of results returned. Default: 20
* `offset`: Number of results to skip. Default: 0
* `city`: Filter by city
* `zipcode`: Filter by ZIP code
* `minPrice`: Minimum property price
* `maxPrice`: Maximum property price
* `beds`: Minimum number of bedrooms
* `baths`: Minimum number of bathrooms
* `sortBy`: Field used for sorting
* `sortOrder`: `ASC` or `DESC`

Supported sorting fields:

* `L_SystemPrice`: Price
* `ListingContractDate`: Listing date
* `LM_Int2_3`: Square footage
* `L_Keyword2`: Bedrooms

Example:

```bash
GET /api/properties?city=Beverly%20Hills&minPrice=300000&beds=3
```

Example with sorting:

```bash
GET /api/properties?sortBy=L_SystemPrice&sortOrder=ASC
```

### GET /api/properties/:id

Returns details for a single property using its listing ID.

Example:

```bash
GET /api/properties/1118422731
```

If the property does not exist, the API returns a `404` error.

### GET /api/properties/:id/openhouses

Returns the open house schedule for a specific property.

Example:

```bash
GET /api/properties/1118422731/openhouses
```

If the property does not exist, the API returns a `404` error.

## Architecture Decisions

### Why Docker for MySQL?

* Provides a consistent database environment
* Makes the database easy to start and stop
* Keeps the database setup separate from the local machine
* Makes it easier to reset and reimport the provided data

### Why Pagination?

* Loading every property at once becomes inefficient as the dataset grows
* Smaller result sets improve response time
* Clients can request properties in manageable chunks
* Reduces unnecessary backend and database load

### Why Validate Query Parameters?

The API validates pagination values, prices, bedroom and bathroom values, and sorting options before using them in database queries. This prevents invalid requests and keeps API behavior predictable.

### Why Restrict Sort Fields?

SQL values can safely use parameterized queries, but column names cannot be passed as normal query parameters. The API uses a predefined list of allowed sorting fields and sort orders to ensure that only expected database columns can be used for sorting.

## Known Issues / Future Improvements

* Add property image galleries
* Improve the frontend property search interface
* Implement user authentication
* Add saved searches or saved properties
* Improve mobile responsiveness
* Add additional property filters

## Troubleshooting

**Backend won't start:**

* Check that MySQL is running:

```bash
docker ps
```

* Verify that the `.env` file exists and contains the correct database credentials
* Run `npm install` inside the backend folder

**Database connection errors:**

* Make sure the MySQL Docker container is running
* Check that the port is set to `3306`
* Verify the username, password, and database name in `.env`

**Tests failing:**

* Reinstall dependencies:

```bash
rm -rf node_modules
npm install
```

* Check your Node version:

```bash
node --version
```

Node.js version 18 or higher is recommended.

## Contributors

Roshni Gokeda - Initial development

## License

This project was created for educational purposes as part of the IDX Exchange internship program.
