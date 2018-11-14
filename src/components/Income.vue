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
                        <template slot="items" slot-scope="props">
                            <td>
                                <v-icon color="green">check</v-icon>
                            </td>
                            <td>{{ props.item.reference }}</td>
                            <td>{{ props.item.amount }}</td>
                            <td>{{ props.item.desc }}</td>
                            <td>{{ props.item.date }}</td>
                            <td v-if="showAction">{{ props.item.action }}</td>
                        </template>
                    </v-data-table>
                </v-flex>

            </v-layout>
        </v-container>
    </div>
</template>

<script>
export default {
  name: 'income',
  props: ['incomes', 'loading', 'showAction'],
  data () {
    return {
      search: '',
      loading: true,
      headers: [
        {
          text: 'Status',
          sortable: false,
        },
        { text: 'Reference', value: 'reference', align: 'left', sortable: false, },
        { text: 'Amount', value: 'amount', sortable: false, },
        { text: 'Description', value: 'desc', sortable: false, },
        { text: 'Date', value: 'day', sortable: false, },
      ],

    };
  },
  created () {
    if (this.showAction) {
      this.headers.push({ text: 'Action', value: 'action', sortable: false });
    }
  }
};
</script>

<style scoped>

</style>
