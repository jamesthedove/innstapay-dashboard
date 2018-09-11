<template>
    <v-dialog persistent v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Add new business user</span>
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
                    <v-form ref="form">
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field :rules="emailRules" v-model="email" label="Email"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-select :rules="roleRules" label="Role" :items="roles" v-model="role"></v-select>
                        </v-flex>
                        <v-flex xs12 class="text-xs-center">
                            <v-btn :loading="loading" @click="add" color="success" depressed="">Add User</v-btn>
                        </v-flex>

                    </v-layout>
                    </v-form>
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
  name: 'add-business-user',
  data: () => ({
    email: '',
    role: '',
    roles: ['admin', 'operations', 'support', 'developer'],
    dialog: true,
    loading: false,
    error: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
    ],
    roleRules: [
      (v) => !!v || 'Role is required',
    ],
  }),
  methods: {
    async add () {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true;
          const business = await Util.getCurrentBusiness();
          console.log(business)
          const response = await Parse.Cloud.run('addBusinessUser', { email: this.email, businessId: business.id, role: this.role });
          Util.toast(response);
          this.$emit('done');
        } catch (e) {
          this.loading = false;
          Util.toast(e.message, false);
        }

      }
    },
    close () {
      this.$emit('done');
    }
  },

};
</script>