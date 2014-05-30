<?php

class WPSEO_Rewrite_Test extends WPSEO_UnitTestCase {

	/**
	 * @var string
	 */
	private $flush_option_name = 'wpseo_flush_rewrite';

	/**
	 * @var WPSEO_Rewrite
	 */
	private static $class_instance;

	public static function setUpBeforeClass() {
		self::$class_instance = new WPSEO_Rewrite;
	}

	/**
	 * @covers WPSEO_Rewrite::schedule_flush
	 */
	public function test_schedule_flush() {
		self::$class_instance->schedule_flush();
		$this->assertTrue( get_option( $this->flush_option_name ) == true );
	}

	/**
	 * @covers WPSEO_Rewrite::flush
	 */
	public function test_flush() {
		delete_option( $this->flush_option_name );

		$this->assertFalse( self::$class_instance->flush() );

		self::$class_instance->schedule_flush();
		$this->assertTrue( self::$class_instance->flush() );
	}

	/**
	 * @covers WPSEO_Rewrite::no_category_base
	 */
	public function test_no_category_base() {

		$input         = 'http://yoast.com/cat/link/';
		$category_base = get_option( 'category_base' );

		if ( '' == $category_base ) {
			$category_base = 'category';
		}

		// Remove initial slash, if there is one (we remove the trailing slash in the regex replacement and don't want to end up short a slash)
		if ( '/' == substr( $category_base, 0, 1 ) ) {
			$category_base = substr( $category_base, 1 );
		}

		$category_base .= '/';

		$expected = preg_replace( '`' . preg_quote( $category_base, '`' ) . '`u', '', $input, 1 );
		$this->assertEquals( $expected, self::$class_instance->no_category_base( $input ) );
	}

	/**
	 * @covers WPSEO_Rewrite::query_vars
	 */
	public function test_query_vars() {
		$this->assertEquals( array( ), self::$class_instance->query_vars( array( ) ) );

		$options                      = WPSEO_Options::get_all();
		$options['stripcategorybase'] = true;
		update_option( WPSEO_Option_Permalinks::get_instance()->option_name, $options );
		$this->assertEquals( array( 'wpseo_category_redirect' ), self::$class_instance->query_vars( array( ) ) );
	}

	/**
	 * @covers WPSEO_Rewrite::request
	 */
	public function test_request() {
		// @TODO find method to test redirects
	}

	/**
	 * @covers WPSEO_Rewrite::category_rewrite_rules
	 */
	public function test_category_rewrite_rules() {

		$c = self::$class_instance;

		$categories = get_categories( array( 'hide_empty' => false ) );

		if( false == is_multisite() ) {
			$expected = array(
				'(uncategorized)/(?:feed/)?(feed|rdf|rss|rss2|atom)/?$' => 'index.php?category_name=$matches[1]&feed=$matches[2]',
				'(uncategorized)/page/?([0-9]{1,})/?$' => 'index.php?category_name=$matches[1]&paged=$matches[2]',
				'(uncategorized)/?$' => 'index.php?category_name=$matches[1]',
				'$' => 'index.php?wpseo_category_redirect=$matches[1]'
			);
		} else {
			$expected = array(
				'blog/(uncategorized)/(?:feed/)?(feed|rdf|rss|rss2|atom)/?$' => 'index.php?category_name=$matches[1]&feed=$matches[2]',
				'blog/(uncategorized)/page/?([0-9]{1,})/?$' => 'index.php?category_name=$matches[1]&paged=$matches[2]',
				'blog/(uncategorized)/?$' => 'index.php?category_name=$matches[1]'
			);

			global $wp_rewrite;
			$old_base                    = trim( str_replace( '%category%', '(.+)', $wp_rewrite->get_category_permastruct() ), '/' );

			$expected[ $old_base . '$' ] = 'index.php?wpseo_category_redirect=$matches[1]';
		}

		$this->assertEquals( $expected, $c->category_rewrite_rules() );
	}

}