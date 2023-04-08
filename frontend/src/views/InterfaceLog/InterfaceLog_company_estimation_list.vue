<style>
  

</style> 
<template>
   <v-card 
    color="card_background"
   >
    <v-card-text>
      <div class="d-flex justify-space-between">                                     
        <span class="px-2">
          <seldate
            v-model="SearchCond.fromDate"
            label="From Date"
            today
           />
         
        </span>            
        <span class="px-2">
          <seldate
            v-model="SearchCond.toDate"
            label="To"
            today
          />
        </span>
         <span class="px-2 pt-2">
          <CSelectBox
            v-model="SearchCond.FLAG_NAME"
            label="인터페이스명"                    
            prepend-icon="search"
            flag-name="IF_COMPANY_ESTIMATION"
            item-text = 'FLAG_DATA'
            item-value = 'FLAG_CODE'
            dense            
          />
         </span>
        <v-spacer></v-spacer>
        <span class="px-2">          
          <v-btn
            class="primary"
            @click="selectList"
          >
            <v-icon left>
              search
            </v-icon>
            조회
          </v-btn>
        </span>
      </div>
      <PageDataTable
        :headers="headers"
        :items="List"                      
      >        
      <template 
          v-slot:item.IF_DATE="{item}"
          >
              {{ $moment(item.IF_DATE).format('YYYY-MM-DD HH:mm:ss') }} 
        </template>
      </PageDataTable>        


    </v-card-text>
  </v-card>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
import PageDataTable from '@/components/DataTable/PageDataTable'
import CSelectBox from '@/components/SelectBox/CSelectBox.vue'
import seldate from '@/components/Date/seldate.vue' //날짜 선택 다이얼로그

export default {
    components: {
      PageDataTable, 
      CSelectBox, 
      seldate,
    },
    data: () => ({
                
        defaultData:'',
        SearchCond: {      //검색조건

          FLAG_NAME:'',       //플래그명(테이블명)
          fromDate:'',
          toDate:''
        },
        List : [],  // 리스트
        
        headers: [
          
          //        {text : 'IF_BUY_LIST_COPPER_ID', value : 'IF_BUY_LIST_COPPER_ID'      , width:'200px'},
                  {text : '법인코드', value : 'CORPORATE_ID', width:'150px', align: 'center'},
                  {text : '업체코드', value : 'COMPANY_CODE'       , width:'150px', align: 'center'},
                  {text : '항목', value : 'RATING_ITEM'       , width:'200px'},
                  {text : '배점', value : 'DISTRIBUTE'       , width:'150px', align: 'right'},
                  {text : '점수', value : 'SCORE'       , width:'150px', align: 'right'},
                  {text : '순위', value : 'RANKING'       , width:'150px', align: 'right'},
                  {text : '평가년도', value : 'YEAR'       , width:'150px', align: 'center'},
                  {text : 'IF_DATE', value : 'IF_DATE'       , width:'200px', align: 'center'},
                  {text : 'IF_STATUS', value : 'IF_STATUS'       , width:'150px' , align: 'center'},
                  {text : 'IF_MSG', value : 'IF_MSG'       , width:'200px'},            
                ],
    }),
    computed:{

    },
    created : function(){        
      //초기화는 여기서..
      //this.selectList();
    },
    methods : {    
        selectList(){   //시스템 플레그 리스트를 조회한다.

            if(this.SearchCond.FLAG_NAME == '')
            {
                this.$root.$toastmsg.ShowError('인터페이스 명을 선택 바랍니다.');  //결과를 화면에 뿌린다.                                                            
                return;
            }

            axios.post(`${CONST.HOST_ADDR}/Interface_log/selectCompanyEstimationList`, this.SearchCond).then(
            (ret)=>{               
                this.List = ret.data;
            }
          );               
        },
        ExcelDownload: async function()
        {            
          this.$GET_EXCEL_FILE(this.headers, this.List);  //엑셀 파일을 다운로드 받는다.                           
        },        
    }

}
</script>




