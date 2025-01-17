<?php
namespace Yoast\WP\SEO\Dashboard\Infrastructure;

use Yoast\WP\SEO\Dashboard\Domain\Search_Rankings\Request_Parameters;

/**
 * The interface of site kit adapters.
 */
interface Site_Kit_Adapter_Interface {

	/**
	 * The wrapper method to add our parameters to a Site Kit API request.
	 *
	 * @param Request_Parameters $parameters The parameters.
	 *
	 * @return ApiDataRow[]|WP_Error Data on success, or WP_Error on failure.
	 */
	public function get_data( Request_Parameters $parameters );
}
