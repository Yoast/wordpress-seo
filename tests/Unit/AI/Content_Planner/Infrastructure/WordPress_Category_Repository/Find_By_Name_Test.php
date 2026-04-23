<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Infrastructure\WordPress_Category_Repository;

use Brain\Monkey\Functions;
use Mockery;
use WP_Term;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;

/**
 * Tests the WordPress_Category_Repository find_by_name method.
 *
 * @group ai-content-planner
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Infrastructure\WordPress_Category_Repository::find_by_name
 */
final class Find_By_Name_Test extends Abstract_WordPress_Category_Repository_Test {

	/**
	 * Tests that a Category is returned with the correct data when the term exists.
	 *
	 * @return void
	 */
	public function test_returns_category_when_term_exists() {
		$term          = Mockery::mock( WP_Term::class );
		$term->name    = 'Travel';
		$term->term_id = 7;

		Functions\expect( 'get_term_by' )
			->once()
			->with( 'name', 'Travel', 'category' )
			->andReturn( $term );

		$result = $this->instance->find_by_name( 'Travel' );

		$this->assertInstanceOf( Category::class, $result );
		$this->assertSame(
			[
				'name' => 'Travel',
				'id'   => 7,
			],
			$result->to_array(),
		);
	}

	/**
	 * Tests that the blog's default category is returned when the named term does not exist.
	 *
	 * @dataProvider data_provider_not_found
	 *
	 * @param mixed $return_value The value returned by get_term_by.
	 *
	 * @return void
	 */
	public function test_returns_default_category_when_term_not_found( $return_value ) {
		$default_term          = Mockery::mock( WP_Term::class );
		$default_term->name    = 'Uncategorized';
		$default_term->term_id = 1;

		Functions\expect( 'get_term_by' )
			->once()
			->with( 'name', 'Non Existent', 'category' )
			->andReturn( $return_value );

		Functions\expect( 'get_option' )
			->once()
			->with( 'default_category' )
			->andReturn( '1' );

		Functions\expect( 'get_term' )
			->once()
			->with( 1, 'category' )
			->andReturn( $default_term );

		$result = $this->instance->find_by_name( 'Non Existent' );

		$this->assertInstanceOf( Category::class, $result );
		$this->assertSame(
			[
				'name' => 'Uncategorized',
				'id'   => 1,
			],
			$result->to_array(),
		);
	}

	/**
	 * Data provider for test_returns_default_category_when_term_not_found.
	 *
	 * @return array<mixed>
	 */
	public function data_provider_not_found(): array {
		return [
			'get_term_by returns false' => [ 'return_value' => false ],
			'get_term_by returns null'  => [ 'return_value' => null ],
		];
	}

	/**
	 * Tests that the empty-category sentinel name resolves to the blog's default category.
	 *
	 * @return void
	 */
	public function test_returns_default_category_for_empty_sentinel_name() {
		$default_term          = Mockery::mock( WP_Term::class );
		$default_term->name    = 'Uncategorized';
		$default_term->term_id = 1;

		Functions\expect( 'get_term_by' )
			->once()
			->with( 'name', '', 'category' )
			->andReturn( false );

		Functions\expect( 'get_option' )
			->once()
			->with( 'default_category' )
			->andReturn( '1' );

		Functions\expect( 'get_term' )
			->once()
			->with( 1, 'category' )
			->andReturn( $default_term );

		$result = $this->instance->find_by_name( '' );

		$this->assertInstanceOf( Category::class, $result );
		$this->assertSame(
			[
				'name' => 'Uncategorized',
				'id'   => 1,
			],
			$result->to_array(),
		);
	}
}
