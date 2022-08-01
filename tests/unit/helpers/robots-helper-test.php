<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Robots_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Robots_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Robots_Helper
 */
class Robots_Helper_Test extends TestCase {

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
	 */
	protected function set_up() {
		parent::set_up();

		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );
		$this->taxonomy_helper  = Mockery::mock( Taxonomy_Helper::class );

		$this->instance = new Robots_Helper( $this->post_type_helper, $this->taxonomy_helper );
	}

	/**
	 * Tests setting 'index' to 'noindex' when 'index' is set to 'index'.
	 *
	 * @covers ::set_robots_no_index
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
