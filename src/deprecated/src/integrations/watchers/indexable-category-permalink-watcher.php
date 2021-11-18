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
 * @since      17.7
 * @deprecated 17.7
 *
 * @phpcs:disable Generic.Files.OneObjectStructurePerFile.MultipleFound
 * @phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedNamespaceFound
 * @phpcs:disable Yoast.Commenting.CodeCoverageIgnoreDeprecated
 * @phpcs:disable Yoast.Commenting.FileComment.Unnecessary
 * @phpcs:disable Yoast.Files.FileName.InvalidClassFileName
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

/**
 * Class Indexable_Category_Permalink_Watcher.
 *
 * @deprecated 17.7 Use {@see \Yoast\WP\SEO\Integrations\Watchers\Option_Stripcategorybase_Watcher} instead.
 */
class Indexable_Category_Permalink_Watcher extends Option_Stripcategorybase_Watcher {

	/**
	 * Indexable Category Permalink Watcher constructor.
	 *
	 * @deprecated 17.7 Use {@see \Yoast\WP\SEO\Integrations\Watchers\Option_Stripcategorybase_Watcher} instead.
	 */
	public function __construct() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 17.7', '\Yoast\WP\SEO\Integrations\Watchers\Option_Stripcategorybase_Watcher' );

		// Only call a constructor if the parent has one; we already are a subclass of the parent.
		if ( is_callable( 'parent::__construct' ) ) {
			parent::__construct();
		}
	}
}
