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
						label: postType.label,
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
			state => preferencesSelectors.selectPreference( state, "homepageIsLatestPosts" ),
			state => preferencesSelectors.selectPreference( state, "homepagePostsEditUrl" ),
		],
		( taxonomies, postTypes, homepageIsLatestPosts, homepagePostsEditUrl ) => {
			let options = [
				{ value: 0, label: __( "None", "wordpress-seo" ) },
			];
			if ( ! homepageIsLatestPosts && ! isEmpty( homepagePostsEditUrl ) ) {
				options.push( { value: "post", label: __( "Blog", "wordpress-seo" ) } );
			}
			const filteredPostTypes = filter( postTypes, ( { hasArchive } ) => hasArchive );
			options = options.concat( map( filteredPostTypes, ( { name, label } ) => ( { value: name, label } ) ) );

			return mapValues( taxonomies, taxonomy => ( { label: taxonomy.label, options } ) );
		}
	),
};
