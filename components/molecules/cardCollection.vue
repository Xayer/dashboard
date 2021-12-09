<template>
  <section><slot /></section>
</template>
<style lang="scss" scoped>
section {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--padding);
  @media only screen and (max-width: 1024px) {
    body {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>
