<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Adds the Dublin Core metadata.
 */
class WPSEO_Dublin_Core {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
	}

	/**
	 * Hooks the methods for output.
	 */
	public function init() {
		add_action( 'wpseo_head', array( $this, 'date_issued' ), 50 );
	}

	/**
	 * Internal function to output DC tags. This also adds an output filter to each bit of output based on the property.
	 *
	 * @param string $property Property attribute value.
	 * @param string $content  Content attribute value.
	 *
	 * @return boolean
	 */
	public function dc_tag( $property, $content ) {

		/**
		 * Filter: 'wpseo_dc_' . $property - Allow developers to change the content of specific DC meta tags.
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
	 */
	public function date_issued() {

		if ( ! is_singular() ) {
			return;
		}

		$this->dc_tag( 'DC.date.issued', get_the_date( DATE_W3C ) );
	}
}
