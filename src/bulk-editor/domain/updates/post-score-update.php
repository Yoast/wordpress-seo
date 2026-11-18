<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Domain\Updates;

/**
 * Describes a per-post update of the SEO title and/or meta description score.
 *
 * A score is null when it is not part of the update, so an update can carry either or both scores.
 */
class Post_Score_Update {

	/**
	 * The ID of the post to update.
	 *
	 * @var int
	 */
	private $post_id;

	/**
	 * The SEO title score, or null when it is not part of this update.
	 *
	 * @var int|null
	 */
	private $seo_title_score;

	/**
	 * The meta description score, or null when it is not part of this update.
	 *
	 * @var int|null
	 */
	private $meta_description_score;

	/**
	 * The constructor.
	 *
	 * @param int      $post_id                The ID of the post to update.
	 * @param int|null $seo_title_score        The SEO title score, or null when not part of this update.
	 * @param int|null $meta_description_score The meta description score, or null when not part of this update.
	 */
	public function __construct( int $post_id, ?int $seo_title_score, ?int $meta_description_score ) {
		$this->post_id                = $post_id;
		$this->seo_title_score        = $seo_title_score;
		$this->meta_description_score = $meta_description_score;
	}

	/**
	 * Gets the ID of the post to update.
	 *
	 * @return int The ID of the post to update.
	 */
	public function get_post_id(): int {
		return $this->post_id;
	}

	/**
	 * Whether this update carries an SEO title score.
	 *
	 * @return bool Whether this update carries an SEO title score.
	 */
	public function has_seo_title_score(): bool {
		return $this->seo_title_score !== null;
	}

	/**
	 * Gets the SEO title score.
	 *
	 * @return int|null The SEO title score, or null when not part of this update.
	 */
	public function get_seo_title_score(): ?int {
		return $this->seo_title_score;
	}

	/**
	 * Whether this update carries a meta description score.
	 *
	 * @return bool Whether this update carries a meta description score.
	 */
	public function has_meta_description_score(): bool {
		return $this->meta_description_score !== null;
	}

	/**
	 * Gets the meta description score.
	 *
	 * @return int|null The meta description score, or null when not part of this update.
	 */
	public function get_meta_description_score(): ?int {
		return $this->meta_description_score;
	}
}
