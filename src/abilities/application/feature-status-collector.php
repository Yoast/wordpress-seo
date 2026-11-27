<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use Yoast\WP\SEO\Abilities\Infrastructure\Features\Feature_Repository;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Application service that collects whether each feature is enabled, including the features that agents cannot enable
 * or disable on the site.
 */
class Feature_Status_Collector {

	/**
	 * The feature repository.
	 *
	 * @var Feature_Repository
	 */
	private $feature_repository;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Feature_Repository $feature_repository The feature repository.
	 * @param Options_Helper     $options_helper     The options helper.
	 */
	public function __construct( Feature_Repository $feature_repository, Options_Helper $options_helper ) {
		$this->feature_repository = $feature_repository;
		$this->options_helper     = $options_helper;
	}

	/**
	 * Returns whether each feature is enabled.
	 *
	 * A feature that is turned on in its setting but turned off by code, like a filter, counts as disabled, as it
	 * has no effect on the site.
	 *
	 * @return array<string, bool> Whether each feature is enabled, keyed by feature key.
	 */
	public function get_all(): array {
		$statuses = [];

		foreach ( $this->feature_repository->get_all() as $feature ) {
			$statuses[ $feature->get_key() ] = ( $this->options_helper->get( $feature->get_option_name(), false ) === true
				&& ! $feature->is_disabled_programmatically() );
		}

		return $statuses;
	}
}
