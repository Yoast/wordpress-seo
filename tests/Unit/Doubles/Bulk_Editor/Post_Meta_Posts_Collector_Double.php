<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Bulk_Editor;

use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Default_Template_Resolver;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Editability_Resolver;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Post_Meta_Posts_Collector;

/**
 * Test double that exposes the collector's protected "needs improvement" WHERE builder.
 *
 * Accepts only the two dependencies it actually exercises (editability + template resolvers); tests
 * that need the full constructor should construct the production class directly.
 */
class Post_Meta_Posts_Collector_Double extends Post_Meta_Posts_Collector {

	/**
	 * The constructor.
	 *
	 * @param Post_Editability_Resolver $post_editability_resolver The resolver for the per-post edit permission.
	 * @param Default_Template_Resolver $default_template_resolver The resolver for the default SEO title / meta description template.
	 */
	public function __construct(
		Post_Editability_Resolver $post_editability_resolver,
		Default_Template_Resolver $default_template_resolver
	) {
		parent::__construct( $post_editability_resolver, $default_template_resolver );
	}

	/**
	 * Exposes build_needs_improvement_where for testing.
	 *
	 * @param array<string> $fields         The fields that need improvement.
	 * @param bool          $scores_enabled Whether the per-field scores may back the filter.
	 *
	 * @return string The prepared WHERE clause.
	 */
	public function expose_build_needs_improvement_where( array $fields, bool $scores_enabled ): string {
		return $this->build_needs_improvement_where( $fields, $scores_enabled );
	}
}
