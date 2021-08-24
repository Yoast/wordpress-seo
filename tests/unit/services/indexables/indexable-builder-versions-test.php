<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Indexables;

use Yoast\WP\SEO\Config\Indexable_Builder_Versions;
use Yoast\WP\SEO\Tests\Unit\Doubles\Config\Indexable_Builder_Versions_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Builder_Versions_Test.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Indexables\Indexable_Builder_Versions
 */
class Indexable_Builder_Versions_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Builder_Versions
	 */
	protected $instance;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Indexable_Builder_Versions();
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf( Indexable_Builder_Versions::class, $this->instance );
	}

	/**
	 * Tests the registration of the routes.
	 *
	 * @covers ::register_routes
	 */
	public function test_get_versions() {
		// Get the protected field from the test double.
		$versions = ( new Indexable_Builder_Versions_Double() )->get_versions();

		$this->assertEquals( 8, \count( $versions ) );
		$this->assertArrayHasKey( 'date-archive', $versions );
		$this->assertArrayHasKey( 'general', $versions );
		$this->assertArrayHasKey( 'home-page', $versions );
		$this->assertArrayHasKey( 'term', $versions );
		$this->assertArrayHasKey( 'post', $versions );
		$this->assertArrayHasKey( 'post-type-archive', $versions );
		$this->assertArrayHasKey( 'system-page', $versions );
		$this->assertArrayHasKey( 'user', $versions );
	}
}
