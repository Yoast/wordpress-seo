<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Application\Updates\Social;

use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Abstract_Bulk_Updater;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Post_Access_Checker_Interface;

/**
 * Applies a batch of social appearance (Open Graph title and description) updates.
 */
class Social_Bulk_Updater extends Abstract_Bulk_Updater {

	/**
	 * The constructor.
	 *
	 * @param Post_Access_Checker_Interface $post_access_checker The post access checker.
	 * @param Social_Meta_Writer_Interface  $meta_writer         The social meta writer.
	 */
	public function __construct( Post_Access_Checker_Interface $post_access_checker, Social_Meta_Writer_Interface $meta_writer ) { // phpcs:ignore Generic.CodeAnalysis.UselessOverridingMethod.Found -- Reason: The override narrows the writer type so DI can autowire the social channel.
		parent::__construct( $post_access_checker, $meta_writer );
	}
}
