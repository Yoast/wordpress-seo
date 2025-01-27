<?php
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;

/**
 * The interface of site kit adapters.
 */
interface Site_Kit_Adapter_Interface {

	/**
	 * The wrapper method to add our parameters to a Site Kit API request.
	 *
	 * @param Search_Console_Parameters $parameters The parameters.
	 *
	 * @return ApiDataRow[]|WP_Error Data on success, or WP_Error on failure.
	 */
	public function get_data( Search_Console_Parameters $parameters ): Data_Container;
}
