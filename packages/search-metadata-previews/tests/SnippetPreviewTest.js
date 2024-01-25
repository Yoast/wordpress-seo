import React from "react";
import { MODE_DESKTOP, MODE_MOBILE } from "../src/snippet-preview/constants";
import SnippetPreview from "../src/snippet-preview/SnippetPreview";
import { render, screen } from "./test-utils";

const baseArgs = {
	description: "Description",
	siteName: "Test site name",
	title: "Title",
	onMouseUp: jest.fn(),
};

describe( "SnippetPreview", () => {
	describe( "breadcrumbs", () => {
		it( "properly renders multiple breadcrumbs in mobile view", () => {
			render( <SnippetPreview { ...baseArgs } url={ "http://www.google.nl/about" } mode={ MODE_MOBILE } /> );
			const baseURL = screen.getByText( "www.google.nl" );
			const subFolder = screen.getByText( "› about" );
			expect( baseURL ).toBeInTheDocument();
			expect( subFolder ).toBeInTheDocument();
		} );

		it( "doesn't percent encode characters that are percent encoded by node's url.parse in mobile view", () => {
			render( <SnippetPreview { ...baseArgs } url={ "http://www.google.nl/`^ {}" } mode={ MODE_MOBILE } /> );
			const baseURL = screen.getByText( "www.google.nl" );
			const subFolder = screen.getByText( "› `^ {}" );
			expect( baseURL ).toBeInTheDocument();
			expect( subFolder ).toBeInTheDocument();
		} );

		it( "properly renders multiple breadcrumbs in desktop view", () => {
			render( <SnippetPreview { ...baseArgs } url={ "http://www.google.nl/about" } mode={ MODE_DESKTOP } /> );
			const baseURL = screen.getByText( "www.google.nl" );
			const subFolder = screen.getByText( "› about" );
			expect( baseURL ).toBeInTheDocument();
			expect( subFolder ).toBeInTheDocument();
		} );

		it( "properly renders multiple breadcrumbs in desktop view without a trailing slash", () => {
			render( <SnippetPreview { ...baseArgs } url={ "http://www.google.nl/about/" } mode={ MODE_DESKTOP } /> );
			const baseURL = screen.getByText( "www.google.nl" );
			const subFolder = screen.getByText( "› about" );
			const subFolderWithTrailingSlash = screen.queryByText( "› about/" );
			expect( baseURL ).toBeInTheDocument();
			expect( subFolder ).toBeInTheDocument();
			expect( subFolderWithTrailingSlash ).not.toBeInTheDocument();
		} );

		it( "strips http protocol in mobile view", () => {
			render( <SnippetPreview { ...baseArgs } url={ "http://www.google.nl/subdir" } mode={ MODE_MOBILE } /> );
			const baseURL = screen.getByText( "www.google.nl" );
			const baseUrlWithProtocol = screen.queryByText( "http://www.google.nl" );
			const subFolder = screen.getByText( "› subdir" );
			expect( baseURL ).toBeInTheDocument();
			expect( baseUrlWithProtocol ).not.toBeInTheDocument();
			expect( subFolder ).toBeInTheDocument();
		} );

		it( "strips https protocol in mobile view", () => {
			render( <SnippetPreview { ...baseArgs } url={ "https://www.google.nl/subdir" } mode={ MODE_MOBILE } /> );
			const baseURL = screen.getByText( "www.google.nl" );
			const baseUrlWithProtocol = screen.queryByText( "https://www.google.nl" );
			const subFolder = screen.getByText( "› subdir" );
			expect( baseURL ).toBeInTheDocument();
			expect( baseUrlWithProtocol ).not.toBeInTheDocument();
			expect( subFolder ).toBeInTheDocument();
		} );

		it( "strips http protocol in desktop view", () => {
			render( <SnippetPreview { ...baseArgs } url={ "http://www.google.nl/subdir" } mode={ MODE_DESKTOP } /> );
			const baseURL = screen.getByText( "www.google.nl" );
			const baseUrlWithProtocol = screen.queryByText( "http://www.google.nl" );
			const subFolder = screen.getByText( "› subdir" );
			expect( baseURL ).toBeInTheDocument();
			expect( baseUrlWithProtocol ).not.toBeInTheDocument();
			expect( subFolder ).toBeInTheDocument();
		} );

		it( "strips https protocol in desktop view", () => {
			render( <SnippetPreview { ...baseArgs } url={ "https://www.google.nl/subdir" } mode={ MODE_DESKTOP } /> );
			const baseURL = screen.getByText( "www.google.nl" );
			const baseUrlWithProtocol = screen.queryByText( "https://www.google.nl" );
			const subFolder = screen.getByText( "› subdir" );
			expect( baseURL ).toBeInTheDocument();
			expect( baseUrlWithProtocol ).not.toBeInTheDocument();
			expect( subFolder ).toBeInTheDocument();
		} );
	} );
} );
