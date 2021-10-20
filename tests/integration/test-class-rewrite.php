<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Rewrite_Test extends WPSEO_UnitTestCase {

	/**
	 * Name of the option indicating whether the rewrite options should be flushed.
	 *
	 * @var string
	 */
	private $flush_option_name = 'wpseo_flush_rewrite';

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Rewrite
	 */
	private static $class_instance;

	/**
	 * Set up the class which will be tested.
	 */
	public static function set_up_before_class() {
		parent::set_up_before_class();
		self::$class_instance = new WPSEO_Rewrite();
	}

	/**
	 * Tests if the schedule_flush function sets the option to 1.
	 *
	 * @covers WPSEO_Rewrite::schedule_flush
	 */
	public function test_schedule_flush() {
		self::$class_instance->schedule_flush();
		$this->assertIsInt( has_action( 'shutdown', 'flush_rewrite_rules' ) );
	}

	/**
	 * Tests if the category base is overwritten correctly.
	 *
	 * @covers WPSEO_Rewrite::no_category_base
	 */
	public function test_no_category_base() {

		$input         = 'http://yoast.com/cat/link/';
		$category_base = get_option( 'category_base' );

		if ( empty( $category_base ) ) {
			$category_base = 'category';
		}

		/*
		 * Remove initial slash, if there is one (we remove the trailing slash in
		 * the regex replacement and don't want to end up short a slash).
		 */
		if ( substr( $category_base, 0, 1 ) === '/' ) {
			$category_base = substr( $category_base, 1 );
		}

		$category_base .= '/';

		$expected = preg_replace( '`' . preg_quote( $category_base, '`' ) . '`u', '', $input, 1 );
		$this->assertEquals( $expected, self::$class_instance->no_category_base( $input, null, 'category' ) ); // Passing null as 2nd parameter as it is not used.
	}

	/**
	 * Tests whether the query variables are as expected.
	 *
	 * @covers WPSEO_Rewrite::query_vars
	 */
	public function test_query_vars() {
		$this->assertEquals( [], self::$class_instance->query_vars( [] ) );

		WPSEO_Options::set( 'stripcategorybase', true );
		$this->assertEquals( [ 'wpseo_category_redirect' ], self::$class_instance->query_vars( [] ) );
	}

	/**
	 * Tests that the redirect method is never called when there aren't any query variables.
	 *
	 * @covers WPSEO_Rewrite::request
	 */
	public function test_request_with_empty_query_vars() {

		$instance = $this
			->getMockBuilder( 'WPSEO_Rewrite' )
			->setMethods( [ 'redirect' ] )
			->getMock();
		$instance
			->expects( $this->never() )
			->method( 'redirect' );

		$expected = [];

		$this->assertEquals( $expected, $instance->request( [] ) );
	}

	/**
	 * Tests that the redirect method is called with the expected parameter when passing a query variable.
	 *
	 * @covers WPSEO_Rewrite::request
	 */
	public function test_request_with_query_vars() {

		$instance = $this
			->getMockBuilder( 'WPSEO_Rewrite' )
			->setMethods( [ 'redirect' ] )
			->getMock();
		$instance
			->expects( $this->once() )
			->method( 'redirect' )
			->with( 'my-category' );

		$instance->request( [ 'wpseo_category_redirect' => 'my-category' ] );
	}

	/**
	 * Tests if the rewrite rules are as expected. Has different expectations for multisite.
	 *
	 * @covers WPSEO_Rewrite::category_rewrite_rules
	 */
	public function test_category_rewrite_rules() {

		$c = self::$class_instance;

		$categories          = get_categories( [ 'hide_empty' => false ] );
		$permalink_structure = get_option( 'permalink_structure' );

		if ( ! ( is_multisite() && strpos( $permalink_structure, '/blog/' ) === 0 ) ) {
			$expected = [
				'(uncategorized)/(?:feed/)?(feed|rdf|rss|rss2|atom)/?$' => 'index.php?category_name=$matches[1]&feed=$matches[2]',
				'(uncategorized)/page/?([0-9]{1,})/?$' => 'index.php?category_name=$matches[1]&paged=$matches[2]',
				'(uncategorized)/?$'                   => 'index.php?category_name=$matches[1]',
			];
		}
		else {
			$expected = [
				'blog/(uncategorized)/(?:feed/)?(feed|rdf|rss|rss2|atom)/?$' => 'index.php?category_name=$matches[1]&feed=$matches[2]',
				'blog/(uncategorized)/page/?([0-9]{1,})/?$' => 'index.php?category_name=$matches[1]&paged=$matches[2]',
				'blog/(uncategorized)/?$'                   => 'index.php?category_name=$matches[1]',
			];
		}

		global $wp_rewrite;
		$old_base = trim( str_replace( '%category%', '(.+)', $wp_rewrite->get_category_permastruct() ), '/' );

		$expected[ $old_base . '$' ] = 'index.php?wpseo_category_redirect=$matches[1]';

		$this->assertEquals( $expected, $c->category_rewrite_rules() );
	}
}
