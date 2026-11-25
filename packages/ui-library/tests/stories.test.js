/**
 * Story smoke test: renders every Storybook story through Storybook's portable stories API.
 *
 * Each story is composed with the project annotations from `.storybook/preview.js` (the `Root`
 * decorator, globals, default args) and rendered in jsdom. The assertion is that it mounts
 * without throwing, so a story that crashes on the current React version fails CI.
 */
import { composeStories, setProjectAnnotations } from "@storybook/react";
import { render } from "@testing-library/react";
import { readdirSync } from "fs";
import { join, sep } from "path";
import React from "react";
import * as previewAnnotations from "../.storybook/preview";

setProjectAnnotations( previewAnnotations );

const SRC = join( __dirname, "../src" );
const storyFiles = readdirSync( SRC, { recursive: true } )
	.map( file => file.split( sep ).join( "/" ) )
	.filter( file => /(^|[/.])stories\.js$/.test( file ) )
	.sort();

describe.each( storyFiles )( "%s", ( file ) => {
	const stories = Object.entries( composeStories( require( join( SRC, file ) ) ) );

	it( "exports at least one story", () => {
		expect( stories.length ).toBeGreaterThan( 0 );
	} );

	it.each( stories )( "renders %s", ( name, Story ) => {
		const { unmount } = render( <Story /> );
		unmount();
	} );
} );

it( "finds the story files", () => {
	expect( storyFiles.length ).toBeGreaterThan( 0 );
	expect( storyFiles ).toContain( "patterns/forms.stories.js" );
} );
