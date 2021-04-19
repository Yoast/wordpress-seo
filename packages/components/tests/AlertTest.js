import React from "react";
import renderer from "react-test-renderer";

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
			const component = renderer.create(
				<Alert type={ alert.type }>
					{ content }
				</Alert>
			);
			const tree = component.toJSON();

			// Check the color of the alert.
			expect( tree.props.color ).toBe( alert.alertColor );

			// 2 children: The type icon and the content.
			expect( tree.children.length ).toBe( 2 );

			// Check the icon.
			expect( tree.children[ 0 ].props.className.indexOf( alert.icon ) ).not.toBe( -1 );
			expect( tree.children[ 0 ].props.fill ).toBe( alert.color );

			// Check the content.
			expect( tree.children[ 1 ].type ).toBe( "div" );
			expect( tree.children[ 1 ].children.length ).toBe( 1 );
			expect( tree.children[ 1 ].children[ 0 ] ).toBe( content );

			// Match the snapshot.
			expect( tree ).toMatchSnapshot();

			// Check the background of the alert.
			const { rendered } = component.toTree();
			expect( rendered.props.background ).toBe( alert.alertBackground );
		} );
	} );

	test( "passing onDismissed makes the alert dismissable", () => {
		const dismiss = jest.fn();
		const component = renderer.create(
			<Alert type="info" onDismissed={ dismiss }>
				Dismissable alert.
			</Alert>
		);
		const tree = component.toJSON();

		// 3 children: The type icon, the content and the dismiss button.
		expect( tree.children.length ).toBe( 3 );

		// Check the last child is the dismissable button.
		expect( tree.children[ 2 ].type ).toBe( "button" );

		// Inside the button should be the times symbol.
		expect( tree.children[ 2 ].children.length ).toBe( 1 );
		expect( tree.children[ 2 ].children[ 0 ] ).toBe( "×" );

		// Check the dismiss action.
		expect( typeof tree.children[ 2 ].props.onClick ).toBe( "function" );
		tree.children[ 2 ].props.onClick();
		expect( dismiss ).toHaveBeenCalledTimes( 1 );

		// Match the snapshot.
		expect( tree ).toMatchSnapshot();
	} );
} );
