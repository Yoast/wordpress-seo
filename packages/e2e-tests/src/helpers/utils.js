/**
 * WordPress e2e utilities
 */
import {
	visitAdminPage,
	pressKeyWithModifier,
} from "@wordpress/e2e-test-utils";

import { addQueryArgs } from '@wordpress/url';

export const deleteExistingTaxonomies = async ( taxonomySlug ) => {
	const taxonomyPageQuery = addQueryArgs( '', {
		taxonomy: taxonomySlug,
	} );
	
	await visitAdminPage( 'edit-tags.php', taxonomyPageQuery );
	
	const noTaxonomyFoundRow = await page.$( 'tr.no-items' );
	if( noTaxonomyFoundRow == null ) {
		await page.click( '[id^=cb-select-all-]' );
		await page.select( '#bulk-action-selector-top', 'delete' );
		await page.focus( '#doaction' );
		await page.keyboard.press( 'Enter' );

		await page.waitForNavigation();
	}
}

export const createNewTaxonomy = async ( taxonomySlug, taxonomyTitle ) => {
	const taxonomyPageQuery = addQueryArgs( '', {
		taxonomy: taxonomySlug,
	} );
	
	await visitAdminPage( 'edit-tags.php', taxonomyPageQuery );

	await page.waitForSelector( '#tag-name' );
	await page.focus( '#tag-name' );
	await pressKeyWithModifier( 'primary', 'a' );
	await page.type( '#tag-name', taxonomyTitle );
	await page.click( '#submit' );

	await page.waitForSelector( '#the-list tr.level-0' );
}