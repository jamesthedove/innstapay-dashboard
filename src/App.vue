<template>
  <div id="appRoot">
    <template v-if="!$route.meta.public">
      <v-app id="inspire" class="app">
        <app-drawer class="app--drawer"></app-drawer>
        <app-toolbar class="app--toolbar"></app-toolbar>
        <create-business v-on:done="createBusiness = false" v-if="createBusiness"></create-business>
        <choose-business v-on:create="createNewBusiness" v-on:done="chooseBusiness = false" v-if="chooseBusiness"></choose-business>
        <v-content>
          <!-- Page Header -->
          <page-header v-if="$route.meta.breadcrumb"></page-header>
          <div class="page-wrapper">
            <router-view></router-view>
          </div>   
           <!-- App Footer -->
          <v-footer height="auto" class="white pa-3 app--footer">
            <span class="caption">Innstapay &copy; 2018</span>
          </v-footer>
        </v-content>
        <!-- Go to top -->
        <app-fab></app-fab>
        <!-- theme setting -->
      </v-app>
    </template>
    <template v-else>
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </template>
    <v-snackbar
      :timeout="3000"
      bottom
      left
      :color="snackbar.color"
      v-model="snackbar.show"
    >
      {{ snackbar.text }}
      <v-btn dark flat @click.native="snackbar.show = false" icon> 
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>    
  </div>
</template>
<script>
import AppDrawer from '@/components/AppDrawer';
import AppToolbar from '@/components/AppToolbar';
import AppFab from '@/components/AppFab';
import PageHeader from '@/components/PageHeader';
import menu from '@/api/menu';
import AppEvents from  './event';
import CreateBusiness from "@/components/CreateBusiness";
import ChooseBusiness from "./components/ChooseBusiness";
import Util from '@/util';
export default {
  components: {
      ChooseBusiness,
      CreateBusiness,
      AppDrawer,
    AppToolbar,
    AppFab,
    PageHeader
  },
  data: () => ({
    expanded: true,
    rightDrawer: false,
    createBusiness: false,
    chooseBusiness: false,
    snackbar: {
      show: false,
      text: '',
      color: '',
    }
  }),

  computed: {

  },
  mounted (){
    this.loadBusinesses();

  },

  created () {
    AppEvents.forEach(item => {
      this.$on(item.name, item.callback);
    });
    document.addEventListener('toast_success', (e) => {
        this.snackbar = {
            show: true,
            color: 'green',
            text: e.detail
        };
    }, false);
    document.addEventListener('toast_failure', (e) => {
        this.snackbar = {
            show: true,
            color: 'red',
            text: e.detail
        };
    }, false);
    window.getApp = this;
  },
  methods: {
    async loadBusinesses(){
        try{
            const business = await Util.getCurrentBusiness();
            if (!business){
                this.chooseBusiness = true;
            }
        } catch (e){

        }
    },
    openThemeSettings () {
      this.$vuetify.goTo(0);
      this.rightDrawer = (!this.rightDrawer);
    },
    createNewBusiness () {
      this.chooseBusiness = false;
      this.createBusiness = true;
    }
  },

};
</script>

<style lang="stylus">
  .page-wrapper
    min-height:calc(100vh - 64px - 50px - 81px );  


</style>
