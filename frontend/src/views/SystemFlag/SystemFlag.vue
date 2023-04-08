
<template>
  <div class="pt-1">
    <v-card
      color="card_background"
      class="baseheight"
    >
     <v-toolbar
        flat        
        dense             
        :height="this.$vuetify.toolbar_height"
        class="title_font_color"
      >
        <!-- <v-toolbar-title dense class="bold">
          <v-icon class="bold">settings</v-icon> 시스템 코드 관리
        </v-toolbar-title> -->
        <v-toolbar-title dense>
          <v-icon class="title_font_color toolbar_icon_size">settings</v-icon> <span class="toolbar_font_size">시스템 코드 관리</span>
        </v-toolbar-title>
        <v-spacer />            
        <v-btn
          text
          class="title_font_color"
          @click="addSystemFlagDlg"
        >
          <v-icon>add</v-icon>
          코드 추가
        </v-btn>
      </v-toolbar>
      <v-divider 
      class="my_toolbar_underline" 
      v-if="this.$vuetify.toolbar_underline"
      />          
      <v-card-text>        
        <div class="d-flex justify-space-between">                                     
          <span class="px-2">
            <CSelectBox
              v-model="SearchCond.FLAG_NAME"
              label="Flag 명"                    
              prepend-icon="search"
              source-url="/SystemFlag/selectFLAG_NAMEList"
              dense
              active-all-item      
              ref="myCSelectBox"         
            />
          </span>            

          <span>          
            <v-btn
              class="primary"
              @click="selectSystemflagList"
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
          :items="SystemFlagList"              
          @click:row="detail"
        >
          <!-- <template 
            v-slot:item.CORPORATE_ID="{item}"
            >
              <CodeNameBox 
                :value="item.CORPORATE_ID"
                 item-text="CORPORATE_NAME"      
                item-value="CORPORATE_ID"      
                source-url="/Common/CoperList"
                active-cache
              />              
          </template>  -->
        </PageDataTable>        
      </v-card-text>
    </v-card>
    
    <systemFlagDlg
      ref="systemFlagDlg" 
      @AddOK="insertSystemFlag"      
      @ModifyOK="updateSystemFlag"
      @DeleteOK="deleteSystemFlag"
    />
   
  </div>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
import systemFlagDlg from './SystemFlagDtlDlg'
//import modifyUserManageDlg from './modifyUserManageDlg'
import PageDataTable from '@/components/DataTable/PageDataTable'
import CSelectBox from '@/components/SelectBox/CSelectBox.vue'
//import CodeNameBox from '@/components/SelectBox/CodeNameBox.vue'


export default {
    components: {
      //addUserManageDlg,
      //modifyUserManageDlg,
      PageDataTable, 
      systemFlagDlg, 
      CSelectBox, 
  //    CodeNameBox, 

    },
    data: () => ({
                
        defaultData:'',
        SearchCond: {      //검색조건
          FLAG_NAME:'',       //플래그명
                  
        },
        SystemFlagList : [],  // 리스트
        
        headers: [
          // { text: 'ID', value: 'SYSTEM_FLAG_ID', sortable: false,align: 'center' },
          { text: 'FLAG 명',value: 'FLAG_NAME',sortable: false,width: '200px'},
          { text: 'FLAG 코드', value: 'FLAG_CODE', width: '300px' },
          { text: 'FLAG DATA', value: 'FLAG_DATA' , width: '200px'},          
          { text: '순서', value: 'OUTPUT_ORDER' ,width: '100px'},          
          { text: '', value: '' ,align: 'center',},
        ],

    }),
    computed:{

    },
    created : function(){        
      //초기화는 여기서..
      this.selectSystemflagList();
    },
    methods : {    
        selectSystemflagList(){   //시스템 플레그 리스트를 조회한다.
            axios.post(`${CONST.HOST_ADDR}/SystemFlag/selectSystemFlagList`, this.SearchCond).then(
            (ret)=>{               
                this.SystemFlagList = ret.data;
            }
          );               
        },
        detail(item){ //상세정보를 표시한다.
          var cloneItem = {};
          Object.assign(cloneItem, item); //복사해서 넣는다.
          this.$refs.systemFlagDlg.ShowModify(cloneItem);
          

          
        },        
        addSystemFlagDlg(){  //사용자를 추가한다.
          this.$refs.systemFlagDlg.ShowDlg();
        },
        insertSystemFlag(SystemFlagInfo){  //사용자 추가 처리
          axios.post(`${CONST.HOST_ADDR}/SystemFlag/insertSystemFlag`, SystemFlagInfo).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.
                if(ret.data.ret == true)
                {
                  this.selectSystemflagList();  //화면 갱신
                  this.$refs.myCSelectBox.selectList();
                }
            }
          );               
        },
        updateSystemFlag(SystemFlagInfo){
          //console.log('modifyUserProc');
          //console.log(UserInfo);
          axios.post(`${CONST.HOST_ADDR}/SystemFlag/updateSystemFlag`, SystemFlagInfo).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.
                if(ret.data.ret == true)
                {
                  this.selectSystemflagList();  //화면 갱신
                  this.$refs.myCSelectBox.selectList();
                }
            }
          );               
        },
        deleteSystemFlag(SystemFlagInfo)
        {
          axios.post(`${CONST.HOST_ADDR}/SystemFlag/deleteSystemFlag`, SystemFlagInfo).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.
                if(ret.data.ret == true)
                {
                  this.selectSystemflagList();  //화면 갱신
                  this.$refs.myCSelectBox.selectList();
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


