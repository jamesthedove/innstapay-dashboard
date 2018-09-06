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
                    placeholder="Transaction Reference"
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
            :items="transactions"
            :loading="loading"
            :disable-initial-sort="true"
            class="elevation-1"
            :pagination.sync="pagination"
            :total-items="totalTransactions"
          >
            <!--<v-progress-linear  height="3" slot="progress" color="blue" indeterminate></v-progress-linear>-->
            <template slot="items" slot-scope="props">
              <td>
                <v-tooltip v-if="props.item.status === 'successful'" bottom>
                  <v-icon slot="activator" color="green">check</v-icon>
                  <span>Successful</span>
                </v-tooltip>
              </td>
              <td>{{ props.item.reference }}</td>
              <td>{{ props.item.description }}</td>
              <td>{{ props.item.amount }}</td>
              <td>{{ props.item.date }}</td>
              <td>{{ props.item.type }}</td>
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
      transactions: [],
      search: '',
      loading: false,
      pagination: {},
      totalTransactions: 0,
      headers: [
        {
          text: 'Status',
          sortable: false,
          value: 'status'
        },
        { text: 'Reference', value: 'reference', align: 'left', sortable: false, },
        { text: 'Description', value: 'description', sortable: false, },
        { text: 'Amount', value: 'amount', sortable: false, },
        { text: 'Date', value: 'day', sortable: true, },
        { text: 'Type', value: 'type', sortable: false, }
      ],

    };
  },
  watch: {
    pagination: {
      handler () {
        this.load();
      },
      deep: true
    }
  },
  mounted () {
    this.load();
  },
  methods: {
    parseTransaction (transaction) {
      transaction.status = transaction.get('status');
      transaction.reference = transaction.get('ref');
      const currency = transaction.get('currency') || 'NGN';
      transaction.amount = `${currency} ${transaction.get('amount')}`;
      transaction.type = transaction.get('type') || 'Card'; // TODO
      transaction.day = transaction.updatedAt;
      transaction.date = moment(transaction.updatedAt).format('dddd, MMMM Do YYYY');
      transaction.description = `From ${transaction.get('email')}`;
    },
    async load () {
      const business = await Util.getCurrentBusiness();
      const { sortBy, descending, page, rowsPerPage } = this.pagination;
      console.log(page);
      this.loading = true;
      let skip = (page - 1) * rowsPerPage;
      if (page === 1) {
        console.log('first page');
        skip = 0;
      }
      const transactions = await business.getTransactions(skip, rowsPerPage);
      const metrics = await business.getMetrics();

      transactions.forEach((transaction) => {
        this.parseTransaction(transaction);
      });
      this.totalTransactions = metrics.get('successfulTransactions');
      this.loading = false;
      this.transactions = transactions;
    },
    async handleSearch () {
      if (this.search) {
        this.loading = true;
        const business = await Util.getCurrentBusiness();
        const transaction = await business.getTransaction(this.search);
        this.parseTransaction(transaction);
        this.transactions = [transaction];
        this.loading = false;
      }

    }
  },
};
</script>
