<template>
  <div>    
    <v-row>
      <v-col
        class="col-sm-12 col-md-9 pt-1"
      >
        <v-card color="grey lighten-5 baseheight">
          <v-toolbar
            color="secondary"
            dark
            flat
            dense
            height="40px"
          >            
            <v-toolbar-title>
              <v-icon>group</v-icon>
              결제 라인 설정
            </v-toolbar-title>
            <v-spacer />            
          </v-toolbar>
          <v-card-text class="pt-1">
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
                    height="calc(100vh - 260px)"
                    flat
                  >
                    <div class="d-flex flex-row">
                      <div
                        class="pa-0"
                        style="width: 100%;"
                      >
                        <v-card-title class="pt-1">
                          결제그룹 수정
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
                              @click="deleteSign"                    
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
                                v-for="item in SignList"
                                :key="item.SIGN_ID"
                                @click="SignClick(item)"
                              >
                                <v-list-item-content>
                                  <v-list-item-title v-text="item.SIGN_NAME" />
                                </v-list-item-content>
                              </v-list-item>
                            </v-list-item-group>                        
                          </v-list>
                        </v-card-text>
                      </div>
                      <div
                        class="pa-0"
                        style="width: 100%;"
                      >
                        <v-card
                          color="grey lighten-5"
                          height="calc(100vh - 260px)"
                          flat
                        >
                          <v-card-title class="pt-1">
                            사용자 리스트
                            <v-spacer />                        
                            <span>
                              <v-text-field
                                v-model="SearchCond"  
                                light              
                                label="검색조건"  
                                solo
                                flat
                                outlined
                                rounded                                                        
                                dense                                 
                                hide-details       
                                clearable                                         
                                prepend-inner-icon="search"
                              />
                            </span>
                          </v-card-title>
                          <v-card-subtitle>
                            결제명 : {{ CurrentSignInfo.SIGN_NAME }}
                          </v-card-subtitle>
                    
                          <v-simple-table
                            dense
                            fixed-header
                            height="calc(100vh - 340px)"                       
                          >
                            <thead>
                              <tr class="">
                                <th
                                  class="text-left secondary white--text"  
                                  width="80"                                              
                                >
                                  Login ID
                                </th>
                                <th
                                  class="text-left secondary white--text"
                                  width="100"
                                >
                                  성명
                                </th>
                                <th
                                  class="text-left secondary white--text"
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
                        <!--결제자에서 해지-->                  
                        <v-btn 
                          text
                          :disabled="(lodash.isEmpty(CurrentSignInfo)|| lodash.isEmpty(CurrentSignUserInfo) )"
                          @click="UserSignSub(CurrentSignUserInfo)"
                        >
                          <v-icon>arrow_back</v-icon>
                        </v-btn>                  
                        <br>
                        <!--결제자로 등록-->                  
                        <v-btn 
                          text 
                          :disabled="(lodash.isEmpty(CurrentSignInfo) || lodash.isEmpty(CurrentUserInfo))"
                          @click="UserSignAdd(CurrentUserInfo)"
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
                          height="calc(100vh - 260px)"
                          flat
                        >
                          <v-card-title class="pt-1">
                            결제자 리스트
                          </v-card-title>
                          <v-card-subtitle>
                            <div align="right">
                              <v-btn              
                                text
                                small
                                :disabled="(lodash.isEmpty(CurrentSignInfo))"
                                @click="SignUserSave"
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
                            height="calc(100vh - 340px)"                                 
                          >
                            <thead>
                              <tr class="">
                                <th
                                  class="text-left secondary white--text text-truncate"                  
                                  width="80"
                                >
                                  Login ID
                                </th>
                                <th
                                  class="text-left secondary white--text"                                            
                                  width="80"
                                >
                                  성명
                                </th>
                                <th
                                  class="text-left secondary white--text"                                 
                                >
                                  부서
                                </th>
                                <th
                                  class="text-center secondary white--text"   
                                  style="max-width: 40px;"                                    
                                >
                                  <v-icon
                                    small
                                    color="white"
                                  >
                                    arrow_upward
                                  </v-icon>
                                </th>
                                <th
                                  class="text-center secondary white--text"     
                                  style="max-width: 40px;"                                       
                                >
                                  <v-icon
                                    small
                                    color="white"
                                  >
                                    arrow_downward
                                  </v-icon>
                                </th>
                              </tr>
                            </thead>
                            <tbody>                        
                              <tr
                                v-for="(item, index) in SignUserList"
                                :key="item.EMP_USER_ID"                  
                                :style="{ cursor: 'pointer'}"                          
                                :class="{bg_gray :((index % 2) == 0 ), 
                                         active_row:(CurrentSignUserInfo != null && item.EMP_USER_ID == CurrentSignUserInfo.EMP_USER_ID)}"
                          
                                @click="SignUserClick(item)"
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
                                <td class="pa-0">
                                  <span
                                    class="text-center"
                                    style="max-width: 40px;"
                                  >
                                    <v-btn 
                                      class="pa-0"
                                      text                                       
                                      @click="SignUserClick(item),UserSignUp(CurrentSignUserInfo)"
                                    >
                                      <v-icon small>arrow_upward</v-icon>
                                    </v-btn>

                                  </span>
                                </td>
                                <td class="pa-0">
                                  <span
                                    class="text-center"
                                    style="max-width: 40px;"
                                  >
                                    <v-btn
                                      class="pa-0" 
                                      text 
                                      @click="SignUserClick(item),UserSignDown(CurrentSignUserInfo)"
                                    >
                                      <v-icon small>arrow_downward</v-icon>
                                    </v-btn>

                                  </span>
                                </td>                                
                              </tr>
                            </tbody>
                          </v-simple-table>
                        </v-card>                  
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>                
            </v-container>
          </v-card-text>  
          <v-card-text class="pt-1">
            <v-container
              class="pa-0"
              fluid
              style="overflow-x: auto"
            />
          </v-card-text>        
        </v-card>
      </v-col>
      <v-col
        class="col-sm-12 col-md-3 pt-1"
      >
        <v-card
          color="grey lighten-5 baseheight"          
        >
          <v-toolbar
            color="secondary"
            dark
            flat
            dense
            height="40px"
          >            
            <v-toolbar-title>메뉴 결제 설정</v-toolbar-title>
          </v-toolbar>
          <v-card-title class="pt-1">
            메뉴 결제정보
          </v-card-title>
          <v-card-subtitle>
            <div
              align="right"
            >
              <v-btn              
                text
                small                
                @click="SignSave"
              >
                <v-icon left>
                  save
                </v-icon>적용
              </v-btn>
            </div>
          </v-card-subtitle>
          <v-card-text>
            <v-treeview
              open-all
              hoverable
              dense
              :items="MenuSignList"
            >
              <template
                v-slot:append="{ item, open }"
                dense
              >           
                <select v-model="item.sign_id">
                  <option value="0">
                    사용안함
                  </option>
                  <option
                    v-for="list in SignList"
                    :key="list"
                    :value="list.SIGN_ID"
                  >
                    {{ list.SIGN_NAME }}
                  </option>
                </select>                            
              </template>
            </v-treeview>
          </v-card-text>  
          <v-divider vertical />
        </v-card>
      </v-col>
    </v-row>

    <alertDlg ref="mydlg" />
    <confirm ref="confirm" />
    <signmodifydlg 
      ref="signdlg" 
      @SaveOK="AddOK"      
      @ModifyOK="EditOK"
    />
  </div>
