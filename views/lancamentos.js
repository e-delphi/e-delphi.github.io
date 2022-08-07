export default {
  data: () => ({
    name: 'lancamentos',
    apiURL: 'https://elated-cherry-08510.pktriot.net/api/real/',
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Código', align: 'end', value: 'id' },
      { text: 'Descrição', value: 'descricao' },
      { text: 'Data', align: 'center', value: 'data'},
      { text: 'Valor', align: 'end', value: 'valor' },
      { text: 'Grupo', align: 'end', value: 'grupo_id' },
      { text: 'Descrição', value: 'grupo_descricao' },
      { text: 'Ações', sortable: false, value: 'actions' },
    ],
    dados: [],
    editedIndex: -1,
    editedItem: {
      descricao: '',
      data: '',
      valor: 0,
      grupo_id: 0,
      grupo_descricao: ''
    },
    defaultItem: {
      descricao: '',
      data: '',
      valor: 0,
      grupo_id: 0,
      grupo_descricao: ''
    },
    search: '',
    rules: [
      value => !!value || 'Obrigatório',
      value => (value || '').length <= 50 || 'Máximo 50 characteres'
    ],
    headerProps: {
      sortByText: 'Ordenar'
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Adicionar' : 'Alterar'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      const getDados = async () => {
        await axios.get(this.apiURL +"lancamentos")
          .then((res) => { 
            this.dados = res.data
          })
          .catch(error => window.alert(error));
      };
      getDados();
    },

    editItem (item) {
      this.editedIndex = this.dados.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.dados.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      const deleteDados = async () => {
        await axios.delete(this.apiURL +"lancamento?id="+ this.dados[this.editedIndex].id)
          .then(() => {
            this.dados.splice(this.editedIndex, 1)
            this.closeDelete()
          })
          .catch(error => window.alert(error));
      };
      deleteDados();
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        const patchDados = async () => {
          await axios.patch(this.apiURL +"lancamento?id="+ this.dados[this.editedIndex].id, {
              descricao: this.editedItem.descricao,
              data: this.editedItem.data,
              valor: this.editedItem.valor,
              grupo_id: this.editedItem.grupo_id,
            })
            .then(() => {
              this.initialize()
            })
            .catch(error => window.alert(error));
        };
        patchDados();
      } else {
        const postDados = async () => {
          await axios.post(this.apiURL +"lancamento", { 
              descricao: this.editedItem.descricao,
              data: this.editedItem.data,
              valor: this.editedItem.valor,
              grupo_id: this.editedItem.grupo_id,
            })
            .then(() => {
              this.initialize()
            })
            .catch(error => window.alert(error));
        };
        postDados();
      }
      this.close()
    },
  },

  template: /*html*/`
    <v-data-table
      :headers="headers"
      :items="dados"
      sort-by="id"
      class="elevation-1"
      :footer-props="{itemsPerPageText: 'Itens por página', itemsPerPageOptions: [10, 25, 50, 100, -1], itemsPerPageAllText: 'Todos', pageText: '{0} a {1} de {2}'}"
      :search="search"
      :header-props="headerProps"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="purple"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                Adicionar
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="12"
                    >
                      <v-text-field
                        v-model="editedItem.descricao"
                        label="Descrição"
                        :rules="rules"
                        color="purple"
                        autofocus
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.data"
                        label="Data"
                        color="purple"
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.valor"
                        label="Valor"
                        color="purple"
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.grupo_id"
                        label="Grupo"
                        color="purple"
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.grupo_descricao"
                        label="Descrição"
                        color="purple"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="purple darken-1"
                  text
                  @click="close"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="purple darken-1"
                  text
                  @click="save"
                >
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Tem certeza de que deseja excluir?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="purple darken-1" text @click="closeDelete">Não</v-btn>
                <v-btn color="purple darken-1" text @click="deleteItemConfirm">Sim</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Pesquisar"
            single-line
            hide-details
            color="purple"
          ></v-text-field>
        </v-toolbar>
      </template>
      <!-- Formata data -->
      <template v-slot:item.data="{ item }">
        <span>{{ new Date(item.data).toLocaleString().substring(0, 10) }}</span>
      </template>
      <!-- Formata valor -->
      <template v-slot:item.valor="{ item }">
        <span>{{ item.valor.toLocaleString('pt-br', {minimumFractionDigits: 2}) }}</span>
      </template>
      <!-- Adiciona ações -->
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <!-- Sem dados -->
      <template v-slot:no-data>
        <v-btn
          color="purple"
          dark
          @click="initialize"
        >
          Recarregar
        </v-btn>
      </template>
    </v-data-table>
  `
}
