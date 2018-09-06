<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-data-table
            :headers="headers"
            :items="incomes"
            :loading="loading"
            hide-actions
            :search="search"
            class="elevation-1"
          >
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
            <template slot="items" slot-scope="props">
              <td>
                <v-icon color="green">check</v-icon>
              </td>
              <td>{{ props.item.reference }}</td>
              <td>{{ props.item.amount }}</td>
              <td>{{ props.item.date }}</td>
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
      incomes: [],
      search: '',
      loading: true,
      headers: [
        {
          text: 'Status',
          sortable: false,
        },
        { text: 'Reference', value: 'reference', align: 'left', sortable: false, },
        { text: 'Amount', value: 'amount', sortable: false, },
        { text: 'Date', value: 'day', sortable: false, },
      ],

    };
  },
  mounted () {
    this.load();
  },
  methods: {
    async load () {
      const business = await Util.getCurrentBusiness();
      const incomes = await business.getIncome();
      incomes.forEach((income) => {
        income.reference = income.id;
        const currency = income.get('currency') || 'NGN';
        income.amount = `${currency} ${income.get('amount')}`;
        income.date = moment(income.updatedAt).format('dddd, MMMM Do YYYY, h:mm a');
      });
      this.loading = false;
      this.incomes = incomes;
    }
  },
};
</script>
