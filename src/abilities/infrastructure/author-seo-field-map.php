<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Surfaces\Meta_Surface;

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
	 * Constructor.
	 *
	 * @param Meta_Surface $meta_surface The meta surface.
	 * @param User_Helper  $user_helper  The user helper.
	 */
	public function __construct( Meta_Surface $meta_surface, User_Helper $user_helper ) {
		$this->meta_surface = $meta_surface;
		$this->user_helper  = $user_helper;
	}

	/**
	 * Builds the author SEO data array from an indexable: the identity fields of the user, then the SEO fields.
	 *
	 * @param Indexable $indexable The indexable to read from.
	 *
	 * @return array<string, int|string|bool|null> The author SEO data, keyed by output-schema property name.
	 */
	public function to_seo_array( $indexable ): array {
		$user_id   = (int) $indexable->object_id;
		$user_name = $this->user_helper->get_the_author_meta( 'display_name', $user_id );
		$meta      = $this->meta_surface->for_indexable( $indexable, 'Author_Archive' );

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
