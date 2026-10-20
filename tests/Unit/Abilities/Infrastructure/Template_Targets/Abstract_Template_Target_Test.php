<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Template_Targets;

use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Abstract_Template_Target;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Abstract_Template_Target class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Abstract_Template_Target
 */
final class Abstract_Template_Target_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Abstract_Template_Target
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new class() extends Abstract_Template_Target {

			/**
			 * Returns the name of the target.
			 *
			 * @return string The name.
			 */
			public function get_name(): string {
				return 'test_target';
			}
		};
	}

	/**
	 * Tests the defaults: identified by its name only, not shared, enabled, without URL, and always available.
	 *
	 * @covers ::get_identifiers
	 * @covers ::is_shared
	 * @covers ::is_enabled
	 * @covers ::get_url
	 * @covers ::ensure_available
	 *
	 * @return void
	 */
	public function test_defaults() {
		$this->instance->ensure_available();

		$this->assertSame( [ 'target' => 'test_target' ], $this->instance->get_identifiers() );
		$this->assertFalse( $this->instance->is_shared() );
		$this->assertTrue( $this->instance->is_enabled() );
		$this->assertNull( $this->instance->get_url() );
	}

	/**
	 * Tests that format_option_name returns the option pattern as is.
	 *
	 * @covers ::format_option_name
	 *
	 * @return void
	 */
	public function test_format_option_name() {
		$this->assertSame( 'title-author-wpseo', $this->instance->format_option_name( 'title-author-wpseo' ) );
	}
}
