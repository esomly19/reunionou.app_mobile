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
      <Label class="action-bar-title" text="Login"></Label>
    </ActionBar>

    <FlexboxLayout class="page">
      <StackLayout class="form">
        <Image class="logo" src="~/images/geo.png" />
        <Label class="header" text="Reunionou.app" />

        <StackLayout class="input-field" marginBottom="25">
          <TextField
            class="input"
            hint="Email"
            keyboardType="email"
            autocorrect="false"
            autocapitalizationType="none"
            v-model="user.email"
            returnKeyType="next"
            @returnPress="focusPassword"
            fontSize="18"
          />
          <StackLayout class="hr-light" />
        </StackLayout>

        <StackLayout v-show="!isLoggingIn" class="input-field">
          <TextField
            ref="prenom"
            class="input"
            hint="Prenom"
            v-model="user.nom"
            returnKeyType="done"
            fontSize="18"
          />
          <StackLayout class="hr-light" />
        </StackLayout>
        <StackLayout v-show="!isLoggingIn" class="input-field">
          <TextField
            ref="nom"
            class="input"
            hint="Nom"
            v-model="user.prenom"
            returnKeyType="done"
            fontSize="18"
          />
          <StackLayout class="hr-light" />
        </StackLayout>
        <StackLayout class="input-field" marginBottom="25">
          <TextField
            ref="password"
            class="input"
            hint="Mot de passe"
            secure="true"
            v-model="user.password"
            :returnKeyType="isLoggingIn ? 'fait' : 'suivant'"
            @returnPress="focusConfirmPassword"
            fontSize="18"
          />
          <StackLayout class="hr-light" />
        </StackLayout>
        <StackLayout v-show="!isLoggingIn" class="input-field">
          <TextField
            ref="confirmPassword"
            class="input"
            hint="Confirmer mot de passe"
            secure="true"
            v-model="user.confirmPassword"
            returnKeyType="done"
            fontSize="18"
          />
          <StackLayout class="hr-light" />
        </StackLayout>

        <Button
          :text="isLoggingIn ? 'Se connecter' : 'S\'inscrire'"
          @tap="submit"
          class="btn btn-primary m-t-20"
        />
      </StackLayout>

      <Label class="login-label sign-up-label" @tap="toggleForm">
        <FormattedString>
          <Span
            :text="
              isLoggingIn
                ? 'Vous n\'avez pas de compte ? '
                : 'Retour à la page de connexion'
            "
          />
          <Span :text="isLoggingIn ? 'S\'inscrire' : ''" class="bold" />
        </FormattedString>
      </Label>
    </FlexboxLayout>
  </Page>
</template>

<script>
import axios from "axios";
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";
import * as localStorage from "nativescript-localstorage";
import Home from "./Home";

export default {
  data() {
    return {
      isLoggingIn: true,
      user: {
        email: "",
        password: "",
        confirmPassword: "",
        nom: "",
        prenom: ""
      }
    };
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Settings");
  },
  computed: {
    message() {
      return "<!-- Login content goes here -->";
    }
  },
  methods: {
    toggleForm() {
      this.isLoggingIn = !this.isLoggingIn;
    },
    submit() {
      if (!this.user.email || !this.user.password) {
        this.alert("Veuillez indiquer une adresse email et un mot de passe.");
      }
      if (this.isLoggingIn) {
        this.login();
      } else {
        this.register();
      }
    },
    logine(user) {
      axios({
        method: "post",
        url: "https://warm-badlands-86536.herokuapp.com/connect",
        data: {
          email: user.email,
          password: user.password
        }
      })
        .then(result => {
          console.log(result);
          localStorage.setItem("connect", true);
          localStorage.setItem("id", result.data.id);
          localStorage.setItem("nom", this.nom);
          localStorage.setItem("email", user.email);
          this.$navigateTo(Home);
        })
        .catch(err => {
          console.error(err.message);
          this.alert("Malheureusement nous n'avons pas trouvé votre compte.");
        })
        .finally(() => {});
    },
    login() {
      this.logine(this.user);
    },
    registery(user) {
      axios({
        method: "post",
        url: "https://warm-badlands-86536.herokuapp.com/utilisateur",
        data: {
          email: user.email,
          password: user.password,
          prenom: this.user.prenom,
          nom: this.user.nom
        }
      })
        .then(result => {
          console.log(result);
          localStorage.setItem("connect", true);
          localStorage.setItem("nom", this.nom);
          localStorage.setItem("email", user.email);
          this.$navigateTo(Home);
        })
        .catch(err => {
          console.error(err.message);
          this.alert(
            "Malheureusement nous n'avaons pas pu créer votre compte."
          );
        })
        .finally(() => {});
    },
    register() {
      if (this.user.password != this.user.confirmPassword) {
        this.alert("Vos mots de passe ne sont pas identiques.");
        return;
      } else {
        this.registery(this.user);
      }
    },
    focusPassword() {
      this.$refs.password.nativeView.focus();
    },
    focusConfirmPassword() {
      if (!this.isLoggingIn) {
        this.$refs.confirmPassword.nativeView.focus();
      }
    },
    alert(message) {
      return alert({
        title: "GeoGussr",
        okButtonText: "OK",
        message: message
      });
    }
  },
  onDrawerButtonTap() {
    utils.showDrawer();
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "~@nativescript/theme/scss/variables/blue";
// End custom common variables
.page {
  align-items: center;
  flex-direction: column;
}
.form {
  margin-left: 30;
  margin-right: 30;
  flex-grow: 2;
  vertical-align: middle;
}
.logo {
  margin-bottom: 12;
  height: 90;
  font-weight: bold;
}
.header {
  horizontal-align: center;
  font-size: 25;
  font-weight: 600;
  margin-bottom: 70;
  text-align: center;
  color: lightblue;
}
.input-field {
  margin-bottom: 25;
}
.input {
  font-size: 18;
  placeholder-color: #a8a8a8;
}
.input-field .input {
  font-size: 54;
}
.btn-primary {
  height: 50;
  margin: 30 5 15 5;
  background-color: lightblue;
  color: black;
  border-radius: 5;
  font-size: 20;
  font-weight: 600;
}
.login-label {
  horizontal-align: center;
  color: #a8a8a8;
  font-size: 16;
}
.sign-up-label {
  margin-bottom: 20;
}
.bold {
  color: #000000;
}
</style>
