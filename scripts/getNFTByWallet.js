import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Load request data from JSON file
const requestData = JSON.parse(open('../data/apiRequestData.json'));

// Define the error rate metric
export const errorRate = new Rate('errors');

export const options = {
    stages: [
        { duration: '1m', target: 10 }, // ramp-up
        { duration: '2m', target: 10 }, // steady state
        { duration: '1m', target: 0 },  // ramp-down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete within 500ms
        'http_req_failed{status:404}': ['rate<0.05'], // Less than 5% of requests should fail with 404
    },
};

export default function () {
    // Loop through each API request data in the JSON file
    requestData.forEach((req) => {
        const url = `${req.url}?chain=${req.params.chain}&format=${req.params.format}&media_items=${req.params.media_items}`;
        const params = {
            headers: req.params.headers,
        };

        // Send GET request to the Moralis API
        const response = http.get(url, params);

        // Check if the status code is 200 (success)
        check(response, {
            'status is 200': (r) => r.status === 200,
        }) || errorRate.add(1); // Add to errorRate if check fails
    });

    // Pause for a second between iterations
    sleep(1);
}