</template>

<script>
  import CONST from '@/const'
  import axios from 'axios'  
  import signmodifydlg from './SignModifyDlg.vue'
  import alertDlg from '@/components/Dialog/AlertDlg.vue'
  import confirm from '@/components/Dialog/Confirm.vue'


  export default {
    components: {      
      signmodifydlg,
      alertDlg,
      confirm
    },
    data: () => ({
      GroupList : [],           //{ACTV, GROUP_ID, GROUP_NAME} 
      SignList : [],
      GroupAuthList: [],        //그룹 권한 리스트
      MenuSignList: [],         //메뉴별 결제 리스트
      UserList : [],            //사용자 리스트
      GroupUserList : [],       //현재 그룹에 등록된 사용자 리스트
      SignUserList : [],        //현재 결제에 등록된 결제자 리스트
      CurrentGroupInfo : {},    //현재 선택된 그룹 정보
      CurrentSignInfo : {},     //현재 선택된 결제 정보
      CurrentUserInfo:{},       //현재 선택된 사용자
      CurrentGroupUserInfo:{},  //현재 선택된 그룹 사용자 정보
      CurrentSignUserInfo:{},   //현재 선택된 결제 결제자 정보
      TreeViewLoading : false,  //트리뷰 로딩 상태
      SearchCond : '',          //검색조건
    }),
    computed:{
      
      UserListFi : function(){  //사용자 리스트에서 현재결제자가 아닌 사용자만 보여준다
        return this.UserList.filter((element)=>{                        

            var searchTarget = element.EMP_USER_ID + element.EMP_NAME;                                    
            if(!this.lodash.isEmpty(this.SearchCond))
            {
              if(searchTarget.indexOf(this.SearchCond) == -1) return false;
            }            
            var findUser = this.SignUserList.filter((element2)=>{
              if(element.EMP_USER_ID == element2.EMP_USER_ID) return true;
              return false;
            });
          return (findUser.length == 0);
        });
      },

    },    
    created: function(){
      this.selectUserList();      //사용자 리스트를 가져온다      
      this.selectSignList();      //결제리스트를 가져온다.   
      this.selectMenuSignList();      //메뉴별 결제리스트를 가져온다.  
    },
    methods: {
      AddBtnClick(){
        this.$refs.signdlg.ShowDlg();
      },
      ModifyBtnClick(){
        console.log(this.CurrentSignInfo);
        this.$refs.signdlg.ShowModify(this.CurrentSignInfo);   
      },
      SignUserSave:async function(){  //현재 선택한 사용자 그룹 정보를 서버에 전송시켜 반영한다.
        console.log(this.SignUserList); 
        
        if (await this.$refs.confirm.open('Confirm', '저장 하시겠습니까?', { color: 'red' }) == false) return;

        //사용자 리스트와 그룹정보를 혼합시켜 전송한다.
        var sendItem = {'SignInfo' : this.CurrentSignInfo, 
                      'SignUserList' : this.SignUserList};


        //결제자 리스트의 정보를 갱신한다.
        axios.post(`${CONST.HOST_ADDR}/sign/updateSignMemberList`, sendItem).then(
         (ret)=>{
           console.log(ret);           
         }
       );       

      },
      SignUserClick: function(SignUserInfo)
      {
        this.CurrentSignUserInfo = SignUserInfo;
      },
      UserSignAdd : function(userInfo){  //사용자를 현재 그룹에 등록한다.
        this.SignUserList.push(userInfo);
        this.CurrentUserInfo = {};

      },
      UserSignSub : function(userInfo){  //사용자를 현재 그룹에서 뺀다
        
        var index = this.SignUserList.indexOf(userInfo);
        if (index > -1) this.SignUserList.splice(index, 1);

        this.CurrentSignUserInfo = {};

      },
      UserSignUp : function(userInfo){  //사용자를 결제 그룹에서 한칸 위로 올린다
        
        var index = this.SignUserList.indexOf(userInfo);
        console.log(index);   
        if (index > 0) {
          this.SignUserList.splice(index, 1);
          this.SignUserList.splice(index-1,0,userInfo);
        }

        this.CurrentSignUserInfo = {};

      },
      UserSignDown : function(userInfo){  //사용자를 결제 그룹에서 한칸 밑으로 내린다
        
        var index = this.SignUserList.indexOf(userInfo);
        console.log(index);   
        if (index > -1 && index < this.SignUserList.length-1) {
          this.SignUserList.splice(index, 1);
          this.SignUserList.splice(index+1,0,userInfo);
        }
        this.CurrentSignUserInfo = {};

      },
      UserClick: function(userInfo){
        this.CurrentUserInfo = userInfo;
      },
      AddOK : function(Data){   //Group 추가 작업
      
        console.log(Data);
        //신규 그룹 추가작업.
        axios.post(`${CONST.HOST_ADDR}/sign/insertSign`, Data).then(
            (ret)=>{      
              if(ret.data.ret === true)
              {
                //작업 성공
                console.log(ret);
                //그룹정보를 새로 읽어 들인다.
                this.selectSignList();
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
        axios.post(`${CONST.HOST_ADDR}/sign/updateSign`, Data).then(
            (ret)=>{      
              if(ret.data.ret === true)
              {
                //작업 성공                
                //그룹정보를 새로 읽어 들인다.
                this.selectSignList();
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.                                            
              }
              else
              {                
                this.$root.$commretmsg.CommonDTOMsg(ret.data);  //결과를 화면에 뿌린다.                                            
              }
            }
          );

      },
      SignSave :async function(){ //그룹 저장버튼 클릭
        
        if (await this.$refs.confirm.open('Confirm', '저장 하시겠습니까?', { color: 'red' }) == false) return;
                
        var sendItem = {
                      'MenuSignList' : this.MenuSignList          //현적용한 그룹 권한 정보
                      };

        console.log(sendItem);

        axios.post(`${CONST.HOST_ADDR}/sign/updateMenuSignList`, sendItem).then(
         (ret)=>{
           console.log(ret);        
         }
       );       


      },
      deleteSign : function(){ //결제정보 삭제 처리
        axios.post(`${CONST.HOST_ADDR}/sign/deleteSign`, this.CurrentSignInfo).then(
            (ret)=>{      
              if(ret.data.ret === true)
              {
                //작업 성공                
                //그룹정보를 새로 읽어 들인다.
                this.selectSignList();
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
      selectSignList : function(){ //결제 리스트를 가져온다.
      
        axios.post(`${CONST.HOST_ADDR}/sign/selectSignList`, {}).then(
          (ret)=>{   
            this.SignList = ret.data;                        
          }
        );       

      },
      selectMenuSignList : function(){ //결제 리스트를 가져온다.
      
        axios.post(`${CONST.HOST_ADDR}/sign/selectMenuSignList`, {}).then(
          (ret)=>{   
            this.MenuSignList = ret.data;
            this.TreeViewLoading = false;                  
          }
        );       

      },
      SignClick : function(item){  //그룹을 선택했을 때의 이벤트
        console.log(item);
        this.CurrentSignInfo = item;        
        this.CurrentUserInfo = null;

        this.TreeViewLoading = true;
        
        axios.post(`${CONST.HOST_ADDR}/sign/selectSignMemberList`, item).then(
          (ret)=>{       
            
            this.SignUserList = ret.data;
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
