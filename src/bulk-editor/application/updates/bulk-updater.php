<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Application\Updates;

use Exception;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update_Collection;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Error;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Result;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Result_Collection;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Type;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Applies a batch of post updates, independently per post.
 */
class Bulk_Updater implements LoggerAwareInterface {

	use LoggerAwareTrait;

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
	 * The field renderer.
	 *
	 * @var Field_Renderer_Interface
	 */
	private $field_renderer;

	/**
	 * The constructor.
	 *
	 * @param Post_Access_Checker_Interface $post_access_checker The post access checker.
	 * @param Meta_Writer_Interface         $meta_writer         The meta writer.
	 * @param Field_Renderer_Interface      $field_renderer      The field renderer.
	 */
	public function __construct(
		Post_Access_Checker_Interface $post_access_checker,
		Meta_Writer_Interface $meta_writer,
		Field_Renderer_Interface $field_renderer
	) {
		$this->post_access_checker = $post_access_checker;
		$this->meta_writer         = $meta_writer;
		$this->field_renderer      = $field_renderer;
		$this->logger              = new NullLogger();
	}

	/**
	 * Applies the given post updates. Updates are applied independently: one failing
	 * update does not block the others.
	 *
	 * @param Update_Type            $type    The appearance the updates target.
	 * @param Post_Update_Collection $updates The post updates to apply.
	 *
	 * @return Update_Result_Collection The result per post update.
	 */
	public function update( Update_Type $type, Post_Update_Collection $updates ): Update_Result_Collection {
		$results = new Update_Result_Collection();

		foreach ( $updates->get() as $update ) {
			$results->add( $this->apply( $type, $update ) );
		}

		return $results;
	}

	/**
	 * Applies a single post update.
	 *
	 * @param Update_Type $type   The appearance the update targets.
	 * @param Post_Update $update The post update to apply.
	 *
	 * @return Update_Result The result of the update.
	 */
	private function apply( Update_Type $type, Post_Update $update ): Update_Result {
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
				$this->meta_writer->write_title( $type, $post_id, $update->get_title() );
			}

			if ( $update->has_description() ) {
				$this->meta_writer->write_description( $type, $post_id, $update->get_description() );
			}

			if ( $update->has_focus_keyphrase() ) {
				$this->meta_writer->write_focus_keyphrase( $post_id, $update->get_focus_keyphrase() );
			}
		} catch ( Exception $exception ) {
			$this->logger->warning(
				'Bulk update failed to save post {post_id}: {error}',
				[
					'post_id' => $post_id,
					'error'   => $exception->getMessage(),
				],
			);

			return Update_Result::for_failure( $post_id, Update_Error::SAVE_FAILED );
		}

		return Update_Result::for_success( $post_id, $this->render_fields( $type, $post_id ) );
	}

	/**
	 * Renders the search appearance fields so the bulk editor can re-score them on the value users see.
	 *
	 * Only the search appearance is rendered: its SEO title and meta description feed the per-field
	 * scores. The social appearance has no assessors, so it needs no rendered value. Both fields are
	 * always returned, regardless of which one changed, so a focus keyphrase edit (which affects both
	 * scores) can be re-scored too.
	 *
	 * @param Update_Type $type    The appearance the update targets.
	 * @param int         $post_id The ID of the post.
	 *
	 * @return array<string, string> The rendered fields, keyed by field, or an empty array for social updates.
	 */
	private function render_fields( Update_Type $type, int $post_id ): array {
		if ( ! $type->is_search() ) {
			return [];
		}

		return [
			'seo_title'        => $this->field_renderer->render( $post_id, 'title' ),
			'meta_description' => $this->field_renderer->render( $post_id, 'metadesc' ),
		];
	}
}
