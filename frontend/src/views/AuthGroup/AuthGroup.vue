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
          <v-icon class="title_font_color toolbar_icon_size">person_add</v-icon> <span class="toolbar_font_size">사용자 권한 설정(Group)</span>
        </v-toolbar-title>

      </v-toolbar>
        <v-divider 
        class="my_toolbar_underline" 
        v-if="this.$vuetify.toolbar_underline"
        />          
      <v-card-text>

        <v-row>
          <v-col class="col-sm-12 col-md-6 pt-4">
            <v-card 
                color="card_background"
                height="calc(100vh - 220px)"
              >
              <v-toolbar
                flat        
                dense             
                :height="this.$vuetify.toolbar_height"
                class="title_font_color"
              >            
                <v-toolbar-title dense>
                  <v-icon 
                    class="title_font_color toolbar_icon_size"
                    >
                      group
                      </v-icon> <span class="toolbar_font_size">그룹 정보</span>
                </v-toolbar-title>

                <v-spacer />            
              </v-toolbar>
              <v-card-text class="pt-4">
                <v-container
                  fluid
                  class="pa-0"
                >
                  <v-row>
                    <v-col 
                      class="pa-0"
                    > 
                      <v-card
                        color="grey lighten-5"
                        height="calc(100vh - 300px)"
                        flat
                      >
                        <v-card-title class="pt-4">
                          그룹정보 수정
                        </v-card-title>
                        <v-card-subtitle>
                          <div align="right">
                            <v-btn                                                                    
                              text
                              small        
                              @click="AddBtnClick"
                            >
                              <v-icon left>
                                add
                              </v-icon>추가
                            </v-btn>
                            <!-- <groupinputdlg
                              mode="I"
                              @ok="AddOK"
                            />                  -->
                            <v-btn                     
                              text
                              small      
                              @click="ModifyBtnClick"
                            >
                              <v-icon left>
                                edit
                              </v-icon>수정
                            </v-btn>
                            <!-- <groupinputdlg
                              mode="E"
                              @ok="EditOK"
                            />                  -->
                            <v-btn                                        
                              text
                              small
                              @click="deleteGroup"                    
                            >
                              <v-icon left>
                                restore_from_trash
                              </v-icon>
                              삭제
                            </v-btn>
                          </div>
                        </v-card-subtitle>
                        <v-card-text>
                          <v-list
                            dense
                            color="grey lighten-5"
                          >                            
                            <v-list-item-group color="primary">
                              <v-list-item
                                v-for="item in GroupList"
                                :key="item.GROUP_ID"
                                @click="GroupClick(item)"
                              >
                                <v-list-item-content>
                                  <v-list-item-title v-text="item.GROUP_NAME" />
                                </v-list-item-content>
                              </v-list-item>
                            </v-list-item-group>                        
                          </v-list>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-divider vertical />
                    <v-col
                      class="pa-0"
                    >
                      <v-card
                        color="grey lighten-5"
                        height="calc(100vh - 260px)"
                        style="overflow:auto;"
                        flat                                
                      >
                        <v-card-title class="pt-4">
                          그룹 권한정보
                        </v-card-title>
                        <v-card-subtitle>
                          <div
                            align="right"
                          >
                            <v-btn              
                              text
                              small
                              :disabled="(lodash.isEmpty(CurrentGroupInfo))"
                              @click="GroupSave"
                            >
                              <v-icon left>
                                save
                              </v-icon>적용
                            </v-btn>
                          </div>
                        </v-card-subtitle>                    
                        <v-card-text v-if="lodash.isEmpty(CurrentGroupInfo)">
                          그룹 리스트에서 그룹정보를 선택하여 주십시요.
                        </v-card-text>
                        <v-card-text 
                          v-else
                          >
                          <v-progress-linear
                            :active="TreeViewLoading"
                            color="deep-purple accent-4"
                            height="6"
                          />
                          
                          <v-treeview
                            v-if="TreeViewLoading === false"
                            open-all
                            hoverable
                            dense
                            :items="GroupAuthList"
                          >
                            <template
                              v-slot:append="{ item, open }"
                              dense
                            >                    
                              <select v-model="item.auth_level">
                                <option value="0">
                                    사용안함
                                  </option>
                                  <option value="1">
                                    읽기
                                  </option>
                                  <option value="2">
                                    쓰기
                                  </option>
                                  <option value="3">
                                  삭제
                                  </option>
                                  <option value="4">
                                  승인
                                  </option>
                              </select>                            
                            </template>
                          </v-treeview>
                        </v-card-text>                    
                      </v-card>
                    </v-col>                  
                  </v-row>                
                </v-container>
              </v-card-text>          
            </v-card>
          </v-col>
          <v-col class="col-sm-12 col-md-6 pt-4">
            <v-card
              color="card_background"
               height="calc(100vh - 220px)"
            >
              <v-toolbar
                flat        
                dense             
                :height="this.$vuetify.toolbar_height"
                class="title_font_color"
              >            
                <!-- <v-toolbar-title>사용자 그룹 설정</v-toolbar-title> -->
                <v-toolbar-title dense>
                  <v-icon class="title_font_color toolbar_icon_size">group</v-icon> <span class="toolbar_font_size">사용자 그룹 설정</span>
                </v-toolbar-title>

                <v-spacer />                        
                <span>
                  <v-text-field
                    v-model="SearchCond"  
                    light              
                    label="검색조건"  
                    solo
                    flat
                    rounded                                                        
                    dense                                 
                    hide-details       
                    clearable                                         
                    prepend-inner-icon="search"                
                  />
                </span>
              </v-toolbar>
              
              <v-card-text class="pt-4">
                <v-container
                  class="pa-0"
                  fluid
                  style="overflow-x: auto"
                >
                  <div class="d-flex flex-row">
                    <div
                      class="pa-0"
                      style="width: 100%;"
                    >
                      <v-card
                        color="grey lighten-5"
                        height="calc(100vh - 270px)"
                        flat
                      >
                        <v-card-title class="pt-1">
                          사용자 리스트
                        </v-card-title>
                        <v-card-subtitle>
                          그룹명 : {{ CurrentGroupInfo.GROUP_NAME }}
                        </v-card-subtitle>
                        
                        <v-simple-table
                          dense
                          fixed-header
                          height="calc(100vh - 370px)"
                          class="std_datatable cursor_p"                       
                        >
                          <thead>
                            <tr class="">
                              <th
                                
                                width="80"                                              
                              >
                                Login ID
                              </th>
                              <th
                                
                                width="100"
                              >
                                성명
                              </th>
                              <th
                                
                                width="100"
                              >
                                부서
                              </th>
                            </tr>
                          </thead>
                          <tbody>                          
                            <tr
                              v-for="(item, index) in UserListFi"
                              :key="item.EMP_USER_ID"                  
                              :style="{ cursor: 'pointer'}"
                              :class="{bg_gray :((index % 2) == 0 ), 
                                      active_row:(CurrentUserInfo != null && item.EMP_USER_ID == CurrentUserInfo.EMP_USER_ID)}"                                                     
                              @click="UserClick(item)"
                            >                        
                              <td class="pr-1">
                                <span
                                  class="d-inline-block text-truncate"
                                >
                                  {{ item.EMP_USER_ID }}
                                </span>
                              </td>
                              <td>
                                <span
                                  class="d-inline-block text-truncate"
                                  style="max-width: 80px;"
                                >
                                  {{ item.EMP_NAME }}
                                </span>
                              </td>
                              <td>
                                <span
                                  class="d-inline-block text-truncate"
                                  style="max-width: 80px;"
                                >
                                  {{ item.DEPT_NAME }}

                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </v-card>                  
                    </div>
                    <div                  
                      class="pa-0 align-self-center"
                    >                  
                      <!--그룹 사용자에서 해지-->                  
                      <v-btn 
                        text
                        :disabled="(lodash.isEmpty(CurrentGroupInfo)|| lodash.isEmpty(CurrentGroupUserInfo) )"
                        @click="UserGroupSub(CurrentGroupUserInfo)"
                      >
                        <v-icon>arrow_back</v-icon>
                      </v-btn>                  
                      <br>
                      <!--그룹사용자로 등록-->                  
                      <v-btn 
                        text 
                        :disabled="(lodash.isEmpty(CurrentGroupInfo) || lodash.isEmpty(CurrentUserInfo))"
                        @click="UserGroupAdd(CurrentUserInfo)"
                      >
                        <v-icon>arrow_forward</v-icon>
                      </v-btn>                  
                    </div>
                    <div
                      class="pa-0"                  
                      style="width: 100%;"
                    > 
                      <v-card
                        color="grey lighten-5"
                        height="calc(100vh - 370px)"
                        flat
                      >
                        <v-card-title class="pt-1">
                          그룹 사용자 리스트
                        </v-card-title>
                        <v-card-subtitle>
                          <div align="right">
                            <v-btn              
                              text
                              small
                              :disabled="(lodash.isEmpty(CurrentGroupInfo))"
                              @click="GroupUserSave"
                            >
                              <v-icon left>
                                save
                              </v-icon>적용
                            </v-btn>
                          </div>
                        </v-card-subtitle>
                        <v-simple-table
                          dense
                          fixed-header
                          height="calc(100vh - 370px)"       
                          class="std_datatable cursor_p"            
                        >
                          <thead>
                            <tr class="">
                              <th
                                width="80"
                              >
                                Login ID
                              </th>
                              <th
                                width="100"
                              >
                                성명
                              </th>
                              <th>
                                부서
                              </th>
                            </tr>
                          </thead>
                          <tbody>                        
                            <tr
                              v-for="(item, index) in GroupUserList"
                              :key="item.EMP_USER_ID"                  
                              :style="{ cursor: 'pointer'}"                          
                              :class="{bg_gray :((index % 2) == 0 ), 
                                      active_row:(CurrentGroupUserInfo != null && item.EMP_USER_ID == CurrentGroupUserInfo.EMP_USER_ID)}"
                              
                              @click="GroupUserClick(item)"
                            >                        
                              <td class="pr-1">
                                <span
                                  class="d-inline-block text-truncate"
                                >
                                  {{ item.EMP_USER_ID }}
                                </span>
                              </td>
                              <td>
                                <span
                                  class="d-inline-block text-truncate"
                                  style="max-width: 80px;"
                                >
                                  {{ item.EMP_NAME }}
                                </span>
                              </td>
                              <td>
                                <span
                                  class="d-inline-block text-truncate"
                                >
                                  {{ item.DEPT_NAME }}

                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </v-card>                  
                    </div>
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    
    </v-card>

    <alertDlg ref="mydlg" />
    <confirm ref="confirm" />
    <groupmodifydlg 
      ref="groupdlg" 
      @SaveOK="AddOK"      
      @ModifyOK="EditOK"
    />
  </div>
