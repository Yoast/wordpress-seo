<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Robots_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Robots_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Robots_Helper
 */
final class Robots_Helper_Test extends TestCase {

	/**
	 * Represents the robots helper.
	 *
	 * @var Robots_Helper
	 */
	private $instance;

	/**
	 * Represents the Post_Type_Helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Represents the Taxonomy_Helper.
	 *
	 * @var Mockery\MockInterface|Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );
		$this->taxonomy_helper  = Mockery::mock( Taxonomy_Helper::class );

		$this->instance = new Robots_Helper( $this->post_type_helper, $this->taxonomy_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Post_Type_Helper::class,
			$this->getPropertyValue( $this->instance, 'post_type_helper' )
		);
		$this->assertInstanceOf(
			Taxonomy_Helper::class,
			$this->getPropertyValue( $this->instance, 'taxonomy_helper' )
		);
	}

	/**
	 * Tests that the indexable returns true when `is_robots_noindex` is false.
	 *
	 * @covers ::is_indexable
	 *
	 * @return void
	 */
	public function test_is_indexable_true() {
		$indexable                    = Mockery::mock( Indexable_Mock::class );
		$indexable->is_robots_noindex = false;

		$this->assertTrue( $this->instance->is_indexable( $indexable ) );
	}

	/**
	 * Tests that the indexable returns false when `is_robots_noindex` is true.
	 *
	 * @covers ::is_indexable
	 *
	 * @return void
	 */
	public function test_is_indexable_false() {
		$indexable                    = Mockery::mock( Indexable_Mock::class );
		$indexable->is_robots_noindex = true;

		$this->assertFalse( $this->instance->is_indexable( $indexable ) );
	}

	/**
	 * Tests that the post type setting is checked when the indexable does not have an override.
	 *
	 * @covers ::is_indexable
	 *
	 * @return void
	 */
	public function test_is_indexable_post_type() {
		$indexable                    = Mockery::mock( Indexable_Mock::class );
		$indexable->is_robots_noindex = null;
		$indexable->object_type       = 'post';
		$indexable->object_sub_type   = 'post';

		$this->post_type_helper->expects( 'is_indexable' )->with( $indexable->object_sub_type )->andReturns( true );

		$this->assertTrue( $this->instance->is_indexable( $indexable ) );
	}

	/**
	 * Tests that the taxonomy setting is checked when the indexable does not have an override.
	 *
	 * @covers ::is_indexable
	 *
	 * @return void
	 */
	public function test_is_indexable_taxonomy() {
		$indexable                    = Mockery::mock( Indexable_Mock::class );
		$indexable->is_robots_noindex = null;
		$indexable->object_type       = 'term';
		$indexable->object_sub_type   = 'category';

		$this->taxonomy_helper->expects( 'is_indexable' )->with( $indexable->object_sub_type )->andReturns( true );

		$this->assertTrue( $this->instance->is_indexable( $indexable ) );
	}

	/**
	 * Tests setting 'index' to 'noindex' when 'index' is set to 'index'.
	 *
	 * @covers ::set_robots_no_index
	 *
	 * @return void
	 */
	public function test_set_robots_no_index() {
		$this->assertEquals(
			[
				'index'  => 'noindex',
				'follow' => 'follow',
			],
			$this->instance->set_robots_no_index(
				[
					'index'  => 'index',
					'follow' => 'follow',
				]
			)
		);
	}

	/**
	 * Tests setting 'index' to 'noindex' when a string is passed instead of an array.
	 *
	 * @covers ::set_robots_no_index
	 *
	 * @return void
	 */
	public function test_set_robots_no_index_string_given() {
		Monkey\Functions\expect( '_deprecated_argument' )
			->with(
				Robots_Helper::class . '::set_robots_no_index',
				'14.1',
				'$robots has to be a key-value paired array.'
			);

		$this->assertEquals(
			'noindex,follow',
			$this->instance->set_robots_no_index( 'noindex,follow' )
		);
	}
}
