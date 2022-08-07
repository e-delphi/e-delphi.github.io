import grupos from '../views/grupos.js';
import lancamentos from '../views/lancamentos.js';

const App = {
  name: 'App',
  components: {
    grupos,
    lancamentos
  },
  data() {
    return {
      tabs: null,
    };
  },
  template: /*html*/`
    <v-app>
      <v-main>
        <v-container>

        <v-card>
            <v-toolbar 
              color="purple"
              dark
              flat
            >
              <v-toolbar-title>Real</v-toolbar-title>
              <template v-slot:extension>
                <v-tabs v-model="tabs">
                  <v-tab :key="0">Grupos</v-tab>
                  <v-tab :key="1">Lançamentos</v-tab>
                </v-tabs>
              </template>
            </v-toolbar>
            <v-tabs-items v-model="tabs">       
              <v-tab-item>
                <v-card flat>
                  <grupos></grupos>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <lancamentos></lancamentos>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>

        </v-container>
      </v-main>
    </v-app>
  `,
};

new Vue({
  vuetify: new Vuetify(),
  render: h => h(App)
}).$mount('#app');
