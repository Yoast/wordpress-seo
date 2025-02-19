<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Time_Based_Seo_Metrics;

use Exception;

/**
 * Exception for when the integration is not yet onboarded.
 */
class Not_Onboarded_Exception extends Exception {

	/**
	 * Constructor of the exception.
	 */
	public function __construct() {
		parent::__construct( 'The used repository is not yet onboarded fully' );
	}
}
