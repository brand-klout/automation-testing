Feature: User Management
  As a platform and system user
  I want to validate backend (API) and frontend (UI) capabilities
  So that I am confident both layers function correctly

  # API Scenarios (@api)
  @api
  Scenario: Get user list via API
    When I send a GET request to "/users"
    Then the response status should be 200
    And the response should be an array

  @api
  Scenario: Create user via API
    Given I have a new user with email "test@example.com"
    When I send a POST request to "/users" with the user data
    Then the response status should be 201
    And the response should contain the user ID

  @api
  Scenario: Create another user via API
    Given I have a new user with email "second@example.com"
    When I send a POST request to "/users" with the user data
    Then the response status should be 201
    And the response should contain the user ID

  # UI Scenarios (@ui)
  @ui
  Scenario: Visit homepage
    Given I am on the homepage
    Then I should see the "Get started" button

  @ui
  Scenario: Display main navigation elements
    Given I am on the homepage
    Then I should see the "Get started" button
    And I should see the "Docs" link

  @ui
  Scenario: View homepage then see Docs link
    Given I am on the homepage
    Then I should see the "Docs" link

    @api @ui
    Scenario: Classification only: homepage visibility (dual-tag)
      Given I am on the homepage
      Then I should see the "Get started" button