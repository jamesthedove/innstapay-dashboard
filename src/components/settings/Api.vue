<template>
    <v-card flat>
        <v-card-text>

            <v-layout wrap>
                <v-flex xs12>
                    <v-text-field :loading="loading" disabled outline v-model="publicKey" label="Public key">
                    </v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field :loading="loading" disabled outline v-model="privateKey" label="Private key">
                    </v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field :loading="loading" label="Webhook URL" v-model="webhook">

                    </v-text-field>
                </v-flex>
                <div class="text-xs-center">
                    <v-btn @click="update" :loading="saving" color="success" flat>Save Changes</v-btn>
                </div>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script>
import Parse from 'parse';
import moment from 'moment';
import Util from '@/util';
export default {
    name: 'api-settings',
    data () {
        return {
            publicKey: '',
            privateKey: '',
            webhook: '',
            loading: true,
            saving: false,
            business: null

        };
    },
    async mounted () {
        const business = await Util.getCurrentBusiness();
        this.business = business;
        const apiKey = await business.getApiKey();

        this.publicKey = apiKey.get('public');
        this.privateKey = apiKey.get('private');
        this.webhook = apiKey.get('webhook');

        this.loading = false;
    },
    methods: {
        async update(){
            this.saving = true;
            try{
                const response = await Parse.Cloud.run('updateBusinessApi', {businessId: this.business.id, webhook: this.webhook});
                Util.toast(response);
            } catch (e){
                Util.toast(e.message, false);
            }
            finally {
                this.saving  = false;
            }
        }
    },
};
</script>
