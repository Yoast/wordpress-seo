<?php
/**
 * @package WPSEO\Admin\Import\External
 */

/**
 * Class WPSEO_Import_External
 *
 * Class with functionality to import Yoast SEO settings from other plugins
 */
class WPSEO_Import_External {

	/**
	 * Whether or not to delete old data.
	 *
	 * @var boolean
	 */
	protected $replace;

	/**
	 * Message about the import status.
	 *
	 * @var string
	 */
	public $msg = '';

	/**
	 * Whether import has been successful.
	 *
	 * @var bool
	 */
	public $success = false;

	/**
	 * Import class constructor.
	 *
	 * @param boolean $replace Boolean replace switch.
	 */
	public function __construct( $replace = false ) {
		$this->replace = $replace;

		WPSEO_Options::initialize();
	}

	/**
	 * Convenience function to set import message
	 *
	 * @param string $msg Message string.
	 */
	protected function set_msg( $msg ) {
		if ( ! empty( $this->msg ) ) {
			$this->msg .= PHP_EOL;
		}
		$this->msg .= $msg;
	}

	/**
	 * Deletes an option depending on the class replace state
	 *
	 * @param string $option Option key.
	 */
	protected function perhaps_delete( $option ) {
		if ( $this->replace ) {
			delete_option( $option );
		}
	}

	/**
	 * Import HeadSpace SEO settings
	 */
	public function import_headspace() {
		global $wpdb;

		WPSEO_Meta::replace_meta( '_headspace_description', WPSEO_Meta::$meta_prefix . 'metadesc', $this->replace );
		WPSEO_Meta::replace_meta( '_headspace_keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', $this->replace );
		WPSEO_Meta::replace_meta( '_headspace_page_title', WPSEO_Meta::$meta_prefix . 'title', $this->replace );

		/**
		 * @todo [JRF => whomever] verify how headspace sets these metas ( 'noindex', 'nofollow', 'noarchive', 'noodp', 'noydir' )
		 * and if the values saved are concurrent with the ones we use (i.e. 0/1/2)
		 */
		WPSEO_Meta::replace_meta( '_headspace_noindex', WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', $this->replace );
		WPSEO_Meta::replace_meta( '_headspace_nofollow', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', $this->replace );

		/*
		 * @todo - [JRF => whomever] check if this can be done more efficiently by querying only the meta table
		 * possibly directly changing it using concat on the existing values
		 */
		$posts = $wpdb->get_results( "SELECT ID FROM $wpdb->posts" );
		if ( is_array( $posts ) && $posts !== array() ) {
			foreach ( $posts as $post ) {
				$custom         = get_post_custom( $post->ID );
				$robotsmeta_adv = '';
				if ( isset( $custom['_headspace_noarchive'] ) ) {
					$robotsmeta_adv .= 'noarchive,';
				}
				$robotsmeta_adv = preg_replace( '`,$`', '', $robotsmeta_adv );
				WPSEO_Meta::set_value( 'meta-robots-adv', $robotsmeta_adv, $post->ID );
			}
		}

		if ( $this->replace ) {
			// We no longer use noydir, but we remove the meta key as it's unneeded.
			$hs_meta = array( 'noarchive', 'noodp', 'noydir' );
			foreach ( $hs_meta as $meta ) {
				delete_post_meta_by_key( '_headspace_' . $meta );
			}
			unset( $hs_meta, $meta );
		}
		$this->success = true;
		$this->set_msg( __( 'HeadSpace2 data successfully imported', 'wordpress-seo' ) );
	}
}
