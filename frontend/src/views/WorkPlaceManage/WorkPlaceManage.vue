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
          <v-icon class="title_font_color toolbar_icon_size">factory</v-icon> <span class="toolbar_font_size">사업장 관리</span>                    
        </v-toolbar-title>
        <v-spacer />            
        <v-btn
          text
          class="title_font_color"
          @click="addUser"
          v-if="(isEditable)"
        >
          <v-icon>add</v-icon>
          사업장 추가
        </v-btn>
      </v-toolbar>
      <v-divider class="my_toolbar_underline" v-if="this.$vuetify.toolbar_underline"/>
      <v-card-text>        
        <div class="d-flex justify-space-between">
          <span 
            style="width:270px" class="px-2">
              <v-select      
                v-model="SearchCond.CORPORATE_ID"      
                :items="coperList"      
                item-text="CORPORATE_NAME"      
                item-value="CORPORATE_ID"      
                label="법인"     
                prepend-icon="search" 
                dense      
                v-on:change="corporateChange"
                />
          </span>
          <span style="width:270px" class="px-2">
            <v-select
              v-model="SearchCond.WORKPLACE_ID"
              :items="WorkPlaceListCmb"
              class="pa-0"                
              label="사업장"  
              prepend-icon="search"
              item-text="WORKPLACE_NAME"      
              item-value="WORKPLACE_ID" 
                
            />  
            <!-- <v-text-field                
              v-model="SearchCond.EMP_NO"          
              label="사번"                    
              prepend-inner-icon="search"
              dense
              clearable
            /> -->
          </span>
          <span style="width:300px" class="px-2">
          </span>
          <span style="width:300px" class="px-2">
          </span>
          <span>          
            <v-btn
              class="primary"
              @click="selectWorkPlaceList"
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
          :items="WorkPlaceList"              
          @click:row="detail"          
        >
          
        </PageDataTable>        
      </v-card-text>
    </v-card>
    
    <addWorkPlaceManageDlg
      ref="addWorkPlaceManageDlg" 
      @SaveOK="addWorkPlaceProc"
    />
    <modifyWorkPlaceManageDlg
      ref="modifyWorkPlaceManageDlg" 
      @SaveOK="modifyWorkPlaceProc"
    />
  </div>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'
import addWorkPlaceManageDlg from './addWorkPlaceManageDlg'
import modifyWorkPlaceManageDlg from './modifyWorkPlaceManageDlg'
import PageDataTable from '@/components/DataTable/PageDataTable'
import {mapGetters} from 'vuex';


export default {
    components: {
      addWorkPlaceManageDlg,
      modifyWorkPlaceManageDlg,
      PageDataTable,  
    },
    data: () => ({
                
        defaultData:'',
        SearchCond: {      //검색조건
          CORPORATE_NAME:'',       //사번
          CORPORATE_ID:'',
          WORKPLACE_NAME:'',       //사번
          WORKPLACE_ID:'',
        },
        coperList : [],
        WorkPlaceList : [],  //사용자 리스트
        WorkPlaceListCmb : [],  //사용자 리스트
        
        headers: [
          { text: '법인코드', value: 'CORPORATE_ID', sortable: false , align: 'center'},
          { text: '법인명',value: 'CORPORATE_NAME',sortable: false, align: 'center'},
          { text: '사업장코드', value: 'WORKPLACE_ID', sortable: false , align: 'center'},
          { text: '사업장명',value: 'WORKPLACE_NAME',sortable: false, align: 'center',},
          { text: '생성자', value: 'CREATER_ID', align: 'center', },
          { text: '생성일', value: 'CREATED_DATE' ,align: 'center',},          
          { text: '수정자', value: 'UPDATE_ID' ,align: 'center',},
          { text: '수정일', value: 'UPDATE_DATE',align: 'center', },
          { text: '사용여부', value: 'ACTV' ,align: 'center',},          
        ],

    }),
    computed:{
        ...mapGetters(
                      [
                      'IsWrite',      //쓰기 권한이 있는가?                      
                      ]),
      isEditable()    //수정가능한지
      {
        if(this.IsWrite == false) return false;
        return true;
      }
    },
    created : function(){        
      //초기화는 여기서..
      this.selectWorkPlaceList();
      this.selectcoperList(); //주문법인 리스트를 가져온다.
    },
    methods : {
        //여기에 함수들
        test(){
            
        },
        selectWorkPlaceList(){
            //console.log(this.SearchCond.CORPORATE_ID);
            if(this.SearchCond.CORPORATE_ID == "전체"){
              this.SearchCond.CORPORATE_ID = "";
            }
            axios.post(`${CONST.HOST_ADDR}/workplacemanage/selectWorkPlaceList`, this.SearchCond).then(
            (ret)=>{
               
                this.WorkPlaceList = ret.data;
            }
          );               
        },
        selectcoperList(){   //전체 주문법인 리스트를 가져온다.   
          return axios.post(`${CONST.HOST_ADDR}/companybuylist/coperList`,"").then(
            (ret)=>{                         
              this.coperList = ret.data;
            }
            
          );
              
        }, 
        selectWorkPlaceListCmb(){
           //console.log(this.SearchCond);
            axios.post(`${CONST.HOST_ADDR}/workplacemanage/selectWorkPlaceList`, this.SearchCond).then(
            (ret)=>{
               
                this.WorkPlaceListCmb = ret.data;
            }
          );               
        },
        detail(item){ //상세정보를 표시한다.
          console.log(item);
          var cloneItem = {};
          Object.assign(cloneItem, item); //복사해서 넣는다.
          
          this.$refs.modifyWorkPlaceManageDlg.ShowDlg(cloneItem);
          
        },        
        addUser(){  //사용자를 추가한다.
          this.$refs.addWorkPlaceManageDlg.ShowDlg();   
        },
        corporateChange : function() //상세화면으로 이동한다.
        {
          this.selectWorkPlaceListCmb();
          
        },
        addWorkPlaceProc(CoperInfo){  //사용자 추가 처리
          axios.post(`${CONST.HOST_ADDR}/workplacemanage/updateWorkPlace`, CoperInfo).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.
                if(ret.data.ret == true)
                {
                  this.SearchCond.CORPORATE_ID = "";
                  this.SearchCond.WORKPLACE_ID = "";
                  this.selectWorkPlaceList();  //화면 갱신
                }
            }
          );               
        },
        modifyWorkPlaceProc(CoperInfo){
          //console.log('modifyCoperProc');
          //console.log(UserInfo);
          axios.post(`${CONST.HOST_ADDR}/workplacemanage/updateWorkPlace`, CoperInfo).then(
            (ret)=>{
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.
                if(ret.data.ret == true)
                {
                  this.SearchCond.CORPORATE_ID = "";
                  this.SearchCond.WORKPLACE_ID = "";
                  this.selectWorkPlaceList();  //화면 갱신
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




