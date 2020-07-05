<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <!-- 
            Use the NavigationButton as a side-drawer button in Android
            because ActionItems are shown on the right side of the ActionBar
      -->
      <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="onBackTap" />

      <!-- 
            Use the ActionItem for IOS with position set to left. Using the
            NavigationButton as a side-drawer button in iOS is not possible,
            because its function is to always navigate back in the application.
      -->
      <ActionItem
        icon="res://menu"
        android:visibility="collapsed"
        @tap="onDrawerButtonTap"
        ios.position="left"
      ></ActionItem>
      <Label class="action-bar-title" :text="titre"></Label>
    </ActionBar>
    <StackLayout>
      <TextField
        v-model="namee"
        ref="nom"
        class="input"
        hint="Nom"
        returnKeyType="done"
        fontSize="18"
      />
      <button @tap="participer()">Participer</button>
    </StackLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import axios from "axios";
import SelectedPageService from "../shared/selected-page-service";

export default {
  props: ["tokenevent", "titre"],
  components: {},
  data() {
    return {
      events: null,
      namee: ""
    };
  },
  mounted() {},
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    }
  },
  methods: {
    onBackTap() {
      this.$navigateBack();
    },
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    participer() {
      axios
        .post("https://warm-badlands-86536.herokuapp.com/participe", {
          nom: this.namee,
          token: this.tokenevent
        })
        .then(res => {
          console.log(res.data);
          this.$emit("recupparticipants");
          this.$navigateBack();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "~@nativescript/theme/scss/variables/blue";
// End custom common variables

// Custom styles
</style>
