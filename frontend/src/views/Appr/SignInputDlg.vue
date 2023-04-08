<template>
  <!--그룹명 추가를 위한 다이얼로그-->
  <v-dialog      
    v-model="dialog"
    persistent 
    width="300"
  >
    <template v-slot:activator="{ on }">
      <!--추가 버튼-->
      <v-btn                                                            
        v-if="mode==='I'"
        text
        small
        
        @click="AddBtnClick"
      >
        <v-icon left>
          add
        </v-icon>추가
      </v-btn>
      <!--수정 버튼-->
      <v-btn             
        v-else
        text
        small        
        @click="EditBtnClick"
      >
        <v-icon left>
          edit
        </v-icon>수정
      </v-btn>
    </template>

    <v-card>
      <v-card-title
        v-if="mode==='I'"
        class="headline"
      >
        Input New Group
      </v-card-title>
      <v-card-title
        v-else
        class="headline"
      >
        Edit Group
      </v-card-title>
      <v-card-text>          
        <v-text-field
          v-model="inputData"
          label="Group Name*"
          hint="그룹명을 입력해주세요"
          persistent-hint
          required
        />
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1" />
        <v-btn
          color="green darken-1"
          text
          @click="dialog=false"
        >
          취소
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          @click="confirm"
        >
          확인
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!--그룹명 추가를 위한 다이얼로그 끝-->
</template>

<script>

export default {
    name : 'GroupInputDlg',
    props: {mode:{type: String, default:'I'}},  //mode : I(Input), E(Edit)
    data : () =>(
    {
        dialog: false,
        inputData : '', 
    }
  ),
    created: function(){
        
  },
  methods: {
      confirm : function(){         //확인 버튼을 눌렀을때
          
          this.dialog = false;      //다이얼로그를 닫는다.
          this.$emit('ok', this.inputData);
      },
      AddBtnClick : function(){     //추가버튼 클릭 이벤트
        console.log('addBtnClcik!!!');
        this.inputData = '';
         this.dialog = true;        //입력 다이얼로그 출력
      },
      EditBtnClick : function(){    //수정 버튼 클릭 이벤트
        this.inputData = '';
         this.dialog = true;        //수정 다이얼로그 출력
      }
  },
    

}
</script>

<style>

</style>