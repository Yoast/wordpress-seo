<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Integrations
 */

namespace Yoast\WP\SEO\Tests\Initializers;

use Brain\Monkey\Expectation\Exception\Exception;
use Brain\Monkey\Expectation\Exception\MissedPatchworkReplace;
use Brain\Monkey\Expectation\Exception\ExpectationArgsRequired;
use Brain\Monkey\Expectation\Exception\NotAllowedMethod;
use Brain\Monkey\Functions;
use UnexpectedValueException;
use Yoast\WP\SEO\Initializers\Disable_Core_Sitemaps;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Initializers\Disable_Core_Sitemaps
 *
 * @group integrations
 */
class Disable_Core_Sitemaps_Test extends TestCase {
	/**
	 * Represents the instance we are testing.
	 *
	 * @var Disable_Core_Sitemaps
	 */
	private $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Disable_Core_Sitemaps();
	}

	/**
	 * Tests the situation when primary term id isn't to the category id, the id should get updated.
	 *
	 * @covers ::__construct
	 * @covers ::register_hooks
	 */
	public function test_initialize() {
		$this->instance->initialize();

		$this->assertTrue( \has_filter( 'wp_sitemaps_enabled', '__return_false' ), 'Does not have expected wp_sitemaps_enabled filter' );
		$this->assertTrue( \has_action( 'template_redirect', [ $this->instance, 'template_redirect' ] ), 'Does not have expected template_redirect action' );
	}

	/**
	 * Tests the template_redirect function.
	 *
	 * @param string $path     The request path.
	 * @param string $redirect The expected redirect.
	 *
	 * @covers ::__construct
	 * @covers ::template_redirect
	 * @covers ::get_redirect_url
	 *
	 * @dataProvider template_redirect_data
	 */
	public function test_template_redirect( $path, $redirect ) {
		$_SERVER['REQUEST_URI'] = $path;

		if ( $redirect ) {
			Functions\expect( 'home_url' )->once()->with( $redirect )->andReturnFirstArg();
			Functions\expect( 'wp_safe_redirect' )->once()->with( $redirect, 301, 'Yoast SEO' );
		}

		$this->instance->template_redirect();

		unset( $_SERVER['REQUEST_URI'] );
	}

	/**
	 * Data provider for the template redirect test.
	 *
	 * @return array The test data.
	 */
	public function template_redirect_data() {
		return [
			[ null, null ],
			[ '/', null ],
			[ '/this-is-not-a-wp-sitemap-request', null ],
			[ '/wp-sitemap.xml', '/sitemap_index.xml' ],
			[ '/wp-sitemap-posts-post-1.xml', '/post-sitemap.xml' ],
			[ '/wp-sitemap-posts-books-2.xml', '/books-sitemap1.xml' ],
			[ '/wp-sitemap-users-1.xml', '/author-sitemap.xml' ],
			[ '/wp-sitemap-taxonomies-category-1.xml', '/category-sitemap.xml' ],
		];
	}
}
