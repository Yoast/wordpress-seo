/**
 * Higher order component that adds shouldCloseOnClickOutside for modals
 *
 * @param {JSX.Element} Component The component to enrich with the shouldCloseOnClickOutside prop.
 * @returns {JSX.Element} A component that adds the shouldCloseOnClickOutside prop for modals.
 */
const withShouldntCloseOnOutsideClick = ( Component ) => {
	/**
     * A wrapper component that adds the shouldCloseOnClickOutside prop.
     *
     * @param {Object} props The props object.
     * @returns {JSX.Element} Component that
     */
	const ShouldntCloseOnOutsideClick = ( props ) => <Component { ...props } shouldCloseOnClickOutside={ false } />;
	ShouldntCloseOnOutsideClick.displayName = `withShouldntCloseOnOutsideClick( ${ Component.displayName } )`;

	console.warn( "Component.displayName", Component.displayName );
	console.warn( "ShouldntCloseOnOutsideClick.displayName", ShouldntCloseOnOutsideClick.displayName );

	return ShouldntCloseOnOutsideClick;
};

export default withShouldntCloseOnOutsideClick;
