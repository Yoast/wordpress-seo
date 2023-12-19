<?php

namespace Yoast\WP\SEO\Tests\Unit\Config;

use Yoast\WP\SEO\Config\Badge_Group_Names;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Badge_Group_Names_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Config\Badge_Group_Names
 */
final class Badge_Group_Names_Test extends TestCase {

	/* We'll be testing with this existing group. */
	public const TESTING_GROUP = Badge_Group_Names::GROUP_GLOBAL_TEMPLATES;

	/* The group we're testing will no longer be considered new from this version onwards. */
	public const VERSION_NO_LONGER_NEW = '16.7';

	/* The group we're testing will no longer be considered new from this RC version onwards. */
	public const VERSION_NO_LONGER_NEW_RC = '16.7-RC1';

	/* The group we're testing will still be considered new on this version. */
	public const VERSION_STILL_NEW = '16.6';

	/* The group we're testing is not considered new on this version. */
	public const VERSION_NEXT_MINOR = '16.8';

	/* The group we're testing is definitely not considered new on this version. */
	public const VERSION_NEXT_MAJOR = '17.0';

	/**
	 * The test instance.
	 *
	 * @var Badge_Group_Names
	 */
	protected $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Badge_Group_Names();
	}

	/**
	 * Tests whether an unknown group is eligible for a "new" badge.
	 *
	 * @covers ::is_still_eligible_for_new_badge
	 *
	 * @return void
	 */
	public function test_unknown_group_is_eligible_for_new_badge() {
		$unknown_group = 'unknown_group';

		self::assertFalse(
			$this->instance->is_still_eligible_for_new_badge( $unknown_group ),
			'Group "' . $unknown_group . '" should not exist and should not be considered "new"'
		);
	}

	/**
	 * Tests if the global templates group is no longer eligible for a "new" badge on the set version.
	 *
	 * @covers ::is_still_eligible_for_new_badge
	 *
	 * @return void
	 */
	public function test_global_templates_group_is_eligible_for_new_badge() {
		$expiry_version = self::VERSION_NO_LONGER_NEW;

		self::assertFalse(
			$this->instance->is_still_eligible_for_new_badge( self::TESTING_GROUP, $expiry_version ),
			\sprintf( 'Group should not be "new" on version %s', $expiry_version )
		);
	}

	/**
	 * Tests if the global templates group is no longer eligible for a "new" badge on the set RC version.
	 *
	 * @covers ::is_still_eligible_for_new_badge
	 *
	 * @return void
	 */
	public function test_global_templates_group_is_eligible_for_new_badge_release_candidate() {
		$expiry_version = self::VERSION_NO_LONGER_NEW_RC;

		self::assertFalse(
			$this->instance->is_still_eligible_for_new_badge( self::TESTING_GROUP, $expiry_version ),
			\sprintf( 'Group should not be "new" on version %s', $expiry_version )
		);
	}

	/**
	 * Tests if the global templates group is no longer eligible for a "new" badge on the next minor version.
	 *
	 * @covers ::is_still_eligible_for_new_badge
	 *
	 * @return void
	 */
	public function test_global_templates_group_no_longer_eligible_for_new_badge_on_next_minor() {
		$expiry_version = self::VERSION_NEXT_MINOR;

		self::assertFalse(
			$this->instance->is_still_eligible_for_new_badge( self::TESTING_GROUP, $expiry_version ),
			\sprintf( 'Group should not be "new" on version %s', $expiry_version )
		);
	}

	/**
	 * Tests if the global templates group is no longer eligible for a "new" badge on the next major version.
	 *
	 * @covers ::is_still_eligible_for_new_badge
	 *
	 * @return void
	 */
	public function test_global_templates_group_no_longer_eligible_for_new_badge_on_next_major() {
		$expiry_version = self::VERSION_NEXT_MAJOR;

		self::assertFalse(
			$this->instance->is_still_eligible_for_new_badge( self::TESTING_GROUP, $expiry_version ),
			\sprintf( 'Group should not be "new" on version %s', $expiry_version )
		);
	}

	/**
	 * Tests if the global templates group is eligible for a "new" badge on the previous version.
	 *
	 * @covers ::is_still_eligible_for_new_badge
	 *
	 * @return void
	 */
	public function test_global_templates_group_no_longer_eligible_for_new_badge_on_previous_version() {
		$expiry_version = self::VERSION_STILL_NEW;

		self::assertTrue(
			$this->instance->is_still_eligible_for_new_badge( self::TESTING_GROUP, $expiry_version ),
			\sprintf( 'Group should be "new" on version %s', $expiry_version )
		);
	}
}
