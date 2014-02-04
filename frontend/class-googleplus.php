<?php
/**
 * @package Frontend
 *
 * This code handles the Google+ specific output that's not covered by OpenGraph.
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'WPSEO_GooglePlus' ) ) {
	class WPSEO_GooglePlus extends WPSEO_Frontend {

		/**
		 * @var	object	Instance of this class
		 */
		public static $instance;

		/**
		 * @var array $options Options for the OpenGraph Settings
		 */
		var $options = array();

		/**
		 * Class constructor.
		 */
		public function __construct() {
			$this->options = WPSEO_Options::get_all();

			add_action( 'wpseo_googleplus', array( $this, 'description' ) );

			add_action( 'wpseo_head', array( $this, 'output' ), 40 );
		}

		/**
		 * Get the singleton instance of this class
		 *
		 * @return object
		 */
		public static function get_instance() {
			if ( ! ( self::$instance instanceof self ) ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Output the Google+ specific content
		 */
		public function output() {
			do_action( 'wpseo_googleplus' );
		}

		/**
		 * Output the Google+ specific description
		 */
		public function description() {
			if ( is_singular() ) {
				$desc = WPSEO_Meta::get_value( 'google-plus-description' );

				/**
				 * Allow developers to change the Google+ specific description output
				 *
				 * @api string $desc The description string
				 */
				$desc = apply_filters( 'wpseo_googleplus_desc', $desc );

				if ( is_string( $desc ) && '' != $desc ) {
					echo '<meta itemprop="description" content="' . $desc . '">' . "\n";
				}
			}
		}
	}
} // end if class exists