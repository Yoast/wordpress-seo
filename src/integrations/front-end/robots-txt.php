<?php

namespace Yoast\WP\SEO\Integrations\Front_End;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class Robots_Txt.
 */
class Robots_Txt implements Integration_Interface {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Sets the helpers.
	 *
	 * @codeCoverageIgnore It just handles dependencies.
	 *
	 * @param Options_Helper $options Options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_filter( 'robots_txt', [ $this, 'filter_robots' ], 10, 2 );
	}

	/**
	 * Filter the robots.txt output.
	 *
	 * @param string $robots_txt The robots.txt output from WordPress.
	 * @param string $public     Option that says whether the site is public or not.
	 *
	 * @return string $output Filtered robots.txt output.
	 */
	public function filter_robots( $robots_txt, $public ) {
		// If the site isn't public, bail.
		if ( $public === '0' ) {
			return $robots_txt;
		}

		if ( $this->options->get( 'enable_xml_sitemap', false ) ) {
			$robots_txt  = trim( $robots_txt );
			$robots_txt .= "\n\n" . 'Sitemap: ' . home_url( '/sitemap_index.xml' ) . "\n";
		}

		return $robots_txt;
	}
}
