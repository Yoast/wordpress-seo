<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Third_Party\CoAuthors_Plus_Activated_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class CoAuthors_Plus_Activated_Conditional_Test.
 *
 * @group conditionals
 * @group third-party
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Third_Party\CoAuthors_Plus_Activated_Conditional
 */
class CoAuthors_Plus_Activated_Conditional_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var CoAuthors_Plus_Activated_Conditional
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new CoAuthors_Plus_Activated_Conditional();
	}

	/**
	 * Tests that the condition is not met when the CoAuthors Plus plugin is not active.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met() {
		$this->assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests that the condition is met when the CoAuthors Plus plugin is active.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met() {
		if ( ! \defined( 'COAUTHORS_PLUS_VERSION' ) ) {
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- Third party constant used in a test.
			\define( 'COAUTHORS_PLUS_VERSION', 123 );
		}

		$this->assertTrue( $this->instance->is_met() );
	}
}
