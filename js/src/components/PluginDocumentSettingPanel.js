const PluginDocumentSettingFill = ( {
	isEnabled,
	panelName,
	opened,
	onToggle,
	className,
	title,
	icon,
	children,
} ) => {
	return (
		<>
			<EnablePluginDocumentSettingPanelOption
				label={ title }
				panelName={ panelName }
			/>
			<Fill>
				{ isEnabled && (
					<PanelBody
						className={ className }
						title={ title }
						icon={ icon }
						opened={ opened }
						onToggle={ onToggle }
					>
						{ children }
					</PanelBody>
				) }
			</Fill>
		</>
	);
};
