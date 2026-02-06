# Plan: Add Constructor Test for Schema_Aggregator_Indexables_Disabled_Alert

## Context
The source class at `src/schema-aggregator/application/schema-aggregator-indexables-disabled-alert.php` has 6 constructor dependencies:
1. `Yoast_Notification_Center` → `$notification_center`
2. `Short_Link_Helper` → `$short_link_helper`
3. `Options_Helper` → `$options_helper`
4. `Schema_Aggregator_Conditional` → `$schema_aggregator_conditional`
5. `User_Helper` → `$user_helper`
6. `Indexable_Helper` → `$indexable_helper`

## Steps

### Step 1: Create the Abstract Test Class
**File:** `tests/Unit/Schema_Aggregator/Application/Schema_Aggregator_Indexables_Disabled_Alert/Abstract_Schema_Aggregator_Indexables_Disabled_Alert_Test.php`

Following the pattern from `Abstract_Aggregate_Site_Schema_Command_Handler_Test.php`:
- Extends `TestCase`
- Declares protected mock properties for all 6 dependencies
- Declares protected `$instance` property
- `set_up()` method creates Mockery mocks and instantiates the class under test
- Includes `phpcs:disable` comments for long namespace/class names (consistent with other schema-aggregator tests)

### Step 2: Update the Constructor Test
**File:** `tests/Unit/Schema_Aggregator/Application/Schema_Aggregator_Indexables_Disabled_Alert/Constructor_Test.php`

Following the pattern from other Constructor_Test files:
- `final class` extending the abstract test
- `@covers` annotation on `::__construct`
- `@group schema-aggregator`
- Single `test_constructor()` method with `assertInstanceOf` + `getPropertyValue` for each of the 6 dependencies