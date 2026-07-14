<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_Identifier_Resolver;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_SEO_Field_Map;

/**
 * Application service that reads the SEO data of one or more posts.
 *
 * Doubles as a discovery tool: a title keyword search returns full SEO data for
 * every matching post. A request must carry an identifier; an empty request is an error.
 */
class Post_SEO_Data_Collector {

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
	 * Constructor.
	 *
	 * @param Post_Identifier_Resolver $resolver  The post identifier resolver.
	 * @param Post_SEO_Field_Map       $field_map The post SEO field map.
	 */
	public function __construct(
		Post_Identifier_Resolver $resolver,
		Post_SEO_Field_Map $field_map
	) {
		$this->resolver  = $resolver;
		$this->field_map = $field_map;
	}

	/**
	 * Retrieves the SEO data for the posts matching the input.
	 *
	 * @param array<string, int|string|bool|null> $input The input containing an optional 'post_id', 'permalink', or 'title'.
	 *
	 * @return array<int, array<string, int|string|bool|null>>|WP_Error The SEO data for each matching post, or an error.
	 */
	public function get_post_seo_data( array $input ) {
		$indexables = $this->resolver->resolve_many( $input );

		if ( $indexables instanceof WP_Error ) {
			return $indexables;
		}

		return $this->field_map->indexables_to_arrays( $indexables );
	}
}
