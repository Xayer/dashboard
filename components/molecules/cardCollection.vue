<template>
  <section><slot /></section>
</template>
<style lang="scss" scoped>
section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--padding);
}
</style>
