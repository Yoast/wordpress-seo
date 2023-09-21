// import React from "react";
import { useSelect } from "@wordpress/data";
import { set } from "lodash";

// import FleschReadingEase from "../../../src/insights/components/flesch-reading-ease";
import { DIFFICULTY } from "yoastseo";

jest.mock( "@wordpress/data", () => (
	{
		useSelect: jest.fn(),
	}
) );

jest.mock( "@wordpress/element", () => (
	{
		...jest.requireActual( "@wordpress/element" ),
		useMemo: jest.fn( fn => fn() ),
	}
) );

/**
 * Mocks the WordPress `useSelect` hook.
 *
 * @param {number} score The Flesch reading ease score to use.
 * @param {DIFFICULTY} difficulty The Flesch reading ease difficulty to use.
 *
 * @returns {void}
 */
function mockSelect( score, difficulty ) {
	const select = jest.fn(
		() => (
			{
				getFleschReadingEaseScore: jest.fn( () => score ),
				getFleschReadingEaseDifficulty: jest.fn( () => difficulty ),
			}
		)
	);

	useSelect.mockImplementation(
		selectFunction => selectFunction( select )
	);
}

describe( "The FleschReadingEase component", () => {
	set( window, "wpseoAdminL10n.shortlinks-insights-flesch_reading_ease", "https://example.org/link" );
	set( window, "wpseoAdminL10n.shortlinks-insights-flesch_reading_ease_article", "https://example.org/article" );

	it( "renders the component when the text is considered very difficult.", () => {
		mockSelect( 10, DIFFICULTY.VERY_DIFFICULT );
	} );
	it( "renders the component when the text is considered very easy.", () => {
		mockSelect( 90, DIFFICULTY.VERY_EASY );
	} );
	it( "renders the component when the text is considered easy.", () => {
		mockSelect( 80, DIFFICULTY.EASY );
	} );
	it( "renders the component when the text is considered fairly easy.", () => {
		mockSelect( 70, DIFFICULTY.FAIRLY_EASY );
	} );
	it( "renders the component when the text is considered okay.", () => {
		mockSelect( 60, DIFFICULTY.OKAY );
	} );
	it( "renders the component when the text is considered fairly difficult.", () => {
		mockSelect( 50, DIFFICULTY.FAIRLY_DIFFICULT );
	} );
	it( "renders the component when the text is considered difficult.", () => {
		mockSelect( 30, DIFFICULTY.DIFFICULT );
	} );
} );
