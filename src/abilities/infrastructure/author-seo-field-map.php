<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Surfaces\Values\Meta;

/**
 * Translates between the ability input, a user indexable, and the author SEO data output.
 *
 * Authors support only the SEO title, the meta description and noindex: the user profile
 * offers no other SEO settings for the author archive.
 */
class Author_SEO_Field_Map extends Abstract_SEO_Field_Map {

	/**
	 * Maps the string input fields to the indexable column they write to.
	 *
	 * @var array<string, string>
	 */
	private const STRING_FIELDS = [
		'seo_title'        => 'title',
		'meta_description' => 'description',
	];

	/**
	 * The meta surface.
	 *
	 * @var Meta_Surface
	 */
	private $meta_surface;

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user_helper;

	/**
	 * The author archive helper.
	 *
	 * @var Author_Archive_Helper
	 */
	private $author_archive_helper;

	/**
	 * Constructor.
	 *
	 * @param Meta_Surface          $meta_surface          The meta surface.
	 * @param User_Helper           $user_helper           The user helper.
	 * @param Author_Archive_Helper $author_archive_helper The author archive helper.
	 */
	public function __construct(
		Meta_Surface $meta_surface,
		User_Helper $user_helper,
		Author_Archive_Helper $author_archive_helper
	) {
		$this->meta_surface          = $meta_surface;
		$this->user_helper           = $user_helper;
		$this->author_archive_helper = $author_archive_helper;
	}

	/**
	 * Builds the author SEO data array from a built indexable: the identity fields of the user, then the SEO fields.
	 *
	 * @param Indexable $indexable The indexable to read from.
	 *
	 * @return array<string, int|string|bool|null> The author SEO data, keyed by output-schema property name.
	 */
	public function to_seo_array( $indexable ): array {
		return $this->build_seo_array( $indexable, $this->meta_surface->for_indexable( $indexable, 'Author_Archive' ) );
	}

	/**
	 * Builds the author SEO data array from an indexable that could not be built, because the author archive is
	 * not output: the stored values without rendered companions, plus a warning that they have no effect.
	 *
	 * @param Indexable $indexable The indexable to read from.
	 *
	 * @return array<string, int|string|bool|null> The author SEO data, keyed by output-schema property name.
	 */
	public function to_unbuilt_seo_array( $indexable ): array {
		$seo_array = $this->build_seo_array( $indexable, false );

		$seo_array['permalink'] = null;
		$seo_array['warning']   = \__( 'These settings are saved, but have no effect while this author archive is excluded, for example because the user has no posts and author archives without posts are not shown in search results.', 'wordpress-seo' );

		if ( $this->author_archive_helper->are_disabled() ) {
			$seo_array['warning'] = \__( 'Author archives are disabled, so these settings are saved but have no effect until author archives are enabled.', 'wordpress-seo' );
		}

		return $seo_array;
	}

	/**
	 * Builds the author SEO data array.
	 *
	 * @param Indexable  $indexable The indexable to read from.
	 * @param Meta|false $meta      The meta values for the author archive, or false when unavailable.
	 *
	 * @return array<string, int|string|bool|null> The author SEO data, keyed by output-schema property name.
	 */
	private function build_seo_array( $indexable, $meta ): array {
		$user_id   = (int) $indexable->object_id;
		$user_name = $this->user_helper->get_the_author_meta( 'display_name', $user_id );

		return [
			'user_id'                   => $user_id,
			'user_name'                 => ( \is_string( $user_name ) && $user_name !== '' ) ? $user_name : null,
			'permalink'                 => $indexable->permalink,
			'seo_title'                 => $indexable->title,
			'seo_title_rendered'        => $this->rendered( $meta, 'seo_title' ),
			'meta_description'          => $indexable->description,
			'meta_description_rendered' => $this->rendered( $meta, 'meta_description' ),
			'noindex'                   => (bool) $indexable->is_robots_noindex,
		];
	}

	/**
	 * Returns the string input fields mapped to the indexable column they write to.
	 *
	 * @return array<string, string> The string fields.
	 */
	protected function get_string_fields(): array {
		return self::STRING_FIELDS;
	}

	/**
	 * Returns the boolean input fields mapped to the indexable column they write to.
	 *
	 * @return array<string, string> The boolean fields.
	 */
	protected function get_boolean_fields(): array {
		return [];
	}
}
