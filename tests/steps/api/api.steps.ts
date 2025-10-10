import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

// User data management
Given('I have a new user with email {string}', async ({ apiContext }, email: string) => {
  apiContext.data = {
    name: 'Test User',
    email,
    username: email.split('@')[0],
  };
});

// HTTP Request steps
When('I send a GET request to {string}', async ({ request, apiContext }, endpoint: string) => {
  try {
    apiContext.response = await request.get(endpoint);
    apiContext.status = apiContext.response.status();
    
    if (apiContext.response.status() === 200) {
      apiContext.data = await apiContext.response.json();
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
});

// New step for trend data variation
Then('the response should have content', async ({ apiContext }) => {
  expect(apiContext.response).toBeTruthy();
  expect(apiContext.status).toBe(200);
  
  if (apiContext.response) {
    const responseData = await apiContext.response.json();
    expect(responseData).toBeTruthy();
    expect(Object.keys(responseData).length).toBeGreaterThan(0);
  }
  
  // Add some randomness for trend variation (simulate occasional issues)
  const randomFactor = Math.random();
  if (randomFactor < 0.1) { // 10% chance to simulate a slow response
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
});

When('I send a POST request to {string} with the user data', async ({ request, apiContext }, endpoint: string) => {
  apiContext.endpoint = endpoint;
  apiContext.response = await request.post(endpoint, {
    data: apiContext.data
  });
  apiContext.status = apiContext.response.status();
  
  if (apiContext.status === 201) {
    try {
      const responseData = await apiContext.response.json();
      apiContext.data = { ...apiContext.data, ...responseData };
    } catch {
      // If JSON parsing fails, keep original data
    }
  }
});

// Response validation steps
Then('the response status should be {int}', async ({ apiContext }, expectedStatus: number) => {
  expect(apiContext.status).toBe(expectedStatus);
});

Then('the response should contain the user ID', async ({ apiContext }) => {
  if (typeof apiContext.data === 'object' && apiContext.data !== null) {
    expect(apiContext.data).toHaveProperty('id');
    expect(apiContext.data.id).toBeTruthy();
  } else {
    const responseData = await apiContext.response?.json();
    expect(responseData).toHaveProperty('id');
    expect(responseData.id).toBeTruthy();
  }
});

Then('the response should be an array', async ({ apiContext }) => {
  let responseData = apiContext.data;
  if (!responseData) {
    responseData = await apiContext.response?.json();
  }
  expect(Array.isArray(responseData)).toBe(true);
});
