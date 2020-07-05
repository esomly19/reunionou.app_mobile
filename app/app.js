import Vue from "nativescript-vue";
import App from "./components/App";
import Home from "./components/Home";
import DrawerContent from "./components/DrawerContent";
import RadSideDrawer from "nativescript-ui-sidedrawer/vue";
import { handleOpenURL } from 'nativescript-urlhandler';
Vue.use(RadSideDrawer);
Vue.registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView);
Vue.config.silent = (TNS_ENV === 'production');


new Vue({
  mounted() {
    handleOpenURL((appURL) => {
      console.log(appURL) // here you can get your appURL path etc and map it to a component... eg path === 'Settings. In this example I've just hardwired it in.
      this.$navigateTo(Home);
    });
  },
  render(h) {
    return h(

      App,
      [
        h(DrawerContent, { slot: 'drawerContent' }),
        h(Home, { slot: 'mainContent' })
      ]
    )
  }
}).$start();
