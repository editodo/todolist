
<template>
  <div class="pt-1">
    <v-card          
      color="card_background"
      class="baseheight"
    >
      <v-toolbar       
        flat        
        dense             
        class="title_font_color"
        :height="this.$vuetify.toolbar_height"
      >
        <v-toolbar-title dense>
          <v-icon class="title_font_color toolbar_icon_size">bar_chart</v-icon> <span class="toolbar_font_size">연간 구매집계</span>
        </v-toolbar-title>
        <v-spacer />            
        <!--필요시 여기에 버튼을 넣는다. -->
      </v-toolbar>
      <v-divider 
        class="my_toolbar_underline" 
        v-if="this.$vuetify.toolbar_underline"
      />          
      <v-card-text>
        <v-card
          class="pa-0"
          flat
          color="card_background"
        >
          <div class="d-flex  flex-row">            
            <div class="pr-2">
              <v-text-field
                  v-model="SearchCond.fromYear"
                  prepend-icon="calendar_month"
                  hide-details
                  label="From Year"                    
                  type="number"
                  style="width:150px;"
                />                              
            </div>
            <div class="pl-2">
              <v-text-field
                  v-model="SearchCond.toYear"
                  prepend-icon="calendar_month"
                  hide-details
                  label="To Year"                    
                  type="number"
                  style="width:150px;"
                />              
            </div>
            <v-spacer />

            <v-btn
              color="primary"
              @click="searchProc"
            >
              <v-icon>
                search
              </v-icon>
              조회
            </v-btn>
          </div>

          <br />

          <v-row>
            <v-col cols="6">
              <BuyStatisticsYearBarGraph 
                title="LS전선 구매금액"
                corporate-id="A002"
                ref="BuyStatisticsYearBarGraph_A002"
              />
            </v-col>
            <v-col cols="6">
              <BuyStatisticsYearBarGraph 
                title="LS ELECTRIC 구매금액"
                corporate-id="A003"
                ref="BuyStatisticsYearBarGraph_A003"
              />

            </v-col>
            <v-col cols="6">
              <BuyStatisticsYearBarGraph 
                title="LS MnM 구매금액"
                corporate-id="A004"
                ref="BuyStatisticsYearBarGraph_A004"
              />

            </v-col>
            <v-col cols="6">
              <BuyStatisticsYearBarGraph 
                title="LS엠트론 구매금액"
                corporate-id="A005"
                ref="BuyStatisticsYearBarGraph_A005"
              />
            </v-col>
          </v-row>                          
          
        </v-card>
    </v-card-text>
    </v-card>
  </div>
</template>

<script>
import BuyStatisticsYearBarGraph from './BuyStatisticsYearBarGraph'

export default {
    components: {      
      BuyStatisticsYearBarGraph      
    },
    data: () => ({
        TableList:[],     
        ChartDataList : {},      //차트 데이터
        fromMenu: false,
        
        SearchCond : {            
            fromYear : 2000,        //시작일(년도)
            toYear:2000,            //종료일(년도)            
        }
    }),
    computed:{

    },
    created : function(){        
      this.SearchCond.fromYear = this.$moment().add(-5, 'Years').format('YYYY');
      this.SearchCond.toYear = this.$moment().format('YYYY');
            
    },
    methods : {                    
        searchProc(){

          this.$refs.BuyStatisticsYearBarGraph_A002.searchProc(this.SearchCond);          
          this.$refs.BuyStatisticsYearBarGraph_A003.searchProc(this.SearchCond);          
          this.$refs.BuyStatisticsYearBarGraph_A004.searchProc(this.SearchCond);
          this.$refs.BuyStatisticsYearBarGraph_A005.searchProc(this.SearchCond);

        }
    }

}
</script>

<style scoped lang="scss">
   @import "@/assets/scss/config.scss";          
    :deep(.v-toolbar--dense .v-toolbar__content)
    {
      background-color: $sub-title-backgroundcolor !important;
    }  

    .v-input--selection-controls 
    {
      margin-top: 4px;
    }

    
</style>