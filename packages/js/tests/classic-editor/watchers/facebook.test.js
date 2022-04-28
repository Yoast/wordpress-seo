import createDomSync from "../../../src/classic-editor/watchers/helpers/createDomSync";
import { createPostFacebookSync } from "../../../src/classic-editor/watchers/facebook";
import * as dom from "../../../src/classic-editor/helpers/dom";

jest.mock( "../../../src/classic-editor/watchers/helpers/createDomSync" );

describe( "The Facebook watcher", () => {
	it(
		"syncs the Facebook title from the store to a hidden input field.",
		() => {
			const selectors ={
				selectFacebookTitle: jest.fn(),
				selectFacebookDescription: jest.fn(),
				selectFacebookImageURL: jest.fn(),
				selectFacebookImageID: jest.fn(),
			};

			createPostFacebookSync( selectors );

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookTitle,
				{
					domGet: dom.getPostFBTitle,
					domSet: dom.setPostFBTitle,
				},
				"facebookTitle"
			);

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookDescription,
				{
					domGet: dom.getPostFBDescription,
					domSet: dom.setPostFBDescription,
				},
				"facebookDescription"
			);

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookImageURL,
				{
					domGet: dom.getPostFBImageURL,
					domSet: dom.setPostFBImageUrl,
				},
				"facebookImageURL"
			);

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookImageID,
				{
					domGet: dom.getPostFBImageID,
					domSet: dom.setPostFBImageID,
				},
				"facebookImageID"
			);
		} );
} )
