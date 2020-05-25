<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Routes
 */

namespace Yoast\WP\SEO\Tests\Routes;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexables\Indexable_Head_Action;
use Yoast\WP\SEO\Conditionals\Headless_Rest_Endpoints_Enabled_Conditional;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Routes\Yoast_Head_REST_Field;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Yoast_Head_REST_Field_Test class
 *
 * @coversDefaultClass Yoast\WP\SEO\Routes\Yoast_Head_REST_Field
 *
 * @group routes
 * @group indexables
 */
class Yoast_Head_REST_Field_Test extends TestCase {

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * The taxonomy helper.
	 *
	 * @var Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * The head action.
	 *
	 * @var Indexable_Head_Action
	 */
	protected $head_action;

	/**
	 * The test instance
	 *
	 * @var Yoast_Head_REST_Field
	 */
	protected $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );
		$this->taxonomy_helper  = Mockery::mock( Taxonomy_Helper::class );
		$this->head_action      = Mockery::mock( Indexable_Head_Action::class );

		$this->instance = new Yoast_Head_REST_Field(
			$this->post_type_helper,
			$this->taxonomy_helper,
			$this->head_action
		);
	}

	/**
	 * Tests the get conditionals function.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [ Headless_Rest_Endpoints_Enabled_Conditional::class ], Yoast_Head_REST_Field::get_conditionals() );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertAttributeInstanceOf( Post_Type_Helper::class, 'post_type_helper', $this->instance );
		$this->assertAttributeInstanceOf( Taxonomy_Helper::class, 'taxonomy_helper', $this->instance );
		$this->assertAttributeInstanceOf( Indexable_Head_Action::class, 'head_action', $this->instance );
	}

	/**
	 * Tests the register routes function.
	 *
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		$this->post_type_helper
			->expects( 'get_public_post_types' )
			->once()
			->andReturn( [ 'post_type' ] );

		$this->taxonomy_helper
			->expects( 'get_public_taxonomies' )
			->once()
			->andReturn( [ 'taxonomy', 'post_tag' ] );

		Monkey\Functions\expect( 'register_rest_field' )
			->once()
			->with(
				'post_type',
				Yoast_Head_REST_Field::YOAST_HEAD_FIELD_NAME,
				[ 'get_callback' => [ $this->instance, 'for_post' ] ]
			);

		Monkey\Functions\expect( 'register_rest_field' )
			->once()
			->with(
				'taxonomy',
				Yoast_Head_REST_Field::YOAST_HEAD_FIELD_NAME,
				[ 'get_callback' => [ $this->instance, 'for_term' ] ]
			);

		Monkey\Functions\expect( 'register_rest_field' )
			->once()
			->with(
				'tag',
				Yoast_Head_REST_Field::YOAST_HEAD_FIELD_NAME,
				[ 'get_callback' => [ $this->instance, 'for_term' ] ]
			);

		Monkey\Functions\expect( 'register_rest_field' )
			->once()
			->with(
				'user',
				Yoast_Head_REST_Field::YOAST_HEAD_FIELD_NAME,
				[ 'get_callback' => [ $this->instance, 'for_author' ] ]
			);

		Monkey\Functions\expect( 'register_rest_field' )
			->once()
			->with(
				'type',
				Yoast_Head_REST_Field::YOAST_HEAD_FIELD_NAME,
				[ 'get_callback' => [ $this->instance, 'for_post_type_archive' ] ]
			);

		$this->instance->register_routes();
	}

	/**
	 * Tests adding the yoast_head property for all functions.
	 *
	 * @covers ::for_post
	 * @covers ::for_term
	 * @covers ::for_author
	 * @covers ::for_post_type_archive
	 *
	 * @dataProvider method_provider
	 *
	 * @param string $method The method to test.
	 * @param array  $params The arguments to use.
	 * @param mixed  $input  The input for the head_action.
	 */
	public function test_adding_yoast_head( $method, $params, $input ) {
		$this->head_action
			->expects( $method )
			->once()
			->with( $input )
			->andReturn(
				(object) [
					'status' => 200,
					'head'   => 'this is the head',
				]
			);

		if ( $method === 'for_post_type_archive' ) {
			$this->post_type_helper->expects( 'has_archive' )->with( $input )->andReturnTrue();
		}

		$this->assertEquals( 'this is the head', $this->instance->{$method}( $params ) );
	}

	/**
	 * Tests adding the yoast_head property for the posts page.
	 *
	 * @covers ::for_post_type_archive
	 *
	 * @dataProvider method_provider
	 */
	public function test_adding_yoast_head_to_posts_page() {
		$this->head_action
			->expects( 'for_posts_page' )
			->once()
			->andReturn(
				(object) [
					'status' => 200,
					'head'   => 'this is the head',
				]
			);

		$this->assertEquals( 'this is the head', $this->instance->for_post_type_archive( [ 'slug' => 'post' ] ) );
	}

	/**
	 * Tests adding the yoast_head property for the posts page.
	 *
	 * @covers ::for_post_type_archive
	 *
	 * @dataProvider method_provider
	 */
	public function test_adding_yoast_head_to_post_type_without_archive() {
		$this->post_type_helper->expects( 'has_archive' )->with( 'no-archive' )->andReturnFalse();

		$this->assertNull( $this->instance->for_post_type_archive( [ 'slug' => 'no-archive' ] ) );
	}

	/**
	 * Tests adding the yoast_head property for all functions.
	 *
	 * @covers ::for_post
	 * @covers ::for_term
	 * @covers ::for_author
	 * @covers ::for_post_type_archive
	 *
	 * @dataProvider method_provider
	 *
	 * @param string $method The method to test.
	 * @param array  $params The arguments to use.
	 * @param mixed  $input  The input for the head_action.
	 */
	public function test_adding_yoast_head_with_404( $method, $params, $input ) {
		$this->head_action
			->expects( $method )
			->once()
			->with( $input )
			->andReturn(
				(object) [
					'status' => 404,
					'head'   => 'this is the 404 head',
				]
			);

		if ( $method === 'for_post_type_archive' ) {
			$this->post_type_helper->expects( 'has_archive' )->with( $input )->andReturnTrue();
		}

		$this->assertNull( $this->instance->{$method}( $params ) );
	}

	/**
	 * Tests adding the yoast_head property for the posts page.
	 *
	 * @covers ::for_post_type_archive
	 *
	 * @dataProvider method_provider
	 */
	public function test_adding_yoast_head_to_posts_page_with_404() {
		$this->head_action
			->expects( 'for_posts_page' )
			->once()
			->andReturn(
				(object) [
					'status' => 404,
					'head'   => 'this is the 404 head',
				]
			);

		$this->assertNull( $this->instance->for_post_type_archive( [ 'slug' => 'post' ] ) );
	}

	/**
	 * Data provider for the tests.
	 *
	 * @return array A mapping of methods and expected inputs.
	 */
	public function method_provider() {
		return [
			[
				'for_post',
				[ 'id' => 1 ],
				1,
			],
			[
				'for_term',
				[ 'id' => 1 ],
				1,
			],
			[
				'for_author',
				[ 'id' => 1 ],
				1,
			],
			[
				'for_post_type_archive',
				[ 'slug' => 'type' ],
				'type',
			],
		];
	}
}
