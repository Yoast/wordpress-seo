<?php

namespace Yoast\WP\SEO\Tests\Unit\Config;

use Brain\Monkey;
use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Schema_Types class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Config\Schema_Types
 */
final class Schema_Types_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Schema_Types
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Schema_Types();
	}

	/**
	 * Tests that get_article_types returns the article types, including the ones added through the filter.
	 *
	 * @covers ::get_article_types
	 *
	 * @return void
	 */
	public function test_get_article_types() {
		Monkey\Filters\expectApplied( 'wpseo_schema_article_types' )
			->once()
			->with( Schema_Types::ARTICLE_TYPES )
			->andReturn(
				[
					'Article' => '',
					'Recipe'  => '',
				],
			);

		$this->assertSame( [ 'Article', 'Recipe' ], $this->instance->get_article_types() );
	}

	/**
	 * Tests that get_article_types falls back to the default article types when the filter does not return an array.
	 *
	 * @covers ::get_article_types
	 *
	 * @return void
	 */
	public function test_get_article_types_with_invalid_filter() {
		Monkey\Filters\expectApplied( 'wpseo_schema_article_types' )->once()->andReturn( 'Article' );

		$this->assertSame( \array_keys( Schema_Types::ARTICLE_TYPES ), $this->instance->get_article_types() );
	}
}
