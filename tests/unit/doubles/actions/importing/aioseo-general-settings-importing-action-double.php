<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing;

use Yoast\WP\SEO\Actions\Importing\Aioseo_General_Settings_Importing_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Class Aioseo_General_Settings_Importing_Action_Double
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Aioseo_General_Settings_Importing_Action_Double extends Aioseo_General_Settings_Importing_Action {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	public function __construct( Options_Helper $options ) {
		return parent::__construct( $options );
	}

	/**
	 * Queries the database and retrieves unimported AiOSEO settings (in chunks if a limit is applied).
	 *
	 * @param int $limit The maximum number of unimported objects to be returned.
	 *
	 * @return array The (maybe chunked) unimported AiOSEO settings to import.
	 */
	public function query( $limit = null ) {
		return parent::query( $limit );
	}
}
