<template>
    
  <v-card         
    class="p-2 defaultBackColor"
    >
      <v-toolbar   
      flat
      dense
      class="title_font_color"
                    :height="this.$vuetify.toolbar_height"
      >
        <v-toolbar-title dense>
          <v-icon class="title_font_color toolbar_icon_size">bar_chart</v-icon> 
          <span class="toolbar_font_size">{{ title }}</span>
        </v-toolbar-title>
        <v-spacer />      

         <v-btn
            text
            class="title_font_color"
            @click="ExcelDownload"
          >
            <v-icon>download</v-icon>
            Excel
          </v-btn> 

      </v-toolbar>
       <v-card-text>

          <BarChart
              :chart-data="ChartDataList"
              :height="240"
            />
      
        </v-card-text>
  
  </v-card>

</template>

<script>


import CONST from '@/const'
import axios from 'axios'
import BarChart from '@/components/Barchart.vue';

export default {
    name:'BuyStatisticsYearBarGraph',
    components: {
      BarChart
        
    },
    props: {
          
          title:{
            type: String,
            default: '',        
          },
          corporateId : {
            type: String,
            default: '',        
          }

    },
    data: () => ({
        TableList:[],     
        ChartDataList : {},      //차트 데이터

     }),
     watch: {
        

    },
    mounted() {
       
        
    },
    beforeDestroy() {

    },

    methods:{
      makeChartData(){

           //차트 데이터를 생성한다.

            var labelList = [];
            var valueList = [];
            

             for(var i =0; i < this.TableList.length; i++)
             {
                  labelList.push(this.TableList[i].IN_DAY);
                  valueList.push(this.TableList[i].IN_AMOUNT);
              }

              this.ChartDataList = {
                labels: labelList,
                datasets: [ { label: '구매금액 (단위 : 원)'
                              ,backgroundColor:'rgba(0,172,213,0.6)'
                              ,borderColor:"#0081C4"
                              ,borderWidth:2
                              ,data: valueList },

                        ]
              };

        },
      searchProc(SearchCond){

          var newSearhCond = {};
          Object.assign(newSearhCond, SearchCond); //복사해서 넣는다.

          newSearhCond.CORPORATE_ID = this.corporateId;

          axios.post(`${CONST.HOST_ADDR}/BuyStatisticsYear/selectBuyList_Year`, newSearhCond).then(
                (ret)=>{              
                    this.TableList = ret.data;
                    this.makeChartData();

                }
              );                     

      },
      ExcelDownload: async function()
          {            

             var headers = [
                { text: '법인', value: 'CORPORATE_NAME'},
                { text: '년도',value: 'IN_DAY'},
                { text: '금액', value: 'IN_AMOUNT', type:'Double'},
                { text: '거래건수', value: 'BUY_COUNT' , type:'Double'},          
             ];

            this.$GET_EXCEL_FILE(headers, this.TableList);  //엑셀 파일을 다운로드 받는다.                        
            
          },

    }

}
</script>

<style scoped lang="scss">




</style>