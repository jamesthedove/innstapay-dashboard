<template>
  <v-app id="login" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="/static/m.png" alt="Vue Material Admin" width="120" height="120">
                  <h1 class="flex my-4 primary--text">Join Innstapay</h1>
                </div>                
                <v-form ref="form">
                  <v-alert outline color="error" icon="warning" :value="error">
                    {{error}}
                  </v-alert>
                  <v-layout row wrap>
                    <v-flex xs6>
                      <v-text-field class="pr-2" append-icon="person" name="login" label="First Name" type="text" v-model="firstName"></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field append-icon="person" label="Last Name" type="text" v-model="lastName"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-text-field :disabled="!!token" append-icon="person" :rules="emailRules" label="Email Address" type="text" v-model="email"></v-text-field>
                  <v-text-field append-icon="person" label="Phone Number" type="text" v-model="phone"></v-text-field>
                  <v-text-field append-icon="lock" :rules="passwordRules" name="password" label="Password" id="password" type="password" v-model="password"></v-text-field>
                </v-form>
              </v-card-text>
                <v-btn @keyup.enter="login" :loading="loading" block color="primary" @click="register">Create an account</v-btn>
                <v-btn v-if="!loading" class="mt-3" @keyup.enter="login" block color="primary" @click="$router.push('/login')">Login Instead</v-btn>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Parse from 'parse';
import Util from '@/util';

export default {
  data: () => ({
    loading: false,
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    token: '',
    error: null,
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
    ],
    passwordRules: [
      (v) => !!v || 'Password is required',
      (v) => (v && v.length >= 8) || 'Password must be at least 8 characters'
    ],

  }),

  watch: {
    username () {
      this.error = null;
    },
    password () {
      this.error = null;
    }
  },
  mounted(){
    const token = Util.getParameterByName('it');
    const email = Util.getParameterByName('e');

    if (token && email){
        this.token = token;
        this.email = email;
    }
  },
  methods: {
    register () {
      if (this.$refs.form.validate()) {
        this.loading = true;

        Parse.User.logOut().then(() => {
          return Parse.Cloud.run('createUser', { token: this.token, email: this.email, password: this.password, firstName: this.firstName, lastName: this.lastName, phone: this.phone });
        }).then(() => {
          return Parse.User.logIn(this.email, this.password);
        }).then(() => {
          // logged in
          window.getApp.$emit('APP_LOGIN_SUCCESS');
        }).catch((e) => {
          this.loading = false;
          this.error = e.message;
        });
      }

    }
  }

};
</script>
<style scoped lang="css">
  #login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
</style>
