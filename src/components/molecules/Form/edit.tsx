import { InspectorControls } from '@wordpress/block-editor';
import { BlockEditProps } from '@wordpress/blocks';
import { PanelBody, PanelRow, SelectControl } from '@wordpress/components';
import { useCallback } from '@wordpress/element';
import { _x } from '@wordpress/i18n';
import { useMemo } from 'react';

import icon from '@/components/icons/FormIcon';
import { useGraphQlApi } from '#/hooks';

import { Form } from '.';
import block from './block.json';
import { getData, getFormsList } from './data';
import './styles.css';
import './styles.edit.css';

/**
 * COMPONENT EDIT
 */
const Edit = ({ attributes, setAttributes }: BlockEditProps<FormProps>) => {
	const { isLoading: isLoadingFormsList, data: formsList } =
		useGraphQlApi(getFormsList);

	const formsListSelectOptions = useMemo(
		() =>
			formsList &&
			Array.isArray(formsList) &&
			formsList.reduce(
				(
					opts: Array<{ value: string; label: string }>,
					f: GraphQlFormFields
				) => [
					...opts,
					{
						value: f.id,
						label: f.title,
					},
				],
				[
					{
						value: null,
						label: _x('Pick a form', 'Form block settings', 'supt'),
					},
				]
			),
		[formsList]
	);

	const handleOnFormSelect = useCallback(
		(value: string) => {
			const id = parseInt(value);

			setAttributes({
				id: isNaN(id) ? undefined : id,
			});
		},
		[setAttributes]
	);

	const { id, isPreview } = attributes;

	const variables = useMemo(() => ({ id }), [id]);
	const { data: form } = useGraphQlApi(getData, variables);

	// For block preview
	if (isPreview) return null;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={_x('Settings', 'Form block settings', 'supt')}
				>
					{!isLoadingFormsList && (
						<>
							<PanelRow>
								{formsList.length ? (
									<SelectControl
										label={_x(
											'Form',
											'Form block settings',
											'supt'
										)}
										value={id?.toString()}
										options={formsListSelectOptions}
										onChange={handleOnFormSelect}
									/>
								) : (
									<strong>
										{_x(
											'⚠️ No form exists. Please create one in "Forms > Add New".',
											'Form block settings',
											'supt'
										)}
									</strong>
								)}
							</PanelRow>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			<div className="form-block">
				{form ? (
					<Form {...form} />
				) : (
					<div className="components-placeholder">
						<div className="components-placeholder__label">
							<span className="editor-block-icon block-editor-block-icon has-colors">
								{icon}
							</span>
							{_x('Form', 'Form block settings', 'supt')}
						</div>
						<div className="components-placeholder__instructions">
							{_x(
								'Please choose the form you want to display, in the right panel.',
								'Form block settings',
								'supt'
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
};

/**
 * WORDPRESS BLOCK
 */
export const FormBlock: WpBlockType<FormProps> = {
	slug: block.slug,
	settings: {
		title: block.title,
		description: _x('', 'Block Form Description', 'supt'),
		category: 'common',
		icon: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M7 16h7v2H7v-2zm0-4h10v2H7v-2zm0-4h10v2H7V8zm12-4h-4.18C14.4 2.84 13.3 2 12 2c-1.3 0-2.4.84-2.82 2H5c-.14 0-.27.01-.4.04a2.008 2.008 0 00-1.44 1.19c-.1.23-.16.49-.16.77v14c0 .27.06.54.16.78s.25.45.43.64c.27.27.62.47 1.01.55.13.02.26.03.4.03h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-7-.25c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zM19 20H5V6h14v14z"
					fill="#5F6368"
					fillRule="nonzero"
				/>
			</svg>
		),
		postTypes: ['page'],
		attributes: {
			id: {
				type: 'number',
				default: undefined,
			},
			name: {
				type: 'string',
				default: '',
			},
			optIns: {
				type: 'object',
				default: {},
			},
			isPreview: {
				type: 'boolean',
				default: false,
			},
			fields: {
				type: 'array',
				default: [],
			},
			version: {
				type: 'number',
				default: 0,
			},
		},
		keywords: [],
		supports: { customClassName: false },
		example: {
			attributes: {
				isPreview: true,
			},
		},
		edit: Edit,
		save: () => null,
	},
};
