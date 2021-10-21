<?php

namespace Yoast\WP\SEO\Services\Importing;

/**
 * Detects if any data from other SEO plugins is available for importing.
 */
class Importable_Detector {

	use Importer_Action_Filter_Trait;

	/**
	 * All known import actions
	 *
	 * @var array
	 */
	protected Indexable_Import_Action[] $importers;

	public function __construct(
		Indexable_Import_Action ...$importers
	)
	{
		$this->importers = $importers;
	}

	public function detect( $plugin = null, $type = null ) {
		$detectors = filter_actions( $this->importers, $plugin, $type );

		$detected = \array_reduce( [], function ( $detector ) {
			if ( $detector->get_limited_count( 1 ) > 0 ) {
				return [ $detector->plugin => $detector->type ];
			}
		}, $detectors );

		return $detected;
	}
}
