<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <!-- 
            Use the NavigationButton as a side-drawer button in Android
            because ActionItems are shown on the right side of the ActionBar
      -->
      <NavigationButton ios:visibility="collapsed" icon="res://menu" @tap="onDrawerButtonTap"></NavigationButton>
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
      <Label class="action-bar-title" text="Mes évenements"></Label>
    </ActionBar>
    <ListView for="event in events" @itemTap="onItemTap">
      <v-template>
        <Event :event="event"></Event>
      </v-template>
    </ListView>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import axios from "axios";
import Detail from "./Detail";
import Event from "./Event";
import SelectedPageService from "../shared/selected-page-service";

export default {
  components: { Event, Detail },
  data() {
    return {
      events: null
    };
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Featured");
    this.recupevents();
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    }
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    recupevents() {
      axios
        .get(
          "https://warm-badlands-86536.herokuapp.com/eventuser/" +
            localStorage.getItem("id")
        )
        .then(res => {
          console.log("Données" + res.data);
          this.events = res.data.events;
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
