Feature: BrandKlout Core Testing
  As a BrandKlout platform user
  I want to verify the system functionality
  So that I can ensure quality and reliability

  Background:
  Given the BrandKlout platform is available

  # API Tests
  @api @smoke
  Scenario: API health check
    When I send a GET request to "/users"
    Then the response status should be 200
    And the response should be an array

  @api
  Scenario: Create user via API
  Given I have a new user with email "test@brandklout.com"
    When I send a POST request to "/users" with the user data
    Then the response status should be 201
    And the response should contain the user ID

  # UI Tests
  @ui @smoke
  Scenario: Homepage accessibility
    Given I am on the homepage
    Then I should see the main navigation menu
    And I should see the "Get Started" button

  @ui
  Scenario: Navigation functionality
    Given I am on the homepage
    Then I should see the "Docs" link
  And I should see the BrandKlout logo

  # Integration Test
  @api @ui @smoke
  Scenario: Platform integration check
    Then I can access the platform via API
    And I can access the platform via UI
    And the platform should be fully operational