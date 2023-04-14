import { it, expect } from 'vitest';
import { Vue3Fullpage } from '../src';
import { mount } from '@vue/test-utils';

it('renders', () => {
	const wrapper = mount(Vue3Fullpage, {
		slots: {
			default: ['<section>One</section>', '<section>Two</section>', '<section>Three</section>']
		}
	});

	expect(wrapper.findAll('.vue3-fullpage__wrapper')).toHaveLength(1);
});
