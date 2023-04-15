import { h, defineComponent, ref, VNode, computed, watch } from 'vue';
import { default as Page } from './page';
import { default as Navigation } from './navigation';

const processPages = (defaultSlot, props, { active }) => {
	const pageNodes = defaultSlot();
	const keys = [];
	const pages = pageNodes.map((node: VNode, index: number) => {
		const key = node?.props?.id ?? `${props.prefix}${index + 1}`;
		keys.push(key);

		return h(
			Page,
			{
				id: key,
				class: [!props.disableClasses && 'vue3-fullpage__page', props.pageClass],
				key,
				index,
				active: active.value,
				updateHistory: props.updateHistory,
				'onUpdate:active': ($event: number) => (active.value = $event)
			},
			{
				default: () => node
			}
		);
	});

	return {
		pages,
		keys
	};
};

export default defineComponent({
	props: {
		/**
		 * Do not add any of the component classes (besides state-related ones)
		 */
		disableClasses: {
			type: Boolean,
			default: false
		},
		/**
		 * Size of the navigation dots, accepts any CSS value
		 */
		navigationSize: {
			type: [String, Number],
			default: '1rem'
		},
		/**
		 * Gap between the navigation dots on the sidebar
		 */
		navigationGap: {
			type: String,
			default: '0.5rem'
		},
		/**
		 * Colour of the main navigation dots
		 */
		navigationColour: {
			type: String,
			default: 'currentColor'
		},
		/**
		 * Opacity of the outer rings on the navigation dots
		 */
		navigationOpacityOuter: {
			type: [Number, String],
			default: 0.2
		},
		/**
		 * Opacity of the outer rings of nav dots when hovered
		 */
		navigationOpacityOuterHover: {
			type: [Number, String],
			default: 0.3
		},
		/**
		 * Opacity of the outer rings of nav dots when active
		 */
		navigationOpacityOuterActive: {
			type: [Number, String],
			default: 0.4
		},
		/**
		 * Colour of the dot when the page is active
		 */
		activeColour: {
			type: String,
			default: 'crimson'
		},
		/**
		 * Push the current page hash to the browser history
		 */
		updateHistory: {
			type: Boolean,
			default: false
		},
		/**
		 * Prefix for the page keys
		 */
		prefix: {
			type: String,
			default: 'page-'
		},
		/**
		 * Disables rendering of the page navigation bar
		 */
		hideNavigation: {
			type: Boolean,
			default: false
		},
		/**
		 * Tag to use when rendering the page wrapper
		 */
		tag: {
			type: String,
			default: 'div'
		},
		/**
		 * Apply class string to all pages
		 */
		pageClass: {
			type: String,
			default: ''
		},
		/**
		 * Apply class string to navigation element
		 */
		navigationClass: {
			type: String,
			default: ''
		},
		/**
		 * Apply class string to all navigation dot elements
		 */
		navigationDotClass: {
			type: String,
			default: ''
		},
		/**
		 * Apply class string to all navigation dot inner elements
		 */
		navigationDotInnerClass: {
			type: String,
			default: ''
		},
		/**
		 * The currently active page index
		 */
		modelValue: {
			type: Number,
			default: 0
		}
	},
	emits: ['update:modelValue', 'page-enter', 'page-leave'],
	setup(props, { slots, emit }) {
		const active = ref(props.modelValue ? props.modelValue - 1 : 0);
		const { pages, keys } = processPages(slots.default, props, {
			active
		});

		watch(
			() => props.modelValue,
			(v) => (active.value = v ? v - 1 : 0)
		);
		watch(active, (newValue, oldValue) => {
			emit('update:modelValue', newValue + 1);
			if (oldValue || oldValue === 0) emit('page-leave', oldValue + 1);
			emit('page-enter', newValue + 1);
		});

		const changePage = (v: number) => {
			active.value = v;
			const key = pages[v].key;
			const el = document.querySelector(`#${key}`);
			el.scrollIntoView({
				behavior: 'smooth'
			});
		};

		const normalisedNavigationSize = computed(() =>
			typeof props.navigationSize === 'number' || /\D/.test(props.navigationSize) === false
				? `${props.navigationSize}px`
				: props.navigationSize
		);

		return () => {
			return h(
				props.tag,
				{
					class: [!props.disableClasses && 'vue3-fullpage__wrapper'],
					style: {
						'--v3fp-total-pages': pages.length,
						'--v3fp-active-page': active.value + 1,
						'--v3fp-navigation-gap': props.navigationGap,
						'--v3fp-navigation-colour': props.navigationColour,
						'--v3fp-navigation-size': normalisedNavigationSize.value,
						'--v3fp-navigation-colour--active': props.activeColour,
						'--v3fp-navigation-opacity--outer': props.navigationOpacityOuter,
						'--v3fp-navigation-opacity--outer__hover': props.navigationOpacityOuterHover,
						'--v3fp-navigation-opacity--outer__active': props.navigationOpacityOuterActive
					}
				},
				[
					...pages,
					!props.hideNavigation &&
						h(Navigation, {
							class: props.navigationClass,
							dotClass: props.navigationDotClass,
							dotInnerClass: props.navigationDotInnerClass,
							disableClasses: props.disableClasses,
							pages: pages.length,
							pageKeys: keys,
							active: active.value,
							'onUpdate:active': changePage
						})
				]
			);
		};
	}
});
