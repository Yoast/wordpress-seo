/* External dependencies */
import React from "react";
import { fireEvent, render, screen } from "./test-utils";

/* Internal dependencies */
import ModeSwitcher from "../src/snippet-editor/ModeSwitcher";
import { MODE_DESKTOP, MODE_MOBILE } from "../src/snippet-preview/constants";

describe( "ModeSwitcher", () => {
	describe( "Snapshot tests", () => {
		it( "matches snapshot in mobile mode", () => {
			const { container } = render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ jest.fn() }
					id="test-toggle-mobile"
					desktopModeInputId="test-desktop-icon-mobile"
					mobileModeInputId="test-mobile-icon-mobile"
				/>
			);
			expect( container ).toMatchSnapshot();
		} );

		it( "matches snapshot in desktop mode", () => {
			const { container } = render(
				<ModeSwitcher
					active={ MODE_DESKTOP }
					onChange={ jest.fn() }
					id="test-toggle-desktop"
					desktopModeInputId="test-desktop-icon-desktop"
					mobileModeInputId="test-mobile-icon-desktop"
				/>
			);
			expect( container ).toMatchSnapshot();
		} );
	} );

	describe( "Rendering", () => {
		it( "renders the component with label", () => {
			render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ jest.fn() }
					id="test-toggle"
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			expect( screen.getByText( "Google preview" ) ).toBeInTheDocument();
		} );

		it( "renders Mobile and Desktop labels", () => {
			render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ jest.fn() }
					id="test-toggle"
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			expect( screen.getByText( "Mobile" ) ).toBeInTheDocument();
			expect( screen.getByText( "Desktop" ) ).toBeInTheDocument();
		} );

		it( "applies correct styling to mobile label when mobile is active", () => {
			render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ jest.fn() }
					id="test-toggle"
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			const mobileLabel = screen.getByText( "Mobile" );
			expect( mobileLabel ).toHaveClass( "yst-text-slate-800" );
			expect( mobileLabel ).not.toHaveClass( "yst-text-slate-500" );
		} );

		it( "applies correct styling to desktop label when desktop is active", () => {
			render(
				<ModeSwitcher
					active={ MODE_DESKTOP }
					onChange={ jest.fn() }
					id="test-toggle"
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			const desktopLabel = screen.getByText( "Desktop" );
			expect( desktopLabel ).toHaveClass( "yst-text-slate-800" );
			expect( desktopLabel ).not.toHaveClass( "yst-text-slate-500" );
		} );

		it( "applies correct styling to mobile label when desktop is active", () => {
			render(
				<ModeSwitcher
					active={ MODE_DESKTOP }
					onChange={ jest.fn() }
					id="test-toggle"
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			const mobileLabel = screen.getByText( "Mobile" );
			expect( mobileLabel ).toHaveClass( "yst-text-slate-500" );
			expect( mobileLabel ).not.toHaveClass( "yst-text-slate-800" );
		} );

		it( "applies correct styling to desktop label when mobile is active", () => {
			render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ jest.fn() }
					id="test-toggle"
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			const desktopLabel = screen.getByText( "Desktop" );
			expect( desktopLabel ).toHaveClass( "yst-text-slate-500" );
			expect( desktopLabel ).not.toHaveClass( "yst-text-slate-800" );
		} );

		it( "renders toggle with correct data-id", () => {
			const testId = "custom-toggle-id";
			const { container } = render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ jest.fn() }
					id={ testId }
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			const toggle = container.querySelector( `[data-id="${testId}"]` );
			expect( toggle ).toBeInTheDocument();
		} );
	} );

	describe( "Toggle state", () => {
		it( "toggle is unchecked when mobile mode is active", () => {
			const testId = "test-toggle-mobile";
			const { container } = render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ jest.fn() }
					id={ testId }
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			const toggle = container.querySelector( `[data-id="${testId}"]` );
			expect( toggle ).toHaveAttribute( "aria-checked", "false" );
		} );

		it( "toggle is checked when desktop mode is active", () => {
			const testId = "test-toggle-desktop";
			const { container } = render(
				<ModeSwitcher
					active={ MODE_DESKTOP }
					onChange={ jest.fn() }
					id={ testId }
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			const toggle = container.querySelector( `[data-id="${testId}"]` );
			expect( toggle ).toHaveAttribute( "aria-checked", "true" );
		} );
	} );

	describe( "Interaction", () => {
		it( "calls onChange with desktop mode when switching from mobile", () => {
			const onChangeMock = jest.fn();
			const testId = "test-toggle";

			const { container } = render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ onChangeMock }
					id={ testId }
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			const toggle = container.querySelector( `[data-id="${testId}"]` );
			fireEvent.click( toggle );

			expect( onChangeMock ).toHaveBeenCalledTimes( 1 );
			expect( onChangeMock ).toHaveBeenCalledWith( MODE_DESKTOP );
		} );

		it( "calls onChange with mobile mode when switching from desktop", () => {
			const onChangeMock = jest.fn();
			const testId = "test-toggle";

			const { container } = render(
				<ModeSwitcher
					active={ MODE_DESKTOP }
					onChange={ onChangeMock }
					id={ testId }
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			const toggle = container.querySelector( `[data-id="${testId}"]` );
			fireEvent.click( toggle );

			expect( onChangeMock ).toHaveBeenCalledTimes( 1 );
			expect( onChangeMock ).toHaveBeenCalledWith( MODE_MOBILE );
		} );

		it( "calls onChange multiple times when toggled multiple times", () => {
			const onChangeMock = jest.fn();
			const testId = "test-toggle";

			const { container, rerender } = render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ onChangeMock }
					id={ testId }
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			let toggle = container.querySelector( `[data-id="${testId}"]` );

			// First click: mobile -> desktop
			fireEvent.click( toggle );
			expect( onChangeMock ).toHaveBeenCalledWith( MODE_DESKTOP );

			// Rerender with new mode
			rerender(
				<ModeSwitcher
					active={ MODE_DESKTOP }
					onChange={ onChangeMock }
					id={ testId }
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			toggle = container.querySelector( `[data-id="${testId}"]` );

			// Second click: desktop -> mobile
			fireEvent.click( toggle );
			expect( onChangeMock ).toHaveBeenCalledWith( MODE_MOBILE );

			expect( onChangeMock ).toHaveBeenCalledTimes( 2 );
		} );
	} );

	describe( "Accessibility", () => {
		it( "has proper screen reader label in mobile mode", () => {
			const testId = "test-toggle";
			const { container } = render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ jest.fn() }
					id={ testId }
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			const screenReaderLabel = container.querySelector( ".yst-sr-only" );

			expect( screenReaderLabel ).toBeInTheDocument();
			expect( screenReaderLabel.textContent ).toContain( "Google preview" );
			expect( screenReaderLabel.textContent ).toContain( "Switch to desktop preview" );
			expect( screenReaderLabel.textContent ).toContain( "Currently showing mobile preview" );
		} );

		it( "has proper screen reader label in desktop mode", () => {
			const testId = "test-toggle";
			const { container } = render(
				<ModeSwitcher
					active={ MODE_DESKTOP }
					onChange={ jest.fn() }
					id={ testId }
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			const screenReaderLabel = container.querySelector( ".yst-sr-only" );

			expect( screenReaderLabel ).toBeInTheDocument();
			expect( screenReaderLabel.textContent ).toContain( "Google preview" );
			expect( screenReaderLabel.textContent ).toContain( "Switch to mobile preview" );
			expect( screenReaderLabel.textContent ).toContain( "Currently showing desktop preview" );
		} );

		it( "has aria-hidden on mode labels", () => {
			render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ jest.fn() }
					id="test-toggle"
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			const mobileLabel = screen.getByText( "Mobile" );
			const desktopLabel = screen.getByText( "Desktop" );

			expect( mobileLabel ).toHaveAttribute( "aria-hidden", "true" );
			expect( desktopLabel ).toHaveAttribute( "aria-hidden", "true" );
		} );

		it( "has role group on the switcher container", () => {
			const { container } = render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ jest.fn() }
					id="test-toggle"
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
				/>
			);

			const groupElement = container.querySelector( '[role="group"]' );
			expect( groupElement ).toBeInTheDocument();
		} );
	} );

	describe( "Disabled state", () => {
		it( "renders correctly when disabled", () => {
			const { container } = render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ jest.fn() }
					id="test-toggle-disabled"
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
					disabled={ true }
				/>
			);
			expect( container ).toMatchSnapshot();
		} );

		it( "mobile label styling is not affected by disabled state", () => {
			render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ jest.fn() }
					id="test-toggle"
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
					disabled={ true }
				/>
			);

			const mobileLabel = screen.getByText( "Mobile" );
			expect( mobileLabel ).toHaveClass( "yst-text-slate-800" );
			expect( mobileLabel ).not.toHaveClass( "yst-text-slate-500" );
		} );

		it( "desktop label styling is not affected by disabled state", () => {
			render(
				<ModeSwitcher
					active={ MODE_DESKTOP }
					onChange={ jest.fn() }
					id="test-toggle"
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
					disabled={ true }
				/>
			);

			const desktopLabel = screen.getByText( "Desktop" );
			expect( desktopLabel ).toHaveClass( "yst-text-slate-800" );
			expect( desktopLabel ).not.toHaveClass( "yst-text-slate-500" );
		} );

		it( "toggle is disabled when disabled prop is true", () => {
			const testId = "test-toggle-disabled";
			const { container } = render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ jest.fn() }
					id={ testId }
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
					disabled={ true }
				/>
			);

			const toggle = container.querySelector( `[data-id="${testId}"]` );
			expect( toggle ).toHaveClass( "yst-toggle--disabled" );
		} );

		it( "does not call onChange when disabled toggle is clicked", () => {
			const onChangeMock = jest.fn();
			const testId = "test-toggle";

			const { container } = render(
				<ModeSwitcher
					active={ MODE_MOBILE }
					onChange={ onChangeMock }
					id={ testId }
					desktopModeInputId="test-desktop-icon"
					mobileModeInputId="test-mobile-icon"
					disabled={ true }
				/>
			);

			const toggle = container.querySelector( `[data-id="${testId}"]` );
			fireEvent.click( toggle );

			expect( onChangeMock ).not.toHaveBeenCalled();
		} );
	} );
} );
