<?php
/**
 * Author watcher to save the meta data to an Indexable.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Integrations\Presenters;

use WPSEO_Frontend;
use Yoast\WP\Free\Conditionals\Indexables_Feature_Flag_Conditional;
use Yoast\WP\Free\Conditionals\Simple_Page_Conditional;
use Yoast\WP\Free\Repositories\Indexable_Repository;
use Yoast\WP\Free\WordPress\Integration;

class Meta_Description_Presenter implements Integration {

	/**
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Indexables_Feature_Flag_Conditional::class, Simple_Page_Conditional::class ];
	}

	public function __construct( Indexable_Repository $repository ) {
		$this->repository = $repository;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\remove_action( 'wpseo_head', [ WPSEO_Frontend::get_instance(), 'metadesc' ], WPSEO_Frontend::METADESC_PRIORITY );
		\add_action( 'wpseo_head', [ $this, 'present' ], WPSEO_Frontend::METADESC_PRIORITY );
	}

	public function present() {
		$indexable = $this->repository->for_current_page();

		if ( ! $indexable ) {
			// Fallback in case no indexable could be found.
			WPSEO_Frontend::get_instance()->metadesc();
			return;
		}

		$meta_description = $indexable->description;

		if ( ! $meta_description ) {
			$meta_description = WPSEO_Options::get( 'metadesc-' . $indexable->object_sub_type );
		}
	}
}
