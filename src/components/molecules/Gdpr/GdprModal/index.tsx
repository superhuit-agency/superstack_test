import {
	forwardRef,
	useEffect,
	useRef,
	useState,
	useImperativeHandle,
	Ref,
	MouseEvent,
	useCallback,
} from 'react';
import cx from 'classnames';

import { useLocale } from '@/contexts/locale-context';
import { Button } from '@/components/atoms';
import { CloseIcon } from '@/components/icons';

import { GdprCategory, type GdprCategoryType } from '../GdprCategory';

import './styles.css';

/**
 * TYPINGS
 */
export interface GdprModalProps {
	categories: GdprCategoryType[];
	onCategoryChange: (param: { enabled: boolean; id: string }) => void;
	onModalSaved: Function;
	onModalClosed: Function;
};

/**
 * COMPONENT
 */
export const GdprModal = forwardRef(
	(
		{
			categories,
			onModalSaved,
			onModalClosed,
			onCategoryChange,
		}: GdprModalProps,
		ref: Ref<{}>
	) => {
		const [isHidden, setIsHidden] = useState(true);
		const [isUnmounting, setIsUnmounting] = useState(false);

		const elRef = useRef<HTMLDivElement>(null);
		const dialogRef = useRef<HTMLDivElement>(null);

		const categoriesRef = useRef<any[]>([]);
		const id = useRef('');

		const { dictionary } = useLocale();

		useEffect(() => {
			id.current = genId();
		}, []);

		// Allows to call these functions from the parent
		useImperativeHandle(ref, () => ({
			open,
			setCategoryEnabled,
		}));

		// ##############################
		// #region Event handler
		// ##############################

		const close = useCallback(() => {
			if (isHidden === true) return;

			setIsHidden(true);
			onModalClosed();
		}, [onModalClosed, isHidden]);

		const save = useCallback(() => {
			onModalSaved();
			close();
		}, [close, onModalSaved]);

		const onAnimationEnd = useCallback(() => {
			close();
			setIsUnmounting(false);
		}, [close]);

		const onSave = useCallback(
			(event: MouseEvent) => {
				event.stopPropagation();
				save();
			},
			[save]
		);

		const onClose = useCallback(
			(event: MouseEvent | Event) => {
				event.stopPropagation();
				setIsUnmounting(true);

				window.setTimeout(() => {
					onAnimationEnd();
				}, 300);
			},
			[onAnimationEnd]
		);

		// ##############################
		// #endregion
		// ##############################

		const open = useCallback(() => {
			if (isHidden === false) return;

			setIsHidden(false);
		}, [isHidden]);

		const setCategoryEnabled = useCallback(
			(category: Record<string, any>, enabled = false) => {
				categoriesRef.current
					?.find((cat) => cat.getId() === category.id)
					?.setEnabled(enabled);
			},
			[]
		);

		/**
		 * Generate unique IDs for use as pseudo-private/protected names.
		 * Similar in concept to
		 * <http://wiki.ecmascript.org/doku.php?id=strawman:names>.
		 *
		 * The goals of this function are twofold:
		 *
		 * * Provide a way to generate a string guaranteed to be unique when compared
		 *   to other strings generated by this function.
		 * * Make the string complex enough that it is highly unlikely to be
		 *   accidentally duplicated by hand (this is key if you're using `ID`
		 *   as a private/protected name on an object).
		 *
		 * Use:
		 *
		 *     var privateName = ID();
		 *     var o = { 'public': 'foo' };
		 *     o[privateName] = 'bar';
		 *
		 * @source https://gist.github.com/gordonbrander/2230317;
		 */
		const genId = () => {
			// Math.random should be unique because of its seeding algorithm.
			// Convert it to base 36 (numbers + letters), and grab the first 9 characters
			// after the decimal.
			return '_' + Math.random().toString(36).substr(2, 9);
		};

		useEffect(() => {
			const closeOnOutsideClick = (e: Event) => {
				if (isHidden) return;
				if (dialogRef.current?.contains(e.target as Node)) return;
				onClose(e);
			};

			const target = elRef.current;

			if (!isHidden) {
				target?.addEventListener('click', closeOnOutsideClick);
				// Disable scroll on body
				document.body.style.overflow = 'hidden';
			}
			return () => {
				target?.removeEventListener('click', closeOnOutsideClick);
				// Enable scroll on body
				document.body.style.overflow = '';
			};
		}, [isHidden, onClose]);

		return (
			<section
				className={cx('supt-gdpr-modal', {
					'-fade-out': isUnmounting,
				})}
				role="dialog"
				aria-hidden={isHidden}
				tabIndex={-1}
				id={id.current}
				ref={elRef}
			>
				<div
					className="supt-gdpr-modal__dialog supt-modal-inner"
					role="document"
					aria-labelledby="cookie-law-modal:title"
					ref={dialogRef}
				>
					<div className="supt-gdpr-modal__content">
						<button
							type="button"
							className="supt-gdpr-modal__close"
							onClick={onClose}
						>
							<CloseIcon />
						</button>
						<header className="supt-gdpr-modal__head">
							<p
								id="cookie-law-modal:title"
								className="supt-gdpr-modal__title"
							>
								{dictionary.gdpr.modal.title}
							</p>
						</header>
						<div className="supt-gdpr-modal__body supt-modal-section">
							<p className="supt-gdpr-modal__body__text">
								{dictionary.gdpr.modal.description}
							</p>
							<ul className="supt-gdpr-modal__categories">
								{categories.map((cat, index) => (
									<GdprCategory
										key={index}
										cat={cat}
										handleChange={onCategoryChange}
										ref={(categoryRef) => {
											if (categoryRef) {
												categoriesRef.current[index] =
													categoryRef;
											}
										}}
									/>
								))}
							</ul>
							<footer className="supt-gdpr-modal__footer">
								<Button
									title={dictionary.gdpr.modal.save}
									className="supt-gdpr-modal__save-button"
									onClick={onSave}
									variant="link"
								/>
							</footer>
						</div>
					</div>
				</div>
			</section>
		);
	}
);

GdprModal.displayName = 'GdprModal';
