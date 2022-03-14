<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Indexables;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Services\Indexables\Indexable_Version_Manager;
use Yoast\WP\SEO\Tests\Unit\Doubles\Config\Indexable_Builder_Versions_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Class Indexable_Version_Manager_Test.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Indexables\Indexable_Version_Manager
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
	 * The mocked version numbers of each indexable type.
	 *
	 * @var Indexable_Builder_Versions_Double
	 */
	protected $indexable_versions;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_versions = new Indexable_Builder_Versions_Double();
		$this->instance           = new Indexable_Version_Manager( $this->indexable_versions );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		self::assertInstanceOf(
			Indexable_Builder_Versions::class,
			self::getPropertyValue( $this->instance, 'indexable_builder_versions' )
		);
	}

	/**
	 * Tests the indexable_needs_upgrade route for a low indexable version.
	 *
	 * @covers ::needs_upgrade
	 * @covers ::indexable_needs_upgrade
	 */
	public function test_needs_upgrade_if_Indexable_version_too_low() {
		// Arrange.
		// Set the builder to version 2.
		$this->indexable_versions->mock_version( 'post', 2 );

		// Set the indexable to a lower version.
		$this->setup_indexable( 'post', 1 );

		// Act.
		$result = $this->instance->indexable_needs_upgrade( $this->indexable );

		// Assert.
		$this->assertTrue( $result );
	}

	/**
	 * Tests the indexable_needs_upgrade route for an equal indexable version.
	 *
	 * @covers ::needs_upgrade
	 * @covers ::indexable_needs_upgrade
	 */
	public function test_needs_upgrade_if_Indexable_version_same() {
		// Arrange.

		// Set the builder to version 2.
		$this->indexable_versions->mock_version( 'post', 2 );

		// Set the indexable to the same version.
		$this->setup_indexable( 'post', 2 );

		// Act.
		$result = $this->instance->indexable_needs_upgrade( $this->indexable );

		// Assert.
		$this->assertFalse( $result );
	}

	/**
	 * Tests the indexable_needs_upgrade route for an equal indexable version.
	 *
	 * @covers ::needs_upgrade
	 * @covers ::indexable_needs_upgrade
	 */
	public function test_needs_upgrade_if_Indexable_version_higher() {
		// Arrange.
		// Set the builder to version 2.
		$this->indexable_versions->mock_version( 'post', 2 );

		// Set the indexable to a higher version.
		$this->setup_indexable( 'post', 3 );

		// Act.
		$result = $this->instance->indexable_needs_upgrade( $this->indexable );

		// Assert.
		$this->assertFalse( $result );
	}

	/**
	 * Tests the indexable_needs_upgrade route for an unknown indexable type.
	 *
	 * @covers ::needs_upgrade
	 * @covers ::indexable_needs_upgrade
	 */
	public function test_needs_upgrade_if_Indexable_type_unknown() {
		// Arrange.

		// Use an unknown object type so that the version cannot be determined.
		$this->setup_indexable( 'this object type does not exist', 1 );

		// Act.
		$result = $this->instance->indexable_needs_upgrade( $this->indexable );

		// Assert.
		$this->assertFalse( $result );
	}

	/**
	 * Configures the mocked Indexable.
	 *
	 * @param string $obj_type The object type of the indexable under test.
	 * @param int    $version  The current version of the indexable under test.
	 */
	protected function setup_indexable( $obj_type = 'post', $version = 0 ) {
		// Setup the Indexable mock and its ORM layer.
		$this->indexable      = Mockery::mock( Indexable_Mock::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$this->indexable->object_type = $obj_type;
		$this->indexable->version     = $version;
	}
}
