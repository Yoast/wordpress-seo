<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use Yoast\WP\SEO\Abilities\Infrastructure\Post_SEO_Field_Validators\Post_SEO_Field_Validator_Interface;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Surfaces\Meta_Surface;

/**
 * Translates between the ability input, an indexable, and the post SEO data value object.
 *
 * The read path (collector) maps every readable field onto the output array. The
 * write path (updater) applies whatever validated input it receives onto an
 * indexable; which fields are exposed for writing is decided by the ability's
 * input schema, so the writable set may be narrower than the fields known here.
 * Persistence to post meta is delegated to Indexable_To_Postmeta_Helper so the
 * encodings live in one place.
 */
class Post_SEO_Field_Map extends Abstract_SEO_Field_Map {

	/**
	 * Maps the string input fields to the indexable column they write to.
	 *
	 * @var array<string, string>
	 */
	private const STRING_FIELDS = [
		'seo_title'              => 'title',
		'meta_description'       => 'description',
		'canonical'              => 'canonical',
		'open_graph_title'       => 'open_graph_title',
		'open_graph_description' => 'open_graph_description',
		'twitter_title'          => 'twitter_title',
		'twitter_description'    => 'twitter_description',
		'schema_page_type'       => 'schema_page_type',
		'schema_article_type'    => 'schema_article_type',
	];

	/**
	 * Maps the boolean input fields to the indexable column they write to.
	 *
	 * Excludes `noindex`, which is tri-state (null resets to the default) and is
	 * handled separately.
	 *
	 * @var array<string, string>
	 */
	private const BOOLEAN_FIELDS = [
		'is_cornerstone' => 'is_cornerstone',
		'nofollow'       => 'is_robots_nofollow',
		'noimageindex'   => 'is_robots_noimageindex',
		'noarchive'      => 'is_robots_noarchive',
		'nosnippet'      => 'is_robots_nosnippet',
	];

	/**
	 * The meta surface.
	 *
	 * @var Meta_Surface
	 */
	private $meta_surface;

	/**
	 * The validators of the post SEO fields.
	 *
	 * @var Post_SEO_Field_Validator_Interface[]
	 */
	private $field_validators;

	/**
	 * Constructor.
	 *
	 * @param Meta_Surface                       $meta_surface        The meta surface.
	 * @param Post_SEO_Field_Validator_Interface ...$field_validators The validators of the post SEO fields.
	 */
	public function __construct( Meta_Surface $meta_surface, Post_SEO_Field_Validator_Interface ...$field_validators ) {
		$this->meta_surface     = $meta_surface;
		$this->field_validators = $field_validators;
	}

	/**
	 * Builds the post SEO data array from an indexable: the identity fields of the post, the shared SEO fields, then the post-only robots and schema fields.
	 *
	 * @param Indexable $indexable The indexable to read from.
	 *
	 * @return array<string, int|string|bool|null> The post SEO data, keyed by output-schema property name.
	 */
	public function to_seo_array( $indexable ): array {
		$meta = $this->meta_surface->for_indexable( $indexable, 'Post_Type' );

		return \array_merge(
			[
				'post_id'     => (int) $indexable->object_id,
				'post_title'  => $indexable->breadcrumb_title,
				'permalink'   => $indexable->permalink,
				'post_type'   => $indexable->object_sub_type,
				'post_status' => $indexable->post_status,
			],
			$this->get_shared_seo_fields( $indexable, $meta ),
			[
				'nofollow'            => (bool) $indexable->is_robots_nofollow,
				'noimageindex'        => (bool) $indexable->is_robots_noimageindex,
				'noarchive'           => (bool) $indexable->is_robots_noarchive,
				'nosnippet'           => (bool) $indexable->is_robots_nosnippet,
				'schema_page_type'    => $indexable->schema_page_type,
				'schema_article_type' => $indexable->schema_article_type,
			],
		);
	}

	/**
	 * Builds the post SEO data arrays for a set of indexables.
	 *
	 * @param Indexable[] $indexables The indexables to read from.
	 *
	 * @return array<int, array<string, int|string|bool|null>> The post SEO data for each indexable.
	 */
	public function indexables_to_arrays( array $indexables ): array {
		if ( $indexables !== [] ) {
			$object_ids = \array_map(
				static function ( $indexable ) {
					return (int) $indexable->object_id;
				},
				$indexables,
			);

			// Prime the post cache in one query, so each presentation build below reads its post from cache instead of issuing its own query.
			\_prime_post_caches( $object_ids, false, false );
		}

		return \array_map( [ $this, 'to_seo_array' ], $indexables );
	}

	/**
	 * Returns the input fields that cannot be saved for the post, along with the reason.
	 *
	 * @param array<string, int|string|bool|null> $input     The validated input patch.
	 * @param Indexable                           $indexable The indexable of the post.
	 *
	 * @return array<string, string> The warning of each field that cannot be saved, keyed by field name.
	 */
	public function get_skipped_fields( array $input, Indexable $indexable ): array {
		$skipped_fields = [];
		foreach ( $this->field_validators as $field_validator ) {
			$field_name = $field_validator->get_field_name();

			// A field another validator already rejected keeps that warning.
			if ( ! \array_key_exists( $field_name, $input ) || isset( $skipped_fields[ $field_name ] ) ) {
				continue;
			}

			$warning = $field_validator->validate( $input[ $field_name ], $indexable );
			if ( $warning !== null ) {
				$skipped_fields[ $field_name ] = $warning;
			}
		}

		return $skipped_fields;
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
		return self::BOOLEAN_FIELDS;
	}
}
