import createDomSync from "../../../src/classic-editor/watchers/helpers/createDomSync";
import { createPostFacebookSync, createTermFacebookSync } from "../../../src/classic-editor/watchers/facebook";
import * as dom from "../../../src/classic-editor/helpers/dom";

jest.mock( "../../../src/classic-editor/watchers/helpers/createDomSync" );

describe( "The Facebook Post watcher", () => {
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
} );

describe( "The Facebook Term watcher", () => {
	it(
		"syncs the Facebook title from the store to a hidden input field.",
		() => {
			const selectors ={
				selectFacebookTitle: jest.fn(),
				selectFacebookDescription: jest.fn(),
				selectFacebookImageURL: jest.fn(),
				selectFacebookImageID: jest.fn(),
			};

			createTermFacebookSync( selectors );

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookTitle,
				{
					domGet: dom.getTermFBTitle,
					domSet: dom.setTermFBTitle,
				},
				"facebookTitle"
			);

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookDescription,
				{
					domGet: dom.getTermFBDescription,
					domSet: dom.setTermFBDescription,
				},
				"facebookDescription"
			);

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookImageURL,
				{
					domGet: dom.getTermFBImageURL,
					domSet: dom.setTermFBImageUrl,
				},
				"facebookImageURL"
			);

			expect( createDomSync ).toBeCalledWith(
				selectors.selectFacebookImageID,
				{
					domGet: dom.getTermFBImageID,
					domSet: dom.setTermFBImageID,
				},
				"facebookImageID"
			);
		} );
} );
