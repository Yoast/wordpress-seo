<?php

namespace Yoast\WP\SEO\Tests\Unit\Initializers;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Initializers\Crawl_Cleanup_Permalinks;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;


/**
 * Class Crawl_Cleanup_Permalinks_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Initializers\Crawl_Cleanup_Permalinks
 *
 * @group integrations
 */
class Crawl_Cleanup_Permalinks_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Crawl_Cleanup_Permalinks
	 */
	private $instance;

	/**
	 * The current page helper
	 *
	 * @var Mockery\MockInterface
	 */
	private $current_page_helper;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface
	 */
	private $options_helper;

	/**
	 * The URL helper.
	 *
	 * @var Mockery\MockInterface
	 */
	private $url_helper;

	/**
	 * Sets up the tests.
	 *
	 * @covers ::__construct
	 */
	protected function set_up() {
		parent::set_up();

		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->options_helper      = Mockery::mock( Options_Helper::class );
		$this->url_helper          = Mockery::mock( Url_Helper::class );

		$this->instance = new Crawl_Cleanup_Permalinks(
			$this->current_page_helper,
			$this->options_helper,
			$this->url_helper
		);
	}

	/**
	 * Tests the initialization.
	 *
	 * @covers ::initialize
	 */
	public function test_initialize() {
		Monkey\Actions\expectAdded( 'plugins_loaded' )
				->with( [ $this->instance, 'register_hooks' ] )
				->times( 1 );
		$this->instance->initialize();
	}

	/**
	 * Tests register_hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @dataProvider register_hooks_provider
	 *
	 * @param string $permalink_structure permalink_structure value returned from get_option.
	 * @param string $campaign_tracking_urls Returned value from option_helper.
	 * @param string $clean_permalinks Returned value from option_helper.
	 * @param int    $expected_utm_redirect Is action fired.
	 * @param int    $expected_clean_permalinks Is action fired.
	 */
	public function test_register_hooks( $permalink_structure, $campaign_tracking_urls, $clean_permalinks, $expected_utm_redirect, $expected_clean_permalinks ) {

		Monkey\Functions\expect( 'get_option' )
			->with( 'permalink_structure' )
			->andReturn( $permalink_structure );

		$this->options_helper
			->expects( 'get' )
			->with( 'clean_campaign_tracking_urls' )
			->once()
			->andReturns( $campaign_tracking_urls );

		$this->options_helper
			->expects( 'get' )
			->with( 'clean_permalinks' )
			->once()
			->andReturns( $clean_permalinks );

		Monkey\Actions\expectAdded( 'template_redirect' )
			->with( [ $this->instance, 'utm_redirect' ] )
			->times( $expected_utm_redirect );

			Monkey\Actions\expectAdded( 'template_redirect' )
				->with( [ $this->instance, 'clean_permalinks' ] )
				->times( $expected_clean_permalinks );


		$this->instance->register_hooks();
	}

	/**
	 * Data provider for test_register_hooks.
	 *
	 * register_hooks_provider
	 *
	 * @return array
	 */
	public function register_hooks_provider() {
		return [
			[ null, 'returned_value_campaign_tracking_urls', 'returned_value_clean_permalinks', 0, 0 ],
			[ null, 'returned_value_campaign_tracking_urls', null, 0, 0 ],
			[ null, null, 'returned_value_clean_permalinks', 0, 0 ],
			[ null, null, null, 0, 0 ],
			[ 'permalink_structure_option', 'returned_value_clean_campaign_tracking_urls', 'returned_value_clean_permalinks', 1, 1 ],
			[ 'permalink_structure_option', null, 'returned_value_clean_permalinks', 0, 1 ],
			[ 'permalink_structure_option', 'returned_value_clean_campaign_tracking_urls', null, 1, 0 ],
		];
	}

	/**
	 * Tests get_conditionals.
	 *
	 * @covers ::get_conditionals
	 **/
	public function test_get_conditionals() {
		$this->assertEquals( [ Front_End_Conditional::class ], $this->instance->get_conditionals() );
	}


    /**
     * Tests utm_redirect.
     *
     * @covers ::utm_redirect
     */
    public function test_utm_redirect() {
        $this->current_page_helper
            ->expects( 'is_404' )
            ->once()
            ->andReturn( true );

        $this->url_helper
            ->expects( 'get_current_url' )
            ->once()
            ->andReturn( 'http://example.org/?utm_source=source&utm_medium=medium&utm_campaign=campaign&utm_term=term&utm_content=content' );

        $this->url_helper
            ->expects( 'get_home_url' )
            ->once()
            ->andReturn( 'http://example.org/' );

        $this->url_helper
            ->expects( 'redirect' )
            ->once()
            ->with( 'http://example.org/' );

        $this->instance->utm_redirect();

       
    }
}
