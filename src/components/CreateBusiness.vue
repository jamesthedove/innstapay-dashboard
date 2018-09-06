<template>
    <v-dialog persistent v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Create Business</span>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-alert outline color="error" icon="warning" :value="error">
                    {{error}}
                </v-alert>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field v-model="name"  label="Business Name" required></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="email" label="Business Email" ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="phone" label="Business Phone" ></v-text-field>
                        </v-flex>

                        <v-flex xs12>
                            <v-text-field v-model="address" label="Business Address" ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="website" label="Business Website"></v-text-field>
                        </v-flex>

                        <v-flex xs12 class="text-xs-center">
                            <v-btn :loading="loading" @click="create" color="success" depressed="">Create</v-btn>
                        </v-flex>

                    </v-layout>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>

</template>

<script>
import Parse from 'parse';
import Vue from 'vue';
import Util from '@/util';
export default {
  name: 'create-business',
  data: () => ({
    name: '',
    address: '',
    email: '',
    phone: '',
    website: '',
    loading: false,
    error: '',
    dialog: true
  }),
  methods: {
    close () {
      this.dialog = false;
      this.$emit('done');
    },
    async create () {
      try {
        this.loading = true;

        const res = await Parse.Cloud.run('createBusiness', {name: this.name, email: this.email, phone: this.phone, website: this.website, address: this.address});

        this.loading  = false;
        Util.toast(res)
        location.reload();
      }
      catch (e) {
        this.loading = false;
        this.error = e.message;
        Util.toast(e.message, false);
      }

    }
  },

};
</script>