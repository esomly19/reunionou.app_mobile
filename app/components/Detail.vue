<template>
  <Page>
    <ActionBar :title="event.titre">
      <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="onBackTap" />
      <ActionItem
        ios.systemIcon="12"
        android.systemIcon="ic_menu_search"
        ios.position="right"
        @tap="participants"
      ></ActionItem>
      <ActionItem
        ios.systemIcon="0"
        android.systemIcon="ic_menu_add"
        ios.position="right"
        @tap="commentaires"
      ></ActionItem>
    </ActionBar>
    <StackLayout>
      <ContentView height="85%" width="100%">
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
      </ContentView>
      <Label class="h2" :text="event.description"></Label>
      <Label class="text-center" :text="event.adresse"></Label>
      <Label class="text-center">Organisateur : {{nom}} {{prenom}}</Label>
      <Label v-if="meteook" class="text-center">{{meteod}} {{temp}}°c</Label>
      <Label
        v-if="!meteook"
        class="text-center"
      >Pas de données méteo pour cette événement, veuillez nous excusez.</Label>
    </StackLayout>
  </Page>
</template>
<script>
import axios from "axios";
import { Directions } from "nativescript-directions";
import Browse from "./Browse";
import Participants from "./Participants";
import Commentaires from "./Commentaires";
export default {
  props: ["event"],
  components: { Browse },
  data() {
    return {
      nom: "",
      map: null,
      prenom: "",
      meteod: null,
      temp: null,
      meteook: false
    };
  },
  computed: {},
  methods: {
    navigate() {
      directions
        .navigate({
          from: {
            // optional, default 'current location'
            lat: 52.215987,
            lng: 5.282764
          },
          to: {
            // either pass in a single object or an Array (see the TypeScript example below)
            address: "Hof der Kolommen 34, Amersfoort, Netherlands"
          }
          // for platform-specific options, see the TypeScript example below.
        })
        .then(
          function() {
            console.log("Maps app launched.");
          },
          function(error) {
            console.log(error);
          }
        );
    },
    onBackTap() {
      this.$navigateBack();
    },
    participants() {
      this.$navigateTo(Participants, {
        props: {
          tokenevent: this.event.token,
          titre: this.event.titre
        }
      });
    },
    commentaires() {
      this.$navigateTo(Commentaires, {
        props: {
          tokenevent: this.event.token,
          titre: this.event.titre
        }
      });
    },
    update(lul) {
      const newId = new Date().getTime();
      this.$showModal(updateSerie, { props: { serie: lul } }).then(newItem => {
        if (newItem) {
          console.log(newItem);
        }
      });
    },
    getPoi() {
      axios
        .get(
          `https://www.overpass-api.de/api/interpreter?data=[out:json][timeout:60];area["boundary"~"administrative"]["name"~` +
            this.event.ville +
            `];node(area)["amenity"~"bar"];out;`
        )
        .then(res => {
          console.log(res.data.elements);
          let poi = res.data.elements;
          poi.forEach((value, index) => {
            this.map.addMarkers([
              {
                lat: value.lat,
                lng: value.lon,
                title: value.name,
                subtitle: value.amenity,
                onCalloutTap: () => {
                  utils.openUrl(value.website);
                },
                properties: {
                  "marker-color": "#3bb2d0"
                }
              }
            ]);
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    getEvent() {
      axios
        .get(
          "https://warm-badlands-86536.herokuapp.com/user/" + this.event.iduser
        )
        .then(res => {
          console.log(res.data);
          this.nom = res.data.nom;
          this.prenom = res.data.prenom;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onMapReady(args) {
      this.map = args.map;

      args.map.setCenter({
        lat: parseFloat(this.event.x),
        lng: parseFloat(this.event.y),
        animated: true // default true
      });
      args.map.addMarkers([
        {
          "marker-color": "#0000ff",
          lat: this.event.x,
          lng: this.event.y,
          title: this.event.titre,
          subtitle: this.event.description,
          onCalloutTap: () => {
            utils.openUrl("https://www.thepolyglotdeveloper.com");
          }
        }
      ]);
    },
    meteo() {
      let apiKey = "a579a57df9601dfb8d080dbd25538189";

      let options = "&lang=fr" + "&units=metric";
      let weatherUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        this.event.ville +
        options +
        "&APPID=" +
        apiKey;
      console.log(weatherUrl);
      axios({
        method: "get",
        url: weatherUrl
      })
        .then(result => {
          console.log(result.data.weather);
          this.meteod = result.data.weather[0].description;
          let e = result.data.main.temp;
          this.temp = Math.floor(e);
          this.meteook = true;
        })
        .catch(err => {
          console.error(err.message);
        })
        .finally(() => {});
    }
  },
  mounted() {
    this.getEvent();
    this.meteo();
    this.getPoi();
  }
};
</script>