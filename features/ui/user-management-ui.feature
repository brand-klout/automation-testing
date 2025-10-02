Feature: User Management UI
  As a platform user
  I want to access the homepage
  So that I can navigate using primary entry points

  Background:
    Given I am on the homepage

  @ui
  Scenario: Visit homepage
    Then I should see the "Get started" button

  @ui
  Scenario: Display main navigation elements
    Then I should see the "Get started" button
    And I should see the "Docs" link