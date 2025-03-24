// loadtest.js
import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics
const successRate = new Rate('success_rate');
const errorRate = new Counter('error_counter');
const latencyTrend = new Trend('latency_trend');

// Test configuration
export const options = {
  // Test scenarios
  scenarios: {
    // Constant load scenario
    constant_load: {
      executor: 'constant-vus',
      vus: 50,         // 50 virtual users
      duration: '1m',  // for 1 minute
    },
    // Ramp-up scenario
    ramp_up: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 100 },   // Ramp up to 100 users over 30 seconds
        { duration: '1m', target: 100 },    // Stay at 100 users for 1 minute
        { duration: '30s', target: 0 },     // Ramp down to 0 users
      ],
      startTime: '1m',  // Start after the constant load scenario
    },
    // Spike test scenario
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 200 },   // Quick ramp up to 200 users
        { duration: '20s', target: 200 },   // Stay at 200 users briefly
        { duration: '10s', target: 0 },     // Quick ramp down
      ],
      startTime: '3m',  // Start after previous scenarios
    },
  },
  thresholds: {
    // Set performance thresholds
    http_req_duration: ['p(95)<500'],  // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.05'],    // Less than 5% of requests should fail
    'success_rate': ['rate>0.95'],     // Success rate should be above 95%
  },
};

// List of important URLs to test on your blog
const urls = [
  'https://yourblog.com/',                     // Homepage
  'https://yourblog.com/about',                // About page
  'https://yourblog.com/posts/latest-post',    // A specific blog post
  'https://yourblog.com/api/posts',            // API endpoint for posts
  'https://yourblog.com/api/comments'          // API endpoint for comments
];

// Main function executed for each virtual user
export default function() {
  // Test each URL
  for (const url of urls) {
    const startTime = new Date().getTime();
    const response = http.get(url);
    const endTime = new Date().getTime();
    
    // Record latency
    latencyTrend.add(endTime - startTime);
    
    // Check if the request was successful (status code 200-399)
    const success = check(response, {
      'status is 200-399': (r) => r.status >= 200 && r.status < 400,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });
    
    // Update success and error metrics
    successRate.add(success);
    if (!success) {
      errorRate.add(1);
      console.log(`Error on ${url}: ${response.status} - ${response.body.substring(0, 100)}`);
    }
  }
  
  // Wait between iterations to simulate real user behavior
  sleep(Math.random() * 3 + 1); // Random sleep between 1-4 seconds
}