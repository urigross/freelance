<template>
  <section class="gig-tags">
    <div>{{ tags[0] }}</div>
    <div>{{ tags[1] }}</div>
  </section>
</template>

<script>
export default {
  props: ["tags"],
};
</script>