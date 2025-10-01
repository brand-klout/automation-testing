Feature: Homepage Navigation
  As a user visiting the website
  I want to navigate through the homepage
  So that I can access different sections of the site

  Background:
    Given I am on the homepage

  @ui
  Scenario: Display main navigation elements
    Then I should see the "Get started" button
    And I should see the "Docs" link

  @ui
  Scenario: Visit homepage successfully
    Then I should see the "Get started" button