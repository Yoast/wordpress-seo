<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\User_Interface;

use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Social\Social_Bulk_Updater;

/**
 * Registers the route that applies social appearance (Open Graph title and description) updates.
 */
class Social_Bulk_Update_Route extends Abstract_Bulk_Update_Route {

	/**
	 * The prefix for this route.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/bulk_editor/update_social';

	/**
	 * The constructor.
	 *
	 * @param Social_Bulk_Updater $bulk_updater The social bulk updater.
	 */
	public function __construct( Social_Bulk_Updater $bulk_updater ) { // phpcs:ignore Generic.CodeAnalysis.UselessOverridingMethod.Found -- Reason: The override narrows the updater type so DI can autowire the social channel.
		parent::__construct( $bulk_updater );
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
		return 'social_title';
	}

	/**
	 * Gets the name of the description argument in the request.
	 *
	 * @return string The name of the description argument.
	 */
	protected function get_description_arg_name(): string {
		return 'social_description';
	}
}
