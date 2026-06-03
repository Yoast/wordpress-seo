<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Application\Updates;

use Exception;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update_Collection;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Error;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Result;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Result_Collection;

/**
 * Applies a batch of post updates, independently per post.
 */
abstract class Abstract_Bulk_Updater {

	/**
	 * The post access checker.
	 *
	 * @var Post_Access_Checker_Interface
	 */
	private $post_access_checker;

	/**
	 * The meta writer.
	 *
	 * @var Meta_Writer_Interface
	 */
	private $meta_writer;

	/**
	 * The constructor.
	 *
	 * @param Post_Access_Checker_Interface $post_access_checker The post access checker.
	 * @param Meta_Writer_Interface         $meta_writer         The meta writer.
	 */
	public function __construct( Post_Access_Checker_Interface $post_access_checker, Meta_Writer_Interface $meta_writer ) {
		$this->post_access_checker = $post_access_checker;
		$this->meta_writer         = $meta_writer;
	}

	/**
	 * Applies the given post updates. Updates are applied independently: one failing
	 * update does not block the others.
	 *
	 * @param Post_Update_Collection $updates The post updates to apply.
	 *
	 * @return Update_Result_Collection The result per post update.
	 */
	public function update( Post_Update_Collection $updates ): Update_Result_Collection {
		$results = new Update_Result_Collection();

		foreach ( $updates->get() as $update ) {
			$results->add( $this->apply( $update ) );
		}

		return $results;
	}

	/**
	 * Applies a single post update.
	 *
	 * @param Post_Update $update The post update to apply.
	 *
	 * @return Update_Result The result of the update.
	 */
	private function apply( Post_Update $update ): Update_Result {
		$post_id = $update->get_post_id();

		if ( ! $this->post_access_checker->exists( $post_id ) ) {
			return Update_Result::for_failure( $post_id, Update_Error::NOT_FOUND );
		}

		if ( ! $this->post_access_checker->is_supported_type( $post_id ) ) {
			return Update_Result::for_failure( $post_id, Update_Error::INVALID_POST_TYPE );
		}

		if ( ! $this->post_access_checker->can_edit( $post_id ) ) {
			return Update_Result::for_failure( $post_id, Update_Error::FORBIDDEN );
		}

		try {
			if ( $update->has_title() ) {
				$this->meta_writer->write_title( $post_id, $update->get_title() );
			}

			if ( $update->has_description() ) {
				$this->meta_writer->write_description( $post_id, $update->get_description() );
			}
		} catch ( Exception $exception ) {
			return Update_Result::for_failure( $post_id, Update_Error::SAVE_FAILED );
		}

		return Update_Result::for_success( $post_id );
	}
}
