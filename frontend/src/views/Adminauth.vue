<template>
  <div class="pt-1">
    <v-card 
      color="card_background"
      class="baseheight">      
      <v-toolbar
        flat        
        dense             
        :height=this.$vuetify.toolbar_height
        class="title_font_color"
      >            
        <!-- <v-toolbar-title class="bold">
          <v-icon class="bold">enhanced_encryption</v-icon> 사용자 권한
        </v-toolbar-title> -->
        <v-toolbar-title dense>
          <v-icon class="title_font_color toolbar_icon_size">enhanced_encryption</v-icon> <span class="toolbar_font_size">사용자 권한</span>
        </v-toolbar-title>

        <v-spacer />
        <div style="margin: 0 20px 0 0;" align="right">    
        <v-btn
          text
          class="title_font_color"
          @click="Save"
        >
          <v-icon left>
            save
          </v-icon>저장
        </v-btn>            
         </div>   

        <!-- <v-btn icon>
              <v-icon>search</v-icon>
            </v-btn> -->
      </v-toolbar>
      <v-divider class="my_toolbar_underline" v-if="this.$vuetify.toolbar_underline"/>          
      
      <v-card-text class="pt-5">
        <div>
          <v-row>
            <v-col class="pt-4">          
              <v-card
                class="pa-0"
                color="card_background"
                flat
                
              >
                <v-row>
                  <v-col>                        
                    <v-text-field
                      v-model="SearchCond.EMP_USER_ID"     
                      label="Login ID"  
                      prepend-icon="search"                    
                      dense
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="SearchCond.EMP_NAME"         
                      label="성명"                    
                      prepend-icon="search"
                      dense
                    />
                  </v-col> 
                  <v-col>                        
                    <v-text-field
                      v-model="SearchCond.DEPT_NAME"         
                      label="부서"                    
                      prepend-icon="search"
                      dense
                    />
                  </v-col> 
                </v-row>                   
              </v-card>
                  
              <v-simple-table
                dense
                fixed-header
                height="calc(100vh - 350px)"
                class="std_datatable cursor_p"
              >
                <thead>
                  <tr class="">
                    <th
                      
                      width="100"
                    >
                      사번
                    </th>
                    <th
                      
                      width="100"
                    >
                      Login ID
                    </th>
                    <th
                      
                    >
                      성명
                    </th>
                    <th
                      
                      width="150"
                    >
                      부서
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in UserListFi"
                    :key="item.EMP_NO"                  
                    :style="{ cursor: 'pointer'}"
                          
                    :class="{bg_gray :((index % 2) == 0 ), 
                             active_row:(item.EMP_USER_ID == sel_user_id)}"
                    @click="UserClick(item)"
                  >
                    <td>
                      <span
                        class="d-inline-block text-truncate"
                        style="min-width: 100px;"
                      >
                        {{ item.EMP_NO }}
                      </span>
                    </td>
                    <td>
                      <span
                        class="d-inline-block text-truncate"
                        style="min-width: 80px;"
                      >                            
                        {{ item.EMP_USER_ID }}
                      </span>
                    </td>
                    <td>
                      <span
                        class="d-inline-block text-truncate"
                        style="min-width: 80px;"
                      >
                        {{ item.EMP_NAME }}
                      </span>
                    </td>
                    <td>
                      <span
                        class="d-inline-block text-truncate"
                        style="min-width: 80px;"
                      >
                        {{ item.DEPT_NAME }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-col>
            <v-divider vertical />
            <v-col>
              <!-- <div align="right">
                    <v-btn
                      text                      
                      @click="Save"
                    >
                      <v-icon left>
                        save
                      </v-icon>저장
                    </v-btn>            
                  </div>                   -->
              <v-card
                
                height="calc(100vh - 270px)"
                class="scroll_y card_background"
              >
                <v-card-title>
                  권한정보
                </v-card-title>
                <v-card-subtitle v-if="lodash.isEmpty(sel_user_id)">
                  사용자 리스트에서 사용자 정보를 선택하여 주십시요.
                </v-card-subtitle>
                <v-card-subtitle v-else>
                  사용자 : {{ sel_user_id }}
                </v-card-subtitle>
                <v-treeview
                  open-all
                  hoverable
                  dense
                  :items="MenuList"
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
              </v-card>
            </v-col>
          </v-row>                
        </div>
      </v-card-text>
      <!-- <v-card-actions>
            <v-btn>저장</v-btn>
          </v-card-actions>               -->
    </v-card>
  </div>
</template>

<script>
import CONST from '@/const'
import axios from 'axios'

export default {
  data: () => ({
    MenuList : [],
    UserList : [],      //사용자 리스트
    sel_item_no : -1,   // 선택한 항목 번호
    sel_user_id : '',   // 선택한 사용자 ID

    SearchCond: {      
      EMP_USER_ID : '',
      EMP_NAME : '',
      DEPT_NAME : ''
    }
  }),
  computed:{
      UserListFi(){  //사용자 리스트에서 검색조건에 맞는 사용자만 보여준다.
        
        return this.UserList.filter((element)=>{                      
          if(this.SearchCond.EMP_USER_ID != '' && element.EMP_USER_ID.indexOf(this.SearchCond.EMP_USER_ID) == -1) return false;
          if(this.SearchCond.EMP_NAME != '' && element.EMP_NAME.indexOf(this.SearchCond.EMP_NAME) == -1) return false;          
          if(this.SearchCond.DEPT_NAME != '' && element.DEPT_NAME == null)  return false;
          if(this.SearchCond.DEPT_NAME != '' && element.DEPT_NAME.indexOf(this.SearchCond.DEPT_NAME) == -1) return false;
          
          return true;
        });
      },

    },    
  created: function(){
    this.selectUserList();
  },
  methods: {
    Save : async function(){

      if (await this.$root.$confirm.open('Confirm', '저장 하시겠습니까??', { color: 'primary' }) == false) return;

      var sendItem = {'selUserID' : this.sel_user_id, 
                      'MenuList' : this.MenuList};
      
      axios.post(`${CONST.HOST_ADDR}/adminauth/updateUserAuthList`, sendItem).then(
         (ret)=>{
           console.log(ret);
           //this.MenuList = ret.data;           
         }
       );       
      
    },
    UserClick : function (item) //사용자 클릭 이벤트
    {
      //console.log(item.EMP_USER_ID);
      //JSON.stringify()
      //JSON.parse()

      this.sel_user_id = item.EMP_USER_ID;           

      axios.post(`${CONST.HOST_ADDR}/adminauth/selectUserAuthList`, item).then(
         (ret)=>{
           
            var zeroUndef = function(list){ //자식 리스트가 없다면 leaf노드로 인정
              list.forEach(element => {                  
                  if(element.children.length == 0) {
                      element.children = undefined;
                      return;
                  }
                  zeroUndef(element.children);
              });
            }
            zeroUndef(ret.data);

           this.MenuList = ret.data;           
           
         }
       );       

    },
    selectUserList: function(){ //사용자 목록 데이터를 읽어온다.
       
       axios.post(`${CONST.HOST_ADDR}/adminauth/selectUserList`, {}).then(
         (ret)=>{
           console.log(ret);
           this.UserList = ret.data;
         }
       );       
    },
  },

}
</script>

<style scoped>  
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

