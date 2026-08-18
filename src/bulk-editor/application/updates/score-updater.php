<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Application\Updates;

use Exception;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Score_Update;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Error;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Result;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Result_Collection;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Persists the per-field scores the bulk editor computes after a save, independently per post.
 */
class Score_Updater implements LoggerAwareInterface {

	use LoggerAwareTrait;

	/**
	 * The meta key (without prefix) the SEO title score is stored under.
	 *
	 * @var string
	 */
	public const SEO_TITLE_SCORE_KEY = 'seo_title_score';

	/**
	 * The meta key (without prefix) the meta description score is stored under.
	 *
	 * @var string
	 */
	public const META_DESCRIPTION_SCORE_KEY = 'meta_description_score';

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
		$this->logger              = new NullLogger();
	}

	/**
	 * Applies the given score updates. Updates are applied independently: one failing update does
	 * not block the others.
	 *
	 * @param array<Post_Score_Update> $updates The score updates to apply.
	 *
	 * @return Update_Result_Collection The result per score update.
	 */
	public function update( array $updates ): Update_Result_Collection {
		$results = new Update_Result_Collection();

		foreach ( $updates as $update ) {
			$results->add( $this->apply( $update ) );
		}

		return $results;
	}

	/**
	 * Applies a single score update.
	 *
	 * @param Post_Score_Update $update The score update to apply.
	 *
	 * @return Update_Result The result of the update.
	 */
	private function apply( Post_Score_Update $update ): Update_Result {
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
			if ( $update->has_seo_title_score() ) {
				$this->meta_writer->write_score( $post_id, self::SEO_TITLE_SCORE_KEY, $update->get_seo_title_score() );
			}

			if ( $update->has_meta_description_score() ) {
				$this->meta_writer->write_score( $post_id, self::META_DESCRIPTION_SCORE_KEY, $update->get_meta_description_score() );
			}
		} catch ( Exception $exception ) {
			$this->logger->warning(
				'Bulk score update failed to save post {post_id}: {error}',
				[
					'post_id' => $post_id,
					'error'   => $exception->getMessage(),
				],
			);

			return Update_Result::for_failure( $post_id, Update_Error::SAVE_FAILED );
		}

		return Update_Result::for_success( $post_id );
	}
}
