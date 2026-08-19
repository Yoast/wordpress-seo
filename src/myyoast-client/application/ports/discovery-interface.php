<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Ports;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Discovery_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Server_Capability_Exception;
use Yoast\WP\SEO\MyYoast_Client\Domain\Discovery_Document;

/**
 * Port for OIDC endpoint discovery.
 */
interface Discovery_Interface {

	/**
	 * Returns the validated discovery document.
	 *
	 * @return Discovery_Document The validated discovery document.
	 *
	 * @throws Discovery_Failed_Exception  If the document cannot be fetched.
	 * @throws Server_Capability_Exception If the server lacks required capabilities.
	 */
	public function get_document(): Discovery_Document;
}
