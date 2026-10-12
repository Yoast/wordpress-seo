<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_Access_Checker;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_Identifier_Resolver;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_SEO_Field_Map;

/**
 * Application service that reads the SEO data of one or more posts.
 *
 * Doubles as a discovery tool: a title keyword search returns full SEO data for
 * every matching post. A request must carry an identifier; an empty request is an error.
 * Only posts the current user may edit are exposed.
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
	 * The post access checker.
	 *
	 * @var Post_Access_Checker
	 */
	private $post_access_checker;

	/**
	 * Constructor.
	 *
	 * @param Post_Identifier_Resolver $resolver            The post identifier resolver.
	 * @param Post_SEO_Field_Map       $field_map           The post SEO field map.
	 * @param Post_Access_Checker      $post_access_checker The post access checker.
	 */
	public function __construct(
		Post_Identifier_Resolver $resolver,
		Post_SEO_Field_Map $field_map,
		Post_Access_Checker $post_access_checker
	) {
		$this->resolver            = $resolver;
		$this->field_map           = $field_map;
		$this->post_access_checker = $post_access_checker;
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

		$editable = $this->post_access_checker->filter_editable( $indexables );

		// Every match was a post the user may not edit; an already empty match list
		// (a title-search page past the last result) stays a valid empty result.
		if ( $editable === [] && $indexables !== [] ) {
			return $this->post_access_checker->forbidden_error();
		}

		return $this->field_map->indexables_to_arrays( $editable );
	}
}
