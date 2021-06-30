<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-row dense>
          <v-col v-for="library in libraries" :key="library.title" :cols="3">
            <router-link :to="'content/' + library.slug">
              <v-card>
                <v-img
                  :src="library.logo_url"
                  class="white--text align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  height="200px"
                >
                  <v-card-title v-text="library.title"></v-card-title>
                </v-img>
              </v-card>
            </router-link>
          </v-col>
          <v-col :cols="3">
            <v-card>
              <v-img
                src="https://icons-for-free.com/iconfiles/png/512/add+character+increase+math+plus+sign+icon-1320184998988139546.png"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              >
                <v-card-title>Add Library</v-card-title>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import config from "../../config.json";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      full_address: config.daemon_address + ':' + config.daemon_port + '/',
      libraries: [],
    };
  },
  methods: {
    getLibraries: function () {
      fetch(this.full_address + "library/getAll", {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (response.status === 401) {
            this.$router.push({ name: "Login" });
          } else if (response.status === 500) {
            console.log(response.json());
          } else {
            return response.json();
          }
        })
        .then((libraries) => {
          this.libraries = libraries;
        });
    },
  },
  mounted() {
    this.getLibraries();
  },
};
</script>
