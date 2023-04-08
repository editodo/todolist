<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"      
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">

        <span    
          style="color: #B2C4D8;" 
          v-on="on"
          class="btn"
        >
        <v-icon style="color: #B2C4D8;">
            account_circle
        </v-icon>
          {{ USER_DATA.EMP_USER_ID }}
        </span>
      

        <!-- <v-icon>
          account_circle
        </v-icon>
        <v-btn
          color="indigo"
          dark
          v-bind="attrs"
          v-on="on"
        >
          admin
        </v-btn> -->
      </template>

      <v-card 
        max-width="320"
        class="mx-auto"
      >
      <div style="height:10px;"></div>
        <v-list dense>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon
                large
              >
              account_circle
              </v-icon>
            </v-list-item-avatar>            
            <v-list-item-content>              
              <!--<v-list-item-title>ID : {{ USER_DATA.EMP_USER_ID }} </v-list-item-title>-->
              <v-list-item-title><div style="display: inline-flex;flex-wrap: wrap;"><div style="width:40px; text-align: left; margin-right: 5px; ">ID : </div> {{ USER_DATA.EMP_USER_ID }}</div> </v-list-item-title>
              <div style="height:2px;"></div>
              <v-list-item-title><div style="display: inline-flex;flex-wrap: wrap;"><div style="width:40px; text-align: left; margin-right: 5px; ">성명 : </div> {{ USER_DATA.EMP_NAME }}</div></v-list-item-title>
              <div style="height:2px;"></div>
              <v-list-item-title><div style="display: inline-flex;flex-wrap: wrap;"><div style="width:40px; text-align: left; margin-right: 5px; ">법인 : </div> 
                 <CodeNameBox 
                :value="USER_DATA.CORPORATE_ID"
                 item-text="CORPORATE_NAME"      
                item-value="CORPORATE_ID"      
                source-url="/Common/CoperList"
                active-cache
              /></div>          
              </v-list-item-title>
              <div style="height:2px;"></div>
              <v-list-item-title><div style="display: inline-flex;flex-wrap: wrap;"><div style="width:40px; text-align: left; margin-right: 5px; ">부서 : </div> {{ USER_DATA.DEPT_NAME }} </div></v-list-item-title>              
            </v-list-item-content>
            <v-list-item-action>
            
            </v-list-item-action>
          </v-list-item>
        </v-list>

        
        <div class="ma-1 text-center">
          <v-btn
            
            color="primary"
            @click="OpenChangePasswordDlg"
            height="30px"
          >
            패스워드 변경
          </v-btn>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>          
          <v-btn
            text
            @click="menu = false"
          >
            Close
          </v-btn>
          
        </v-card-actions>
      </v-card>
    </v-menu>

    <UserInfoDlg 
      ref="userInfoDlg"
      />
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import UserInfoDlg from '@/components/Dialog/UserInfoDlg.vue'
import CodeNameBox from '@/components/SelectBox/CodeNameBox.vue'

export default {
    name : 'UserInfoMenu',    
    components: {
      UserInfoDlg,
      CodeNameBox, 

    },
    data: () => ({    
      menu: false,    
    }),
    computed : {
      ...mapGetters({        
        USER_DATA : 'USER_DATA',    //사용자 정보를 Vuex에서 가져온다.      
      }),
    },
    created:function(){
        
    },
    methods:{
        OpenChangePasswordDlg : function () // 패스워드 변경 다이얼로그를 출력한다.
        {       
            this.$refs.userInfoDlg.open();  //비밀번호 변경 다이얼로그를 출력한다.     
            this.menu = false;  //다이얼로그를 닫는다.
        }
    },   
    
}
</script>

<style>

</style>