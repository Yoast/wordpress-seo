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

		$detected = [];

		foreach( $detectors as $detector ) {
			if ( $detector->get_limited_count( 1 ) > 0 ) {
				$detected[ $detector->name ][] = $detector->type;
			}
		}

		return $detected;
	}
}
