
export const Feature = ( {
	icon,
	title,
	description,
	iconClassName,
} ) => {
	const Icon = icon;
	return (
		<div className="yst-flex yst-gap-6">
			<Icon className={ `yst-mt-1 yst-shrink-0 ${ iconClassName } yst-rounded-md` } />
			<div className="yst-flex yst-flex-col">
				<span className="yst-text-base yst-text-slate-900 yst-leading-6 yst-font-medium">{ title }</span>
				<span className="yst-text-sm yst-text-slate-600"> { description } </span>
			</div>
		</div>
	);
};
