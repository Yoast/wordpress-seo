/**
 * WordPress e2e utilities
 */
import {
	__experimentalRest as rest,
} from "@wordpress/e2e-test-utils";

export const deleteAllPostsWithApi = async (post_type) => {
	const response = await rest({
		method: 'GET',
		path: `/wp/v2/${post_type}`,
	});

	const ids = response.map((post) => post.id);

	if (ids.length > 0) {
		for (const id of ids) {
			await rest({
				method: 'DELETE',
				path: `/wp/v2/${post_type}/${id}`,
			});
		}
	}
}

export const createNewTaxonomyTerm = async (taxonomySlug, taxonomyTermSlug, taxonomyTermTitle) => {
	await rest({
		method: 'POST',
		path: `/wp/v2/${taxonomySlug}`,
		data: {
			slug: taxonomyTermSlug,
			name: taxonomyTermTitle,
		}
	});
}

export const deleteAllTaxonomyTerms = async (taxonomySlug) => {
	const response = await rest({
		method: 'GET',
		path: `/wp/v2/${taxonomySlug}`,
	});

	const ids = response.map((term) => term.id);

	if (ids.length > 0) {
		for (const id of ids) {
			await rest({
				method: 'DELETE',
				path: `/wp/v2/${taxonomySlug}/${id}/?force=true`,
			});
		}
	}
}
