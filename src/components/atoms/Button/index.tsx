import { FC } from 'react';
import cx from 'classnames';

import { Link } from '@/helpers/Link';

import block from './block.json';

// styles
import './styles.css';

export const Button: FC<ButtonProps> & BlockConfigs = ({
	text = '',
	url,
	className,
	variant = 'primary',
	linkTarget,
	rel,
	width,
}) => {
	return text && url ? (
		<Link
			className={cx('supt-button', `-${variant}`, className)}
			href={url}
			target={linkTarget || undefined}
			rel={rel || undefined}
			style={{
				width: width ? `${width}%` : undefined,
			}}
		>
			<span className="supt-button__inner">
				<span dangerouslySetInnerHTML={{ __html: text }} />
			</span>
		</Link>
	) : null;
};

Button.slug = block.slug;
Button.title = block.title;
