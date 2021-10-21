<?php

namespace Yoast\WP\SEO\Services\Importing;

use Yoast\WP\SEO\Actions\Importing\Importing_Action_Interface;

/**
 * Detects if any data from other SEO plugins is available for importing.
 */
class Importable_Detector {

	use Importer_Action_Filter_Trait;

	/**
	 * All known import actions
	 *
	 * @var array|Importing_Action_Interface[]
	 */
	protected $importers;

	public function __construct(
		Importing_Action_Interface ...$importers
	)
	{
		$this->importers = $importers;
	}

	public function detect( $plugin = null, $type = null ) {
		$detectors = $this->filter_actions( $this->importers, $plugin, $type );

		$detected = [];

		foreach( $detectors as $detector ) {
			if ( $detector->get_limited_count( 1 ) > 0 ) {
				$detected[ $detector->name ][] = $detector->type;
			}
		}

		return $detected;
	}
}
