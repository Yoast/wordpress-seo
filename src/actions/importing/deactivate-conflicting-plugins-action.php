<?php

namespace Yoast\WP\SEO\Actions\Importing;

use wpdb;
use Yoast\WP\SEO\Conditionals\AIOSEO_V4_Importer_Conditional;
use Yoast\WP\SEO\Config\Conflicting_Plugins;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Services\Importing\Aioseo_Replacevar_Handler;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Transformer_Service;
use Yoast\WP\SEO\Services\Importing\Conflicting_Plugins_Service;

/**
 * Deactivates plug-ins that cause conflicts with Yoast SEO.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Deactivate_Conflicting_Plugins_Action extends Abstract_Importing_Action {

	/**
	 * The plugin the class deals with.
	 *
	 * @var string
	 */
	const PLUGIN = 'conflicting-plugins';

	/**
	 * The type the class deals with.
	 *
	 * @var string
	 */
	const TYPE = 'deactivation';

	/**
	 * The replacevar handler.
	 *
	 * @var Aioseo_Replacevar_Handler
	 */
	protected $replacevar_handler;

	/**
	 * Knows all plugins that might possibly conflict.
	 *
	 * @var Conflicting_Plugins_Service
	 */
	protected $conflicting_plugins;

	/**
	 * The list of conflicting plugins
	 *
	 * @var array
	 */
	protected $detected_plugins;

	/**
	 * Class constructor.
	 *
	 * @param Options_Helper                    $options                     The options helper.
	 * @param Aioseo_Replacevar_Handler         $replacevar_handler          The replacevar handler.
	 * @param Aioseo_Robots_Provider_Service    $robots_provider             The robots provider service.
	 * @param Aioseo_Robots_Transformer_Service $robots_transformer          The robots transfomer service.
	 * @param Conflicting_Plugins_Service       $conflicting_plugins_service The Conflicting plugins Service.
	 */
	public function __construct(
		Options_Helper $options,
		Aioseo_Replacevar_Handler $replacevar_handler,
		Aioseo_Robots_Provider_Service $robots_provider,
		Aioseo_Robots_Transformer_Service $robots_transformer,
		Conflicting_Plugins_Service $conflicting_plugins_service
	) {
		parent::__construct( $options, $replacevar_handler, $robots_provider, $robots_transformer );

		$this->conflicting_plugins = $conflicting_plugins_service;
		$this->detected_plugins    = [];
	}

	/**
	 * Get the total number of conflicting plugins.
	 */
	public function get_total_unindexed() {
		return \count( $this->get_detected_plugins() );
	}

	/**
	 * Returns whether the AISOEO post importing action is enabled.
	 *
	 * @return bool True if the AISOEO post importing action is enabled.
	 */
	public function is_enabled() {
		$aioseo_importer_conditional = \YoastSEO()->classes->get( AIOSEO_V4_Importer_Conditional::class );

		return $aioseo_importer_conditional->is_met();
	}

	/**
	 * Deactivate conflicting plugins.
	 */
	public function index() {
		$detected_plugins = $this->get_detected_plugins();
		$this->conflicting_plugins->deactivate_conflicting_plugins( $detected_plugins );

		// We need to conform to the interface, so we report that no indexables were created.
		return [];
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_limit() {
		return \count( Conflicting_Plugins::all_plugins() );
	}

	/**
	 * Returns the total number of unindexed objects up to a limit.
	 *
	 * @param int $limit The maximum.
	 *
	 * @return int The total number of unindexed objects.
	 */
	public function get_limited_unindexed_count( $limit ) {
		$count = \count( $this->get_detected_plugins() );
		return ( $count <= $limit ) ? $count : $limit;
	}

	/**
	 * Returns all detected plugins.
	 *
	 * @return array The detected plugins.
	 */
	protected function get_detected_plugins() {
		// The active plugins won't change much. We can reuse the result for the duration of the request.
		if ( \count( $this->detected_plugins ) < 1 ) {
			$this->detected_plugins = $this->conflicting_plugins->detect_conflicting_plugins();
		}
		return $this->detected_plugins;
	}
}
