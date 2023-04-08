
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
        outlined
      >        
        <v-toolbar-title dense>
          <v-icon class="title_font_color toolbar_icon_size">person_add</v-icon> <span class="toolbar_font_size">사용자 관리</span>
        </v-toolbar-title>

        <v-spacer />            
        <v-btn
          text
          class="title_font_color"
          @click="addUser"
        >
          <v-icon>add</v-icon>
          사용자 추가
        </v-btn>
        <v-btn
          text
          class="title_font_color"
          @click="ExcelDownload"
        >
          <v-icon>download</v-icon>
          Excel
        </v-btn>

      </v-toolbar>
      <v-divider 
        class="my_toolbar_underline" 
        v-if="this.$vuetify.toolbar_underline"
        />          
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
          <span class="px-2">
            <v-text-field                
              v-model="SearchCond.EMP_USER_ID"
              label="Login ID"                    
              prepend-inner-icon="search"
              dense
              clearable
            />
          </span>            
          <span class="px-2">
            <v-text-field                
              v-model="SearchCond.EMP_NAME"
              label="성명"                    
              prepend-inner-icon="search"
              dense
              clearable
            />
          </span>            
          <span class="px-2">
            <v-text-field                
              v-model="SearchCond.DEPT_NAME"
              label="부서"
              prepend-inner-icon="search"
              dense
              clearable
            />
          </span>                         
          <span
            class="px-2"
            style="width:170px"
          >
            <v-select
              v-model="SearchCond.ACTV"
              dense
              class="pa-0"                
              label="사용여부"  
              prepend-icon="search"
              :items="[{text:'전체',value:''},{text:'Y(활성)',value:'Y'},{text:'N(비활성)',value:'N'} ]"
            />              
          </span>          
          <span>          
            <v-btn
              class="primary"
              @click="selectUserList"
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
          :items="UserList"              
          @click:row="detail"
        >
          <template 
            v-slot:item.CORPORATE_ID="{item}"
            >
              <CodeNameBox 
                :value="item.CORPORATE_ID"
                 item-text="CORPORATE_NAME"      
                item-value="CORPORATE_ID"      
                source-url="/Common/CoperList"
                active-cache
              />              
          </template> 
        </PageDataTable>        
      </v-card-text>
    </v-card>
    
    <addUserManageDlg
      ref="addUserManageDlg" 
      @SaveOK="addUserProc"
    />
    <modifyUserManageDlg
      ref="modifyUserManageDlg" 
      @SaveOK="modifyUserProc"
    />
  </div>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
import addUserManageDlg from './addUserManageDlg'
import modifyUserManageDlg from './modifyUserManageDlg'
import PageDataTable from '@/components/DataTable/PageDataTable'
import CSelectBox from '@/components/SelectBox/CSelectBox.vue'
import CodeNameBox from '@/components/SelectBox/CodeNameBox.vue'


export default {
    components: {
      addUserManageDlg,
      modifyUserManageDlg,
      PageDataTable,  
      CSelectBox, 
      CodeNameBox, 

    },
    data: () => ({
                
        defaultData:'',
        SearchCond: {      //검색조건
          EMP_NO:'',       //사번
          CORPORATE_ID:'',
          EMP_USER_ID:'',  //로그인 ID
          EMP_NAME:'',     //성명
          DEPT_NAME:'',    //부서명
          ACTV:'',        //활성화 여부
          
          USE_SYNC:'',    //인사연동 사용자 여부(Y:인사연동 N:로컬사용자)
        },
        UserList : [],  //사용자 리스트
        
        headers: [
          { text: '법인', value: 'CORPORATE_ID', sortable: false },
          { text: '사번',value: 'EMP_NO',sortable: false, align: 'center',},
          { text: 'Login ID', value: 'EMP_USER_ID', align: 'center', },
          { text: '성명', value: 'EMP_NAME' ,align: 'left',},          
          { text: '부서', value: 'DEPT_NAME' ,align: 'left',},
          { text: 'E-MAIL', value: 'EMAIL',align: 'left', },
          { text: 'Mobile', value: 'TEL_NO' ,align: 'left',},
          { text: '사용여부', value: 'ACTV' ,align: 'center',},          
          { text: '조직현황여부', value: 'GROUP_DISP_YN' ,align: 'center',},          
          { text: '담당업무', value: 'TASK' ,align: 'left',},          
        ],

    }),
    computed:{

    },
    created : function(){        
      //초기화는 여기서..
      this.selectUserList();
    },
    methods : {
        //여기에 함수들
        test(){
            
        },
        selectUserList(){
           //console.log(this.SearchCond);
            axios.post(`${CONST.HOST_ADDR}/usermanage/selectUserList`, this.SearchCond).then(
            (ret)=>{
               
                this.UserList = ret.data;
            }
          );               
        },
        detail(item){ //상세정보를 표시한다.

          var cloneItem = {};
          Object.assign(cloneItem, item); //복사해서 넣는다.
          
          this.$refs.modifyUserManageDlg.ShowDlg(cloneItem);
          
        },        
        addUser(){  //사용자를 추가한다.
          this.$refs.addUserManageDlg.ShowDlg();   
        },
        addUserProc(UserInfo){  //사용자 추가 처리
          axios.post(`${CONST.HOST_ADDR}/usermanage/insertUser`, UserInfo).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.
                if(ret.data.ret == true)
                {
                  this.selectUserList();  //화면 갱신
                }
            }
          );               
        },
        modifyUserProc(UserInfo){
          //console.log('modifyUserProc');
          //console.log(UserInfo);
          axios.post(`${CONST.HOST_ADDR}/usermanage/updateUser`, UserInfo).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.
                if(ret.data.ret == true)
                {
                  this.selectUserList();  //화면 갱신
                }
            }
          );               
        },
        ExcelDownload: async function()
        {            
          this.$GET_EXCEL_FILE(this.headers, this.UserList);  //엑셀 파일을 다운로드 받는다.            
        },
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


