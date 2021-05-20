/**
 * WordPress e2e utilities
 */
import {
	createNewPost,
	installPlugin,
	activatePlugin
} from '@wordpress/e2e-test-utils';

describe( 'Yoast SEO plugin metabox', () => {
	beforeEach( async () => {
		// Testing this with Yoast plugin installed and activated
		// on the docker WordPress installation.
		// If the plugin is not installed and activated, the next two lines
		// need to be uncommented

		// await installPlugin( 'wordpress-seo' );
		// await activatePlugin( 'wordpress-seo' );
	} );

	it( 'should contains the Yoast SEO plugin metabox', async () => {
		await createNewPost();

			await page.waitForSelector( '.postbox.yoast.wpseo-metabox' );
			const yoastSeoMetabox = await page.$x(
			`//*[contains(@class, 'postbox yoast wpseo-metabox')]`
		);
		expect( yoastSeoMetabox.length ).toBe( 1 );
	} );
} );