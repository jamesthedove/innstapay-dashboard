<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-toolbar card color="white">
            <v-text-field
                    flat
                    solo
                    prepend-icon="search"
                    placeholder="Customer email"
                    v-model="search"
                    @keyup.enter="handleSearch"
                    hide-details
                    class="hidden-sm-and-down"
            ></v-text-field>
            <v-btn icon>
              <v-icon>filter_list</v-icon>
            </v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-data-table
            :headers="headers"
            :items="customers"
            :loading="loading"
            hide-actions
            class="elevation-1"
          >
            <!--<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>-->
            <template slot="items" slot-scope="props">
              <td>{{ props.item.email }}</td>
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.phone }}</td>
              <td>{{ props.item.transactions }}</td>
            </template>
          </v-data-table>
        </v-flex>

      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Parse from 'parse';
import moment from 'moment';
import Util from '@/util';
import { Items as Users } from '@/api/user';
export default {
  data () {
    return {
      customers: [],
      search: '',
      loading: true,
      headers: [
        {
          text: 'Email',
          sortable: false,
          value: 'email'
        },
        { text: 'Name', value: 'name', sortable: true, },
        { text: 'Phone', value: 'phone', sortable: false, },
        { text: 'Successful Transactions', value: 'transactions', sortable: true, },
      ],

    };
  },
  watch: {
    async search (value) {
      if (!value) {
        this.load();
      }
    }
  },
  mounted () {
    this.load();
  },
  methods: {
    parseCustomer (customer) {
      customer.email = customer.get('email');
      customer.name = customer.get('firstName') ? `${customer.get('firstName')} ${customer.get('lastName') || ''}` : 'Not provided';
      customer.transactions = customer.get('successfulTransactions') || 0;
      customer.phone = customer.get('phone') || 'Not provided';
    },
    async load () {
      const business = await Util.getCurrentBusiness();
      const customers = await business.getCustomers();
      customers.forEach((customer) => {
        this.parseCustomer(customer);
      });
      this.loading = false;
      this.customers = customers;
    },
    async handleSearch () {
      const email = this.search;
      const business = await Util.getCurrentBusiness();
      this.loading = true;
      const customer = await business.getCustomer(email);
      this.parseCustomer(customer);
      this.customers = [customer];
      this.loading = false;
    }
  },
};
</script>
