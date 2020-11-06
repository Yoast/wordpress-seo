<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Indexable_Helper;

/**
 * WordPress Permalink structure watcher.
 *
 * Handles updates to the permalink_structure for the Indexables table.
 */
class Permalink_Integrity_Watcher implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Permalink_Integrity_Watcher constructor.
	 *
	 * @param Indexable_Helper $indexable The indexable helper.
	 */
	public function __construct( Indexable_Helper $indexable ) {
		$this->indexable_helper = $indexable;
	}

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wpseo_frontend_presentation', [ $this, 'compare_indexable_permalink' ] );
	}


	public function compare_indexable_permalink()
	{

	}

}
