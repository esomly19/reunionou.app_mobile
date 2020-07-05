
<template>
  <GridLayout colums="200, *">
    <Label col="1" :text="event.titre"></Label>
  </GridLayout>
</template>
<script>
export default {
  props: ["event"],
  data: function() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>
<style lang="scss" scoped></style>