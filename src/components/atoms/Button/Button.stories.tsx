import { Meta, StoryObj } from '@storybook/react';

import { Button } from '.';

const meta = {
	title: 'Components/Atoms/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	args: {},
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		text: 'Button Primary',
		url: '#',
	},
};

export const Secondary: Story = {
	args: {
		text: 'Button Secondary',
		url: '#',
		variant: 'secondary',
	},
};
