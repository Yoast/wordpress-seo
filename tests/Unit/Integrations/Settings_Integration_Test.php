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

	/**
	 * Data provider for test_get_defaults_from_local_seo.
	 *
	 * @return array<string,array<string,bool,int>>
	 */
	public static function data_provider_get_defaults_from_local_seo() {
		$shared_info_expected = [
			'wpseo_titles' => [
				'org-email'  => 'example@location.con',
				'org-phone'  => '+91 1234567890',
				'org-vat-id' => '123456',
				'org-tax-id' => '654321',
			],
		];
		return [
			'Should return shared business info for multiple locations' => [
				'should_local_get_options' => 1,
				'multiple_locations'       => 'on',
				'same_organization'        => 'on',
				'primary_location'         => '',
				'shared_info'              => 'on',
				'has_primary_location'     => false,
				'expected'                 => $shared_info_expected,
			],
			'Should return business info with no multiple locations' => [
				'should_local_get_options' => 1,
				'multiple_locations'       => '',
				'same_organization'        => 'on',
				'primary_location'         => '',
				'shared_info'              => 'on',
				'has_primary_location'     => false,
				'expected'                 => $shared_info_expected,
			],
		];
	}

	/**
	 * Tests get_defaults_from_local_seo method.
	 *
	 * @covers ::get_defaults_from_local_seo
	 *
	 * @dataProvider data_provider_get_defaults_from_local_seo
	 *
	 * @param int           $should_local_get_options Whether local seo should get options.
	 * @param string        $multiple_locations       Whether multiple locations are enabled.
	 * @param string        $same_organization        Whether same organization is enabled.
	 * @param string        $primary_location         The primary location.
	 * @param string        $shared_info              Whether shared info is enabled.
	 * @param bool          $has_primary_location     Whether a primary location is set.
	 * @param array<string> $expected                 The expected result.
	 *
	 * @return void
	 */
	public function test_get_defaults_from_local_seo( $should_local_get_options, $multiple_locations, $same_organization, $primary_location, $shared_info, $has_primary_location, $expected ) {
		$defaults = [
			'wpseo_titles' => [
				'org-email'                        => '',
				'org-phone'                        => '',
				'org-vat-id'                       => '',
				'org-tax-id'                       => '',
			],
		];

		Monkey\Functions\expect( 'get_option' )
			->times( $should_local_get_options )
			->with( 'wpseo_local' )
			->andReturn(
				[
					'use_multiple_locations'                     => $multiple_locations,
					'multiple_locations_same_organization'       => $same_organization,
					'multiple_locations_primary_location'        => '',
					'multiple_locations_shared_business_info'    => $shared_info,
					'location_phone'                             => '+91 1234567890',
					'location_email'                             => 'example@location.con',
					'location_vat_id'                            => '123456',
					'location_tax_id'                            => '654321',
				]
			);

		Monkey\Functions\expect( 'wpseo_has_primary_location' )
			->once()
			->andReturn( $has_primary_location );

		$defaults = $this->instance_double->get_defaults_from_local_seo( $defaults );

		$this->assertSame( $expected, $defaults );
	}

	/**
	 * Tests get_defaults_from_local_seo when there is primary location.
	 *
	 * @covers ::get_defaults_from_local_seo
	 * @return void
	 */
	public function test_get_defaults_from_local_seo_when_there_is_primary_location() {
		$defaults = [
			'wpseo_titles' => [
				'org-email'  => 'organization@mail.test',
				'org-phone'  => '',
				'org-vat-id' => '',
				'org-tax-id' => '',
			],
		];

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_local' )
			->andReturn(
				[
					'use_multiple_locations'                     => 'on',
					'multiple_locations_same_organization'       => 'on',
					'multiple_locations_primary_location'        => 1,
					'multiple_locations_shared_business_info'    => '',
					'location_phone'                             => '+91 1234567890',
					'location_email'                             => 'example@location.con',
					'location_vat_id'                            => '123456',
					'location_tax_id'                            => '654321',
				]
			);

		Monkey\Functions\expect( 'wpseo_has_primary_location' )
			->once()
			->andReturn( true );

		Monkey\Functions\expect( 'get_post_meta' )
			->with( 1, '_wpseo_business_phone', true )
			->once()
			->andReturn( '+91 108108108' );

		Monkey\Functions\expect( 'get_post_meta' )
			->with( 1, '_wpseo_business_email', true )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'get_post_meta' )
			->with( 1, '_wpseo_business_tax_id', true )
			->once()
			->andReturn( '1111' );

		Monkey\Functions\expect( 'get_post_meta' )
			->with( 1, '_wpseo_business_vat_id', true )
			->once()
			->andReturn( '2222' );

		$result = $this->instance_double->get_defaults_from_local_seo( $defaults );

		$expected = [
			'wpseo_titles' => [
				'org-email'  => '',
				'org-phone'  => '+91 108108108',
				'org-vat-id' => '2222',
				'org-tax-id' => '1111',
			],
		];

		$this->assertSame( $expected, $result );
	}

	/**
	 * Tetst get_defaults_from_local_seo with shared business info and primary location.
	 *
	 * @covers ::get_defaults_from_local_seo
	 * @return void
	 */
	public function test_get_defaults_from_local_seo_with_shared_business_info_and_primary_location() {
		$defaults = [
			'wpseo_titles' => [
				'org-email'  => 'organization@mail.test',
				'org-phone'  => '',
				'org-tax-id' => '',
				'org-vat-id' => '8888',
			],
		];

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'wpseo_local' )
			->andReturn(
				[
					'use_multiple_locations'                     => 'on',
					'multiple_locations_same_organization'       => 'on',
					'multiple_locations_primary_location'        => 1,
					'multiple_locations_shared_business_info'    => 'on',
					'location_phone'                             => '+91 1234567890',
					'location_email'                             => 'example@location.con',
					'location_vat_id'                            => '123456',
					'location_tax_id'                            => '654321',
				]
			);

		Monkey\Functions\expect( 'wpseo_has_primary_location' )
			->once()
			->andReturn( true );

		Monkey\Functions\expect( 'get_post_meta' )
			->with( 1, '_wpseo_is_overridden_business_phone', true )
			->once()
			->andReturn( 'on' );

		Monkey\Functions\expect( 'get_post_meta' )
			->with( 1, '_wpseo_business_phone', true )
			->once()
			->andReturn( '+91 108108108' );

		Monkey\Functions\expect( 'get_post_meta' )
			->with( 1, '_wpseo_is_overridden_business_email', true )
			->once()
			->andReturn( 'off' );

		Monkey\Functions\expect( 'get_post_meta' )
			->with( 1, '_wpseo_is_overridden_business_tax_id', true )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'get_post_meta' )
			->with( 1, '_wpseo_is_overridden_business_vat_id', true )
			->once()
			->andReturn( 'on' );

		Monkey\Functions\expect( 'get_post_meta' )
			->with( 1, '_wpseo_business_vat_id', true )
			->once()
			->andReturn( false );

		$result = $this->instance_double->get_defaults_from_local_seo( $defaults );

		$expected = [
			'wpseo_titles' => [
				'org-email'  => 'example@location.con', // Shared.
				'org-phone'  => '+91 108108108', // Overridden.
				'org-tax-id' => '654321', // Shared.
				'org-vat-id' => '', // Overridden but empty.
			],
		];

		$this->assertSame( $expected, $result );
	}
}
