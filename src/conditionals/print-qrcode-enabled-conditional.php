<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Conditional that is only met when the Print QR code integration is enabled.
 */
class Print_QRCode_Enabled_Conditional implements Conditional {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Print_QR_Code_Enabled_Conditional constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * Returns whether or not this conditional is met.
	 *
	 * @return bool Whether or not the conditional is met.
	 */
	public function is_met() {
		return $this->options->get( 'enable_print_qr_code', false );
	}
}
