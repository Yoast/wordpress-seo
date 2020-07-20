<?php
/**
 * Country code option action for SEMrush.
 *
 * @package Yoast\WP\SEO\Actions\SEMrush
 */

namespace Yoast\WP\SEO\Actions\SEMrush;

use \Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Class SEMrush_Options_Action
 */
class SEMrush_Options_Action {

	/**
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * SEMrush_Options_Action constructor.
	 *
	 * @param \Yoast\WP\SEO\Helpers\Options_Helper $options_helper The WPSEO options helper
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Stores SEMrush country code in the WPSEO options
	 *
	 * @param string $country_code The country code to store.
	 *
	 * @return object The response object.
	 */
	public function set_country_code( $country_code ) {
		// Code has already been validated at this point. No need to do that again.
		$this->options_helper->set( 'semrush_country_code', $country_code );

		return (object) [
			'status' => 200,
		];
	}

}

