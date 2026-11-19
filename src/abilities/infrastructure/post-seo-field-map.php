<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use Yoast\WP\SEO\Abilities\Infrastructure\Post_SEO_Field_Validators\Post_SEO_Field_Validator_Interface;
use Yoast\WP\SEO\Conditionals\Woo_SEO_Inactive_Conditional;
use Yoast\WP\SEO\Helpers\Schema\Graph_Helper;
use Yoast\WP\SEO\Helpers\Woocommerce_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Schema\Application\Configuration\Schema_Configuration;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Surfaces\Values\Meta;

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
	 * The Schema graph helper.
	 *
	 * @var Graph_Helper
	 */
	private $graph_helper;

	/**
	 * The Yoast WooCommerce SEO inactive conditional.
	 *
	 * @var Woo_SEO_Inactive_Conditional
	 */
	private $woo_seo_inactive_conditional;

	/**
	 * The WooCommerce helper.
	 *
	 * @var Woocommerce_Helper
	 */
	private $woocommerce_helper;

	/**
	 * The Schema configuration.
	 *
	 * @var Schema_Configuration
	 */
	private $schema_configuration;

	/**
	 * The validators of the post SEO fields.
	 *
	 * @var Post_SEO_Field_Validator_Interface[]
	 */
	private $field_validators;

	/**
	 * Constructor.
	 *
	 * @param Meta_Surface                       $meta_surface                 The meta surface.
	 * @param Graph_Helper                       $graph_helper                 The Schema graph helper.
	 * @param Woo_SEO_Inactive_Conditional       $woo_seo_inactive_conditional The Yoast WooCommerce SEO inactive conditional.
	 * @param Woocommerce_Helper                 $woocommerce_helper           The WooCommerce helper.
	 * @param Schema_Configuration               $schema_configuration         The Schema configuration.
	 * @param Post_SEO_Field_Validator_Interface ...$field_validators          The validators of the post SEO fields.
	 */
	public function __construct(
		Meta_Surface $meta_surface,
		Graph_Helper $graph_helper,
		Woo_SEO_Inactive_Conditional $woo_seo_inactive_conditional,
		Woocommerce_Helper $woocommerce_helper,
		Schema_Configuration $schema_configuration,
		Post_SEO_Field_Validator_Interface ...$field_validators
	) {
		$this->meta_surface                 = $meta_surface;
		$this->graph_helper                 = $graph_helper;
		$this->woo_seo_inactive_conditional = $woo_seo_inactive_conditional;
		$this->woocommerce_helper           = $woocommerce_helper;
		$this->schema_configuration         = $schema_configuration;
		$this->field_validators             = $field_validators;
	}

	/**
	 * Builds the post SEO data array from an indexable: the identity fields of the post, the shared SEO fields, then the post-only robots and schema fields.
	 *
	 * @param Indexable $indexable The indexable to read from.
	 *
	 * @return array<string, int|string|bool|array<string>|null> The post SEO data, keyed by output-schema property name.
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
				'nofollow'                     => (bool) $indexable->is_robots_nofollow,
				'noimageindex'                 => (bool) $indexable->is_robots_noimageindex,
				'noarchive'                    => (bool) $indexable->is_robots_noarchive,
				'nosnippet'                    => (bool) $indexable->is_robots_nosnippet,
				'schema_page_type'             => $indexable->schema_page_type,
				'schema_page_type_rendered'    => $this->rendered_schema_page_type( $indexable, $meta ),
				'schema_article_type'          => $indexable->schema_article_type,
				'schema_article_type_rendered' => $this->rendered_schema_article_type( $meta ),
			],
		);
	}

	/**
	 * Builds the post SEO data arrays for a set of indexables.
	 *
	 * @param Indexable[] $indexables The indexables to read from.
	 *
	 * @return array<int, array<string, int|string|bool|array<string>|null>> The post SEO data for each indexable.
	 */
	public function indexables_to_arrays( array $indexables ): array {
		if ( $indexables !== [] ) {
			$this->prime_caches( $indexables );
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
	 * Primes, in bulk, the caches that building the presentation and the Schema graph of each post reads from.
	 *
	 * Without this, each post would issue its own queries for its post object, its terms, its meta, its featured image and
	 * its author.
	 *
	 * @param Indexable[] $indexables The indexables of the posts.
	 *
	 * @return void
	 */
	private function prime_caches( array $indexables ): void {
		$object_ids = \array_map(
			static function ( $indexable ) {
				return (int) $indexable->object_id;
			},
			$indexables,
		);

		// Terms, meta, featured images and authors are only read when building the Schema graph, which is skipped while its output is turned off.
		$schema_output_disabled = $this->schema_configuration->is_schema_output_disabled();

		\_prime_post_caches( $object_ids, ! $schema_output_disabled, ! $schema_output_disabled );

		if ( $schema_output_disabled ) {
			return;
		}

		// The featured image IDs are read from the meta primed above, so collecting them issues no queries.
		$image_ids  = [];
		$author_ids = [];
		foreach ( $indexables as $indexable ) {
			$image_id = \get_post_thumbnail_id( (int) $indexable->object_id );
			if ( $image_id > 0 ) {
				$image_ids[] = $image_id;
			}

			$author_id = (int) $indexable->author_id;
			if ( $author_id > 0 ) {
				$author_ids[] = $author_id;
			}
		}

		if ( $image_ids !== [] ) {
			\_prime_post_caches( $image_ids, false, true );
		}

		// Posts sharing an author need no deduplication, as cache_users() skips the users it has already cached.
		if ( $author_ids !== [] ) {
			\cache_users( $author_ids );
		}
	}

	/**
	 * Returns the Schema.org page types output on the front end for the post, read from the WebPage piece of its graph.
	 *
	 * Reading the generated graph, instead of repeating the rules that decide which pieces are output and with which
	 * types, keeps the rendered schema types in line with the front end, including every schema filter.
	 *
	 * @param Indexable  $indexable The indexable of the post.
	 * @param Meta|false $meta      The meta values for the post, or false when unavailable.
	 *
	 * @return array<string>|null The page types, empty when no WebPage piece is output, or null when unavailable.
	 */
	private function rendered_schema_page_type( $indexable, $meta ): ?array {
		if ( ! $meta instanceof Meta ) {
			return null;
		}

		$pieces  = $this->get_graph_pieces( $meta );
		$webpage = $this->graph_helper->get_webpage_piece( $pieces, $meta->main_schema_id );

		if ( $webpage === null ) {
			return [];
		}

		return $this->add_woo_seo_page_types( $indexable, $this->graph_helper->get_types( $webpage ) );
	}

	/**
	 * Applies the page types Yoast WooCommerce SEO gives the WebPage piece of products and of the checkout page.
	 *
	 * Yoast WooCommerce SEO sets these in a filter on the WebPage piece that only acts on the product or checkout page
	 * itself, so they are missing from a graph generated for the post anywhere else and are repeated here.
	 *
	 * Only the checkout page configured in WooCommerce is detected. Other posts that the front end treats as a checkout,
	 * such as one holding the checkout shortcode or one flagged through the `woocommerce_is_checkout` filter, are not.
	 *
	 * @param Indexable     $indexable The indexable of the post.
	 * @param array<string> $types     The page types read from the WebPage piece.
	 *
	 * @return array<string> The page types.
	 */
	private function add_woo_seo_page_types( $indexable, array $types ): array {
		if ( $this->woo_seo_inactive_conditional->is_met() ) {
			return $types;
		}

		if ( (int) $indexable->object_id === $this->woocommerce_helper->get_checkout_page_id() ) {
			return [ 'CheckoutPage' ];
		}

		if ( $indexable->object_sub_type === 'product' && ! \in_array( 'ItemPage', $types, true ) ) {
			$types[] = 'ItemPage';
		}

		return $types;
	}

	/**
	 * Returns the Schema.org article types output on the front end for the post, read from the Article piece of its graph.
	 *
	 * @param Meta|false $meta The meta values for the post, or false when unavailable.
	 *
	 * @return array<string>|null The article types, empty when no Article piece is output, or null when unavailable.
	 */
	private function rendered_schema_article_type( $meta ): ?array {
		if ( ! $meta instanceof Meta ) {
			return null;
		}

		$pieces  = $this->get_graph_pieces( $meta );
		$article = $this->graph_helper->get_article_piece( $pieces, $meta->main_schema_id );

		if ( $article === null ) {
			return [];
		}

		return $this->graph_helper->get_types( $article );
	}

	/**
	 * Returns the pieces of the Schema graph output on the front end for the post.
	 *
	 * @param Meta $meta The meta values for the post.
	 *
	 * @return array<array<string, string|array<string|array<string, string>>>> The graph pieces, empty when no Schema is output at all.
	 */
	private function get_graph_pieces( Meta $meta ): array {
		// The graph is still generated while its output is turned off, so it would list pieces the front end never outputs.
		if ( $this->schema_configuration->is_schema_output_disabled() ) {
			return [];
		}

		return $this->graph_helper->get_pieces( $meta->schema );
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
