<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Exceptions\Option\Unknown_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Twitter_Username_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Helpers\Validation_Helper;
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
	 * Holds the validation helper instance.
	 *
	 * @var Validation_Helper|Mockery\Mock
	 */
	protected $validation_helper;

	/**
	 * Holds the post type helper instance.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Holds the taxonomy helper instance.
	 *
	 * @var Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * Prepares the test.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->validation_helper    = Mockery::mock( Validation_Helper::class );
		$this->post_type_helper     = Mockery::mock( Post_Type_Helper::class );
		$this->taxonomy_helper      = Mockery::mock( Taxonomy_Helper::class );
		$this->site_options_service = Mockery::mock(
			Site_Options_Service::class,
			[
				$this->validation_helper,
				$this->post_type_helper,
				$this->taxonomy_helper,
			]
		);

		$this->instance = Mockery::mock( Options_Helper::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
		$this->instance->set_dependencies( $this->site_options_service );
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
	}

	/**
	 * Tests the retrieval of an option value.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get() {
		$this->site_options_service->expects( 'get_defaults' )->andReturn( [ 'foo' => 'bar' ] );

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
		$this->site_options_service->expects( 'get_configurations' )
			->times( 3 )
			->andReturn(
				[
					'twitter_site' => [
						'default' => '',
						'types'   => [
							'empty_string',
							'twitter_username',
						],
					],
				]
			);

		Monkey\Functions\expect( 'update_option' )->once();

		$this->site_options_service->expects( 'get_defaults' )->andReturn( [ 'twitter_site' => '' ] );
		$this->validation_helper->expects( 'validate_as' )->andReturn( 'yoast' );

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
		$this->site_options_service->expects( 'get_configurations' )->andReturn( [] );

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
		$this->site_options_service->expects( 'get_configurations' )
			->times( 3 )
			->andReturn(
				[
					'twitter_site' => [
						'default' => '',
						'types'   => [
							'empty_string',
							'twitter_username',
						],
					],
				]
			);

		$this->site_options_service->expects( 'get_defaults' )->andReturn( [ 'twitter_site' => '' ] );
		$this->validation_helper->expects( 'validate_as' )
			->andThrows( Invalid_Twitter_Username_Exception::class );

		$this->assertFalse( $this->instance->set( 'twitter_site', '#yoast' ) );
	}

	/**
	 * Tests the retrieval of the default value of an option.
	 *
	 * @covers ::get_default
	 *
	 * @return void
	 */
	public function test_get_default() {
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
		$this->site_options_service->expects( 'ensure_options' )->once();

		$this->instance->ensure_options();
	}

	/**
	 * Tests if the reset_options of the site_options_service is called correctly.
	 *
	 * @covers ::reset_options
	 *
	 * @return void
	 */
	public function test_reset_options() {
		$this->site_options_service->expects( 'reset_options' )->once();

		$this->instance->reset_options();
	}

	/**
	 * Tests if the clear_cache of the site_options_service is called correctly.
	 *
	 * @covers ::clear_cache
	 *
	 * @return void
	 */
	public function test_clear_cache() {
		$this->site_options_service->expects( 'clear_cache' )->once();

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
