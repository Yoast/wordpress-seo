<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Domain;

/**
 * Immutable value object representing the full SEO data of a single post.
 *
 * Carries an identity block (so callers can disambiguate which post they are
 * looking at), the editable SEO fields, and the read-only analysis scores.
 */
class Post_SEO_Data {

	/**
	 * The SEO data, keyed by output-schema property name.
	 *
	 * @var array<string, int|string|bool|null>
	 */
	private $data;

	/**
	 * Constructor.
	 *
	 * @param array<string, int|string|bool|null> $data The SEO data, keyed by output-schema property name.
	 */
	public function __construct( array $data ) {
		$this->data = $data;
	}

	/**
	 * Serializes the post SEO data to an array for ability output.
	 *
	 * @return array<string, int|string|bool|null> The serialized post SEO data.
	 */
	public function to_array(): array {
		return $this->data;
	}

	/**
	 * Returns a minimal summary, used to present candidates when a title search is ambiguous.
	 *
	 * @return array<string, int|string|null> The candidate summary (post identity only).
	 */
	public function to_candidate_array(): array {
		return [
			'post_id'     => ( $this->data['post_id'] ?? null ),
			'post_title'  => ( $this->data['post_title'] ?? null ),
			'permalink'   => ( $this->data['permalink'] ?? null ),
			'post_type'   => ( $this->data['post_type'] ?? null ),
			'post_status' => ( $this->data['post_status'] ?? null ),
		];
	}
}
