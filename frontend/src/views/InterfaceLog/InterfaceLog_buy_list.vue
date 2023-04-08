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
            flag-name="IF_BUY_LIST"
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
      
        <!-- 입고금액 -->
        <template 
          v-slot:item.IN_AMOUNT="{item}"
          >
              {{ item.IN_AMOUNT | makeComma }} 
        </template>

        <!-- 입고금액(원화) -->
        <template 
          v-slot:item.IN_AMOUNT_WON="{item}"
          >
              {{ item.IN_AMOUNT_WON | makeComma }} 
        </template>

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
                  {text : '대분류', value : 'PRODUCT_CLASS'  , width:'150px'},
                  {text : '중분류', value : 'PRODUCT_GROUP'  , width:'150px'},
                  {text : '소분류', value : 'PRODUCT_SUBCLASS' , width:'200px'},
                  {text : '품목코드', value : 'PRODUCT_CODE'       , width:'150px'},
                  {text : '품목명', value : 'PRODUCT_NAME'       , width:'400px'},
                  {text : '법인명', value : 'CORPORATE_NAME'       , width:'200px'},
                  {text : '사업장명', value : 'WORKPLACE_NAME'       , width:'200px'},
                  {text : '법인코드', value : 'CORPORATE_ID'       , width:'120px', align: 'center'},
                  {text : '담당자', value : 'MANAGER'       , width:'200px'},
                  {text : '담당자 전화번호', value : 'MANAGER_TEL'       , width:'200px'},
                  {text : '입고수량', value : 'IN_QTY'       , width:'150px', align: 'right'},
                  {text : '입고일', value : 'IN_DAY'       , width:'150px', align: 'center'},
                  {text : '입고단위', value : 'IN_UNIT'       , width:'120px' , align: 'center'},
                  {text : '기준단위', value : 'BASIC_UNIT'       , width:'120px', align: 'center'},
                  {text : '화폐단위', value : 'IN_CURRENCY'       , width:'120px', align: 'center'},
                  {text : '입고금액', value : 'IN_AMOUNT'       , width:'150px', align: 'right'},
                  {text : '입고금액(원화)', value : 'IN_AMOUNT_WON' , width:'150px', align: 'right'},
                  {text : '국가', value : 'IN_COUNTRY'       , width:'200px'},
                  {text : '업체코드', value : 'IN_COMPANY_CODE'       , width:'200px' , align: 'center'},
                  {text : '업체명', value : 'IN_COMPANY_NAME'       , width:'200px'},
                  {text : 'Released date', value : 'RELEASED_DATE'       , width:'150px', align: 'center'},
                  {text : '도착일자', value : 'DELIVER_DATE'       , width:'150px', align: 'center'},
                  {text : 'Lead time', value : 'LEAD_TIME'       , width:'150px', align: 'right'},
                  {text : 'i/f 일자', value : 'IF_DATE'       , width:'200px', align: 'center'},
                  {text : 'i/f 상태', value : 'IF_STATUS'       , width:'150px' , align: 'center'},
                  {text : 'i/f 메시지', value : 'IF_MSG'       , width:'200px'},
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

            axios.post(`${CONST.HOST_ADDR}/Interface_log/selectBuyList`, this.SearchCond).then(
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




