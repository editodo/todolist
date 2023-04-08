<template>
  <div 
    class="pt-2 d-flex justify-space-around flex-wrap"
    >
      <div style="position: relative; width:100%; height: 50%;">
					<div style="width:100%;height:100%;">
            <div style="float:right;  margin: 0 20px 0 0;">
              ■ 참고자료
              <div style="height:40px">
              <v-btn 
                color="primary"
                @click="ProductInfoProc"
                >
                각사 제품분류기준
              </v-btn>              
              </div>
              <div 
                style="height:40px"
                 >
              <v-btn 
                color="primary"
                @click="EmpInfoProc" 
                >
                각사 구매조직현황
              </v-btn>              
              </div>
              <div 
              style="height:40px;width:160px"
               >
              <v-btn 
                color="primary" 
                width="100%"
                @click="RSSProc" 
                >
                  시 황 정 보
              </v-btn>              
              </div>
            </div>
          </div>
          <div style="width:100%; height:100px;"></div>
          <div style="width:100%; height:30px; display:flex; align-items: center; justify-content: center;">
            <div 
              style="width:94px; height:42px; flex-grow: 0; margin: 12px 0 11px; position:relative; "              
              >
                <v-img        
                    contain        
                    max-height="42"
                    max-width="94"
                    src="@/assets/LsLogo.png"
                  />
            </div>
            <span 
              style="width: 125px;height: 65px;flex-grow: 0;font-family: NotoSans;font-size: 48px;font-weight: bold;font-stretch: normal;font-style: normal;
                    line-height: normal;letter-spacing: 4.8px;text-align: left;color: #9ea3a6; position:relative; "
                    >
                    GPIS
            </span>
          </div>
          <div style="width:100%; height:10px;"></div>
          <div style="width:100%; height:50px;">
            <div 
              style="height: 22px;flex-grow: 0;margin: 5px 0 0;font-family: NotoSans;font-size: 16px;font-weight: 500;font-stretch: normal;
              font-style: normal;line-height: normal;letter-spacing: normal;text-align: center;color: #444; position:relative;"
              >Global Purchase Information System
            </div>
          </div>
          <div style="width:50%; text-align:center;margin: auto;">
            <div 
                class="d-flex justify-space-between" 
                style="display:felx;"
                >
            <v-container>
            <span class="px-30">
                <v-text-field                
                  v-model="SearchData.searchData"
                  label="제품 KeyWord,업체명,국가 등"                    
                  outlined
                  rounded
                  prepend-inner-icon="search"
                  dense
                  clearable
                  @keyup.enter="searchDetail()"
                  class="text-h3"
                />
              </span>
              </v-container>
            </div>
            
            
          </div>
          <div style="width:100%; margin: -10px 0 5px 0; display: flex; align-items: center; justify-content: center;">
            <div style="width:73%;text-align:center;margin: auto;"></div>
            <div style="width:27%;text-align:left;margin: auto;"><span style="font-size: 12px; font-weight: bold; color: #007EA5">기준년도 {{ year }}</span></div>
            
          </div>
			</div>
      
      <div style="width:100%; height: 80px;display: flex; align-items: center; justify-content: center;">
        <div style="width:250px; height: 80px; border: 1px solid; margin: 3px 30px 3px 30px ;text-align:center; padding: 10px;border-radius: 15px; border-color: #d0d0d0;display: flex;align-items: center; justify-content: center;">
          <span>
            <v-icon 
              color="#F48FB1" 
              size="50px"
              >update</v-icon></span>
          <span style="padding: 5px;"> 마지막 업데이트 <br> <span style="font-size: 19px; font-weight: bold;">{{ lastdate }}</span></span>
        </div>
        <div style="width:300px; height: 80px; border: 1px solid; margin: 3px 30px 3px 30px ;text-align:center; padding: 10px;border-radius: 15px; border-color: #d0d0d0;display: flex;align-items: center; justify-content: center;">
          <span>
            <v-icon 
            color="#c5b382" 
            size="50px"
            >paid</v-icon></span>
          <span style="padding: 5px;"> 연간 총 구매금액 <br><span style="font-size: 19px; font-weight: bold;">{{ yearTotalMoney }}</span></span>
        </div>
        <div style="width:250px; height: 80px; border: 1px solid; margin: 3px 30px 3px 30px ;text-align:center; padding: 10px;border-radius: 15px; border-color: #d0d0d0;display: flex;align-items: center; justify-content: center;">
          <span>
            <v-icon 
            color="#81D4FA" 
            size="50px"
            >corporate_fare</v-icon></span>
          <span style="padding: 5px;"> 연간 총 거래업체 <br> <span style="font-size: 19px; font-weight: bold;">{{ yearTotalCompany }}</span></span>
        </div>
      </div>
      <div style="width:100%; height:20px;"></div>
      <div style="width:100%; height: 300px;display: flex; align-items: center; justify-content: center;">
        <div style="width:450px; height: 300px; margin: 5px 50px 10px 100px ;">
          <BarChart 
            :chart-data="DataList"
            :height="300"
          />
        </div>
        <div style="width:450px; height: 300px;margin: 5px 100px 10px 50px ;">
          <BarChart
            :chart-data="DataList1"
            :height="300"
          />
        </div>
      </div>
      <RSS ref="RSS"></RSS>
      <EmpInfo ref="EmpInfo"></EmpInfo>
      <ProductInfo ref="ProductInfo"></ProductInfo>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */
