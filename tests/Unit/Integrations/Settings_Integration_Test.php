<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Conditionals\Settings_Conditional;
use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Content_Type_Visibility\Application\Content_Type_Visibility_Dismiss_Notifications;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Language_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Schema\Article_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Helpers\Woocommerce_Helper;
use Yoast\WP\SEO\Integrations\Settings_Integration;
use Yoast\WP\SEO\Tests\Unit\Doubles\Integrations\Settings_Integration_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Settings_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Settings_Integration
 *
 * @group integrations
 */
final class Settings_Integration_Test extends TestCase {

	/**
	 * The class under test.
	 *
	 * @var Settings_Integration
	 */
	protected $instance;

	/**
	 * The class under test.
	 *
	 * @var Settings_Integration_Double
	 */
	protected $instance_double;

	/**
	 * Holds the Post_Type_Helper instance.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * Holds the Article_Helper instance.
	 *
	 * @var Mockery\MockInterface|Article_Helper
	 */
	private $article_helper;

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * Runs the setup to prepare the needed instance
	 *
	 * @return void
	 */
	public function set_up() {
		$asset_manager           = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$replace_vars            = Mockery::mock( WPSEO_Replace_Vars::class );
		$schema_types            = Mockery::mock( Schema_Types::class );
		$current_page_helper     = Mockery::mock( Current_Page_Helper::class );
		$this->post_type_helper  = Mockery::mock( Post_Type_Helper::class );
		$language_helper         = Mockery::mock( Language_Helper::class );
		$taxonomy_helper         = Mockery::mock( Taxonomy_Helper::class );
		$product_helper          = Mockery::mock( Product_Helper::class );
		$woocommerce_helper      = Mockery::mock( Woocommerce_Helper::class );
		$this->article_helper    = Mockery::mock( Article_Helper::class );
		$user_helper             = Mockery::mock( User_Helper::class );
		$this->options           = Mockery::mock( Options_Helper::class );
		$content_type_visibility = Mockery::mock( Content_Type_Visibility_Dismiss_Notifications::class );

		$this->instance = new Settings_Integration(
			$asset_manager,
			$replace_vars,
			$schema_types,
			$current_page_helper,
			$this->post_type_helper,
			$language_helper,
			$taxonomy_helper,
			$product_helper,
			$woocommerce_helper,
			$this->article_helper,
			$user_helper,
			$this->options,
			$content_type_visibility
		);

		$this->instance_double = new Settings_Integration_Double(
			$asset_manager,
			$replace_vars,
			$schema_types,
			$current_page_helper,
			$this->post_type_helper,
			$language_helper,
			$taxonomy_helper,
			$product_helper,
			$woocommerce_helper,
			$this->article_helper,
			$user_helper,
			$this->options,
			$content_type_visibility
		);
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				Settings_Conditional::class,
			],
			Settings_Integration::get_conditionals()
		);
	}

	/**
	 * Tests the addition of a submenu page.
	 *
	 * @covers ::add_settings_saved_page
	 *
	 * @return void
	 */
	public function test_add_submenu_page() {

		Monkey\Functions\expect( 'add_submenu_page' )
			->with( '', '', '', 'wpseo_manage_options', 'wpseo_page_settings_saved', Mockery::type( 'Closure' ) );

		$submenu_pages = [
			'array',
			'that',
			'should',
			'remain',
			'untouched',
		];

		$this->assertSame( $submenu_pages, $this->instance->add_settings_saved_page( $submenu_pages ) );
	}

	/**
	 * Tests construct method.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			$this->getPropertyValue( $this->instance, 'asset_manager' ),
			'asset_manager is set.'
		);
		$this->assertInstanceOf(
			WPSEO_Replace_Vars::class,
			$this->getPropertyValue( $this->instance, 'replace_vars' ),
			'replace_vars is set.'
		);
		$this->assertInstanceOf(
			Schema_Types::class,
			$this->getPropertyValue( $this->instance, 'schema_types' ),
			'schema_types is set.'
		);
		$this->assertInstanceOf(
			Current_Page_Helper::class,
			$this->getPropertyValue( $this->instance, 'current_page_helper' ),
			'current_page_helper is set.'
		);
		$this->assertInstanceOf(
			Post_Type_Helper::class,
			$this->getPropertyValue( $this->instance, 'post_type_helper' ),
			'post_type_helper is set.'
		);
		$this->assertInstanceOf(
			Language_Helper::class,
			$this->getPropertyValue( $this->instance, 'language_helper' ),
			'language_helper is set.'
		);
		$this->assertInstanceOf(
			Taxonomy_Helper::class,
			$this->getPropertyValue( $this->instance, 'taxonomy_helper' ),
			'taxonomy_helper is set.'
		);
		$this->assertInstanceOf(
			Product_Helper::class,
			$this->getPropertyValue( $this->instance, 'product_helper' ),
			'product_helper is set.'
		);
		$this->assertInstanceOf(
			Woocommerce_Helper::class,
			$this->getPropertyValue( $this->instance, 'woocommerce_helper' ),
			'woocommerce_helper is set.'
		);
		$this->assertInstanceOf(
			Article_Helper::class,
			$this->getPropertyValue( $this->instance, 'article_helper' ),
			'article_helper is set.'
		);
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' ),
			'user_helper is set.'
		);
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options' ),
			'Options helper is set.'
		);
		$this->assertInstanceOf(
			Content_Type_Visibility_Dismiss_Notifications::class,
			$this->getPropertyValue( $this->instance, 'content_type_visibility' ),
			'Content type visibility notifications is set.'
		);
	}

	/**
	 * Data provider for test_transform_post_types.
	 *
	 * @return array
	 */
	public static function data_provider_transform_post_types() {
		return [
			'New post type' => [
				'post_types'     => [
					'book' => (object) [
						'name'          => 'book',
						'label'         => 'Books',
						'rewrite'       => [ 'slug' => 'books' ],
						'rest_base'     => 'books',
						'labels'        => (object) [ 'singular_name' => 'Book' ],
						'singularLabel' => 'Book',
						'menu_position' => 5,
					],
				],
				'new_post_types' => [ 'book' ],
				'expected'       => [
					'book' => [
						'name'                 => 'book',
						'route'                => 'books',
						'label'                => 'Books',
						'singularLabel'        => 'Book',
						'hasArchive'           => true,
						'hasSchemaArticleType' => false,
						'menuPosition'         => 5,
						'isNew'                => true,
					],
				],
			],
			'Not new post type' => [
				'post_types'     => [
					'book' => (object) [
						'name'          => 'book',
						'label'         => 'Books',
						'rewrite'       => [ 'slug' => 'books' ],
						'rest_base'     => 'books',
						'labels'        => (object) [ 'singular_name' => 'Book' ],
						'singularLabel' => 'Book',
						'menu_position' => 5,
					],
				],
				'new_post_types' => [],
				'expected'       => [
					'book' => [
						'name'                 => 'book',
						'route'                => 'books',
						'label'                => 'Books',
						'singularLabel'        => 'Book',
						'hasArchive'           => true,
						'hasSchemaArticleType' => false,
						'menuPosition'         => 5,
						'isNew'                => false,
					],
				],
			],
		];
	}

	/**
	 * Tests transform_post_types method.
	 *
	 * @covers ::transform_post_types
	 *
	 * @dataProvider data_provider_transform_post_types
	 *
	 * @param array $post_types     The post types to transform.
	 * @param array $new_post_types The new post types.
	 * @param array $expected       The expected result.
	 *
	 * @return void
	 */
	public function test_transform_post_types( $post_types, $new_post_types, $expected ) {

		$this->options
			->expects( 'get' )
			->with( 'new_post_types', [] )
			->andReturn( $new_post_types );

		$this->post_type_helper
			->expects( 'has_archive' )
			->with( $post_types['book'] )
			->andReturn( true );

		$this->article_helper
			->expects( 'is_article_post_type' )
			->with( 'book' )
			->andReturn( false );

		$result = $this->instance_double->transform_post_types( $post_types );

		$this->assertSame( $expected, $result );
	}

	/**
	 * Data provider for test_transform_taxonomies.
	 *
	 * @return array
	 */
	public static function data_provider_transform_taxonomies() {
		return [
			'New taxonomy' => [
				'taxonomies'      => [
					'book_category' => (object) [
						'name'          => 'book_category',
						'label'         => 'Categories',
						'rewrite'       => [ 'slug' => 'yoast-test-book-category' ],
						'rest_base'     => false,
						'labels'        => (object) [ 'singular_name' => 'Category' ],
						'show_ui'       => true,
						'object_type'   => [ 'book' ],
					],
				],
				'post_type_names' => [ 'book' ],
				'new_taxonomies'  => [ 'book_category' ],
				'expected'        => [
					'book_category' => [
						'name'                 => 'book_category',
						'route'                => 'yoast-test-book-category',
						'label'                => 'Categories',
						'showUi'               => true,
						'singularLabel'        => 'Category',
						'postTypes'            => [ 'book' ],
						'isNew'                => true,
					],
				],
			],
			'Not new taxonomy' => [
				'taxonomies'      => [
					'book_category' => (object) [
						'name'          => 'book_category',
						'label'         => 'Categories',
						'rewrite'       => [ 'slug' => 'yoast-test-book-category' ],
						'rest_base'     => false,
						'labels'        => (object) [ 'singular_name' => 'Category' ],
						'show_ui'       => true,
						'object_type'   => [ 'book' ],
					],
				],
				'post_type_names' => [ 'book' ],
				'new_taxonomies'  => [],
				'expected'        => [
					'book_category' => [
						'name'                 => 'book_category',
						'route'                => 'yoast-test-book-category',
						'label'                => 'Categories',
						'showUi'               => true,
						'singularLabel'        => 'Category',
						'postTypes'            => [ 'book' ],
						'isNew'                => false,
					],
				],
			],
		];
	}

	/**
	 * Tests transform_taxonomies method.
	 *
	 * @covers ::transform_taxonomies
	 *
	 * @dataProvider data_provider_transform_taxonomies
	 *
	 * @param array $taxonomies      The taxonomies to transform.
	 * @param array $post_type_names The post type names.
	 * @param array $new_taxonomies  The new taxonomies.
	 * @param array $expected        The expected result.
	 *
	 * @return void
	 */
	public function test_transform_taxonomies( $taxonomies, $post_type_names, $new_taxonomies, $expected ) {

		$this->options
			->expects( 'get' )
			->with( 'new_taxonomies', [] )
			->andReturn( $new_taxonomies );

		$result = $this->instance_double->transform_taxonomies( $taxonomies, $post_type_names );

		$this->assertSame( $expected, $result );
	}
}
