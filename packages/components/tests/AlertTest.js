import React from "react";
import { render, fireEvent } from "@testing-library/react";

import Alert from "../src/Alert";

describe( "Alert", () => {
	test( "the Alert types match the snapshot", () => {
		const alerts = [
			{
				type: "error",
				color: "#8f1919",
				background: "#f9dcdc",
				icon: "alert-error",
			},
			{
				type: "info",
				color: "#00468f",
				background: "#cce5ff",
				icon: "alert-info",
			},
			{
				type: "success",
				color: "#395315",
				background: "#e2f2cc",
				icon: "alert-success",
			},
			{
				type: "warning",
				color: "#674e00",
				background: "#fff3cd",
				icon: "alert-warning",
			},
		];

		alerts.forEach( alert => {
			const content = `This is of the type: "${ alert.type }".`;
			const { container } = render(
				<Alert type={ alert.type }>
					{ content }
				</Alert>
			);
			const tree = container.firstChild;

			// Check the color of the alert.
			expect( tree ).toHaveStyleRule( "color", alert.color );

			// 2 children: The type icon and the content.
			expect( tree.children.length ).toBe( 2 );

			// Check the icon.
			expect( tree.children[ 0 ].getAttribute( "class" ) ).toContain( alert.icon );
			expect( tree.children[ 0 ].getAttribute( "fill" ) ).toBe( alert.color );

			// Check the content.
			expect( tree.children[ 1 ].tagName ).toBe( "DIV" );
			expect( tree.children[ 1 ].childNodes.length ).toBe( 1 );
			expect( tree.children[ 1 ].textContent ).toBe( content );

			// Match the snapshot.
			expect( tree ).toMatchSnapshot();

			// Check the background of the alert.
			expect( tree ).toHaveStyleRule( "background", alert.background );
		} );
	} );

	test( "passing onDismissed makes the alert dismissable", () => {
		const dismiss = jest.fn();
		const { container } = render(
			<Alert type="info" onDismissed={ dismiss }>
				Dismissable alert.
			</Alert>
		);
		const tree = container.firstChild;

		// 3 children: The type icon, the content and the dismiss button.
		expect( tree.children.length ).toBe( 3 );

		// Check the last child is the dismissable button.
		const button = tree.children[ 2 ];
		expect( button.tagName ).toBe( "BUTTON" );

		// Inside the button should be the times symbol.
		expect( button.childNodes.length ).toBe( 1 );
		expect( button.textContent ).toBe( "×" );

		// Check the dismiss action.
		expect( dismiss ).not.toHaveBeenCalled();
		fireEvent.click( button );
		expect( dismiss ).toHaveBeenCalledTimes( 1 );

		// Match the snapshot.
		expect( tree ).toMatchSnapshot();
	} );
} );
