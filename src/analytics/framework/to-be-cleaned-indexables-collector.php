<?php

namespace Yoast\WP\SEO\Analytics\Framework;

class To_Be_Cleaned_Indexables_Collector implements \WPSEO_Collection {

	/**
	 * @inheritDoc
	 */
	public function get() {
		// count_indexables_with_object_Type_and_object_sub_type
		// count_indexables_with_post_status
		//count_indexables_for_non_publicly_viewable_post
		//count_indexables_for_authors_archive_disabled
		//count_indexables_for_authors_without_archive
		//count_indexables_for_object_type_and_source_table 'users', 'ID', 'user'
		//count_indexables_for_object_type_and_source_table  'posts', 'ID', 'post',
		//count_indexables_for_object_type_and_source_table 'terms', 'term_id', 'term'
		//count_orphaned_from_table 'Indexable_Hierarchy', 'indexable_id'
		//count_orphaned_from_table 'SEO_Links', 'indexable_id'
		//count_orphaned_from_table 'SEO_Links', 'target_indexable_id'

	}
}
