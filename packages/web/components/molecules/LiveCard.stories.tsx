import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import LiveCard from './LiveCard';

type Props = {}

export default {
  title: 'Molecules/LiveCard',
  component: LiveCard,
  argTypes: {},
} as Meta;

const Template: Story<Props> = (args) => <LiveCard {...args} />;
export const Default = Template.bind({});