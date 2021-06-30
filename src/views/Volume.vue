<template>
  <v-container fluid>
    <v-row class="text-center">
      <v-col cols="12">AAA</v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12">
        <v-row dense>
          <v-col v-for="volume in volumes" :key="volume.title" :cols="4">
            <v-card @contextmenu="show(volume.id, $event)">
              <v-img
                :src="volume.logo_url"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
                @click="openVolume(volume.slug)"
              >
                <v-card-title
                  >{{ trimText(volume.title)
                  }}<v-chip
                  style="margin-left: 10px"
                    v-if="volume.read == 1"
                    color="green"
                    text-color="white"
                    >Read</v-chip
                  >
                  <v-chip
                    v-if="volume.on_reading == 1"
                    color="orange"
                    text-color="white"
                    >On Reading</v-chip
                  ></v-card-title
                >
              </v-img>
            </v-card>
          </v-col>
          <v-menu
            v-model="showMenu"
            :position-x="x"
            :position-y="y"
            absolute
            offset-y
          >
            <v-list>
              <v-list-item v-for="(item, index) in items" :key="index" @click="markAsRead()">
                <v-list-item-title >{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import config from "../../config.json";

export default {
  name: "Collection",
  components: {},
  data() {
    return {
      full_address: config.daemon_address + ':' + config.daemon_port + '/',
      volumes: [],
      showMenu: false,
      x: 0,
      y: 0,
      items: [
        { title: "Mark as read" },
      ],
      volume_selected: 0
    };
  },
  methods: {
    getLibraries: function () {
      fetch(this.full_address + "volume/getAllFromCollection", {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({ slug: this.$attrs.collection }),
        method: "POST",
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
        .then((volumes) => {
          this.volumes = volumes;
        });
    },
    openVolume: function (slug_volume) {
      fetch(this.full_address + "volume/open", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          library_slug: this.$attrs.library,
          collection_slug: this.$attrs.collection,
          volume_slug: slug_volume,
        }),
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
        .then(() => {
          this.$router.push({
            path: this.$attrs.collection + "/" + slug_volume,
          });
        });
    },
    show(id, e) {
      e.preventDefault();
      this.volume_selected = id;
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    markAsRead() {
      fetch(this.full_address + "volume/markAsRead", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          volume_id: this.volume_selected
        }),
      })
    },
    trimText(text) {
      return text.replace(/\s*\(.*?\)\s*/g, '').replace(/(\[.+\])/g, '')
    }
  },
  mounted() {
    this.getLibraries();
  },
};
</script>