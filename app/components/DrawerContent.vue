<template lang="html">
<GridLayout rows="auto, *" class="nt-drawer__content">
            <StackLayout  row="0" class="nt-drawer__header">
                <Image class="nt-drawer__header-image fas t-36" src.decode="font://&#xf2bd;"></Image>
                <Label v-show="connecter" class="nt-drawer__header-brand" :text="nom"></Label>
                <Label  v-show="connecter" class="nt-drawer__header-footnote" :text="email"></Label>
                <Label v-show="!connecter" class="nt-drawer__header-brand" text="guest"></Label>
                <Label  v-show="!connecter" class="nt-drawer__header-footnote" text="guest@email.com"></Label>
            </StackLayout>
        
            <ScrollView row="1" class="nt-drawer__body">
                <StackLayout>
                    <GridLayout columns="auto, *" :class="'nt-drawer__list-item' + (selectedPage === 'Home' ? ' -selected': '')" @tap="onNavigationItemTap(Home)">
                        <Label col="0" text.decode="&#xf015;" class="nt-icon fas"></Label>
                        <Label col="1" text="Home" class="p-r-10"></Label>
                    </GridLayout>

                    <GridLayout columns="auto, *" :class="'nt-drawer__list-item' + (selectedPage === 'Browse' ? ' -selected': '')" @tap="onNavigationItemTap(Browse)">
                        <Label col="0" text.decode="&#xf1ea;" class="nt-icon far"></Label>
                        <Label col="1" text="Browse" class="p-r-10"></Label>
                    </GridLayout>

                    <GridLayout columns="auto, *" :class="'nt-drawer__list-item' + (selectedPage === 'Search' ? ' -selected': '')" @tap="onNavigationItemTap(Search)">
                        <Label col="0" text.decode="&#xf002;" class="nt-icon fas"></Label>
                        <Label col="1" text="Search" class="p-r-10"></Label>
                    </GridLayout>

                    <GridLayout   v-show="connecter" columns="auto, *" :class="'nt-drawer__list-item' + (selectedPage === 'Featured' ? ' -selected': '')" @tap="onNavigationItemTap(Featured)">
                        <Label col="0" text.decode="&#xf005;" class="nt-icon fas"></Label>
                        <Label col="1" text="Mes évenements" class="p-r-10"></Label>
                    </GridLayout>
                    <GridLayout  v-if="connecter" columns="auto, *" :class="'nt-drawer__list-item' + (selectedPage === 'createEvent' ? ' -selected': '')" @tap="onNavigationItemTap(createEvent)">
                        <Label col="0" text.decode="&#xf005;" class="nt-icon fas"></Label>
                        <Label col="1" text="Creer Evenement" class="p-r-10"></Label>
                    </GridLayout>
                  
                    <StackLayout class="hr"></StackLayout>

                    <GridLayout  v-if="!connecter" columns="auto, *" :class="'nt-drawer__list-item' + (selectedPage === 'Settings' ? ' -selected': '')" @tap="onNavigationItemTap(Settings)">
                        <Label col="0" text.decode="&#xf013;" class="nt-icon fas"></Label>
                        <Label col="1" text="Login" class="p-r-10"></Label>
                    </GridLayout>
                   <GridLayout  v-if="connecter" columns="auto, *" :class="'nt-drawer__list-item' + (selectedPage === 'Settings' ? ' -selected': '')" @tap="deco()">
                        <Label col="0" text.decode="&#xf013;" class="nt-icon fas"></Label>
                        <Label col="1" text="Se Déconnecter" class="p-r-10"></Label>
                    </GridLayout>
                </StackLayout>
            </ScrollView>
        </GridLayout>
</template>

<script>
import Home from "./Home";
import * as localStorage from "nativescript-localstorage";
import Browse from "./Browse";
import Featured from "./Featured";
import createEvent from "./createEvent";
import Search from "./Search";
import Settings from "./Settings";
import * as utils from "~/shared/utils";
import SelectedPageService from "~/shared/selected-page-service";

export default {
  mounted() {
    SelectedPageService.getInstance().selectedPage$.subscribe(
      selectedPage => (this.selectedPage = selectedPage)
    );
  },
  data() {
    return {
      Home: Home,
      Browse: Browse,
      Featured: Featured,
      createEvent: createEvent,
      Search: Search,
      Settings: Settings,
      selectedPage: "",
      connect: localStorage.getItem("connect"),
      nom: localStorage.getItem("nom"),
      email: localStorage.getItem("email")
    };
  },
  components: {
    Home,
    Browse,
    Featured,
    createEvent,
    Search,
    Settings
  },
  methods: {
    deco() {
      localStorage.removeItem("connect");
      this.$navigateTo(Home);
    },
    onNavigationItemTap(component) {
      this.$navigateTo(component, {
        clearHistory: true
      });
      utils.closeDrawer();
    }
  },
  computed: {
    connecter() {
      return localStorage.getItem("connect");
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
