<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Adds the Dublin Core metadata.
 *
 * @deprecated 5.3
 */
class WPSEO_Dublin_Core {

	/**
	 * Constructor.
	 *
	 * @deprecated 5.3
	 */
	public function __construct() {
		_deprecated_function( 'WPSEO_Dublin_Core::__construct', 'WPSEO 5.3' );
	}

	/**
	 * Hooks the methods for output.
	 *
	 * @deprecated 5.3
	 */
	public function init() {
		_deprecated_function( 'WPSEO_Dublin_Core::init', 'WPSEO 5.3' );
	}

	/**
	 * Internal function to output DC tags. This also adds an output filter to each bit of output based on the property.
	 *
	 * @deprecated 5.3
	 *
	 * @param string $property Property attribute value.
	 * @param string $content  Content attribute value.
	 *
	 * @return boolean
	 */
	public function dc_tag( $property, $content ) {
		_deprecated_function( 'WPSEO_Dublin_Core::dc_tag', 'WPSEO 5.3' );

		/**
		 * Filter: 'wpseo_dc_' . $property - Allow developers to change the content of specific DC meta tags.
		 *
		 * @deprecated 5.3
		 *
		 * @api string $content The content of the property
		 */
		$content = apply_filters( 'wpseo_dc_' . $property, $content );

		if ( empty( $content ) ) {
			return false;
		}

		echo '<meta property="', esc_attr( $property ), '" content="', esc_attr( $content ), '" />', "\n";

		return true;
	}

	/**
	 * Outputs DC.date.issued meta tag.
	 *
	 * @deprecated 5.3
	 */
	public function date_issued() {
		_deprecated_function( 'WPSEO_Dublin_Core::date_issued', 'WPSEO 5.3' );

		if ( ! is_singular() ) {
			return;
		}

		$this->dc_tag( 'DC.date.issued', get_the_date( DATE_W3C ) );
	}
}
