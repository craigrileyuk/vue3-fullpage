import { h, defineComponent, ref } from 'vue';
import { default as Page } from './page';
import { default as Navigation } from './navigation';

const processPages = (defaultSlot, props, { active }) => {
	const pageNodes = defaultSlot();
	const pages = pageNodes.map((node, index) => {
		const key = node?.props?.id ?? `${props.prefix}${index + 1}`;

		return h(
			Page,
			{
				id: key,
				class: 'vue3-fullpage__page',
				key,
				index,
				active: active.value,
				updateHistory: props.updateHistory,
				'onUpdate:active': ($event) => (active.value = $event)
			},
			{
				default: () => node
			}
		);
	});

	return {
		pages
	};
};

export default defineComponent({
	props: {
		navigationGap: {
			type: String,
			default: '0.5rem'
		},
		navigationColour: {
			type: String,
			default: 'currentColor'
		},
		activeColour: {
			type: String,
			default: 'crimson'
		},
		updateHistory: {
			type: Boolean,
			default: false
		},
		prefix: {
			type: String,
			default: 'page-'
		},
		hideNavigation: {
			type: Boolean,
			default: false
		},
		tag: {
			type: String,
			default: 'div'
		}
	},
	setup(props, { slots, attrs }) {
		const active = ref(0);
		const { pages } = processPages(slots.default, props, {
			active
		});

		const changePage = (v) => {
			active.value = v;
			const key = pages[v].key;
			const el = document.querySelector(`#${key}`);
			el.scrollIntoView({
				behavior: 'smooth'
			});
		};

		return () => {
			return h(
				props.tag,
				{
					class: 'vue3-fullpage__wrapper',
					style: {
						'--v3fp-total-pages': pages.length,
						'--v3fp-navigation-gap': props.navigationGap,
						'--v3fp-navigation-colour': props.navigationColour,
						'--v3fp-navigation-colour--active': props.activeColour
					}
				},
				[
					...pages,
					!props.hideNavigation &&
						h(Navigation, {
							pages: pages.length,
							active: active.value,
							'onUpdate:active': changePage
						})
				]
			);
		};
	}
});
