/**
 * WordPress e2e utilities
 */
import {
	createNewPost,
} from "@wordpress/e2e-test-utils";

describe( "Yoast SEO plugin metabox", () => {

	it( "should contains the Yoast SEO plugin metabox", async () => {
		await createNewPost();
		await page.waitForSelector( ".postbox.yoast.wpseo-metabox" );
		const yoastSeoMetabox = await page.$x(
		`//*[contains( @class, "postbox yoast wpseo-metabox" )]`
		);
		expect( yoastSeoMetabox.length ).toBe( 1 );
	} );

} );
