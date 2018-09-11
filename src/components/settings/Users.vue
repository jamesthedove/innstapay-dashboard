<template>
    <div>
        <add-business-user v-if="addUser" v-on:done="addUser = false"></add-business-user>
        <v-toolbar card color="white">
            <v-text-field
                    flat
                    solo
                    prepend-icon="search"
                    placeholder="Name, email or role"
                    v-model="search"
                    hide-details
                    class="hidden-sm-and-down"
            ></v-text-field>
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table
                :headers="headers"
                :items="users"
                :loading="loading"
                :search="search"
                hide-actions
                :disable-initial-sort="true"
                class="elevation-1"
        >
            <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.email }}</td>
                <td>{{ props.item.role }}</td>
            </template>

        </v-data-table>
        <div class="text-xs-center">
            <v-btn @click="addUser = true" color="success" outline="">Add User</v-btn>
        </div>

    </div>

</template>

<script>
import Parse from 'parse';
import moment from 'moment';
import Util from '@/util';
import VWidget from '@/components/VWidget';
import AddBusinessUser from '../AddBusinessUser';
export default {
  name: 'user-settings',
  components: { AddBusinessUser },
  data () {
    return {
      loading: false,
      business: null,
      users: [],
      search: '',
      addUser: false,
      headers: [
        {
          text: 'Name',
          sortable: false,
          value: 'name'
        },
        { text: 'Email', value: 'email', align: 'left', sortable: false, },
        { text: 'Role', value: 'role', sortable: false, },
      ],
    };
  },
  async mounted () {
    const business = await Util.getCurrentBusiness();
    const users = await business.getUsers();
    users.forEach((businessUser) => {
      const user = businessUser.get('publicUser');
      businessUser.name = user.get('name');
      businessUser.email = user.get('email');
      businessUser.role = businessUser.get('role');
    });
    this.users = users;
  },
  methods: {
  },
};
</script>
