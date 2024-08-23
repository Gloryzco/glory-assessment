# Air Quality API

## Documentation

- **Swagger**: http://localhost:3000/swagger
- **Postman**: https://documenter.getpostman.com/view/3821701/2sAXjDfbiu

## Project Overview

The Air Quality API is a RESTful API built using Node.js and the NestJS framework. The primary goal of this project is to expose air quality information for a given location based on its GPS coordinates (longitude and latitude). This information is fetched from the IQAir API, which provides real-time data on various air pollutants and environmental conditions.

## Methodology

The API was designed with the following key features:

- **Efficient Data Caching**: To reduce the number of requests made to the IQAir API, Redis is used to cache air quality data for each zone for one hour. Since the air quality stations are updated only once per hour, this caching mechanism ensures that we are not overloading the external service with unnecessary requests.
- **Rate Limiting**: A rate limiter has been implemented to allow a maximum of 100 requests per second. This helps in preventing Brute-force attacks and abuse by clients making excessive requests.
- **Data Storage**: PostgreSQL is used as the database to store the air quality data, including the date and time when the data was fetched. This allows for efficient querying and analysis of historical air quality data. Additionally, indexing was implemented to optimize performance.
- **Scheduled Updates**: A CRON job is scheduled to run every minute, specifically for the Paris zone. This job checks the air quality data and saves it in the database with the date and time of the update.
- **Unit Testing**: Comprehensive unit tests have been written for both the routes and service classes to ensure the API functions as expected.
- **Logging**: Winston is used as the logging library to capture and manage log data. Winston provides a flexible way of logging different levels of messages (info, warn, error) and supports multiple transport layers, which makes it a robust choice for production-level applications.

## Setup Guide

### Local Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Gloryzco/global-country-insights.git
   ```

2. **Install dependencies:**

```bash
  npm install
```

3. **Configure environment variables:**
   Create a .env file in the root directory and add the following configuration:

```bash
APP_NAME =
APP_PORT = 3000
APP_DEBUG =
TIMEOUT_IN_MILLISECONDS =
APP_TIMEZONE =

DB_TYPE = 'postgres'
DB_USERNAME =
DB_PASSWORD =
DB_NAME =
DB_PORT =
DB_HOST =

REDIS_HOST=
REDIS_PORT=

IQAIR_API_KEY=
```

4. **Run database migrations:**

```bash
npm run migration:run
```

5. **Start the application:**

```bash
npm run start
```

5. **Running Tests:**

```bash
npm run test
```

### Using Docker

Once your `.env` variables is set and you have docker intalled on your local, run the command

```bash
docker-compose up --build
```
