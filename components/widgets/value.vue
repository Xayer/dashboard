<template>
  <div>
    <div class="top">
      <span class="title" v-text="Title"></span>
      <span class="label" :class="labelColor" v-text="Label"></span>
    </div>
    <h1 class="value" v-text="Value"></h1>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { format } from 'timeago.js'
import AlphaVantage from '@/modules/apis/alpha'
import { StockPriceIntraDay } from "@/types/alpha-vantage/stock"

@Component
export default class ValueWidget extends Vue {
  @Prop() private settings!: { value: string; title: string; label: string }
    apiData: { price: string; updated: string; name: string} | null = null;
    price = '';


  get labelColor() {
    return Number.parseFloat(this.settings.label || '0') > -1
      ? 'positive'
      : 'negative'
  }

  get Title() {
    return this.apiData?.name || this.settings.title
  }

  get Label() {
    return this.apiData?.updated ? format(new Date(this.apiData?.updated)) : this.settings.label
  }

  get Value() {
      return this.apiData?.price ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(this.apiData.price)) :this.settings.value;
  }

  created() {
    this.formatStockValue()
  }

  async fetchStocks() {
    if(!this.apiData) {
        const client = new AlphaVantage()
      const { data } = await client.getRecentStocks();
      const prices = Object.values((data as StockPriceIntraDay)["Time Series (5min)"])
      const meta = (data as StockPriceIntraDay)["Meta Data"];
     this.apiData = {
       price: prices[0]["1. open"],
       name: meta["2. Symbol"],
        updated: meta["3. Last Refreshed"]
     };

      // this.apiData = data;
      return data;
    }
    return this.apiData;
  }

  async formatStockValue() {
    await this.fetchStocks();
  }
}
</script>
<style lang="scss" scoped>
div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: -var(--padding);
  .top {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    .title {
      font-size: 10px;
      font-weight: var(--weight-bold);
      text-transform: uppercase;
    }
    .label {
      font-size: 10px;
      font-weight: var(--weight-bold);
      text-transform: uppercase;
    }
  }
  .value {
    font-weight: var(--weight-thin);
    text-align: right;
  }

  .positive {
    color: var(--accent-success);
  }
  .negative {
    color: var(--accent-danger);
  }
}
</style>
