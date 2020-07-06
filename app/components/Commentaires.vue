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
      <Label class="action-bar-title">Commentaires pour {{titre}}</Label>
    </ActionBar>
    <ListView for="commentaire in commentaires">
      <v-template>
        <Label>{{commentaire.nom}} dit {{commentaire.commentaire}}</Label>
      </v-template>
    </ListView>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import axios from "axios";
import AddCommentaires from "./AddCommentaires";
import SelectedPageService from "../shared/selected-page-service";

export default {
  props: ["tokenevent", "titre"],
  components: {},
  data() {
    return {
      events: null,
      commentaires: null
    };
  },
  mounted() {
    this.recupcommentaires();
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    }
  },
  methods: {
    addparticipants() {
      this.$navigateTo(AddCommentaires, {
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
    recupcommentaires() {
      axios
        .get(
          "https://warm-badlands-86536.herokuapp.com/commentaires/" +
            this.tokenevent
        )
        .then(res => {
          console.log("Données" + res.data);
          this.commentaires = res.data.comments;
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
