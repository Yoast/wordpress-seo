<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items;

/**
 * Represents a markdown item.
 */
interface Item_Interface {

	/**
	 * Renders the item.
	 *
	 * @return string
	 */
	public function render(): string;
}
