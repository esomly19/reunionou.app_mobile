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
      <Label class="action-bar-title" text="Reunionou.app"></Label>
      <ActionItem
        @tap="creeevent()"
        ios.systemIcon="0"
        android.systemIcon="ic_menu_add"
        ios.position="right"
      ></ActionItem>
    </ActionBar>

    <GridLayout class="page__content">
      <StackLayout>
        <TextField
          v-model="name"
          ref="nom"
          class="input"
          hint="Nom"
          returnKeyType="done"
          fontSize="18"
        />
        <TextField
          v-model="description"
          ref="desc"
          class="input"
          hint="description"
          returnKeyType="done"
          fontSize="18"
        />
        <DatePicker v-model="selectedDate" />
        <DockLayout width="210" height="50">
          <Switch dock="left" v-model="publik" />
          <Label dock="right">Evénément {{check}}</Label>
        </DockLayout>

        <TextField
          ref="desc"
          class="input"
          hint="adresse"
          returnKeyType="done"
          fontSize="18"
          v-model="adresse"
        />
        <button @tap="getlocation()">Adresse</button>

        <Mapbox
          accessToken="pk.eyJ1IjoiZXNvbWx5IiwiYSI6ImNrYnczMnV2ZDBjMWcyeHRib2pjanFiaXUifQ.M7npNPLrm84MHsSRWKSmQw"
          mapStyle="traffic_night"
          hideCompass="true"
          zoomLevel="12"
          showUserLocation="false"
          disableZoom="false"
          disableRotation="false"
          disableScroll="false"
          disableTilt="false"
          @mapReady="onMapReady($event)"
        ></Mapbox>
      </StackLayout>
    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";
import * as localStorage from "nativescript-localstorage";
import axios from "axios";
import Home from "./Home";
export default {
  data() {
    return {
      selectedDate: new Date(),
      name: "",
      description: "",
      resultats: [],
      erreur: false,
      map: null,
      adresse: "",
      ville: null,
      publik: false,
      positionCentre: { lat: 45.8566969, lng: 3.3514616 }
    };
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Home");
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    },
    check: function() {
      if (this.publik) {
        return "publique";
      } else {
        return "privé";
      }
    }
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    onMapReady(args) {
      this.map = args.map;

      args.map.setCenter({
        lat: this.positionCentre.lat,
        lng: this.positionCentre.lng,
        animated: true // default true
      });
    },
    getlocation() {
      axios
        .get(
          "https://nominatim.openstreetmap.org/search?q=" +
            encodeURIComponent(this.adresse) +
            "&format=json&polygon=1&addressdetails=1&limit=1"
        )
        .then(response => {
          //console.log(response.data[0].lat);

          this.resultats = response.data;
          if (typeof response.data[0].address.town !== "undefined") {
            this.ville = response.data[0].address.town;
          } else {
            this.ville = response.data[0].address.city;
          }
          console.log("Ville " + this.ville);
          this.positionCentre.lat = parseFloat(response.data[0].lat);
          this.positionCentre.lng = parseFloat(response.data[0].lon);
          this.map.setCenter({
            lat: this.positionCentre.lat,
            lng: this.positionCentre.lng,
            animated: true // default true
          });
          this.map.addMarkers([
            {
              "marker-color": "#0000ff",
              lat: this.positionCentre.lat,
              lng: this.positionCentre.lng,
              title: "kk",
              subtitle: "ddd",
              onCalloutTap: () => {
                utils.openUrl("https://www.thepolyglotdeveloper.com");
              }
            }
          ]);
        })
        .catch(error => {
          console.log(error);
          this.erreur = true;
          console.log("33");
        })
        .finally(() => {
          console.log("bruhh");
        });
    },
    creeevent() {
      if (this.publik) {
        this.state = 0;
      } else {
        this.state = 1;
      }
      axios
        .post("https://warm-badlands-86536.herokuapp.com/event", {
          titre: this.name,
          description: this.description,
          date: this.selectedDate,
          etat: this.state,
          x: this.positionCentre.lat.toString(),
          y: this.positionCentre.lng.toString(),
          adresse: this.adresse,
          ville: this.ville,
          iduser: localStorage.getItem("id")
        })
        .then(res => {
          console.log(res.data);
          this.$navigateTo(Home);
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
