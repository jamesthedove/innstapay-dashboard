<template>
    <v-dialog persistent v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">Choose Business</span>
                <!--<v-spacer></v-spacer>-->
                <!--<v-btn icon @click="close">-->
                    <!--<v-icon>close</v-icon>-->
                <!--</v-btn>-->
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-container grid-list-md>

                    <div v-if="loading" class="text-xs-center">
                        <v-progress-circular
                                indeterminate
                                color="red"
                        ></v-progress-circular>
                    </div>

                    <template v-else>
                        <v-list v-if="businesses && businesses.length">
                            <v-list-tile v-for="business in businesses" :key="business.id" @click="switchToBusiness(business)">
                                <v-list-tile-content>
                                    <v-list-tile-title>{{business.get('name')}}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                        <template v-else>
                            <h5>You do not belong to any business. You can start by creating your own business or ask an existing business owner to invite you.</h5>
                            <div class="text-xs-center">
                                <v-btn @click="$emit('create')" color="primary">Create business</v-btn>
                            </div>
                        </template>
                    </template>

                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>

</template>

<script>
import Parse from 'parse';
import Vue from 'vue';
import localforage from 'localforage';
import Util from '@/util';
export default {
  name: 'choose-business',
  data: () => ({
    loading: true,
    error: '',
    dialog: true,
    businesses: [],
  }),
  watch: {
    dialog (value) {
      if (!value) {
        this.$emit('done');
      }
    }
  },
  async mounted () {
    const user = Util.getCurrentUser();
    this.businesses = await user.relation('businesses').query().find();

    this.loading = false;

  },
  methods: {
    close () {
      this.dialog = false;
      this.$emit('done');
    },
    async switchToBusiness (business) {
      await localforage.setItem('current_business', business.id);
      this.dialog = false;
      location.reload();
    }
  },

};
</script>