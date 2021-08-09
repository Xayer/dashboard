<template>
    <div>Settings {{ this.slug }}</div>
</template>
<script>
  export default {
    asyncData({ params }) {
      const slug = params.slug
      return { slug }
    }
  }
</script>