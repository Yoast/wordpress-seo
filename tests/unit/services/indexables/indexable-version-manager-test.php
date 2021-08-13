<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Indexables;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Services\Indexables\Indexable_Version_Manager;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Version_Manager_Test.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Indexable_Version_Manager
 */
class Indexable_Version_Manager_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Version_Manager
	 */
	protected $instance;

	/**
	 * The mocked indexable used during the tests.
	 *
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Indexable_Version_Manager();
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf( Indexable_Version_Manager::class, $this->instance );
	}

	/**
	 * Tests the registration of the routes.
	 *
	 * @covers ::register_routes
	 */
	public function test_get_versions() {

		$versions = $this->instance->get_version_by_type();

		$this->assertEquals( 6, \count( $versions ) );
		$this->assertArrayHasKey( 'general', $versions );
		$this->assertArrayHasKey( 'post', $versions );
		$this->assertArrayHasKey( 'post_type_archive', $versions );
		$this->assertArrayHasKey( 'term', $versions );
		$this->assertArrayHasKey( 'post_link', $versions );
		$this->assertArrayHasKey( 'term_link', $versions );
	}

	/**
	 * Tests the indexable_needs_upgrade route for a low indexable version.
	 *
	 * @covers ::indexable_needs_upgrade
	 */
	public function test_needs_upgrade_if_Indexable_version_too_low() {
		// Arrange.
		$versions = $this->instance->get_version_by_type();

		// Force lower version; this unit test updates automatically with newer versions.
		$this->setup_indexable( 'post', $versions[ 'post' ] - 1 );

		// Act.
		$result = $this->instance->indexable_needs_upgrade( $this->indexable );

		// Assert.
		$this->assertTrue( $result );
	}

	/**
	 * Tests the indexable_needs_upgrade route for an equal indexable version.
	 *
	 * @covers ::indexable_needs_upgrade
	 */
	public function test_needs_upgrade_if_Indexable_version_same() {
		// Arrange.
		$versions = $this->instance->get_version_by_type();


		// Force identical version; this unit test updates automatically with newer versions.
		$this->setup_indexable( 'post', $versions[ 'post' ] );

		// Act.
		$result = $this->instance->indexable_needs_upgrade( $this->indexable );

		// Assert.
		$this->assertFalse( $result );
	}

	/**
	 * Tests the indexable_needs_upgrade route for an equal indexable version.
	 *
	 * @covers ::indexable_needs_upgrade
	 */
	public function test_needs_upgrade_if_Indexable_version_higher() {
		// Arrange.
		$versions = $this->instance->get_version_by_type();

		// Force higher version; this unit test updates automatically with newer versions.
		$this->setup_indexable( 'post', $versions[ 'post' ] + 1 );

		// Act.
		$result = $this->instance->indexable_needs_upgrade( $this->indexable );

		// Assert.
		$this->assertFalse( $result );
	}

	protected function setup_indexable( $obj_type = 'post', $version = 1 ) {
		// Setup the Indexable mock and its ORM layer.
		$this->indexable      = Mockery::mock( Indexable_Mock::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$this->indexable->object_type = $obj_type;
		$this->indexable->version = $version;
	}
}
