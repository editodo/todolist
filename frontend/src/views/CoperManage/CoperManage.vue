<style>
  

</style> 
<template>
  <div class="pt-1">
   <v-card
      color="card_background"
      class="baseheight"
    >
     <v-toolbar
        flat        
        dense             
        :height=this.$vuetify.toolbar_height
        class="title_font_color"
      >
        <v-toolbar-title dense>
          <v-icon class="title_font_color toolbar_icon_size">corporate_fare</v-icon> <span class="toolbar_font_size">법인 관리</span>          
        </v-toolbar-title>
        <v-spacer />            
        <v-btn
          text
          class="title_font_color"
          @click="addUser"
        >
          <v-icon>add</v-icon>
          법인 추가
        </v-btn>
      </v-toolbar>
      <v-divider class="my_toolbar_underline" v-if="this.$vuetify.toolbar_underline"/>
      <v-card-text>        
        <div class="d-flex justify-space-between">
          <span 
            class="px-2" 
            style="max-width:250px;"
            >
            <CSelectBox                 
                v-model="SearchCond.CORPORATE_ID"                        
                label="법인"  
                dense
                prepend-icon="search"                               
                item-text="CORPORATE_NAME"      
                item-value="CORPORATE_ID"      
                source-url="/Common/CoperList"
                active-all-item
              />

            <!-- <v-text-field                
              v-model="SearchCond.EMP_NO"          
              label="사번"                    
              prepend-inner-icon="search"
              dense
              clearable
            /> -->
          </span>
                 
          <span>          
            <v-btn
              class="primary"
              @click="selectCoperList"
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
          :items="CoperList"              
          @click:row="detail"
        >
          
        </PageDataTable>        
      </v-card-text>
    </v-card>
    
    <addCoperManageDlg
      ref="addCoperManageDlg" 
      @SaveOK="addUserProc"
    />
    <modifyCoperManageDlg
      ref="modifyCoperManageDlg" 
      @SaveOK="modifyCoperProc"
    />
  </div>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
import addCoperManageDlg from './addCoperManageDlg'
import modifyCoperManageDlg from './modifyCoperManageDlg'
import PageDataTable from '@/components/DataTable/PageDataTable'
import CSelectBox from '@/components/SelectBox/CSelectBox.vue'



export default {
    components: {
      addCoperManageDlg,
      modifyCoperManageDlg,
      PageDataTable,  
      CSelectBox, 

    },
    data: () => ({
                
        defaultData:'',
        SearchCond: {      //검색조건
          CORPORATE_NAME:'',       //사번
          CORPORATE_ID:'',
        },
        CoperList : [],  //사용자 리스트
        
        headers: [
          { text: '법인코드', value: 'CORPORATE_ID', sortable: false },
          { text: '법인명',value: 'CORPORATE_NAME',sortable: false, align: 'left',},
          { text: '생성자', value: 'CREATER_ID', align: 'center', },
          { text: '생성일', value: 'CREATED_DATE' ,align: 'center',},          
          { text: '수정자', value: 'UPDATE_ID' ,align: 'center',},
          { text: '수정일', value: 'UPDATE_DATE',align: 'center', },
          { text: '사용여부', value: 'ACTV' ,align: 'center',},          
        ],

    }),
    computed:{

    },
    created : function(){        
      //초기화는 여기서..
      this.selectCoperList();
    },
    methods : {
        //여기에 함수들
        test(){
            
        },
        selectCoperList(){
           //console.log(this.SearchCond);
            axios.post(`${CONST.HOST_ADDR}/copermanage/selectCoperList`, this.SearchCond).then(
            (ret)=>{
               
                this.CoperList = ret.data;
            }
          );               
        },
        detail(item){ //상세정보를 표시한다.
          console.log(item);
          var cloneItem = {};
          Object.assign(cloneItem, item); //복사해서 넣는다.
          
          this.$refs.modifyCoperManageDlg.ShowDlg(cloneItem);
          
        },        
        addUser(){  //사용자를 추가한다.
          this.$refs.addCoperManageDlg.ShowDlg();   
        },
        addUserProc(CoperInfo){  //사용자 추가 처리
          axios.post(`${CONST.HOST_ADDR}/copermanage/updateCoper`, CoperInfo).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.
                if(ret.data.ret == true)
                {
                  this.selectCoperList();  //화면 갱신
                }
            }
          );               
        },
        modifyCoperProc(CoperInfo){
          //console.log('modifyCoperProc');
          //console.log(UserInfo);
          axios.post(`${CONST.HOST_ADDR}/copermanage/updateCoper`, CoperInfo).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.
                if(ret.data.ret == true)
                {
                  this.selectCoperList();  //화면 갱신
                }
            }
          );               
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
</style>
