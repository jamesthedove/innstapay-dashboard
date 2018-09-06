<template>
  <div class="ma-3">
    <v-tabs
            fixed-tabs
            v-model="active"
            dark
            color="primary"
    >
      <v-tab
              key="profile"
              ripple
      >
        Profile
      </v-tab>
      <v-tab
              key="business"
              ripple
      >
        Business
      </v-tab>
      <v-tab
              key="preferences"
              ripple
      >
        Preferences
      </v-tab>
      <v-tab
              key="api"
              ripple
      >
        Api
      </v-tab>
      <v-tab
              key="users"
              ripple
      >
        Users
      </v-tab>
      <v-tab-item
              key="profile"
      >
        <profile-settings></profile-settings>
      </v-tab-item>
      <v-tab-item
              key="business"
      >
        <business-settings></business-settings>
      </v-tab-item>
      <v-tab-item
              key="preferences"
      >
        <business-preferences></business-preferences>
      </v-tab-item>
      <v-tab-item
              key="api"
      >
       <api-settings></api-settings>
      </v-tab-item>
      <v-tab-item
              key="users"
      >
       <user-settings></user-settings>
      </v-tab-item>
    </v-tabs>

  </div>
</template>

<script>
import Parse from 'parse';
import moment from 'moment';
import Util from '@/util';
import ProfileSettings from '@/components/settings/Profile';
import BusinessSettings from '@/components/settings/Business';
import BusinessPreferences from '@/components/settings/Preferences';
import ApiSettings from '@/components/settings/Api';
import UserSettings from '@/components/settings/Users';
export default {
    components: {
        UserSettings,
        ApiSettings,
        BusinessPreferences,
        BusinessSettings,
        ProfileSettings},
    data () {
    return {
        active: null,
        firstName: '',
        lastName: '',
        phone: '',
        email: ''

    };
  },
  mounted () {
    this.load();
  },
  methods: {
    async load () {
    },
    next () {
      const active = parseInt(this.active);
      this.active = (active < 2 ? active + 1 : 0)
    }
  },
};
</script>
