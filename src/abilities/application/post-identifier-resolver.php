<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Resolves a user-friendly post identifier (ID, permalink, or title keywords) into post indexables.
 *
 * Lets callers find a post without knowing its numeric ID: by URL, or by a few
 * remembered title keywords. Shared by the read ability, the write ability, and
 * the write permission check.
 */
class Post_Identifier_Resolver {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * Constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository
	) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Resolves the input to exactly one post indexable.
	 *
	 * Used by the write path, which must target a single, unambiguous post.
	 * Title keywords are deliberately not accepted here: they can match several
	 * posts, so only an exact identifier (post ID or permalink) is allowed.
	 *
	 * @param array<string, int|string|bool|null> $input The input containing one of 'post_id' or 'permalink'.
	 *
	 * @return Indexable|WP_Error The matching indexable, or an error (missing or unknown identifier).
	 */
	public function resolve_one( array $input ) {
		if ( $this->has( $input, 'post_id' ) ) {
			return $this->by_id( (int) $input['post_id'] );
		}

		if ( $this->has( $input, 'permalink' ) ) {
			return $this->by_permalink( (string) $input['permalink'] );
		}

		return new WP_Error(
			'yoast_seo_missing_identifier',
			\__( 'Provide a post_id or a permalink to identify the post.', 'wordpress-seo' ),
			[ 'status' => 400 ],
		);
	}

	/**
	 * Resolves the input to all matching post indexables.
	 *
	 * Used by the read path. A title search may match several posts; with no
	 * identifier at all, the latest public post is returned.
	 *
	 * @param array<string, int|string|bool|null> $input The input containing an optional 'post_id', 'permalink', or 'title', plus an optional 'page' for a title search.
	 *
	 * @return Indexable[]|WP_Error The matching indexables, or an error for an unknown id/permalink.
	 */
	public function resolve_many( array $input ) {
		if ( $this->has( $input, 'post_id' ) ) {
			$indexable = $this->by_id( (int) $input['post_id'] );

			return ( $indexable instanceof WP_Error ) ? $indexable : [ $indexable ];
		}

		if ( $this->has( $input, 'permalink' ) ) {
			$indexable = $this->by_permalink( (string) $input['permalink'] );

			return ( $indexable instanceof WP_Error ) ? $indexable : [ $indexable ];
		}

		if ( $this->has( $input, 'title' ) ) {
			$page = ( isset( $input['page'] ) ) ? (int) $input['page'] : 1;

			return $this->indexable_repository->find_posts_by_title_keywords( (string) $input['title'], $page );
		}

		// No identifier given: default to the latest public post.
		return $this->indexable_repository->get_recently_modified_posts( 'post', 1, false );
	}

	/**
	 * Resolves a post by its ID.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return Indexable|WP_Error The matching indexable, or a not-found error.
	 */
	private function by_id( int $post_id ) {
		$indexable = $this->indexable_repository->find_by_id_and_type( $post_id, 'post', false );

		if ( ! $indexable ) {
			return $this->not_found();
		}

		return $indexable;
	}

	/**
	 * Resolves a post by its permalink.
	 *
	 * Matches the permalink exactly against the indexable table; no WordPress URL
	 * resolution is performed, so the exact stored permalink must be provided.
	 *
	 * @param string $permalink The permalink.
	 *
	 * @return Indexable|WP_Error The matching indexable, or a not-found error.
	 */
	private function by_permalink( string $permalink ) {
		$indexable = $this->indexable_repository->find_by_permalink( $permalink );
		if ( ! $indexable ) {
			return $this->not_found();
		}

		return $indexable;
	}

	/**
	 * Builds the standard not-found error.
	 *
	 * @return WP_Error The not-found error.
	 */
	private function not_found(): WP_Error {
		return new WP_Error(
			'yoast_seo_post_not_found',
			\__( 'No post could be found for the given identifier.', 'wordpress-seo' ),
			[ 'status' => 404 ],
		);
	}

	/**
	 * Checks whether a non-empty identifier of the given key is present in the input.
	 *
	 * @param array<string, int|string|bool|null> $input The input.
	 * @param string                              $key   The identifier key.
	 *
	 * @return bool Whether the identifier is present and non-empty.
	 */
	private function has( array $input, string $key ): bool {
		return ( isset( $input[ $key ] ) && $input[ $key ] !== '' );
	}
}