</template>

<script>
  import CONST from '@/const'
  import axios from 'axios'  
  import groupmodifydlg from './GroupModifyDlg.vue'
  import alertDlg from '@/components/Dialog/AlertDlg.vue'
  import confirm from '@/components/Dialog/Confirm.vue'


  export default {
    components: {      
      groupmodifydlg,
      alertDlg,
      confirm
    },
    data: () => ({
      GroupList : [],           //{ACTV, GROUP_ID, GROUP_NAME} 
      GroupAuthList: [],        //그룹 권한 리스트
      UserList : [],            //사용자 리스트
      GroupUserList : [],       //현재 그룹에 등록된 사용자 리스트
      CurrentGroupInfo : {},    //현재 선택된 그룹 정보
      CurrentUserInfo:{},       //현재 선택된 사용자
      CurrentGroupUserInfo:{},  //현재 선택된 그룹 사용자 정보
      TreeViewLoading : false,  //트리뷰 로딩 상태
      SearchCond : '',          //검색조건
    }),
    computed:{
      
      UserListFi : function(){  //사용자 리스트에서 현재그룹 사용자가 아닌 사용자만 보여준다
        return this.UserList.filter((element)=>{                        

            console.log(this.lodash);
            var searchTarget = element.EMP_USER_ID + element.EMP_NAME;                                    
            if(!this.lodash.isEmpty(this.SearchCond))
            {
              if(searchTarget.indexOf(this.SearchCond) == -1) return false;
            }            
            var findUser = this.GroupUserList.filter((element2)=>{
              if(element.EMP_USER_ID == element2.EMP_USER_ID) return true;
              return false;
            });
          return (findUser.length == 0);
        });
      },

    },    
    created: function(){
      this.selectGroupList();     //그룹리스트를 가져온다.
      this.selectUserList();      //사용자 리스트를 가져온다                  
    },
    methods: {
      AddBtnClick(){
        this.$refs.groupdlg.ShowDlg();
      },
      ModifyBtnClick(){
        console.log(this.CurrentGroupInfo);
        this.$refs.groupdlg.ShowModify(this.CurrentGroupInfo);   
      },
      GroupUserSave:async function(){  //현재 선택한 사용자 그룹 정보를 서버에 전송시켜 반영한다.
        
        
        if (await this.$refs.confirm.open('Confirm', '저장 하시겠습니까?', { color: 'red' }) == false) return;

        //사용자 리스트와 그룹정보를 혼합시켜 전송한다.
        var sendItem = {'GroupInfo' : this.CurrentGroupInfo, 
                      'GroupUserList' : this.GroupUserList};


        //그룹의 사용자 정보를 갱신한다.
        axios.post(`${CONST.HOST_ADDR}/authgroup/updateGroupUserList`, sendItem).then(
         (ret)=>{
           console.log(ret);           
         }
       );       

      },
      GroupUserClick: function(GroupUserInfo)
      {
        this.CurrentGroupUserInfo = GroupUserInfo;
      },
      UserGroupAdd : function(userInfo){  //사용자를 현재 그룹에 등록한다.
        this.GroupUserList.push(userInfo);
        this.CurrentUserInfo = {};

      },
      UserGroupSub : function(userInfo){  //사용자를 현재 그룹에서 뺀다
        
        var index = this.GroupUserList.indexOf(userInfo);
        if (index > -1) this.GroupUserList.splice(index, 1);

        this.CurrentGroupUserInfo = {};

      },
      UserClick: function(userInfo){
        this.CurrentUserInfo = userInfo;
      },
      AddOK : function(Data){   //Group 추가 작업
      
        console.log(Data);
        //신규 그룹 추가작업.
        axios.post(`${CONST.HOST_ADDR}/authgroup/insertNewGroup`, Data).then(
            (ret)=>{      
              if(ret.data.ret === true)
              {
                //작업 성공
                console.log(ret);
                //그룹정보를 새로 읽어 들인다.
                this.selectGroupList();
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.                                            
              }
              else
              {
                console.log(ret);
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.                                            
              }
            }
          );

      },
      EditOK : function(Data){  //Group 수정 작업
        
        //그룹 수정 작업.
        axios.post(`${CONST.HOST_ADDR}/authgroup/updateGroup`, Data).then(
            (ret)=>{      
              if(ret.data.ret === true)
              {
                //작업 성공                
                //그룹정보를 새로 읽어 들인다.
                this.selectGroupList();
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.                                            
              }
              else
              {                
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.                                            
              }
            }
          );

      },
      GroupSave :async function(){ //그룹 저장버튼 클릭
        
        if (await this.$refs.confirm.open('Confirm', '저장 하시겠습니까?', { color: 'red' }) == false) return;
                
        var sendItem = {
                      'GROUP_ID' : this.CurrentGroupInfo.GROUP_ID,  //현재 선택된 그룹Id
                      'GroupAuthList' : this.GroupAuthList          //현적용한 그룹 권한 정보
                      };

        console.log(sendItem);

        axios.post(`${CONST.HOST_ADDR}/authgroup/updateGroupAuthList`, sendItem).then(
         (ret)=>{
           console.log(ret);        
         }
       );       


      },
      deleteGroup : function(){ //그룹정보 삭제 처리
        axios.post(`${CONST.HOST_ADDR}/authgroup/deleteGroup`, this.CurrentGroupInfo).then(
            (ret)=>{      
              if(ret.data.ret === true)
              {
                //작업 성공                
                //그룹정보를 새로 읽어 들인다.
                this.selectGroupList();
                alert(ret.data.msg);
              }
              else
              {
                alert(ret.data.msg);
              }
            }
          );
        

      },
      selectUserList : function(){  
        //전체 사용자 리스트를 가져온다.
        axios.post(`${CONST.HOST_ADDR}/authgroup/selectUserList`, {}).then(
          (ret)=>{               
            this.UserList = ret.data;
          }
        );       
      },
      selectGroupList : function(){ //그룹 리스트를 가져온다.
      
        axios.post(`${CONST.HOST_ADDR}/authgroup/selectGroupList`, {}).then(
          (ret)=>{   
            this.GroupList = ret.data;                        
          }
        );       

      },
      GroupClick : function(item){  //그룹을 선택했을 때의 이벤트
        
        this.CurrentGroupInfo = item;        
        this.CurrentUserInfo = null;
        this.CurrentGroupUserInfo = null;


        this.TreeViewLoading = true;
        
        //그룹의 권한 정보를 가져온다.
        axios.post(`${CONST.HOST_ADDR}/authgroup/selectGroupMenuList`, item).then(
            (ret)=>{              

              this.GroupAuthList = ret.data;
              this.TreeViewLoading = false;
            }
          );
        
        //선택된 그룹의 사용자 리스트를 가져온다.
        axios.post(`${CONST.HOST_ADDR}/authgroup/selectGroupUserList`, item).then(
          (ret)=>{       
            
            this.GroupUserList = ret.data;
          }
        );       
        
      },
    },
   
  }
</script>

<style scoped>
  option {
    background:whitesmoke;
  }
  /*등록가능 사용자에 스크롤바를 보이도록...*/
  .v-list-item-group {
  height: 400px;
  overflow-y: auto;
}
</style>


<style scoped lang="scss">
   @import "@/assets/scss/config.scss";                        
    :deep(.v-toolbar--dense .v-toolbar__content)
    {
      background-color: $sub-title-backgroundcolor !important;
    }  

</style>
