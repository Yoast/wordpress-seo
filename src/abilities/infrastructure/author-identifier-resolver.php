<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use WP_Error;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Resolves an author identifier (user ID or author archive permalink) into a user indexable.
 *
 * No user indexable exists while author archives are disabled, or for users excluded from them, like users
 * without posts when author archives without posts are set to noindex. Their SEO settings have no effect on
 * what search engines see, so those users are rejected with a dedicated error.
 */
class Author_Identifier_Resolver {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The author archive helper.
	 *
	 * @var Author_Archive_Helper
	 */
	private $author_archive_helper;

	/**
	 * The URL helper.
	 *
	 * @var Url_Helper
	 */
	private $url_helper;

	/**
	 * Constructor.
	 *
	 * @param Indexable_Repository  $indexable_repository  The indexable repository.
	 * @param Author_Archive_Helper $author_archive_helper The author archive helper.
	 * @param Url_Helper            $url_helper            The URL helper.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Author_Archive_Helper $author_archive_helper,
		Url_Helper $url_helper
	) {
		$this->indexable_repository  = $indexable_repository;
		$this->author_archive_helper = $author_archive_helper;
		$this->url_helper            = $url_helper;
	}

	/**
	 * Resolves the input to exactly one user indexable.
	 *
	 * @param array<string, int|string|bool|null> $input The input containing one of 'user_id' or 'permalink'.
	 *
	 * @return Indexable|WP_Error The matching indexable, or an error (author archives disabled, missing or unknown
	 *                            identifier, or excluded author archive).
	 */
	public function resolve_one( array $input ) {
		if ( $this->author_archive_helper->are_disabled() ) {
			return new WP_Error(
				'yoast_seo_author_archives_disabled',
				\__( 'Author archives are disabled, so their SEO data has no effect. Enable the author archives in the Yoast SEO settings first.', 'wordpress-seo' ),
				[ 'status' => 400 ],
			);
		}

		if ( $this->has( $input, 'user_id' ) ) {
			return $this->by_id( (int) $input['user_id'] );
		}

		if ( $this->has( $input, 'permalink' ) ) {
			return $this->by_permalink( (string) $input['permalink'] );
		}

		return new WP_Error(
			'yoast_seo_missing_identifier',
			\__( 'Provide a user_id or a permalink to identify the author.', 'wordpress-seo' ),
			[ 'status' => 400 ],
		);
	}

	/**
	 * Resolves a user by their ID.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return Indexable|WP_Error The matching indexable, or a not-found or excluded error.
	 */
	private function by_id( int $user_id ) {
		// Checked first, as a missing indexable alone does not tell a nonexistent user apart from an excluded one.
		if ( \get_userdata( $user_id ) === false ) {
			return $this->invalid_identifier( 'user_id' );
		}

		$indexable = $this->indexable_repository->find_by_id_and_type( $user_id, 'user', false );

		if ( ! $indexable ) {
			return new WP_Error(
				'yoast_seo_author_archive_excluded',
				\__( 'The author archive of this user is not shown to search engines, for example because the user has no posts, so its SEO data has no effect.', 'wordpress-seo' ),
				[ 'status' => 400 ],
			);
		}

		return $indexable;
	}

	/**
	 * Resolves a user by the permalink of their author archive.
	 *
	 * Matches the permalink exactly against the indexable table. Excluded authors have no indexable, so when
	 * nothing matches, the permalink is traced back to a user and handed to by_id(), which tells an excluded
	 * author apart from a nonexistent one.
	 *
	 * @param string $permalink The permalink.
	 *
	 * @return Indexable|WP_Error The matching indexable, or a not-found or excluded error.
	 */
	private function by_permalink( string $permalink ) {
		$indexable = $this->indexable_repository->find_by_permalink( $permalink );

		if ( ! $indexable ) {
			$user_id = $this->find_author_id_by_permalink( $permalink );

			return ( $user_id === null ) ? $this->invalid_identifier( 'permalink' ) : $this->by_id( $user_id );
		}

		// The permalink lookup is not scoped by object type, so a post, term, or
		// archive URL can match too; only authors are valid targets here.
		if ( $indexable->object_type !== 'user' ) {
			return $this->invalid_identifier( 'permalink' );
		}

		return $indexable;
	}

	/**
	 * Finds the user whose author archive lives at the given permalink.
	 *
	 * The candidate comes from the author query var (plain permalinks) or the last path segment as the user
	 * nicename (pretty permalinks). It is only accepted when its author archive URL equals the permalink exactly,
	 * as that is how the author indexable permalink is built. This rules out posts or terms sharing the slug,
	 * pagination URLs, and foreign hosts. Sites that filter author_link away from the nicename fall back to the
	 * not-found error.
	 *
	 * @param string $permalink The permalink.
	 *
	 * @return int|null The user ID, or null when the permalink is not an author archive URL.
	 */
	private function find_author_id_by_permalink( string $permalink ): ?int {
		$user  = false;
		$query = \wp_parse_url( $permalink, \PHP_URL_QUERY );

		if ( \is_string( $query ) ) {
			$query_vars = $this->url_helper->parse_str_params( $query );

			if ( isset( $query_vars['author'] ) && \is_string( $query_vars['author'] ) ) {
				$user = \get_userdata( (int) $query_vars['author'] );
			}
		}
		else {
			$user = \get_user_by( 'slug', \basename( (string) \wp_parse_url( $permalink, \PHP_URL_PATH ) ) );
		}

		if ( $user === false || \get_author_posts_url( $user->ID ) !== $permalink ) {
			return null;
		}

		return (int) $user->ID;
	}

	/**
	 * Builds the error for an identifier that does not resolve to an author.
	 *
	 * Coded yoast_seo_invalid_<field> so a caller knows which identifier to correct and retry.
	 *
	 * @param string $field The identifier that failed to resolve: 'user_id' or 'permalink'.
	 *
	 * @return WP_Error The error for the unresolvable identifier.
	 */
	private function invalid_identifier( string $field ): WP_Error {
		return new WP_Error(
			'yoast_seo_invalid_' . $field,
			\__( 'No author could be found for the given identifier.', 'wordpress-seo' ),
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
