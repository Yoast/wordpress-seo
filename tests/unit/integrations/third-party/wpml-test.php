<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Third_Party\WPML_Conditional;
use Yoast\WP\SEO\Integrations\Third_Party\WPML;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class WPML_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\WPML
 *
 * @group integrations
 * @group third-party
 */
class WPML_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var WPML
	 */
	protected $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new WPML();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ WPML_Conditional::class ],
			WPML::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'wpseo_home_url', [ $this->instance, 'filter_home_url_before' ] ) );
		$this->assertNotFalse( \has_filter( 'home_url', [ $this->instance, 'filter_home_url_after' ] ) );
	}

	/**
	 * Tests the result where our home url filter has been calld.
	 *
	 * @covers ::filter_home_url_before
	 */
	public function test_filter_home_url_before() {
		$this->instance->filter_home_url_before();

		$this->assertNotFalse( \has_filter( 'wpml_get_home_url', [ $this->instance, 'wpml_get_home_url' ] ) );
	}

	/**
	 * Tests the result of the method that applies the home_url filter.
	 *
	 * @covers ::filter_home_url_after
	 */
	public function test_filter_home_url_after() {
		$actual = $this->instance->filter_home_url_after( 'https://example.com' );

		$this->assertFalse( \has_filter( 'wpml_get_home_url', [ $this->instance, 'wpml_get_home_url' ] ) );
		$this->assertEquals( 'https://example.com', $actual );
	}

	/**
	 * Tests the result of the home url filter method.
	 *
	 * @covers ::wpml_get_home_url
	 */
	public function test_wpml_get_home_url() {
		$this->assertEquals( 'https://example.com', $this->instance->wpml_get_home_url( 'https://example.com/home', 'https://example.com' ) );
	}
}
