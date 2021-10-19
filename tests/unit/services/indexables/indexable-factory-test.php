<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Indexables;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\Unit\Doubles\Indexable_Factory_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Factory_Test.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Indexables\Indexable_Factory
 */
class Indexable_Factory_Test extends TestCase {
	/**
	 * Indexable types that behave somewhat differently.
	 *
	 * @var string[]
	 */
	protected $subtype_types = [
		'404',
		'search-result'
	];

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Factory_Double
	 */
	protected $instance;

	/**
	 * The mocked indexable used during the tests.
	 *
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->instance             = new Indexable_Factory_Double( $this->indexable_repository );
	}

	/**
	 * Test wether the default properties are set for each indexable type.
	 *
	 * @param string $indexable_type The type to test.
	 *
	 * @dataProvider data_provider_valid_indexable_types
	 *
	 * @covers ::get_defaults
	 */
	public function test_default_indexable_properties( $indexable_type ) {
		// Arrange

		// Act
		$result = $this->instance->double_get_defaults( $indexable_type );

		// Assert
		self::assertNotNull( $result );
		if ( ! in_array( $indexable_type, $this->subtype_types ) ) {
			self::assertEquals( $indexable_type, $result[ 'object_type' ] );
		}
		else {
			self::assertEquals( $indexable_type, $result[ 'object_sub_type' ] );
			self::assertEquals( 'system-page',    $result[ 'object_type' ] );
		}
	}

	/**
	 * Test wether the default properties are set for each indexable type.
	 *
	 * @param string $indexable_type The type to test.
	 *
	 * @dataProvider data_provider_valid_indexable_types
	 *
	 * @covers ::create
	 */
	public function test_create_indexable( $indexable_type ) {
		// Arrange.
		$orm = Mockery::mock( ORM::class );
		$this->indexable_repository
			->expects( 'query' )
			->withNoArgs()
			->andReturn( $orm );
		$orm->expects( 'create' )
			->withAnyArgs()
			->andReturn( "Code Path Verified" );

		// Act.
		$result = $this->instance->create( $indexable_type );

		// Assert
		self::assertNotNull( $result );
		self::assertEquals( "Code Path Verified", $result );
	}

    /**
	 * Provides an array of all known Indexable Types.
	 *
	 * Data provider for test_create_indexable().
	 *
	 * @return array The test data.
	 */
	public function data_provider_valid_indexable_types( )
	{
		return [
			[ 'date-archive' ],
			[ 'home-page' ],
			[ 'post' ],
			[ 'term' ],
			[ 'user' ],
			[ '404' ],
			[ 'search-result' ],
			[ 'any_other_string_value' ],
		];
	}
}

