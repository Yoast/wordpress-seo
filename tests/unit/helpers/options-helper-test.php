<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Exceptions\Option\Delete_Failed_Exception;
use Yoast\WP\SEO\Exceptions\Option\Save_Failed_Exception;
use Yoast\WP\SEO\Exceptions\Option\Unknown_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Twitter_Username_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Helpers\Validation_Helper;
use Yoast\WP\SEO\Services\Options\Multisite_Options_Service;
use Yoast\WP\SEO\Services\Options\Network_Admin_Options_Service;
use Yoast\WP\SEO\Services\Options\Site_Options_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Options_Helper_Test.
 *
 * @group helpers
 * @group options
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Options_Helper
 */
class Options_Helper_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * Holds the site options service instance.
	 *
	 * @var Site_Options_Service|Mockery\Mock
	 */
	protected $site_options_service;

	/**
	 * Holds the multisite options service instance.
	 *
	 * @var Multisite_Options_Service|Mockery\Mock
	 */
	protected $multisite_options_service;

	/**
	 * Holds the network admin options service instance.
	 *
	 * @var Network_Admin_Options_Service|Mockery\Mock
	 */
	protected $network_admin_options_service;

	/**
	 * Holds the validation helper instance.
	 *
	 * @var Validation_Helper|Mockery\Mock
	 */
	protected $validation_helper;

	/**
	 * Holds the post type helper instance.
	 *
	 * @var Post_Type_Helper|Mockery\Mock
	 */
	protected $post_type_helper;

	/**
	 * Holds the taxonomy helper instance.
	 *
	 * @var Taxonomy_Helper|Mockery\Mock
	 */
	protected $taxonomy_helper;

	/**
	 * Holds the site helper instance.
	 *
	 * @var Site_Helper|Mockery\Mock
	 */
	protected $site_helper;

	/**
	 * Prepares the test.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->validation_helper             = Mockery::mock( Validation_Helper::class );
		$this->post_type_helper              = Mockery::mock( Post_Type_Helper::class );
		$this->taxonomy_helper               = Mockery::mock( Taxonomy_Helper::class );
		$this->site_helper                   = Mockery::mock( Site_Helper::class );
		$this->site_options_service          = Mockery::mock(
			Site_Options_Service::class,
			[
				$this->validation_helper,
				$this->post_type_helper,
				$this->taxonomy_helper,
			]
		);
		$this->multisite_options_service     = Mockery::mock(
			Multisite_Options_Service::class,
			[
				$this->validation_helper,
				$this->post_type_helper,
				$this->taxonomy_helper,
			]
		);
		$this->network_admin_options_service = Mockery::mock(
			Network_Admin_Options_Service::class,
			[
				$this->validation_helper,
				$this->post_type_helper,
				$this->taxonomy_helper,
			]
		);

		$this->instance = Mockery::mock( Options_Helper::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
		$this->instance->set_dependencies(
			$this->site_options_service,
			$this->multisite_options_service,
			$this->network_admin_options_service,
			$this->site_helper
		);
	}

	/**
	 * Tests if given dependencies are set as expected.
	 *
	 * @covers ::set_dependencies
	 */
	public function test_set_dependencies() {
		$this->assertInstanceOf( Options_Helper::class, $this->instance );
		$this->assertInstanceOf(
			Site_Options_Service::class,
			$this->getPropertyValue( $this->instance, 'site_options_service' )
		);
		$this->assertInstanceOf(
			Multisite_Options_Service::class,
			$this->getPropertyValue( $this->instance, 'multisite_options_service' )
		);
		$this->assertInstanceOf(
			Network_Admin_Options_Service::class,
			$this->getPropertyValue( $this->instance, 'network_admin_options_service' )
		);
		$this->assertInstanceOf(
			Site_Helper::class,
			$this->getPropertyValue( $this->instance, 'site_helper' )
		);
	}

	/**
	 * Tests the retrieval of an option value.
	 *
	 * @covers ::get
	 * @covers ::get_options_service
	 *
	 * @return void
	 */
	public function test_get() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( false );
		$this->site_options_service->expects( 'get_defaults' )->andReturn( [ 'foo' => 'bar' ] );
		$this->multisite_options_service->expects( 'get_defaults' )->never();

		$this->assertEquals( 'bar', $this->instance->get( 'foo' ) );
	}

	/**
	 * Tests the retrieval of an option value on multisite.
	 *
	 * @covers ::get
	 * @covers ::get_options_service
	 *
	 * @return void
	 */
	public function test_get_multisite() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( true );
		$this->site_options_service->expects( 'get_defaults' )->never();
		$this->multisite_options_service->expects( 'get_defaults' )->andReturn( [ 'foo' => 'bar' ] );

		$this->assertEquals( 'bar', $this->instance->get( 'foo' ) );
	}

	/**
	 * Tests the fallback of retrieving an option value.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_fallback() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( false );
		$this->site_options_service->expects( 'get_defaults' )->andReturn( [] );

		$this->assertEquals( 'fallback', $this->instance->get( 'foo', 'fallback' ) );
	}

	/**
	 * Tests the setting of an option value.
	 *
	 * @covers ::set
	 *
	 * @return void
	 */
	public function test_set() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( false );

		$this->site_options_service->expects( 'validate' )
			->once()
			->with( 'twitter_site', 'yoast' )
			->andReturn( 'yoast' );

		$this->assertTrue( $this->instance->set( 'twitter_site', 'yoast' ) );
	}

	/**
	 * Tests the setting of an option value failing.
	 *
	 * @covers ::set
	 *
	 * @return void
	 */
	public function test_set_catch_unknown() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( false );

		$this->site_options_service->expects( 'validate' )
			->once()
			->with( 'unknown', '' )
			->andThrow( Unknown_Exception::class );

		$this->assertFalse( $this->instance->set( 'unknown', '' ) );
	}

	/**
	 * Tests the setting of an option value failing.
	 *
	 * @covers ::set
	 *
	 * @return void
	 */
	public function test_set_catch_validation() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( false );

		$this->site_options_service->expects( 'validate' )
			->once()
			->with( 'twitter_site', '#yoast' )
			->andThrow( Invalid_Twitter_Username_Exception::class );

		$this->assertFalse( $this->instance->set( 'twitter_site', '#yoast' ) );
	}

	/**
	 * Tests the setting of an option value failing on save.
	 *
	 * @covers ::set
	 *
	 * @return void
	 */
	public function test_set_catch_save_failed() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( false );

		$this->site_options_service->expects( 'validate' )
			->once()
			->with( 'twitter_site', 'yoast' )
			->andThrow( Save_Failed_Exception::class );

		$this->assertFalse( $this->instance->set( 'twitter_site', 'yoast' ) );
	}

	/**
	 * Tests the retrieval of the default value of an option.
	 *
	 * @covers ::get_default
	 *
	 * @return void
	 */
	public function test_get_default() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( false );
		$this->site_options_service->expects( 'get_default' )->andReturn( '' );

		$this->assertEquals( '', $this->instance->get_default( 'twitter_site' ) );
	}

	/**
	 * Tests the retrieval of the default value of an option, unknown exception.
	 *
	 * @covers ::get_default
	 *
	 * @return void
	 */
	public function test_get_default_unknown() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( false );
		$this->site_options_service->expects( 'get_default' )->andThrows( Unknown_Exception::class );

		$this->assertNull( $this->instance->get_default( 'twitter_site' ) );
	}

	/**
	 * Tests the retrieval of a couple of options.
	 *
	 * @covers ::get_options
	 *
	 * @return void
	 */
	public function test_get_options() {
		$options = [
			'foo' => 'bar',
			'baz' => 'qux',
		];

		$this->site_helper->expects( 'is_multisite' )->andReturn( false );
		$this->site_options_service->expects( 'get_options' )->andReturn( $options );

		$this->assertEquals( $options, $this->instance->get_options( $options ) );
	}

	/**
	 * Tests if the ensure_options of the site_options_service is called correctly.
	 *
	 * @covers ::ensure_options
	 *
	 * @return void
	 */
	public function test_ensure_options() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( false );
		$this->site_options_service->expects( 'ensure_options' )->once();

		$this->assertTrue( $this->instance->ensure_options() );
	}

	/**
	 * Tests if the ensure_options handles save failed.
	 *
	 * @covers ::ensure_options
	 *
	 * @return void
	 */
	public function test_ensure_options_save_failed() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( false );
		$this->site_options_service
			->expects( 'ensure_options' )
			->once()
			->andThrow( Save_Failed_Exception::class );

		$this->assertFalse( $this->instance->ensure_options() );
	}

	/**
	 * Tests if the reset_options of the site_options_service is called correctly.
	 *
	 * @covers ::reset_options
	 *
	 * @return void
	 */
	public function test_reset_options() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( false );
		$this->site_options_service->expects( 'reset_options' )->once();

		$this->assertTrue( $this->instance->reset_options() );
	}

	/**
	 * Tests if the reset_options handles save failed.
	 *
	 * @covers ::reset_options
	 *
	 * @return void
	 */
	public function test_reset_options_save_failed() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( false );
		$this->site_options_service
			->expects( 'reset_options' )
			->once()
			->andThrow( Save_Failed_Exception::class );

		$this->assertFalse( $this->instance->reset_options() );
	}

	/**
	 * Tests if the reset_options handles delete failed.
	 *
	 * @covers ::reset_options
	 *
	 * @return void
	 */
	public function test_reset_options_delete_failed() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( false );
		$this->site_options_service
			->expects( 'reset_options' )
			->once()
			->andThrow( Delete_Failed_Exception::class );

		$this->assertFalse( $this->instance->reset_options() );
	}

	/**
	 * Tests the clear_cache on a single site.
	 *
	 * @covers ::clear_cache
	 *
	 * @return void
	 */
	public function test_clear_cache() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( false );

		$this->site_options_service->expects( 'clear_cache' )->once();
		$this->multisite_options_service->expects( 'clear_cache' )->never();
		$this->network_admin_options_service->expects( 'clear_cache' )->never();

		$this->instance->clear_cache();
	}

	/**
	 * Tests the clear_cache on multisite.
	 *
	 * @covers ::clear_cache
	 *
	 * @return void
	 */
	public function test_clear_cache_multisite() {
		$this->site_helper->expects( 'is_multisite' )->andReturn( true );

		$this->site_options_service->expects( 'clear_cache' )->never();
		$this->multisite_options_service->expects( 'clear_cache' )->once();
		$this->network_admin_options_service->expects( 'clear_cache' )->once();

		$this->instance->clear_cache();
	}

	/**
	 * Tests the retrieval of the title separator.
	 *
	 * @covers ::get_title_separator
	 *
	 * @return void
	 */
	public function test_get_title_separator() {
		$this->site_helper->expects( 'is_multisite' )->twice()->andReturn( false );
		$this->site_options_service->expects( 'get_default' )->andReturn( 'sc-dash' );
		$this->site_options_service->expects( 'get_defaults' )->andReturn( [ 'separator' => 'sc-dash' ] );

		$this->instance
			->expects( 'get_separator_options' )
			->once()
			->andReturn(
				[
					'sc-dash' => '-',
				]
			);

		Monkey\Filters\expectApplied( 'wpseo_replacements_filter_sep' )->andReturn( '-' );

		$this->assertEquals( '-', $this->instance->get_title_separator() );
	}

	/**
	 * Tests the retrieval of the title separator, default path.
	 *
	 * @covers ::get_title_separator
	 *
	 * @return void
	 */
	public function test_get_title_separator_default() {
		$this->site_helper->expects( 'is_multisite' )->twice()->andReturn( false );
		$this->site_options_service->expects( 'get_default' )->andReturn( 'sc-dash' );
		$this->site_options_service->expects( 'get_defaults' )->andReturn( [ 'separator' => '' ] );

		$this->instance
			->expects( 'get_separator_options' )
			->once()
			->andReturn(
				[ 'sc-dash' => '-' ]
			);

		Monkey\Filters\expectApplied( 'wpseo_replacements_filter_sep' )->andReturn( '-' );

		$this->assertEquals( '-', $this->instance->get_title_separator() );
	}

	/**
	 * Tests the retrieval of the title separator, reset path.
	 *
	 * @covers ::get_title_separator
	 *
	 * @return void
	 */
	public function test_get_title_separator_reset() {
		$this->site_helper->expects( 'is_multisite' )->twice()->andReturn( false );
		$this->site_options_service->expects( 'get_default' )->andReturn( 'sc-dash' );
		$this->site_options_service->expects( 'get_defaults' )->andReturn( [ 'separator' => 'sc-dash' ] );

		Monkey\Functions\expect( 'wp_list_pluck' )->once()->andReturn( [ '-', '*' ] );

		Monkey\Filters\expectApplied( 'wpseo_replacements_filter_sep' )->andReturn( '-' );

		$this->assertEquals( '-', $this->instance->get_title_separator() );
	}

	/**
	 * Tests the retrieval of a title default.
	 *
	 * @covers ::get_title_default
	 */
	public function test_get_title_default() {
		$this->instance
			->expects( 'get_title_defaults' )
			->once()
			->andReturn(
				[
					'my-title' => 'This is a title',
				]
			);

		$this->assertEquals( 'This is a title', $this->instance->get_title_default( 'my-title' ) );
	}

	/**
	 * Tests the retrieval of an unknown title default.
	 *
	 * @covers ::get_title_default
	 */
	public function test_get_title_default_with_no_default_available() {
		$this->instance
			->expects( 'get_title_defaults' )
			->once()
			->andReturn( [] );

		$this->assertEquals( '', $this->instance->get_title_default( 'unknown-title' ) );
	}
}
