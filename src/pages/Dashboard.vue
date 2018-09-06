<template>
  <div id="pageDashboard">
    <v-container grid-list-xl fluid>
      <v-progress-linear v-if="loading" color="blue" indeterminate></v-progress-linear>
      <v-layout v-if="metrics" row wrap>
        <!-- mini statistic start -->
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="receipt"
            :title="noOfTransactions"
            sub-title="Transactions"
            color="indigo"      
          >
          </mini-statistic>
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="people"
            :title="noOfCustomers"
            sub-title="Customers"
            color="red"      
          >
          </mini-statistic>           
        </v-flex>          
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-arrow-down"
            :title="`₦${todayIncome === null ? '' : balance}`"
            sub-title="Today's Income"
            color="light-blue"      
          >
          </mini-statistic>            
        </v-flex>        
        <v-flex lg3 sm6 xs12>
          <mini-statistic
            icon="fa fa-money"
            :title="`₦${balance === null ? '' : balance}`"
            sub-title="Balance"
            color="purple"      
          >
          </mini-statistic>             
        </v-flex>   
        <!-- mini statistic  end -->
        <v-flex lg12 sm12 xs12>
          <v-widget title="Income for last 30 days" content-bg="white">
            <v-btn icon slot="widget-header-action">
              <v-icon class="text--secondary">refresh</v-icon>
            </v-btn>
            <div slot="widget-content" v-if="incomes && incomes.length > 0">
              <e-chart
                      :path-option="[
                  ['dataset.source', incomes],
                  ['color', [color.lightBlue.base]],
                  ['legend.show', true],
                  ['xAxis.axisLabel.show', true],
                  ['yAxis.axisLabel.show', true],
                  ['grid.left', '2%'],
                  ['grid.bottom', '5%'],
                  ['grid.right', '3%'],
                  ['series[0].type', 'bar'],
                  ['series[0].areaStyle', {}],
                  ['series[0].smooth', true],
                ]"
                      height="400px"
                      width="100%"
              >
              </e-chart>
            </div>
          </v-widget>
        </v-flex>

        <template v-if="incomeData">
          <v-flex lg4 sm12 xs12>
            <circle-statistic
                    title="Success Transactions"
                    :sub-title="incomeData.successfulTransactions.value.toString()"
                    caption="Successful Transactions"
                    icon="list"
                    color="blue"
                    :value="incomeData.successfulTransactions.percent"
            >
            </circle-statistic>

          </v-flex>

          <v-flex lg4 sm12 xs12>
            <circle-statistic
                    title="Failed Transactions"
                    :sub-title="incomeData.failedTransactions.value.toString()"
                    caption="Failed Transactions"
                    icon="list"
                    color="red"
                    :value="incomeData.failedTransactions.percent"
            >
            </circle-statistic>

          </v-flex>
          <v-flex lg4 sm12 xs12>
            <circle-statistic
                    title="Abandoned Transactions"
                    :sub-title="incomeData.abandonedTransactions.value.toString()"
                    caption="Abandoned Transactions"
                    icon="list"
                    color="amber"
                    :value="incomeData.abandonedTransactions.percent"
            >
            </circle-statistic>

          </v-flex>
        </template>



      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Parse from 'parse';
import moment from 'moment';
import Util from '@/util';
import API from '@/api';
import EChart from '@/components/chart/echart';
import MiniStatistic from '@/components/widgets/statistic/MiniStatistic';
import PostListCard from '@/components/widgets/card/PostListCard';
import ProfileCard from '@/components/widgets/card/ProfileCard';
import PostSingleCard from '@/components/widgets/card/PostSingleCard';
import WeatherCard from '@/components/widgets/card/WeatherCard';
import PlainTable from '@/components/widgets/list/PlainTable';
import PlainTableOrder from '@/components/widgets/list/PlainTableOrder';
import VWidget from '@/components/VWidget';
import Material from 'vuetify/es5/util/colors';
import VCircle from '@/components/circle/VCircle';
import BoxChart from '@/components/widgets/chart/BoxChart';
import ChatWindow from '@/components/chat/ChatWindow';
import CircleStatistic from '@/components/widgets/statistic/CircleStatistic';
import LinearStatistic from '@/components/widgets/statistic/LinearStatistic';
import {
  StackData,
  SinData,
  monthVisitData,
  campaignData,
  locationData,
} from '@/api/chart';
export default {
  components: {
    VWidget,
    MiniStatistic,
    ChatWindow,
    VCircle,
    WeatherCard,
    PostSingleCard,
    PostListCard,
    ProfileCard,
    EChart,
    BoxChart,
    CircleStatistic,
    LinearStatistic,
    PlainTable,
    PlainTableOrder    
  },
  data: () => ({
    metrics: null,
    balance: null,
    todayIncome: null,
    incomes: [],
    incomeData: null,
    color: Material,
    selectedTab: 'tab-1',
    loading: true
  }),
  computed: {
    noOfTransactions () {
      const noOfTransactions = this.metrics.get('successfulTransactions');
      if (noOfTransactions > 1000) {
        return '1000+';
      }
      return `${noOfTransactions || 0}`;
    },
    noOfCustomers () {
      const noOfCustomers = this.metrics.get('noOfCustomers');
      if (noOfCustomers > 1000) {
        return '1000+';
      }
      return `${noOfCustomers || 0}`;
    }
  },
  async mounted () {
    const user = Util.getCurrentUser();
    const business = await Util.getCurrentBusiness();
    if (business) {
      this.metrics = await business.getMetrics();

      this.loading = false;

      this.balance = await business.getBalance() || 0;
      this.todayIncome = await business.getTodayIncome();

      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
      const income = await business.getIncome(oneMonthAgo);
      let successfulTransactions = 0;
      let failedTransactions = 0;
      let abandonedTransactions = 0;
      let totalTransactions = 0;
      this.incomes = income.map((dayIncome) => {
        successfulTransactions += dayIncome.get('successfulTransactions') || 0;
        failedTransactions += dayIncome.get('failedTransactions') || 0;
        abandonedTransactions += dayIncome.get('abandonedTransactions') || 0;
        totalTransactions += dayIncome.get('totalTransactions') || 0;
        return {
          'day': moment(dayIncome.createdAt).format('MMM Do'),
          'amount': dayIncome.get('amount')
        };
      });


      this.incomeData = {
        successfulTransactions: {
          percent: Math.round((successfulTransactions / totalTransactions || 0) * 100),
          value: successfulTransactions
        },
        failedTransactions: {
          percent: Math.round((failedTransactions / totalTransactions || 0) * 100),
          value: failedTransactions
        },
        abandonedTransactions: {
          percent: Math.round((abandonedTransactions / totalTransactions || 0) * 100),
          value: abandonedTransactions
        }
      };

      console.log(this.incomes);
      console.log(this.siteTrafficData);
      business.onUpdated = (type, object) => {
        console.log('onupdated');
        if (type === 'metrics') {
          this.metrics = object;
        }
      };
    }

  },

};
</script>