import CONST from '@/const'
import axios from 'axios'
import {mapGetters} from 'vuex';
import BarChart from '@/components/Barchart.vue';

//import BarChart1 from '@/components/Barchart.vue';
//import postscribe from 'postscribe'
import RSS from './PopUp/RSS.vue';
import EmpInfo from './PopUp/EmpInfo.vue';
import ProductInfo from './PopUp/ProductInfo.vue';



  export default {
     components: {
            BarChart,
            RSS,
            EmpInfo,
            ProductInfo,

            //,BarChart1
        },
   data: () => ({
      DataList : {},            //사용자 리스트
      DataList1 : {},       //현재 그룹에 등록된 사용자 리스트
      labelList : [],
      valueList : [],
      labelList1 : [],
      valueList1 : [],
      SearchData : {
          searchData: '',     //검색어
        },
      yearTotalMoney : '',
      yearTotalCompany : '',
      lastdate : '',
      year : new Date().getFullYear(),
    }),          
    
    computed :{
      ...mapGetters(['CurAuthInfo']),
    },
    mounted() {

        
  
    },
    created : function(){      
      this.maxLastDate();
      this.yearTotalMoneyfun();
      this.yearTotalCompanyfun();

    this.selectDataList();
    this.selectDataList1();
     
    },
    activated:function(){
     
    },
    deactivated:function(){
         console.log('deactivated 2');
    },

    
    methods: {
        yearTotalMoneyfun(){
           //console.log(this.SearchCond);
            axios.post(`${CONST.HOST_ADDR}/home/selectyearTotalMoney`, this.SearchData).then(
            (ret)=>{
//                var number = new Number(ret.data[0].YEARTOTALMONEY);
                this.yearTotalMoney = ret.data[0].YEARTOTALMONEY;
            }
          );           
        },
        yearTotalCompanyfun(){
           //console.log(this.SearchCond);
            axios.post(`${CONST.HOST_ADDR}/home/selectyearTotalCompany`, this.SearchData).then(
            (ret)=>{
              var number = new Number(ret.data[0].YEARTOTALCOMPANY);
                this.yearTotalCompany = number.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                //this.yearTotalCompany = ret.data[0].YEARTOTALCOMPANY;
            }
          );           
        },
        maxLastDate(){
           //console.log(this.SearchCond);
            axios.post(`${CONST.HOST_ADDR}/home/selectLastDate`, this.SearchData).then(
            (ret)=>{
                this.lastdate = ret.data[0].LASTDATE;
            }
          );           
        },
        selectDataList(){
           //console.log(this.SearchCond);
            axios.post(`${CONST.HOST_ADDR}/home/selectCoperMoneyList`, this.SearchData).then(
            (ret)=>{
               for(var i =0; i < ret.data.length; i++){
                  this.labelList.push(ret.data[i].ITEM);
                  this.valueList.push(ret.data[i].VALUE);
               }
              console.log(this.labelList);
              this.DataList = {
                labels: this.labelList,
                datasets: [ { label: '법인별 구매금액'
                              ,backgroundColor:'rgba(0,172,213,0.6)'
                              ,borderColor:"#0081C4"
                              ,borderWidth:2
                              ,barPercentage : 0.3
                              ,data: this.valueList } ]
              };
            }
          );               
        },
        selectDataList1(){
           //console.log(this.SearchCond);
            axios.post(`${CONST.HOST_ADDR}/home/selectWorkPlaceMoneyList`, this.SearchData).then(
            (ret)=>{
               for(var i =0; i < ret.data.length; i++){
                  this.labelList1.push(ret.data[i].ITEM);
                  this.valueList1.push(ret.data[i].VALUE);
               }
              console.log(this.labelList1);
              this.DataList1 = {
                labels: this.labelList1,
                datasets: [ { label: '지역별 구매금액'
                              ,backgroundColor:'rgba(0,172,213,0.6)'
                              ,borderColor:"#0081C4"
                              ,borderWidth:2
                              ,barPercentage : 0.3
                              ,data: this.valueList1 } ]
              };
            }
          );               
        },
        searchDetail(){    //조회버튼 클릭
          var url = "/companybuylist/" + this.SearchData.searchData;
          this.$router.push(url);       //화면이동

        },
        RSSProc : function() //시황정보 popup 호출
        {
          this.$refs.RSS.ShowDlg();//

        },

        EmpInfoProc : function() //구매조직 popup 호출
        {
          this.$refs.EmpInfo.ShowDlg();//

        },
        
        ProductInfoProc : function() //분류기준 popup 호출
        {
          this.$refs.ProductInfo.ShowDlg();//

        },
    }
    
 
  }
</script>

<style scoped>

::v-deep(.theme--light.v-input input) {
    color: rgba(0, 0, 0, 0.87);
    font-size: 1rem !important;
    font-weight: 500;
    font-family: NotoSans;
}

</style>
