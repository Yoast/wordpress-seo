<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Features;

use Yoast\WP\SEO\Abilities\Infrastructure\Features\Open_Graph_Feature;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Open_Graph_Feature class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Features\Open_Graph_Feature
 */
final class Open_Graph_Feature_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Open_Graph_Feature
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Open_Graph_Feature();
	}

	/**
	 * Tests that the getters describe the feature.
	 *
	 * @covers ::get_key
	 * @covers ::get_option_name
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_getters() {
		$this->assertSame( 'open_graph', $this->instance->get_key() );
		$this->assertSame( 'opengraph', $this->instance->get_option_name() );
		$this->assertSame( 'Open Graph data', $this->instance->get_name() );
	}

	/**
	 * Tests that is_available always returns true, as the feature can be changed on every site.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Features\Abstract_Feature::is_available
	 *
	 * @return void
	 */
	public function test_is_available() {
		$this->assertTrue( $this->instance->is_available() );
	}

	/**
	 * Tests that is_disabled_programmatically always returns false, as only the setting turns the feature off.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\Infrastructure\Features\Abstract_Feature::is_disabled_programmatically
	 *
	 * @return void
	 */
	public function test_is_disabled_programmatically() {
		$this->assertFalse( $this->instance->is_disabled_programmatically() );
	}
}
