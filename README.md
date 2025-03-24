# Aden

This guide will help you deploy and run load tests for your Astro static blog to ensure it can handle your expected traffic.

## Prerequisites

- Node.js (v14 or later)
- k6 load testing tool
- Your Astro blog deployed to a production environment

## Installation Steps

1. Install k6

    For macOS:
    ```bash
    brew install k6
    ```

    For Windows:
    ```bashCopy
    choco install k6
    ```

    For Linux:
    ```bash
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
    echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
    sudo apt-get update
    sudo apt-get install k6
    ```

2. Create your test script. Save the provided test script as loadtest.js in your project directory.
3. Configure the script for your blog. Update the URLs in the script to match your actual blog's endpoints:

    ```bash
    javascriptCopyconst urls = [
    'https://yourblog.com/',                // Homepage
    'https://yourblog.com/about',           // About page
    // Add other important pages and API endpoints
    ];
    ```

## Running the Tests

1. Basic test run

    ```bash
    k6 run loadtest.js
    ```

2. Output to JSON for further analysis

    ```bash
    k6 run --out json=results.json loadtest.js
    ```

3. Run with custom options

    ```bash
    k6 run --vus 10 --duration 30s loadtest.js
    ```

