<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Application\Updates\Search;

use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Abstract_Bulk_Updater;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Post_Access_Checker_Interface;

/**
 * Applies a batch of search appearance (SEO title and meta description) updates.
 */
class Search_Bulk_Updater extends Abstract_Bulk_Updater {

	/**
	 * The constructor.
	 *
	 * @param Post_Access_Checker_Interface $post_access_checker The post access checker.
	 * @param Search_Meta_Writer_Interface  $meta_writer         The search meta writer.
	 */
	public function __construct( Post_Access_Checker_Interface $post_access_checker, Search_Meta_Writer_Interface $meta_writer ) { // phpcs:ignore Generic.CodeAnalysis.UselessOverridingMethod.Found -- Reason: The override narrows the writer type so DI can autowire the search channel.
		parent::__construct( $post_access_checker, $meta_writer );
	}
}
