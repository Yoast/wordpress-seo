<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Request_Helper;
use Yoast\WP\SEO\Integrations\Front_End_Integration;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Front_End_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End_Integration
 *
 * @group integrations
 */
class Front_End_Integration_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Mockery\MockInterface|Front_End_Integration
	 */
	private $instance;

	/**
	 * Represents the container interface.
	 *
	 * @var Mockery\MockInterface|ContainerInterface
	 */
	private $container;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * Represents the request helper.
	 *
	 * @var Mockery\MockInterface|Request_Helper
	 */
	private $request;

	/**
	 * Represents the meta tags context memoizer.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context_Memoizer
	 */
	private $context_memoizer;

	/**
	 * Represents the indexable presentation.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Indexable_Presentation
	 */
	private $presentation;

	/**
	 * Represents the meta tags context.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Meta_Tags_Context
	 */
	private $context;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Abstract_Indexable_Presenter
	 */
	private $presenter;

	/**
	 * Method that runs before each test case.
	 */
	protected function set_up() {
		parent::set_up();

		$this->context_memoizer = Mockery::mock( Meta_Tags_Context_Memoizer::class );
		$this->container        = Mockery::mock( ContainerInterface::class );
		$this->options          = Mockery::mock( Options_Helper::class );
		$this->request          = Mockery::mock( Request_Helper::class );

		$this->instance = Mockery::mock(
			Front_End_Integration::class,
			[
				$this->context_memoizer,
				$this->container,
				$this->options,
				$this->request,
				Mockery::mock( Helpers_Surface::class ),
				Mockery::mock( WPSEO_Replace_Vars::class ),
			]
		)->makePartial();

		// Set up mocks for classes which which are used in multiple tests.
		$this->context   = Mockery::mock( Meta_Tags_Context::class );
		$this->presenter = Mockery::mock( Abstract_Indexable_Presenter::class );

		$this->context->page_type    = 'page_type';
		$this->context->presentation = $this->presentation;
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class ],
			Front_End_Integration::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'wp_head', [ $this->instance, 'call_wpseo_head' ] ), 'Does not have expected wp_head action' );
		$this->assertNotFalse( \has_action( 'wpseo_head', [ $this->instance, 'present_head' ] ), 'Does not have expected wpseo_head action' );
		$this->assertNotFalse( \has_filter( 'wp_title', [ $this->instance, 'filter_title' ] ), 'Does not have expected wp_title filter' );
		$this->assertNotFalse( \has_filter( 'wpseo_frontend_presenter_classes', [ $this->instance, 'filter_robots_presenter' ] ), 'Does not have expected wpseo_frontend_presenter_classes filter' );
	}

	/**
	 * Tests calling wpseo_head and it's interaction with wp_query.
	 *
	 * @covers ::call_wpseo_head
	 */
	public function test_call_wpseo_head() {
		global $wp_query;

		$initial_wp_query = Mockery::mock( 'WP_Query' );
		$wp_query         = $initial_wp_query;
		Monkey\Functions\expect( 'wp_reset_query' )->once();

		$this->instance->call_wpseo_head();

		$this->assertSame( 1, \did_action( 'wpseo_head' ) );
		$this->assertSame( $initial_wp_query, $GLOBALS['wp_query'] );
	}

	/**
	 * Tests the present_head.
	 *
	 * @covers ::present_head
	 */
	public function test_present_head() {
		$this->context_memoizer
			->expects( 'for_current_page' )
			->once()
			->andReturn( $this->context );

		$this->instance
			->expects( 'get_presenters' )
			->once()
			->with( 'page_type', $this->context )
			->andReturn( [ $this->presenter ] );

		$this->presenter
			->expects( 'present' )
			->once()
			->with()
			->andReturn( 'Output' );

		$this->instance->present_head();

		$this->expectOutputString( \PHP_EOL . "\tOutput" . \PHP_EOL . \PHP_EOL . \PHP_EOL );
	}

	/**
	 * Tests the retrieval of the presenters for a singular type.
	 *
	 * @covers ::get_presenters
	 * @covers ::get_needed_presenters
	 * @covers ::get_presenters_for_page_type
	 * @covers ::get_all_presenters
	 */
	public function test_get_presenters_for_singular_page() {
		Monkey\Functions\expect( 'get_theme_support' )->once()->with( 'title-tag' )->andReturn( true );

		$this->options->expects( 'get' )->with( 'opengraph' )->andReturnTrue();
		$this->options->expects( 'get' )->with( 'twitter' )->andReturnTrue();
		$this->options->expects( 'get' )->with( 'enable_enhanced_slack_sharing' )->andReturnTrue();

		$this->context_memoizer
			->expects( 'for_current_page' )
			->once()
			->andReturn( $this->context );

		$this->request
			->expects( 'is_rest_request' )
			->once()
			->andReturnFalse();

		$expected = [
			'Yoast\WP\SEO\Presenters\Debug\Marker_Open_Presenter',
			'Yoast\WP\SEO\Presenters\Title_Presenter',
			'Yoast\WP\SEO\Presenters\Meta_Description_Presenter',
			'Yoast\WP\SEO\Presenters\Robots_Presenter',
			'Yoast\WP\SEO\Presenters\Canonical_Presenter',
			'Yoast\WP\SEO\Presenters\Rel_Prev_Presenter',
			'Yoast\WP\SEO\Presenters\Rel_Next_Presenter',
			'Yoast\WP\SEO\Presenters\Open_Graph\Locale_Presenter',
			'Yoast\WP\SEO\Presenters\Open_Graph\Type_Presenter',
			'Yoast\WP\SEO\Presenters\Open_Graph\Title_Presenter',
			'Yoast\WP\SEO\Presenters\Open_Graph\Description_Presenter',
			'Yoast\WP\SEO\Presenters\Open_Graph\Url_Presenter',
			'Yoast\WP\SEO\Presenters\Open_Graph\Site_Name_Presenter',
			'Yoast\WP\SEO\Presenters\Open_Graph\Article_Publisher_Presenter',
			'Yoast\WP\SEO\Presenters\Open_Graph\Article_Author_Presenter',
			'Yoast\WP\SEO\Presenters\Open_Graph\Article_Published_Time_Presenter',
			'Yoast\WP\SEO\Presenters\Open_Graph\Article_Modified_Time_Presenter',
			'Yoast\WP\SEO\Presenters\Open_Graph\Image_Presenter',
			'Yoast\WP\SEO\Presenters\Twitter\Card_Presenter',
			'Yoast\WP\SEO\Presenters\Twitter\Title_Presenter',
			'Yoast\WP\SEO\Presenters\Twitter\Description_Presenter',
			'Yoast\WP\SEO\Presenters\Twitter\Image_Presenter',
			'Yoast\WP\SEO\Presenters\Twitter\Creator_Presenter',
			'Yoast\WP\SEO\Presenters\Twitter\Site_Presenter',
			'Yoast\WP\SEO\Presenters\Slack\Enhanced_Data_Presenter',
			'Yoast\WP\SEO\Presenters\Schema_Presenter',
			'Yoast\WP\SEO\Presenters\Debug\Marker_Close_Presenter',
		];

		$callback = static function( $presenter ) {
			return \get_class( $presenter );
		};

		$this->assertEquals(
			$expected,
			\array_map( $callback, $this->instance->get_presenters( 'Post_Type' ) )
		);
	}

	/**
	 * Tests retrieval of the presenters for an error page.
	 *
	 * @covers ::get_presenters
	 * @covers ::get_needed_presenters
	 * @covers ::get_presenters_for_page_type
	 * @covers ::get_all_presenters
	 */
	public function test_get_presenters_for_error_page() {
		Monkey\Functions\expect( 'get_theme_support' )->once()->with( 'title-tag' )->andReturn( true );

		$this->options
			->expects( 'get' )
			->with( 'opengraph' )
			->andReturnTrue();

		$this->context_memoizer
			->expects( 'for_current_page' )
			->once()
			->andReturn( $this->context );

		$this->request
			->expects( 'is_rest_request' )
			->once()
			->andReturnFalse();

		$callback = static function( $presenter ) {
			return \get_class( $presenter );
		};
		$expected = \array_map( $callback, $this->instance->get_presenters( 'Error_Page' ) );

		$this->assertEquals(
			[
				'Yoast\WP\SEO\Presenters\Debug\Marker_Open_Presenter',
				'Yoast\WP\SEO\Presenters\Title_Presenter',
				'Yoast\WP\SEO\Presenters\Meta_Description_Presenter',
				'Yoast\WP\SEO\Presenters\Robots_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Locale_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Title_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Site_Name_Presenter',
				'Yoast\WP\SEO\Presenters\Schema_Presenter',
				'Yoast\WP\SEO\Presenters\Debug\Marker_Close_Presenter',
			],
			$expected
		);
	}

	/**
	 * Tests the retrieval of the presenters for a non singular page.
	 *
	 * @covers ::get_presenters
	 * @covers ::get_needed_presenters
	 * @covers ::get_presenters_for_page_type
	 * @covers ::get_all_presenters
	 */
	public function test_get_presenters_for_non_singular_page() {
		Monkey\Functions\expect( 'get_theme_support' )->once()->with( 'title-tag' )->andReturn( true );

		$this->options
			->expects( 'get' )
			->with( 'opengraph' )
			->andReturnTrue();

		$this->options
			->expects( 'get' )
			->with( 'twitter' )
			->andReturnTrue();

		$this->options
			->expects( 'get' )
			->with( 'enable_enhanced_slack_sharing' )
			->andReturnTrue();

		$this->context_memoizer
			->expects( 'for_current_page' )
			->once()
			->andReturn( $this->context );

		$this->request
			->expects( 'is_rest_request' )
			->once()
			->andReturnFalse();

		$callback = static function( $presenter ) {
			return \get_class( $presenter );
		};
		$expected = \array_map( $callback, \array_values( $this->instance->get_presenters( 'Term_Archive' ) ) );

		$this->assertEquals(
			[
				'Yoast\WP\SEO\Presenters\Debug\Marker_Open_Presenter',
				'Yoast\WP\SEO\Presenters\Title_Presenter',
				'Yoast\WP\SEO\Presenters\Meta_Description_Presenter',
				'Yoast\WP\SEO\Presenters\Robots_Presenter',
				'Yoast\WP\SEO\Presenters\Canonical_Presenter',
				'Yoast\WP\SEO\Presenters\Rel_Prev_Presenter',
				'Yoast\WP\SEO\Presenters\Rel_Next_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Locale_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Type_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Title_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Description_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Url_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Site_Name_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Image_Presenter',
				'Yoast\WP\SEO\Presenters\Twitter\Card_Presenter',
				'Yoast\WP\SEO\Presenters\Twitter\Title_Presenter',
				'Yoast\WP\SEO\Presenters\Twitter\Description_Presenter',
				'Yoast\WP\SEO\Presenters\Twitter\Image_Presenter',
				'Yoast\WP\SEO\Presenters\Twitter\Site_Presenter',
				'Yoast\WP\SEO\Presenters\Schema_Presenter',
				'Yoast\WP\SEO\Presenters\Debug\Marker_Close_Presenter',
			],
			$expected
		);
	}

	/**
	 * Tests retrieval of the presents for a theme without title tag
	 * and with force rewrite titles disabled.
	 *
	 * @covers ::get_presenters
	 * @covers ::get_needed_presenters
	 * @covers ::get_presenters_for_page_type
	 * @covers ::get_all_presenters
	 */
	public function test_get_presenters_for_theme_without_title_tag_and_force_rewrite_titles_disabled() {
		Monkey\Functions\expect( 'get_theme_support' )->once()->with( 'title-tag' )->andReturn( false );

		$this->options
			->expects( 'get' )
			->with( 'forcerewritetitle', false )
			->andReturn( false );

		$this->options
			->expects( 'get' )
			->with( 'opengraph' )
			->andReturnTrue();

		$this->context_memoizer
			->expects( 'for_current_page' )
			->once()
			->andReturn( $this->context );

		$this->request
			->expects( 'is_rest_request' )
			->once()
			->andReturnFalse();

		$callback = static function( $presenter ) {
			return \get_class( $presenter );
		};
		$actual   = \array_map( $callback, \array_values( $this->instance->get_presenters( 'Error_Page' ) ) );

		$this->assertEquals(
			[
				'Yoast\WP\SEO\Presenters\Debug\Marker_Open_Presenter',
				'Yoast\WP\SEO\Presenters\Meta_Description_Presenter',
				'Yoast\WP\SEO\Presenters\Robots_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Locale_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Title_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Site_Name_Presenter',
				'Yoast\WP\SEO\Presenters\Schema_Presenter',
				'Yoast\WP\SEO\Presenters\Debug\Marker_Close_Presenter',
			],
			$actual
		);
	}

	/**
	 * Tests retrieval of the presenters on a REST request.
	 *
	 * @covers ::get_presenters
	 * @covers ::get_needed_presenters
	 * @covers ::get_presenters_for_page_type
	 * @covers ::get_all_presenters
	 */
	public function test_get_presenters_for_theme_on_rest_request() {

		$this->options
			->expects( 'get' )
			->with( 'opengraph' )
			->andReturnTrue();

		$this->context_memoizer
			->expects( 'for_current_page' )
			->once()
			->andReturn( $this->context );

		$this->request
			->expects( 'is_rest_request' )
			->once()
			->andReturnTrue();

		$callback = static function( $presenter ) {
			return \get_class( $presenter );
		};
		$actual   = \array_map( $callback, \array_values( $this->instance->get_presenters( 'Error_Page' ) ) );

		$this->assertEquals(
			[
				'Yoast\WP\SEO\Presenters\Debug\Marker_Open_Presenter',
				'Yoast\WP\SEO\Presenters\Title_Presenter',
				'Yoast\WP\SEO\Presenters\Meta_Description_Presenter',
				'Yoast\WP\SEO\Presenters\Robots_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Locale_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Title_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Site_Name_Presenter',
				'Yoast\WP\SEO\Presenters\Schema_Presenter',
				'Yoast\WP\SEO\Presenters\Debug\Marker_Close_Presenter',
			],
			$actual
		);
	}

	/**
	 * Tests retrieval of the presents for a theme without title tag
	 * and with force rewrite titles enabled.
	 *
	 * @covers ::get_presenters
	 * @covers ::get_needed_presenters
	 * @covers ::get_presenters_for_page_type
	 * @covers ::get_all_presenters
	 */
	public function test_get_presenters_for_theme_without_title_tag_and_force_rewrite_titles_enabled() {
		Monkey\Functions\expect( 'get_theme_support' )->once()->with( 'title-tag' )->andReturn( false );

		$this->options
			->expects( 'get' )
			->with( 'forcerewritetitle', false )
			->andReturn( true );

		$this->options
			->expects( 'get' )
			->with( 'opengraph' )
			->andReturnTrue();

		$this->context_memoizer
			->expects( 'for_current_page' )
			->once()
			->andReturn( $this->context );

		$this->request
			->expects( 'is_rest_request' )
			->once()
			->andReturnFalse();

		$callback = static function( $presenter ) {
			return \get_class( $presenter );
		};
		$expected = \array_map( $callback, \array_values( $this->instance->get_presenters( 'Error_Page' ) ) );

		$this->assertEquals(
			[
				'Yoast\WP\SEO\Presenters\Debug\Marker_Open_Presenter',
				'Yoast\WP\SEO\Presenters\Title_Presenter',
				'Yoast\WP\SEO\Presenters\Meta_Description_Presenter',
				'Yoast\WP\SEO\Presenters\Robots_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Locale_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Title_Presenter',
				'Yoast\WP\SEO\Presenters\Open_Graph\Site_Name_Presenter',
				'Yoast\WP\SEO\Presenters\Schema_Presenter',
				'Yoast\WP\SEO\Presenters\Debug\Marker_Close_Presenter',
			],
			$expected
		);
	}

	/**
	 * Tests the filter robots presenter method without having the wp_robots function.
	 *
	 * @covers ::filter_robots_presenter
	 */
	public function test_filter_robots_presenter_with_wp_robots_absent() {
		$presenters = [
			'Yoast\WP\SEO\Presenters\Title_Presenter',
			'Yoast\WP\SEO\Presenters\Meta_Description_Presenter',
			'Yoast\WP\SEO\Presenters\Robots_Presenter',
		];

		static::assertEquals( $presenters, $this->instance->filter_robots_presenter( $presenters ) );
	}

	/**
	 * Tests the filter robots presenter without having the wp_robots attached to the wp_head action.
	 *
	 * @covers ::filter_robots_presenter
	 */
	public function test_filter_robots_presenter_and_wp_robots_not_attached_to_wp_head_filter() {
		Monkey\Functions\expect( 'wp_robots' )->never();

		$presenters = [
			'Yoast\WP\SEO\Presenters\Title_Presenter',
			'Yoast\WP\SEO\Presenters\Meta_Description_Presenter',
			'Yoast\WP\SEO\Presenters\Robots_Presenter',
		];

		static::assertEquals( $presenters, $this->instance->filter_robots_presenter( $presenters ) );
	}

	/**
	 * Tests the filter robots presenter with having wp_robots attached to the wp_head action.
	 *
	 * @covers ::filter_robots_presenter
	 */
	public function test_filter_robots_presenter_and_wp_robots_to_wp_head_filter() {
		Monkey\Functions\expect( 'wp_robots' )->never();

		\add_action( 'wp_head', 'wp_robots' );

		$this->request
			->expects( 'is_rest_request' )
			->once()
			->andReturnFalse();

		$presenters = [
			'Yoast\WP\SEO\Presenters\Title_Presenter',
			'Yoast\WP\SEO\Presenters\Meta_Description_Presenter',
			'Yoast\WP\SEO\Presenters\Robots_Presenter',
		];

		static::assertEquals(
			[
				'Yoast\WP\SEO\Presenters\Title_Presenter',
				'Yoast\WP\SEO\Presenters\Meta_Description_Presenter',
			],
			$this->instance->filter_robots_presenter( $presenters )
		);
	}

	/**
	 * Tests the filter robots presenter with having wp_robots attached to the wp_head action.
	 *
	 * @covers ::filter_robots_presenter
	 */
	public function test_rest_request_should_output_robots_presenter() {
		Monkey\Functions\expect( 'wp_robots' )->never();

		\add_action( 'wp_head', 'wp_robots' );

		$this->request
			->expects( 'is_rest_request' )
			->once()
			->andReturnTrue();

		$presenters = [
			'Yoast\WP\SEO\Presenters\Title_Presenter',
			'Yoast\WP\SEO\Presenters\Meta_Description_Presenter',
			'Yoast\WP\SEO\Presenters\Robots_Presenter',
		];

		static::assertEquals(
			[
				'Yoast\WP\SEO\Presenters\Title_Presenter',
				'Yoast\WP\SEO\Presenters\Meta_Description_Presenter',
				'Yoast\WP\SEO\Presenters\Robots_Presenter',
			],
			$this->instance->filter_robots_presenter( $presenters )
		);
	}
}
