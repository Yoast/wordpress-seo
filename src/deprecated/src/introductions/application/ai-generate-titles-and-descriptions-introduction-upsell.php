<?php
/**
 * Graceful deprecation of the Ai_Generate_Titles_And_Descriptions_Introduction_Upsell class.
 *
 * {@internal As this file is just (temporarily) put in place to warn extending
 * plugins about the class name changes, it is exempt from select CS standards.}
 *
 * @deprecated 23.2
 *
 * @codeCoverageIgnore
 *
 * @phpcs:disable Generic.Files.OneObjectStructurePerFile.MultipleFound
 * @phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedNamespaceFound
 * @phpcs:disable Yoast.Commenting.CodeCoverageIgnoreDeprecated
 * @phpcs:disable Yoast.Commenting.FileComment.Unnecessary
 * @phpcs:disable Yoast.Files.FileName.InvalidClassFileName
 */

namespace Yoast\WP\SEO\Introductions\Application;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;

/**
 * Represents the introduction for the AI generate titles and introduction upsell.
 *
 * @deprecated 23.2 Use {@see \Yoast\WP\SEO\Introductions\Application\Ai_Fix_Assessments_Upsell} instead.
 */
class Ai_Generate_Titles_And_Descriptions_Introduction_Upsell extends Ai_Fix_Assessments_Upsell {

	use Current_Page_Trait;
	use User_Allowed_Trait;
	use Version_Trait;

	/**
	 * Holds the product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Holds the options' helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructs the introduction.
	 *
	 * @deprecated 23.2
	 *
	 * @param Product_Helper $product_helper The product helper.
	 * @param Options_Helper $options_helper The options' helper.
	 */
	public function __construct(
		Product_Helper $product_helper,
		Options_Helper $options_helper
	) {
		$this->product_helper = $product_helper;
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns the ID.
	 *
	 * @deprecated 23.2
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_id() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 23.2' );
		return 'ai-generate-titles-and-descriptions-upsell';
	}

	/**
	 * Returns the unique name.
	 *
	 * @deprecated 21.6
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_name() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 21.6', 'Please use get_id() instead' );

		return $this->get_id();
	}

	/**
	 * Returns the requested pagination priority. Lower means earlier.
	 *
	 * @deprecated 23.2
	 * @codeCoverageIgnore
	 *
	 * @return int
	 */
	public function get_priority() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 23.2' );
		return 10;
	}

	/**
	 * Returns whether this introduction should show.
	 *
	 * @deprecated 23.2
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public function should_show() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 23.2' );
		// Outdated feature introduction.
		return false;
	}
}
