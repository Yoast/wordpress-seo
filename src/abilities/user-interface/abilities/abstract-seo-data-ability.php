<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Domain\Ability_Interface;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * Base class for the abilities that read or write the SEO data of a single entity, such as a post or a term.
 */
abstract class Abstract_SEO_Data_Ability implements Ability_Interface {

	/**
	 * The capability helper.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The should index indexables conditional.
	 *
	 * @var Should_Index_Indexables_Conditional
	 */
	private $should_index_indexables_conditional;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper                   $capability_helper                   The capability helper.
	 * @param Should_Index_Indexables_Conditional $should_index_indexables_conditional The should index indexables conditional.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Should_Index_Indexables_Conditional $should_index_indexables_conditional
	) {
		$this->capability_helper                   = $capability_helper;
		$this->should_index_indexables_conditional = $should_index_indexables_conditional;
	}

	/**
	 * Returns whether the ability is available: the SEO data is read from and written to the
	 * indexables, so they must be built.
	 *
	 * @return bool Whether the ability is available.
	 */
	public function is_available(): bool {
		return $this->should_index_indexables_conditional->is_met();
	}

	/**
	 * Checks whether the current user can edit advanced SEO metadata.
	 *
	 * Gates the SEO data abilities on the same capability that gates the advanced
	 * and schema fields in the editors, so the abilities can never grant a field the
	 * editor UI denies. The capability helper also passes wpseo_manage_options holders.
	 * Per-entity edit access is enforced on top, in the execute callbacks.
	 *
	 * @return bool Whether the current user can edit advanced SEO metadata.
	 */
	public function can_edit_advanced_metadata(): bool {
		return $this->capability_helper->current_user_can( 'wpseo_edit_advanced_metadata' );
	}
}
