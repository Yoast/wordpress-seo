<?php
/**
 * @package WPSEO\Tests\Frontend
 */

/**
 * Helper class to provide needed shared code to implementations.
 *
 * @group frontend
 */
class WPSEO_UnitTestCase_Frontend extends WPSEO_UnitTestCase {
	/** @var WPSEO_Frontend_Double */
	protected static $class_instance;

	/**
	 * Sets up the class instance to be a more usable double of the Frontend class.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		require_once WPSEO_TESTS_PATH . 'doubles/frontend-double.php';

		self::$class_instance = WPSEO_Frontend_Double::get_instance();
	}

	/**
	 * Override the go_to function in core as its broken when path isn't set.
	 *
	 * Can be removed when https://core.trac.wordpress.org/ticket/31417 is fixed and in all releases we're testing (so when 4.2 is the lowest common denominator).
	 *
	 * @param string $url URL.
	 */
	public function go_to( $url ) {
		// Note: the WP and WP_Query classes like to silently fetch parameters
		// from all over the place (globals, GET, etc), which makes it tricky
		// to run them more than once without very carefully clearing everything.
		$_GET  = array();
		$_POST = array();

		$keys = array(
			'query_string',
			'id',
			'postdata',
			'authordata',
			'day',
			'currentmonth',
			'page',
			'pages',
			'multipage',
			'more',
			'numpages',
			'pagenow',
		);

		foreach ( $keys as $v ) {
			if ( isset( $GLOBALS[ $v ] ) ) {
				unset( $GLOBALS[ $v ] );
			}
		}
		$parts = wp_parse_url( $url );
		if ( isset( $parts['scheme'] ) ) {
			$req = isset( $parts['path'] ) ? $parts['path'] : '';
			if ( isset( $parts['query'] ) ) {
				$req .= '?' . $parts['query'];
				// Parse the url query vars into $_GET.
				parse_str( $parts['query'], $_GET );
			}
		}
		else {
			$req = $url;
		}
		if ( ! isset( $parts['query'] ) ) {
			$parts['query'] = '';
		}

		$_SERVER['REQUEST_URI'] = $req;
		unset( $_SERVER['PATH_INFO'] );

		$this->flush_cache();
		unset( $GLOBALS['wp_query'], $GLOBALS['wp_the_query'] );
		$GLOBALS['wp_the_query'] = new WP_Query();
		$GLOBALS['wp_query']     = $GLOBALS['wp_the_query'];
		$GLOBALS['wp']           = new WP();
		_cleanup_query_vars();

		$GLOBALS['wp']->main( $parts['query'] );
	}
}
