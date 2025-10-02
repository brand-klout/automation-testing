Feature: User Management API
  As a system administrator
  I want to manage users via the public API
  So that backend operations are validated

  @api
  Scenario: Get user list
    When I send a GET request to "/users"
    Then the response status should be 200
    And the response should be an array

  @api
  Scenario: Create user
    Given I have a new user with email "test@example.com"
    When I send a POST request to "/users" with the user data
    Then the response status should be 201
    And the response should contain the user ID