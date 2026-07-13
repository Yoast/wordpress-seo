<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

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
	 * Used by operations that have to target a single, unambiguous post.
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
	 * identifier at all, an error is returned.
	 *
	 * @param array<string, int|string|bool|null> $input The input containing a 'post_id', 'permalink', or 'title', plus an optional 'page' for a title search.
	 *
	 * @return Indexable[]|WP_Error The matching indexables, or an error for a missing or unknown id/permalink.
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

			return $this->by_title( (string) $input['title'], $page );
		}

		return new WP_Error(
			'yoast_seo_missing_identifier',
			\__( 'Provide a post_id, a permalink, or title keywords to identify the post.', 'wordpress-seo' ),
			[ 'status' => 400 ],
		);
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
			return $this->invalid_identifier( 'post_id' );
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

		// The permalink lookup is not scoped by object type, so a term, author, or
		// archive URL can match too; only posts are valid targets here.
		if ( ! $indexable || $indexable->object_type !== 'post' ) {
			return $this->invalid_identifier( 'permalink' );
		}

		return $indexable;
	}

	/**
	 * Resolves posts by title keywords.
	 *
	 * A title search may match several posts; no match on the first page (or an
	 * unexpected result that is not a list of indexables) is treated as not-found,
	 * mirroring the by-id and by-permalink resolvers. An empty later page is valid
	 * pagination past the last result, as the page parameter's schema documents.
	 *
	 * @param string $title The title keywords.
	 * @param int    $page  The 1-based result page.
	 *
	 * @return Indexable[]|WP_Error The matching indexables, or a not-found error.
	 */
	private function by_title( string $title, int $page ) {
		$indexables = $this->indexable_repository->find_posts_by_title_keywords( $title, $page );

		if ( $indexables === [] ) {
			// An empty later page means the client paged past the last result, not a bad identifier.
			if ( $page > 1 ) {
				return [];
			}

			return $this->invalid_identifier( 'title' );
		}

		foreach ( $indexables as $indexable ) {
			if ( ! ( $indexable instanceof Indexable ) ) {
				return $this->invalid_identifier( 'title' );
			}
		}

		return $indexables;
	}

	/**
	 * Builds the error for an identifier that does not resolve to a post.
	 *
	 * Coded yoast_seo_invalid_<field> so a caller knows which identifier to correct and retry.
	 *
	 * @param string $field The identifier that failed to resolve: 'post_id', 'permalink', or 'title'.
	 *
	 * @return WP_Error The error for the unresolvable identifier.
	 */
	private function invalid_identifier( string $field ): WP_Error {
		return new WP_Error(
			'yoast_seo_invalid_' . $field,
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
