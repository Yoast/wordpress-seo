const EllipseWithInnerDot = ( props ) => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" { ...props }>
		<rect
			x="3" y="3" width="18" height="18" rx="9" stroke="currentColor"
			strokeWidth="2"
		/>
		<circle cx="12" cy="12" r="2" fill="currentColor" />
	</svg>
);

export default EllipseWithInnerDot;
