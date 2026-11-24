<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Post_SEO_Field_Validators;

use Yoast\WP\SEO\Conditionals\Woo_SEO_Inactive_Conditional;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Validates the Schema.org page type of a post.
 *
 * While Yoast WooCommerce SEO is active, the editor locks the page type of products to ItemPage, so only ItemPage or
 * clearing the field is allowed for them. Yoast WooCommerce SEO adds ItemPage next to any other stored page type, so
 * saving one would give the product a mixed type.
 */
class Schema_Page_Type_Validator implements Post_SEO_Field_Validator_Interface {

	/**
	 * The Yoast WooCommerce SEO inactive conditional.
	 *
	 * @var Woo_SEO_Inactive_Conditional
	 */
	private $woo_seo_inactive_conditional;

	/**
	 * Constructor.
	 *
	 * @param Woo_SEO_Inactive_Conditional $woo_seo_inactive_conditional The Yoast WooCommerce SEO inactive conditional.
	 */
	public function __construct( Woo_SEO_Inactive_Conditional $woo_seo_inactive_conditional ) {
		$this->woo_seo_inactive_conditional = $woo_seo_inactive_conditional;
	}

	/**
	 * Returns the name of the input field the validator validates.
	 *
	 * @return string The field name.
	 */
	public function get_field_name(): string {
		return 'schema_page_type';
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The validator shares the signature of the interface, which receives any field value.

	/**
	 * Validates the page type for a post.
	 *
	 * @param mixed     $value     The page type to save.
	 * @param Indexable $indexable The indexable of the post.
	 *
	 * @return string|null A warning when the page type cannot be saved for the post, null otherwise.
	 */
	public function validate( $value, Indexable $indexable ): ?string {
		if ( $value === null || $value === '' || $value === 'ItemPage' || $indexable->object_sub_type !== 'product' ) {
			return null;
		}

		if ( $this->woo_seo_inactive_conditional->is_met() ) {
			return null;
		}

		return \sprintf(
			/* translators: 1: the name of a setting, 2: Yoast WooCommerce SEO, 3: the name of a Schema.org page type. */
			\__( 'The %1$s setting was not saved, because %2$s is active and sets the page type of products to %3$s.', 'wordpress-seo' ),
			'schema_page_type',
			'Yoast WooCommerce SEO',
			'ItemPage',
		);
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
