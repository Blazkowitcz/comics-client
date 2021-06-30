<template>
  <v-container fluid>
    <v-row class="text-center">
      <v-col cols="12">
          <v-row dense>
            <v-col v-for="library in libraries" :key="library.title" :cols="4">
              <router-link :to=" $attrs.library + '/' + library.slug">
                <v-card @contextmenu="show(library.id, $event)">
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
                    <v-card-title>Add Librarys</v-card-title>
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
              <v-list-item v-for="(item, index) in items" :key="index">
                <v-list-item-title v-if="item.id === 0" @click="scanFolder()">{{ item.title }}</v-list-item-title>
                <v-list-item-title v-if="item.id === 1" @click="scanFolder()">{{ item.title }}</v-list-item-title>
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
      showMenu: false,
      x: 0,
      y: 0,
      collection_selected: 0,
      items: [
        { title: "Scan Folder", id: 0 },
        { title: "Set Picture", id: 1 },
      ],
      libraries: []
    }
  },
  methods: {
    getLibraries: function() {
      fetch(this.full_address + "collection/getAllFromLibrary", { 
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({slug: this.$attrs.library}),
          method: "POST"
        })
      .then((response) => response.json())
      .then((libraries) => {
        this.libraries = libraries;
      });
    },
    show(id, e) {
      e.preventDefault();
      this.collection_selected = id;
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    scanFolder() {
      fetch(this.full_address + "collection/scan", { 
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({id: this.collection_selected}),
          method: "POST"
        })
    }
  },
  mounted() {
    this.getLibraries();
  }
};
</script>
