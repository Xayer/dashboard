<template>
  <section><slot /></section>
</template>
<style lang="scss" scoped>
section {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--padding);
  @media only screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    grid-auto-flow: row;
  }
}
</style>
