<template>
	<div>
		<h4 :title="hueAvailable ? 'Connected' : 'Disconnected' ">
			<i class="bi bi-lightbulb"
				:class="hueAvailable && online && token ? 'on': 'off'"></i>
				Hue {{ hueAvailable ? 'Connected' : 'Disconnected' }}
		</h4>
		<Button v-if="hueAvailable
			&& token
			&& devices
			&& devices.lights"
			class="m-t primary"
		>{{ lightLabel }} Lights</Button>
		<span v-if="bridgeAddressNotFound" class="m-r">
			<input v-model="bridgeAddress" type="text" placeholder="Hue Bridge IP">
		</span>
		<Button v-if="!hueAvailable || !token"
			class="danger"
			@click="registerToken()"
		>!</Button>
		<span v-if="loading" class="loading">Loading</span>
		<span v-if="errorMessage" class="error" v-text="errorMessage"></span>
	</div>
</template>
<script lang="ts">
import {
	Component, Vue, Watch,
} from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Button } from '@/components/atoms';
import { hueBridgeAddressStorageKey } from '@/constants/hue'

@Component({
	components: {
		Button,
	},
	computed: {
		...mapGetters({
			devices: 'hue/devices',
			token: 'hue/token',
			hueAvailable: 'hue/available',
			online: 'internet/online',
		}),
	},
})
export default class HueIntegration extends Vue {
	token!: string;

	hueAvailable!: boolean;

	loading: boolean = false;

	bridgeAddress: string = '';

	bridgeAddressNotFound = false;

	devices!: {
		lights: Object,
	};

	errorMessage: string = '';

	devicesTimeout!: ReturnType<typeof setTimeout>;

	// eslint-disable-next-line class-methods-use-this
	created() {
		if (!process.browser) {
			return;
		}
		if (localStorage.getItem(hueBridgeAddressStorageKey)) {
			this.bridgeAddress = localStorage.getItem(hueBridgeAddressStorageKey) as string;
			this.bridgeAddressNotFound = false;
		} else {
			this.bridgeAddressNotFound = true;
		}
	}

	@Watch('bridgeAddressNotFound')
	bridgeAddressChanged(found: boolean) {
		if (found) {
			this.devicesTimeout = setInterval(() => {
				this.detectDevices();
			}, 3000);
		} else {
			clearInterval(this.devicesTimeout);
		}
	}

	detectDevices() {
		this.$store.dispatch('hue/getDevices').catch((error: any) => {
			this.errorMessage = error.description;
		});
	}

	@Watch('bridgeAddress')
	commitBridgeAddress(address: string) {
		this.$store.commit('hue/SET_BRIDGE_ADDRESS', address);
		this.bridgeAddressNotFound = false;
		this.detectDevices();
	}

	registerToken() {
		if (this.bridgeAddressNotFound) {
			this.$store.commit('hue/SET_BRIDGE_ADDRESS', this.bridgeAddress);
			this.bridgeAddressNotFound = false;
		}
		if (this.token) {
			return;
		}
		this.loading = true;
		// eslint-disable-next-line no-alert
		alert('go to your Hue Bridge and click the link button (circle). When you have done that, click okay.');
		this.$store.dispatch('hue/registerToken').then(() => {
			this.errorMessage = '';
			this.$forceUpdate();
			this.loading = false;
		}).catch((error: any) => {
			this.errorMessage = error.description;
			this.loading = false;
		});
	}

	get lightLabel() {
		return this.devices && this.devices.lights ? Object.keys(this.devices.lights).length : 'No';
	}
}
</script>

<style lang="scss" scoped>
	.error {
		padding: 5px 7px;
		margin: 0;
		color: var(--danger);
	}

	.on { color: var(--success); }
	.off { color: var(--danger); }
</style>