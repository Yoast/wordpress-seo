import { createSelector } from "@reduxjs/toolkit";
import { __ } from "@wordpress/i18n";
import { filter, forEach, includes, isEmpty, map, mapValues } from "lodash";
import { postTypesSelectors } from "./post-types";
import { preferencesSelectors } from "./preferences";
import { taxonomiesSelectors } from "./taxonomies";

export const breadcrumbsSelectors = {
	selectBreadcrumbsForPostTypes: createSelector(
		[
			taxonomiesSelectors.selectAllTaxonomies,
			postTypesSelectors.selectAllPostTypes,
		],
		( taxonomies, postTypes ) => {
			const none = { value: 0, label: __( "None", "wordpress-seo" ) };
			const options = {};
			forEach( postTypes, ( postType, postTypeName ) => {
				const linkedTaxonomies = filter( taxonomies, taxonomy => includes( taxonomy.postTypes, postTypeName ) );
				if ( ! isEmpty( linkedTaxonomies ) ) {
					options[ postTypeName ] = {
						...postType,
						options: [
							none,
							...map( linkedTaxonomies, ( { name, label } ) => ( { value: name, label } ) ),
						],
					};
				}
			} );
			return options;
		}
	),
	selectBreadcrumbsForTaxonomies: createSelector(
		[
			taxonomiesSelectors.selectAllTaxonomies,
			postTypesSelectors.selectAllPostTypes,
			preferencesSelectors.selectHasPageForPosts,
		],
		( taxonomies, postTypes, hasPageForPosts ) => {
			let options = [
				{ value: 0, label: __( "None", "wordpress-seo" ) },
			];
			if ( hasPageForPosts ) {
				options.push( { value: "post", label: __( "Blog", "wordpress-seo" ) } );
			}
			const filteredPostTypes = filter( postTypes, ( { hasArchive } ) => hasArchive );
			options = options.concat( map( filteredPostTypes, ( { name, label } ) => ( { value: name, label } ) ) );

			return mapValues( taxonomies, taxonomy => ( { name: taxonomy.name, label: taxonomy.label, options } ) );
		}
	),
};
