<?php
// phpcs:disable Yoast.Commenting.FileComment.Unnecessary
/**
 * Graceful deprecation of various classes which were renamed.
 *
 * {@internal As this file is just (temporarily) put in place to warn extending
 * plugins about the class name changes, it is exempt from select CS standards.}
 *
 * @package Yoast\WP\SEO
 *
 * @since      16.7
 * @deprecated 16.7
 *
 * @phpcs:disable Generic.Files.OneObjectStructurePerFile.MultipleFound
 * @phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedNamespaceFound
 * @phpcs:disable Yoast.Commenting.CodeCoverageIgnoreDeprecated
 * @phpcs:disable Yoast.Commenting.FileComment.Unnecessary
 * @phpcs:disable Yoast.Files.FileName.InvalidClassFileName
 */

namespace Yoast\WP\SEO\Integrations\Third_Party;

/**
 * Class Elementor_Exclude_Post_Types.
 *
 * @deprecated 16.7 Use {@see \Yoast\WP\SEO\Integrations\Third_Party\Exclude_Elementor_Post_Types} instead.
 */
class Elementor_Exclude_Post_Types extends Exclude_Elementor_Post_Types {

	/**
	 * Elementor Exclude Post Types constructor.
	 *
	 * @deprecated 16.7 Use {@see \Yoast\WP\SEO\Integrations\Third_Party\Exclude_Elementor_Post_Types} instead.
	 */
	public function __construct() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 16.7', '\Yoast\WP\SEO\Integrations\Third_Party\Exclude_Elementor_Post_Types' );

		// Only call a constructor if the parent has one; we already are a subclass of the parent.
		if ( \is_callable( 'parent::__construct' ) ) {
			parent::__construct();
		}
	}
}
