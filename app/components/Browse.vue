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
      <Label class="action-bar-title" text="Browse"></Label>
    </ActionBar>
    <StackLayout>
      <ListView for="event in events" @itemTap="onItemTap">
        <v-template>
          <Event :event="event"></Event>
        </v-template>
      </ListView>
      <DockLayout width="210" height="50">
        <Button dock="left" class="page-link" @tap="previousPage()">previous</Button>
        <Button dock="right" class="page-link" @tap="nextPage()">next</Button>
      </DockLayout>
    </StackLayout>
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
      events: null,
      page: 1,
      size: 10,
      numberofpages: 0,
      count: 0
    };
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Browse");
    this.recupevents();
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    }
  },
  methods: {
    nextPage() {
      if (this.page + 1 > this.numberofpages) {
        this.page = this.numberofpages;
      } else {
        this.page++;
      }
      this.recupevents();
    },
    previousPage() {
      if (this.page - 1 < 1) {
        this.page = 1;
      } else {
        this.page--;
      }
      this.recupevents();
    },
    onItemTap(args) {
      console.log(args);
      this.$navigateTo(Detail, {
        props: { event: args.item }
      });
    },
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    recupevents() {
      axios
        .get(
          "https://warm-badlands-86536.herokuapp.com/events?page=" +
            this.page +
            "&size=10"
        )
        .then(res => {
          console.log(res.data);
          this.count = res.data.count;
          this.numberofpages = res.data.nbpage;
          this.events = res.data.events;
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
