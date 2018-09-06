<template>
    <v-card flat>
        <v-card-text>

            <v-layout wrap>
                <v-flex xs6>
                    <v-text-field v-model="firstName" label="First Name">
                    </v-text-field>
                </v-flex>
                <v-flex xs6>
                    <v-text-field v-model="lastName" class="pl-1" label="Last Name">
                    </v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field label="Phone Number" v-model="phone">

                    </v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field label="Email" v-model="email">

                    </v-text-field>
                </v-flex>
                <div class="text-xs-center">
                    <v-btn @click="update" :loading="loading" color="success" flat>Save Changes</v-btn>
                </div>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script>
import Parse from 'parse';
import moment from 'moment';
import Util from '@/util';
export default {
  name: 'profile-settings',
  data () {
    return {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      loading: false,

    };
  },
  mounted () {
    const user = Util.getCurrentUser();
    this.firstName = user.get('firstName');
    this.lastName = user.get('lastName');
    this.phone = user.get('phone');
    this.email = user.get('email');
  },
  methods: {
    async update () {
      this.loading = true;
      try {
        const response = await Parse.Cloud.run('updateUserProfile', { firstName: this.firstName, lastName: this.lastName, phone: this.phone, email: this.email });
        Util.toast(response);
        Parse.User.current().fetch();
      } catch (e) {
        Util.toast(e.message, false);
      }
      finally {
        this.loading = false;
      }
    }
  },
};
</script>
