<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <!-- 
            Use the NavigationButton as a side-drawer button in Android
            because ActionItems are shown on the right side of the ActionBar
      -->
      <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="onBackTap" />
      <ActionItem
        ios.systemIcon="0"
        android.systemIcon="ic_menu_add"
        ios.position="right"
        @tap="addparticipants"
      ></ActionItem>
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
      <Label class="action-bar-title">Partcipants à {{titre}}</Label>
    </ActionBar>
    <ListView for="partcipant in participantes">
      <v-template>
        <Label :text="partcipant.nom"></Label>
      </v-template>
    </ListView>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import axios from "axios";
import AddParti from "./Addparticipant";
import SelectedPageService from "../shared/selected-page-service";

export default {
  props: ["tokenevent", "titre"],
  components: {},
  data() {
    return {
      events: null,
      participantes: null
    };
  },
  mounted() {
    this.recupparticipants();
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    }
  },
  methods: {
    addparticipants() {
      this.$navigateTo(AddParti, {
        props: {
          tokenevent: this.tokenevent,
          titre: this.titre
        }
      });
    },
    onBackTap() {
      this.$navigateBack();
    },
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    recupparticipants() {
      axios
        .get(
          "https://warm-badlands-86536.herokuapp.com/participants/" +
            this.tokenevent
        )
        .then(res => {
          console.log("Données" + res.data);
          this.participantes = res.data;
        })
        .catch(err => {
          console.log("CASSE");
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
