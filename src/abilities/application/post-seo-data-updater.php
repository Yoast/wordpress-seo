<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_Identifier_Resolver;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_SEO_Field_Map;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;

/**
 * Application service that updates the SEO data of a single post.
 *
 * The input is applied onto the resolved indexable (the desired state), cascaded
 * to post meta (the source of truth) via Indexable_To_Postmeta_Helper, and the
 * indexable is then rebuilt from that meta so reads and the rest of the plugin
 * stay consistent.
 */
class Post_SEO_Data_Updater {

	/**
	 * The post identifier resolver.
	 *
	 * @var Post_Identifier_Resolver
	 */
	private $resolver;

	/**
	 * The post SEO field map.
	 *
	 * @var Post_SEO_Field_Map
	 */
	private $field_map;

	/**
	 * The indexable-to-postmeta helper.
	 *
	 * @var Indexable_To_Postmeta_Helper
	 */
	private $indexable_to_postmeta;

	/**
	 * The indexable builder.
	 *
	 * @var Indexable_Builder
	 */
	private $indexable_builder;

	/**
	 * Constructor.
	 *
	 * @param Post_Identifier_Resolver     $resolver              The post identifier resolver.
	 * @param Post_SEO_Field_Map           $field_map             The post SEO field map.
	 * @param Indexable_To_Postmeta_Helper $indexable_to_postmeta The indexable-to-postmeta helper.
	 * @param Indexable_Builder            $indexable_builder     The indexable builder.
	 */
	public function __construct(
		Post_Identifier_Resolver $resolver,
		Post_SEO_Field_Map $field_map,
		Indexable_To_Postmeta_Helper $indexable_to_postmeta,
		Indexable_Builder $indexable_builder
	) {
		$this->resolver              = $resolver;
		$this->field_map             = $field_map;
		$this->indexable_to_postmeta = $indexable_to_postmeta;
		$this->indexable_builder     = $indexable_builder;
	}

	/**
	 * Updates the SEO data of the post matching the input and returns its new state.
	 *
	 * Only fields present in the input are changed (patch semantics); a present but
	 * empty value clears the field.
	 *
	 * @param array<string, int|string|bool|null> $input The input identifying the post plus the SEO fields to change.
	 *
	 * @return array<string, int|string|bool|null>|WP_Error The updated SEO data, or an error.
	 */
	public function update_post_seo_data( array $input ) {
		$indexable = $this->resolver->resolve_one( $input );

		if ( $indexable instanceof WP_Error ) {
			return $indexable;
		}

		$changed_columns = $this->field_map->apply_to_indexable( $input, $indexable );

		foreach ( $changed_columns as $column ) {
			$this->indexable_to_postmeta->map_column_to_postmeta( $indexable, $column, true );
		}

		// A post-meta write does not trigger the indexable watcher, so rebuild the read model
		// explicitly from the meta we just wrote.
		$rebuilt = $this->indexable_builder->build_for_id_and_type( (int) $indexable->object_id, 'post', $indexable );

		if ( ! $rebuilt ) {
			return new WP_Error(
				'yoast_seo_post_data_unavailable',
				\__( 'The post SEO data was saved but the indexable could not be rebuilt.', 'wordpress-seo' ),
				[ 'status' => 500 ],
			);
		}

		return $this->field_map->to_seo_array( $rebuilt );
	}
}
