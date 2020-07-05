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
      <Label class="action-bar-title" text="Search"></Label>
    </ActionBar>

    <StackLayout>
      <DockLayout width="210" height="50">
        <TextField
          v-model="search"
          ref="desc"
          class="input"
          hint="recherche"
          returnKeyType="done"
          fontSize="18"
        />
        <Button dock="left" @tap="searchd()">Search</Button>
      </DockLayout>
      <ListView v-if="!dada" for="event in events" @itemTap="onItemTap">
        <v-template>
          <Event :event="event"></Event>
        </v-template>
      </ListView>
      <Label v-if="dada">Pas d'événements avec le nom : {{search}}</Label>
    </StackLayout>
  </Page>
</template>

<script>
import axios from "axios";
import * as utils from "~/shared/utils";
import Detail from "./Detail";
import Event from "./Event";
import SelectedPageService from "../shared/selected-page-service";

export default {
  components: { Event, Detail },
  data() {
    return {
      events: null,
      page: 1,
      size: 10,
      numberofpages: 0,
      count: 0,
      search: "",
      dada: false
    };
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Search");
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
    searchd() {
      axios
        .get(
          "https://warm-badlands-86536.herokuapp.com/events/" +
            this.search +
            "?page=" +
            this.page +
            "&size=10"
        )
        .then(res => {
          this.count = res.data.count;
          this.numberofpages = res.data.nbpage;

          if (res.data.count === 0) {
            this.dada = true;
          } else {
            this.events = res.data.events;
          }

          console.log(this.events);
        })
        .catch(err => {
          console.log(err);
        });
    },
    onItemTap(args) {
      console.log(args);
      this.$navigateTo(Detail, {
        props: { event: args.item }
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
