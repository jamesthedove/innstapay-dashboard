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
                  <h1 class="flex my-4 primary--text">Innstapay Dashboard</h1>
                </div>                
                <v-form>
                  <v-alert outline color="error" icon="warning" :value="error">
                    {{error}}
                  </v-alert>
                  <v-text-field append-icon="person" name="login" label="Email Address" type="text" v-model="username"></v-text-field>
                  <v-text-field @key="login" append-icon="lock" name="password" label="Password" id="password" type="password" v-model="password"></v-text-field>
                </v-form>
              </v-card-text>
                <v-btn @keyup.enter="login" block color="primary" @click="login" :loading="loading">Login</v-btn>
                <v-btn v-if="!loading" class="mt-3" @keyup.enter="login" block color="primary" @click="$router.push('/register')">Create an account</v-btn>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Parse from 'parse';
export default {
  data: () => ({
    loading: false,
    username: '',
    password: '',
    error: null
  }),

  watch: {
    username () {
      this.error = null;
    },
    password () {
      this.error = null;
    }
  },
  methods: {
    login () {
      this.loading = true;
      Parse.User.logIn(this.username, this.password).then(() => {
        window.getApp.$emit('APP_LOGIN_SUCCESS');
      }).catch((e) => {
        this.loading = false;
        this.error = e.message;
      });
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
