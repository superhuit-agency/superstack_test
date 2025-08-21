import { FC } from 'react';

import block from './block.json';

// styles
import './styles.css';

export const Buttons: FC<ButtonsProps> & BlockConfigs = ({
	children,
	layout,
}) => {
	return (
		<div
			className="supt-buttons"
			style={{
				flexWrap: layout?.flexWrap,
				justifyContent: layout?.justifyContent,
				flexDirection: layout
					? layout?.orientation === 'vertical'
						? 'column'
						: 'row'
					: undefined,
				alignItems: layout?.verticalAlignment,
			}}
		>
			{children}
		</div>
	);
};

Buttons.slug = block.slug;
Buttons.title = block.title;
