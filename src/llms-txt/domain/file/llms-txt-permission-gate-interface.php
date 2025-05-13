<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Domain\File;

/**
 * This interface is responsible for defining ways to make sure we can edit/regenerate the llms.txt file.
 */
interface Llms_Txt_Permission_Gate_Interface {

	/**
	 * Checks if the llms.txt can be regenerated.
	 *
	 * @return bool If the llms.txt can be regenerated.
	 */
	public function can_regenerate(): bool;
}
