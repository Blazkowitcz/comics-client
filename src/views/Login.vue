<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-card>
          <v-col :cols="12">
            <v-text-field label="Login" solo v-model="username"></v-text-field>
          </v-col>
          <v-col :cols="12">
            <v-text-field
              type="password"
              label="Password"
              solo
              v-model="password"
            ></v-text-field>
          </v-col>
          <v-col :cols="12">
            <v-btn @click="login">Connection</v-btn>
            <v-btn @click="test">Test</v-btn>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import config from "../../config.json";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      full_address: config.daemon_address + ':' + config.daemon_port + '/',
      username: "",
      password: "",
    };
  },
  methods: {
    login: function () {
      fetch(this.full_address + "auth/signin", {
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("token", data.token);
          this.$router.push({
            path: "/",
          });
        });
    },
    test: function () {
      console.log(localStorage.getItem("token"));
    },
  },
};
</script>
