<template>
  <income :incomes="incomes" :loading="loading" :showAction="true"></income>
</template>

<script>
import moment from 'moment';
import Util from '@/util';
import Income from '../components/Income';
export default {
  components: { Income },
  data () {
    return {
      incomes: [],
      loading: true
    };
  },
  mounted () {
    this.load();
  },
  methods: {
    async load () {
      const business = await Util.getCurrentBusiness();
      const incomes = await business.getIncome(null, null, true);
      incomes.forEach((income) => {
        income.reference = income.id;
        const currency = income.get('currency') || 'NGN';
        income.amount = `${currency} ${income.get('amount')}`;
        income.date = moment(income.updatedAt).format('dddd, MMMM Do YYYY, h:mm a');
        income.desc = income.get('reason');
        income.action = income.get('action');
      });
      this.loading = false;
      this.incomes = incomes;
    }
  },
};
</script>
