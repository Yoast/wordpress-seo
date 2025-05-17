<?php

namespace Yoast\WP\SEO\Tests\Unit\Initializers;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Initializers\Disable_Core_Sitemaps;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Disable_Core_Sitemaps_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Initializers\Disable_Core_Sitemaps
 *
 * @group integrations
 */
final class Disable_Core_Sitemaps_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Disable_Core_Sitemaps
	 */
	private $instance;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * The redirect helper.
	 *
	 * @var Redirect_Helper
	 */
	private $redirect;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options  = Mockery::mock( Options_Helper::class );
		$this->redirect = Mockery::mock( Redirect_Helper::class );
		$this->instance = new Disable_Core_Sitemaps( $this->options, $this->redirect );
	}

	/**
	 * Tests the initialization.
	 *
	 * @covers ::__construct
	 * @covers ::initialize
	 *
	 * @return void
	 */
	public function test_initialize() {
		$this->instance->initialize();

		$this->assertNotFalse( \has_action( 'plugins_loaded', [ $this->instance, 'maybe_disable_core_sitemaps' ] ), 'Does not have expected plugins_loaded action' );
	}

	/**
	 * Tests the situation when primary term id isn't to the category id, the id should get updated.
	 * WordPress sitemaps should be disabled and a redirect should be added to the WP sitemap URL.
	 *
	 * @covers ::__construct
	 * @covers ::maybe_disable_core_sitemaps
	 *
	 * @return void
	 */
	public function test_maybe_disable_core_sitemaps() {
		$this->options->expects( 'get' )->with( 'enable_xml_sitemap' )->andReturn( true );

		$this->instance->maybe_disable_core_sitemaps();

		$this->assertNotFalse( \has_filter( 'wp_sitemaps_enabled', '__return_false' ), 'Does not have expected wp_sitemaps_enabled filter' );
		$this->assertNotFalse( \has_action( 'template_redirect', [ $this->instance, 'template_redirect' ] ), 'Does not have expected template_redirect action' );
	}

	/**
	 * Tests the situation when primary term id isn't to the category id, the id should get updated.
	 * WordPress sitemaps should be disabled and a redirect should be added to the WP sitemap URL.
	 *
	 * @covers ::__construct
	 * @covers ::maybe_disable_core_sitemaps
	 *
	 * @return void
	 */
	public function test_maybe_disable_core_sitemaps_without_sitemaps() {
		$this->options->expects( 'get' )->with( 'enable_xml_sitemap' )->andReturn( false );

		$this->instance->maybe_disable_core_sitemaps();

		$this->assertFalse( \has_filter( 'wp_sitemaps_enabled', '__return_false' ), 'Does not have expected wp_sitemaps_enabled filter' );
		$this->assertFalse( \has_action( 'template_redirect', [ $this->instance, 'template_redirect' ] ), 'Has unexpected template_redirect action' );
	}

	/**
	 * Tests the template_redirect function.
	 *
	 * @covers ::__construct
	 * @covers ::template_redirect
	 * @covers ::get_redirect_url
	 *
	 * @dataProvider template_redirect_data
	 *
	 * @param string $path     The request path.
	 * @param string $redirect The expected redirect.
	 *
	 * @return void
	 */
	public function test_template_redirect( $path, $redirect ) {
		$_SERVER['REQUEST_URI'] = $path;

		if ( $redirect ) {
			Functions\expect( 'home_url' )->once()->with( $redirect )->andReturnFirstArg();
			$this->redirect->expects( 'do_safe_redirect' )->once()->with( $redirect, 301 );
		}
		else {
			Functions\expect( 'home_url' )->never();
			$this->redirect->expects( 'do_safe_redirect' )->never();
		}

		$this->instance->template_redirect();

		unset( $_SERVER['REQUEST_URI'] );
	}

	/**
	 * Data provider for the template redirect test.
	 *
	 * @return array The test data.
	 */
	public static function template_redirect_data() {
		return [
			[ null, null ],
			[ '/', null ],
			[ '/this-is-not-a-wp-sitemap-request', null ],
			[ '/wp-sitemap-post-explaining-what-it-is', null ],
			[ '/wp-sitemap-posts-post-1-xml', null ],
			[ '/wp-sitemap-posts-post-1-more.xml', null ],
			[ '/wp-sitemap.xml', '/sitemap_index.xml' ],
			[ '/wp-sitemap-posts-post-1.xml', '/post-sitemap.xml' ],
			[ '/wp-sitemap-posts-books-2.xml', '/books-sitemap1.xml' ],
			[ '/wp-sitemap-users-1.xml', '/author-sitemap.xml' ],
			[ '/wp-sitemap-users-2.xml', '/author-sitemap1.xml' ],
			[ '/wp-sitemap-users-100.xml', '/author-sitemap99.xml' ],
			[ '/wp-sitemap-taxonomies-category-1.xml', '/category-sitemap.xml' ],
			[ '/wp-sitemap-taxonomies-category-2.xml', '/category-sitemap1.xml' ],
		];
	}
}
