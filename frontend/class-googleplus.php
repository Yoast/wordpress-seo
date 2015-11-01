<?php
/**
 * @package WPSEO\Frontend
 */

/**
 * This code handles the Google+ specific output that's not covered by OpenGraph.
 */
class WPSEO_GooglePlus {

	/**
	 * @var    object    Instance of this class
	 */
	public static $instance;

	/**
	 * Class constructor.
	 */
	public function __construct() {
		add_action( 'wpseo_googleplus', array( $this, 'google_plus_title' ), 10 );
		add_action( 'wpseo_googleplus', array( $this, 'description' ), 11 );
		add_action( 'wpseo_googleplus', array( $this, 'google_plus_image' ), 12 );

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
		/**
		 * Action: 'wpseo_googleplus' - Hook to add all Google+ specific output to.
		 */
		do_action( 'wpseo_googleplus' );
	}

	/**
	 * Output the Google+ specific description
	 */
	public function description() {
		$desc = $this->get_meta_value( 'google-plus-description' );

		if ( is_string( $desc ) ) {
			/**
			 * Filter: 'wpseo_googleplus_desc' - Allow developers to change the Google+ specific description output
			 *
			 * @api string $desc The description string
			 */
			$desc = trim( apply_filters( 'wpseo_googleplus_desc', $desc ) );

			if ( is_string( $desc ) && $desc !== '' ) {
				echo '<meta itemprop="description" content="', esc_attr( $desc ), '">', "\n";
			}
		}
	}

	/**
	 * Output the Google+ specific title
	 */
	public function google_plus_title() {
		$title = $this->get_meta_value( 'google-plus-title' );

		if ( is_string( $title ) ) {
			/**
			 * Filter: 'wpseo_googleplus_title' - Allow developers to change the Google+ specific title
			 *
			 * @api string $title The title string
			 */
			$title = trim( apply_filters( 'wpseo_googleplus_title', $title ) );

			if ( is_string( $title ) && $title !== '' ) {
				$title = wpseo_replace_vars( $title, get_post() );

				echo '<meta itemprop="name" content="', esc_attr( $title ), '">', "\n";
			}
		}
	}

	/**
	 * Output the Google+ specific image
	 */
	public function google_plus_image() {
		$image = $this->get_meta_value( 'google-plus-image' );

		if ( is_string( $image ) ) {

			/**
			 * Filter: 'wpseo_googleplus_image' - Allow changing the Google+ image
			 *
			 * @api string $img Image URL string
			 */
			$image = trim( apply_filters( 'wpseo_googleplus_image', $image ) );

			if ( is_string( $image ) && $image !== '' ) {
				echo '<meta itemprop="image" content="', esc_url( $image ), '">', "\n";
			}
		}
	}

	/**
	 * Returns the meta value for the given $meta_key.
	 *
	 * @param string $meta_key The target key that will be fetched.
	 *
	 * @return string
	 */
	private function get_meta_value( $meta_key ) {
		if ( is_singular() ) {
			return WPSEO_Meta::get_value( $meta_key );
		}

		if ( is_category() || is_tag() || is_tax() ) {
			return WPSEO_Taxonomy_Meta::get_meta_without_term( $meta_key );
		}

		return '';
	}
}
