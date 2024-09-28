# Load Test Report - API Performance Testing

This document outlines the results of load testing conducted on the Moralis API endpoint using k6. The test simulates different user loads to evaluate API performance, stability, and scalability.
# Table of Contents
1. [Test Overview](#test-overview)
    - API Endpoint
    - Test Objective
    - Test Environment
2. [Test Configuration](#test-configuration)
    - Stages
    - Thresholds
    - API Key and Headers
3. [Key Metrics](#key-metrics)
    - Response Times
    - Requests Per Second (RPS)
    - Error Rate
    - Throughput
4. [Performance Observations](#performance-observations)
    - Peak Load Behavior
    - Response Time
    - Error Rate
    - Threshold Breach
5. [Recommendations](#recommendations)
    - Improve Response Times
    - Scaling and Load Testing
    - Threshold Adjustments
6. [Test Scripts and Execution](#test-scripts-and-execution)
    - How to Run the Test
    - k6 Script Overview
7. [Install K6](#Install-K6)


## Test Overview

| Parameter             | Value                                                                                   |
|-----------------------|-----------------------------------------------------------------------------------------|
| **API Endpoint**       | `GET /api/v2.2/0xff3879b8a363aed92a6eaba8f61f1a96a9ec3c1e/nft`                          |
| **Test Objective**     | Evaluate the API's response time, throughput, error rates, and scalability under load.  |
| **Test Environment**   | Staging                                                                                 |
| **Client Machine**     | macOS, 8GB RAM, k6 v0.41.0                                                              |
| **Test Duration**      | 4 minutes                                                                               |
| **Virtual Users (VUs)**| Ramp-up from 0 to 10 VUs, sustain for 2 minutes, ramp down to 0                         |

## Test Configuration

| Parameter                  | Value                                                                                   |
|----------------------------|-----------------------------------------------------------------------------------------|
| **Stages**                  | 10 VUs for 1 min (ramp-up), 10 VUs for 2 min (steady), 0 VUs for 1 min (ramp-down)      |
| **Thresholds**              | 95% of requests must complete within 500 ms, less than 5% should fail with 404          |
| **API Key**                 | [REDACTED]                                                                              |
| **Headers**                 | `'accept': 'application/json', 'X-API-Key': '***'`                                      |

## Key Metrics

### 1. Response Times

| Metric                      | Value                        |
|-----------------------------|------------------------------|
| **Average Response Time**    | 3.06s                        |
| **95th Percentile**          | 5.5s                         |
| **Max Response Time**        | 5.86s                        |

### 2. Requests Per Second (RPS)

| Metric                      | Value                        |
|-----------------------------|------------------------------|
| **Average RPS**              | 1.88 RPS                     |
| **Peak RPS**                 | 2 RPS                        |

### 3. Error Rate

| Error Type                  | Value                        |
|-----------------------------|------------------------------|
| **4xx Errors (404)**         | 0%                           |
| **5xx Errors**               | 0%                           |
| **Failed Requests (Non-200)**| 23% (104 requests)           |

### 4. Throughput

| Metric                      | Value                        |
|-----------------------------|------------------------------|
| **Data Received**            | 43 MB                        |
| **Data Sent**                | 171 kB                       |

## Performance Observations

1. **Peak Load Behavior**:
    - The API handled up to 10 virtual users but struggled with request durations, as **23%** of the requests did not meet the **200 OK** status.

2. **Response Time**:
    - The **average response time** of **3.06 seconds** and the 95th percentile reaching **5.5 seconds** indicate significant latency under the load. This is well above the defined threshold of **500ms** for 95% of requests.

3. **Error Rate**:
    - No **404** or **500** errors were observed, but a considerable number of requests failed due to response times exceeding the thresholds.

4. **Threshold Breach**:
    - The threshold for **http_req_duration** was breached, which means the API did not meet the desired performance target of 95% of requests completing within 500ms.

## Recommendations

- **Improve Response Times**:
    - The response times are significantly higher than expected. Investigate the backend for potential bottlenecks or inefficiencies, such as database queries or external dependencies.

- **Scaling and Load Testing**:
    - Perform tests with a higher number of virtual users to observe how the system scales under increased load. Also, monitor server logs during tests to identify root causes of slowdowns.

- **Threshold Adjustments**:
    - Consider adjusting the performance thresholds if the 500ms requirement is too strict for the current API setup, or optimize the application to meet the defined performance criteria.

## Test Scripts and Execution

To replicate the load test, run the following k6 script located in the `/test/loadTest.js` file:

```bash
k6 run ./scripts/<test-script>.js
```

```Sample test run
k6 run ./scripts/getNFTByWallet.js


          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

     execution: local
        script: ./scripts/getNFTByWallet.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 4m30s max duration (incl. graceful stop):
              * default: Up to 10 looping VUs for 4m0s over 3 stages (gracefulRampDown: 30s, gracefulStop: 30s)


     ✗ status is 200
      ↳  77% — ✓ 350 / ✗ 104

     checks.........................: 77.09%  ✓ 350      ✗ 104 
     data_received..................: 43 MB   177 kB/s
     data_sent......................: 171 kB  709 B/s
     errors.........................: 100.00% ✓ 104      ✗ 0   
     http_req_blocked...............: avg=3.34ms   min=0s       med=2µs     max=328.6ms  p(90)=3µs      p(95)=3µs     
     http_req_connecting............: avg=1.38ms   min=0s       med=0s      max=90.74ms  p(90)=0s       p(95)=0s      
   ✗ http_req_duration..............: avg=3.06s    min=905.86ms med=2.52s   max=5.86s    p(90)=5.4s     p(95)=5.5s    
       { expected_response:true }...: avg=2.36s    min=905.86ms med=2.02s   max=5.86s    p(90)=4.19s    p(95)=4.8s    
     http_req_failed................: 22.90%  ✓ 104      ✗ 350 
     ✓ { status:404 }...............: 0.00%   ✓ 0        ✗ 0   
     http_req_receiving.............: avg=101.65ms min=38µs     med=64.08ms max=1.02s    p(90)=236.82ms p(95)=303.61ms
     http_req_sending...............: avg=189.97µs min=42µs     med=190.5µs max=1.39ms   p(90)=264µs    p(95)=286.34µs
     http_req_tls_handshaking.......: avg=1.81ms   min=0s       med=0s      max=237.51ms p(90)=0s       p(95)=0s      
     http_req_waiting...............: avg=2.96s    min=867.7ms  med=2.4s    max=5.73s    p(90)=5.36s    p(95)=5.45s   
     http_reqs......................: 454     1.883368/s
     iteration_duration.............: avg=4.07s    min=1.9s     med=3.52s   max=6.86s    p(90)=6.4s     p(95)=6.5s    
     iterations.....................: 454     1.883368/s
     vus............................: 1       min=1      max=10
     vus_max........................: 10      min=10     max=10


running (4m01.1s), 00/10 VUs, 454 complete and 0 interrupted iterations
default ✓ [======================================] 00/10 VUs  4m0s
ERRO[0242] thresholds on metrics 'http_req_duration' have been crossed 

```

## Install K6:

#### MacOS
```
brew install k6
```

#### MacOS
```
choco install k6
```
