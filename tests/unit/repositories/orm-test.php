<?php

namespace Yoast\WP\SEO\Tests\Unit\Repositories;

use doubles\lib\Orm_Double;
use InvalidArgumentException;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Orm_Test.
 *
 * @coversDefaultClass \Yoast\WP\Lib\ORM
 */
class Orm_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Orm_Double
	 */
	protected $instance;

	/**
	 * Setup the test.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Orm_Double( 'test', [] );
	}

	/**
	 * Test_insert_many_throws_on_invalid_argument.
	 *
	 * @covers ::insert_many
	 */
	public function test_insert_many_throws_on_invalid_argument() {
		// Arrange.
		$models = $this;
		$this->expectException( InvalidArgumentException::class );

		// Act.
		$result = $this->instance->insert_many( $models );

		// Assert.
	}

	/**
	 * Test_insert_many_early_return_for_empty_array.
	 *
	 * @covers ::insert_many
	 */
	public function test_insert_many_early_return_for_empty_array() {
		// Arrange.
		$models = [];

		// Act.
		$result = $this->instance->insert_many( $models );

		// Assert.
		$this->assertTrue( $result );
	}

	/**
	 * Test_insert_many_throws_on_not_new_model.
	 *
	 * @covers ::insert_many
	 */
	public function test_insert_many_throws_on_not_new_model() {
		// Arrange.
		$orm = Mockery::mock( ORM::class );
		$orm->expects( 'is_new' )
			->withNoArgs()
			->andReturn( false );
		$indexable      = Mockery::mock( Indexable::class );
		$indexable->orm = $orm;

		$models = [
			$indexable,
		];

		$this->expectException( InvalidArgumentException::class );

		// Act.
		$result = $this->instance->insert_many( $models );

		// Assert.
	}
}
