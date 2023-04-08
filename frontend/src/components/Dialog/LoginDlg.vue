<template>
  <v-dialog
    v-model="isShowDlg"
    max-width="400"
    persistent
  >
    <v-card class="elevation-12">
      <v-toolbar
        color="primary"
        dark
        flat
      >
        <v-toolbar-title>Login form</v-toolbar-title>
        <v-spacer />                
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field
            
            v-model="LoginData.userID"
            label="Login"
            name="login"
            prepend-icon="person"
            type="text"            
          />

          <v-text-field
            id="password"
            v-model="LoginData.Password"
            label="Password"
            name="password"
            prepend-icon="lock"
            type="password"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"  
          @click="loginProc"                
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
    data : ()=>(
        {
          LoginData : {
            userID: '',    
            Password : ''      
          },

        }
    ),
    computed : {
      ...mapGetters(['showLoginDlg',
                    'USER_DATA',
                    'accessToken']),
        isShowDlg : function (){
            
            if(this.accessToken === null)            
                return true;

            return false;

        },

    },  
    created : function() {
        this.LoginData.userID = this.USER_DATA.EMP_USER_ID;
        
    },
     methods: {
        ...mapActions(['LOGIN']),   //this.$store.dispatch('LOGIN')에 매핑        
         loginProc : async function()    /*로그인 처리를 한다.*/
        {                                
          try{
            await this.LOGIN(this.LoginData);   //로그인 처리(토큰을 가져온다)                        
          }
          catch(ex)
          {
            alert(ex);
          }
        },
     }
}
</script>

<style>

</style>