<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\User_Interface;

use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Type;

/**
 * Registers the route that applies search appearance (SEO title and meta description) updates.
 */
class Search_Bulk_Update_Route extends Abstract_Bulk_Update_Route {

	/**
	 * The prefix for this route.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/bulk_editor/update_search';

	/**
	 * Gets the appearance this route updates.
	 *
	 * @return Update_Type The search appearance.
	 */
	protected function get_update_type(): Update_Type {
		return Update_Type::search();
	}

	/**
	 * Gets the prefix for this route.
	 *
	 * @return string The prefix for this route.
	 */
	protected function get_route_prefix(): string {
		return self::ROUTE_PREFIX;
	}

	/**
	 * Gets the name of the title argument in the request.
	 *
	 * @return string The name of the title argument.
	 */
	protected function get_title_arg_name(): string {
		return 'seo_title';
	}

	/**
	 * Gets the name of the description argument in the request.
	 *
	 * @return string The name of the description argument.
	 */
	protected function get_description_arg_name(): string {
		return 'meta_description';
	}
}
