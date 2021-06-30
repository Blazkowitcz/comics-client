<template>
  <div class="read">
    <input @keyup.enter="test('second input', $event)" />
    <v-container fluid v-touch="{
          left: () => swipe('Left'),
          right: () => swipe('Right'),
          up: () => swipe('Up'),
          down: () => swipe('Down'),
        }" >
      <v-row
        class="text-center"
        
      >
        <v-col cols="12">
          <v-img
          @click="clickPage"
          class="lighten-2"
            contain
            v-bind:src="
              full_address + this.username + '/' + this.page
            "
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="space-around">
        <v-btn color="primary" @click="changePage('-')">Previous</v-btn>
        <v-btn color="primary" @click="changePage('+')">Next</v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>

import config from "../../config.json";
// @ is an alias to /src
export default {
  name: "Volume",
  components: {},
  data() {
    return {
      full_address: config.daemon_address + ':' + config.daemon_port + '/',
      page: "00",
      page_int: 0,
      username: "",
    };
  },
  methods: {
    nextItem() {
      if (event.keyCode === 37) {
        this.changePage('-');
      }
      if (event.keyCode === 39) {
        this.changePage('+');
      }
    },
    changePage(sign) {
      if(sign === '+' && this.page_int < 999){
        this.page_int++;
      } else if (sign === '-' && this.page_int > 0){
        this.page_int--;
      }
      this.page = this.page_int < 10 ? "0" + this.page_int : this.page_int;
      scroll(0,0)
      fetch(this.full_address + "volume/changePage", {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        method: "POST",
        body: JSON.stringify({
          page: this.page,
        }),
      });
    },
    clickPage() {
      this.changePage('+')
    },
    me() {
      fetch(this.full_address + "auth/me", {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        method: "GET",
      })
        .then((response) => response.json())
        .then((me) => {
          this.username = me.username;
          if (
            this.$attrs.collection === me.collection &&
            this.$attrs.volume === me.volume
          ) {
            let page = me.page > 10 ? me.page : "0" + me.page;
            this.page = page;
            this.page_int = me.page;
          }
        });
    },
    swipe(direction) {
      alert(direction);
    },
  },
  mounted() {
    document.addEventListener("keyup", this.nextItem);
    this.me();
  },
};
</script>