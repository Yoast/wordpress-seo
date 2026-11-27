<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use Yoast\WP\SEO\Actions\Indexing\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Indexing_Helper;

/**
 * Application service that collects whether the indexables of the site are enabled and whether the SEO data
 * optimization has built them.
 *
 * @internal Backs the SEO data optimization status ability. Not meant to be used outside of Yoast SEO, so it can change
 *           at any time without notice.
 */
class SEO_Data_Optimization_Status_Collector {

	/**
	 * The should index indexables conditional.
	 *
	 * @var Should_Index_Indexables_Conditional
	 */
	private $should_index_indexables_conditional;

	/**
	 * The indexing helper.
	 *
	 * @var Indexing_Helper
	 */
	private $indexing_helper;

	/**
	 * The indexing actions that build the indexables the abilities read from.
	 *
	 * @var array<Indexable_Post_Indexation_Action|Indexable_Term_Indexation_Action|Indexable_Post_Type_Archive_Indexation_Action|Indexable_General_Indexation_Action>
	 */
	private $indexing_actions;

	/**
	 * Constructor.
	 *
	 * @param Should_Index_Indexables_Conditional           $should_index_indexables_conditional The should index indexables conditional.
	 * @param Indexing_Helper                               $indexing_helper                     The indexing helper.
	 * @param Indexable_Post_Indexation_Action              $post_indexation                     The post indexing action.
	 * @param Indexable_Term_Indexation_Action              $term_indexation                     The term indexing action.
	 * @param Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation        The post type archive indexing action.
	 * @param Indexable_General_Indexation_Action           $general_indexation                  The general indexing action.
	 */
	public function __construct(
		Should_Index_Indexables_Conditional $should_index_indexables_conditional,
		Indexing_Helper $indexing_helper,
		Indexable_Post_Indexation_Action $post_indexation,
		Indexable_Term_Indexation_Action $term_indexation,
		Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation,
		Indexable_General_Indexation_Action $general_indexation
	) {
		$this->should_index_indexables_conditional = $should_index_indexables_conditional;
		$this->indexing_helper                     = $indexing_helper;
		$this->indexing_actions                    = [
			$post_indexation,
			$term_indexation,
			$post_type_archive_indexation,
			$general_indexation,
		];
	}

	/**
	 * Returns whether the indexables are enabled and whether every indexable the abilities read from has been built.
	 *
	 * @return array<string, bool> The SEO data optimization status.
	 */
	public function get(): array {
		$indexables_enabled = $this->should_index_indexables_conditional->is_met();

		return [
			'optimization_enabled'  => $indexables_enabled,
			// Without indexables nothing gets built, so the unindexed counts would be meaningless.
			'optimization_complete' => $indexables_enabled && $this->are_indexables_built(),
		];
	}

	/**
	 * Returns whether every indexable the abilities read from has been built.
	 *
	 * The link indexing actions are left out on purpose: the abilities don't read the links, and counting the
	 * unindexed links is the heaviest query of all. The unfiltered count is used so that add-ons counting their own
	 * unprocessed items, like the prominent words, don't affect the status. A limit of 1 is enough to tell whether
	 * anything is left, and the counts are cached in transients that are shared with the indexing notification.
	 *
	 * @return bool Whether the indexables have been built.
	 */
	private function are_indexables_built(): bool {
		return $this->indexing_helper->get_limited_unindexed_count( 1, $this->indexing_actions ) === 0;
	}
}
